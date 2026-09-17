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

        if ($event->point_type === 'point_rate') {
            if (! $event->pointRates()->whereKey($data['point_rate_id'] ?? null)->exists()) {
                throw new DomainException('Tarif poin tidak valid untuk acara ini.');
            }
        } else {
            if (! EventRole::query()->whereKey($data['event_role_id'] ?? null)->where('event_id', $event->id)->exists()) {
                throw new DomainException('Peran acara tidak valid.');
            }
        }

        if (! $photo->isValid() || ! str_starts_with((string) $photo->getMimeType(), 'image/')) {
            throw new DomainException('Foto tidak valid.');
        }

        if (Attendance::query()->where('event_id', $event->id)->where('user_id', $user->id)->exists()) {
            throw new DomainException('Anda sudah melakukan absensi untuk acara ini.');
        }

        $photoPath = $this->photoStorage->store($photo);

        try {
            return DB::transaction(function () use ($user, $event, $data, $photoPath): Attendance {
                $attendance = Attendance::create([
                    'event_id' => $event->id,
                    'user_id' => $user->id,
                    'event_role_id' => $data['event_role_id'] ?? null,
                    'point_rate_id' => $data['point_rate_id'] ?? null,
                    'captured_lat' => null,
                    'captured_lng' => null,
                    'gps_accuracy_m' => null,
                    'distance_m' => null,
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

        $isPointRate = $attendance->event->point_type === 'point_rate';
        $relationsToLoad = $isPointRate ? ['user', 'pointRate.pointCategory'] : ['user', 'eventRole'];
        $attendance->loadMissing($relationsToLoad);

        if ($isPointRate && ! $attendance->pointRate) {
            throw new DomainException('Tarif poin untuk absensi belum dipilih.');
        }
        if (! $isPointRate && ! $attendance->eventRole) {
            throw new DomainException('Peran acara untuk absensi belum dipilih.');
        }

        return DB::transaction(function () use ($attendance, $actor, $isPointRate): Attendance {
            if ($isPointRate) {
                $category = $attendance->pointRate->pointCategory;
                $points = $attendance->pointRate->points;
            } else {
                $category = PointCategory::query()->where('slug', 'kegiatan-organisasi')->first();
                if (! $category) {
                    throw new DomainException('Kategori poin kegiatan organisasi belum tersedia.');
                }
                $points = $attendance->eventRole->points;
            }

            $this->ledger->record(
                $attendance->user,
                $category,
                $attendance->event->period,
                'absensi',
                $attendance->id,
                $points,
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

    public function requestRevision(Attendance $attendance, User $actor, string $reason): Attendance
    {
        $this->verificationState->assertCanTransition($attendance->status, 'revisi');
        if (trim($reason) === '') {
            throw new DomainException('Alasan permintaan revisi wajib diisi.');
        }

        return DB::transaction(function () use ($attendance, $actor, $reason): Attendance {
            $attendance->rejection_reason = $reason;
            $this->changeStatus($attendance, 'revisi', $actor, $reason);

            return $attendance->refresh();
        });
    }

    public function revise(Attendance $attendance, User $user, array $data, UploadedFile $photo): Attendance
    {
        if ($attendance->user_id !== $user->id) {
            throw new DomainException('Anda tidak dapat merevisi absensi milik orang lain.');
        }
        if ($attendance->status !== 'ditolak' && $attendance->status !== 'revisi') {
            throw new DomainException('Hanya absensi yang ditolak atau diminta revisi yang dapat dikirim ulang.');
        }

        $this->verificationState->assertCanTransition($attendance->status, 'menunggu');

        $event = $attendance->event;
        if ($event->point_type === 'point_rate') {
            if (! $event->pointRates()->whereKey($data['point_rate_id'] ?? null)->exists()) {
                throw new DomainException('Tarif poin tidak valid untuk acara ini.');
            }
        } else {
            if (! EventRole::query()->whereKey($data['event_role_id'] ?? null)->where('event_id', $event->id)->exists()) {
                throw new DomainException('Peran acara tidak valid.');
            }
        }

        if (! $photo->isValid() || ! str_starts_with((string) $photo->getMimeType(), 'image/')) {
            throw new DomainException('Foto tidak valid.');
        }

        $photoPath = $this->photoStorage->store($photo);
        $oldPhotoPath = $attendance->photo_path;

        return DB::transaction(function () use ($attendance, $data, $photoPath, $oldPhotoPath, $user): Attendance {
            $fromStatus = $attendance->status;

            $attendance->update([
                'event_role_id' => $data['event_role_id'] ?? null,
                'point_rate_id' => $data['point_rate_id'] ?? null,
                'photo_path' => $photoPath,
                'status' => 'menunggu',
                'rejection_reason' => null,
                'verified_by' => null,
                'verified_at' => null,
            ]);

            if ($oldPhotoPath) {
                // Ignore failure if previous photo is missing
                try {
                    $this->photoStorage->delete($oldPhotoPath);
                } catch (\Exception $e) {}
            }

            $attendance->verificationLogs()->create([
                'actor_id' => $user->id,
                'from_status' => $fromStatus,
                'to_status' => 'menunggu',
                'reason' => 'Absensi direvisi.',
            ]);

            return $attendance->refresh()->load(['event', 'eventRole']);
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
