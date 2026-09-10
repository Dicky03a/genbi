<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Event;
use App\Models\EventRole;
use App\Models\PointCategory;
use App\Models\User;
use DomainException;
use Illuminate\Database\QueryException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class AttendanceService
{
    public function __construct(
        private readonly GeoService $geoService,
        private readonly PhotoStorageService $photoStorage,
        private readonly PointLedgerService $ledger,
        private readonly VerificationStateService $verificationState,
    ) {}

    public function submit(User $user, Event $event, array $data, UploadedFile $photo): Attendance
    {
        // The validation order is part of the public attendance contract.
        if ($event->status !== 'dibuka') {
            throw new DomainException('Absensi acara ini belum dibuka.');
        }

        $now = now();
        if ($now->lt($event->opens_at)) {
            throw new DomainException('Absensi belum dibuka.');
        }
        if ($now->gt($event->closes_at)) {
            throw new DomainException('Absensi sudah ditutup.');
        }

        if ($event->komisariat_id !== null && $user->komisariat_id !== $event->komisariat_id) {
            throw new DomainException('Acara ini khusus untuk komisariat lain.');
        }

        if (! EventRole::query()->whereKey($data['event_role_id'])->where('event_id', $event->id)->exists()) {
            throw new DomainException('Peran acara tidak valid.');
        }

        if (! $photo->isValid() || ! str_starts_with((string) $photo->getMimeType(), 'image/')) {
            throw new DomainException('Foto tidak valid.');
        }

        $accuracyLimit = $event->max_gps_accuracy_m ?? config('attendance.max_gps_accuracy_m');
        if ((float) $data['gps_accuracy_m'] > (float) $accuracyLimit) {
            throw new DomainException('Sinyal GPS kurang akurat, coba di area terbuka.');
        }

        $distance = $this->geoService->haversine(
            (float) $data['captured_lat'],
            (float) $data['captured_lng'],
            (float) $event->latitude,
            (float) $event->longitude,
        );
        $allowedDistance = $event->radius_m + (float) config('attendance.location_tolerance_m');
        if ($distance > $allowedDistance) {
            throw new DomainException(sprintf(
                'Anda berada di luar lokasi acara. Jarak Anda %.0f m, batas %.0f m.',
                $distance,
                $allowedDistance,
            ));
        }

        if (Attendance::query()->where('event_id', $event->id)->where('user_id', $user->id)->exists()) {
            throw new DomainException('Anda sudah melakukan absensi untuk acara ini.');
        }

        $photoPath = $this->photoStorage->store($photo);

        try {
            return DB::transaction(function () use ($user, $event, $data, $distance, $photoPath): Attendance {
                $attendance = Attendance::create([
                    'event_id' => $event->id,
                    'user_id' => $user->id,
                    'event_role_id' => $data['event_role_id'] ?? null,
                    'captured_lat' => $data['captured_lat'],
                    'captured_lng' => $data['captured_lng'],
                    'gps_accuracy_m' => $data['gps_accuracy_m'],
                    'distance_m' => $distance,
                    'photo_path' => $photoPath,
                    'status' => 'menunggu',
                ]);
                $attendance->verificationLogs()->create([
                    'from_status' => null,
                    'to_status' => 'menunggu',
                    'reason' => 'Absensi dikirim.',
                ]);

                return $attendance->load(['event', 'eventRole']);
            });
        } catch (QueryException $exception) {
            $this->photoStorage->delete($photoPath);

            if (str_contains($exception->getMessage(), 'attendances_event_id_user_id_unique')) {
                throw new DomainException('Anda sudah melakukan absensi untuk acara ini.');
            }

            throw $exception;
        }
    }

    public function verify(Attendance $attendance, User $actor): Attendance
    {
        $this->verificationState->assertCanTransition($attendance->status, 'disetujui');

        $attendance->loadMissing(['user', 'eventRole']);
        if (! $attendance->eventRole) {
            throw new DomainException('Peran acara untuk absensi belum dipilih.');
        }

        return DB::transaction(function () use ($attendance, $actor): Attendance {
            $category = PointCategory::query()->where('slug', 'kegiatan-organisasi')->first();
            if (! $category) {
                throw new DomainException('Kategori poin kegiatan organisasi belum tersedia.');
            }

            $this->ledger->record(
                $attendance->user,
                $category,
                $attendance->event->period,
                'absensi',
                $attendance->id,
                $attendance->eventRole->points,
                $actor,
                "Absensi acara: {$attendance->event->title}",
            );
            $this->changeStatus($attendance, 'disetujui', $actor);

            return $attendance->refresh();
        });
    }

    public function reject(Attendance $attendance, User $actor, string $reason): Attendance
    {
        $this->verificationState->assertCanTransition($attendance->status, 'ditolak');
        if (trim($reason) === '') {
            throw new DomainException('Alasan penolakan wajib diisi.');
        }

        return DB::transaction(function () use ($attendance, $actor, $reason): Attendance {
            $attendance->rejection_reason = $reason;
            $this->changeStatus($attendance, 'ditolak', $actor, $reason);

            return $attendance->refresh();
        });
    }

    private function changeStatus(Attendance $attendance, string $status, User $actor, ?string $reason = null): void
    {
        $fromStatus = $attendance->status;
        $this->verificationState->assertCanTransition($fromStatus, $status);

        $attendance->update([
            'status' => $status,
            'verified_by' => $actor->id,
            'verified_at' => now(),
        ]);
        $attendance->verificationLogs()->create([
            'actor_id' => $actor->id,
            'from_status' => $fromStatus,
            'to_status' => $status,
            'reason' => $reason,
        ]);
    }
}
