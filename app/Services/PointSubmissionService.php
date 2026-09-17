<?php

namespace App\Services;

use App\Models\PointRate;
use App\Models\PointSubmission;
use App\Models\User;
use Carbon\Carbon;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PointSubmissionService
{
    public function __construct(
        private readonly PointLedgerService $ledger,
        private readonly VerificationStateService $verificationState,
    ) {}

    public function getForUser(User $user): Collection
    {
        return PointSubmission::query()
            ->where('user_id', $user->id)
            ->with(['pointCategory', 'period', 'division', 'verificationLogs'])
            ->latest()
            ->get();
    }

    public function getPending(User $actor): Collection
    {
        $query = PointSubmission::query()->pending()->with(['user', 'pointCategory', 'period', 'division']);
        if ($actor->hasRole('admin_komisariat')) {
            $query->whereHas('user', fn ($userQuery) => $userQuery->where('komisariat_id', $actor->komisariat_id));
        }

        return $query->latest()->get();
    }

    public function submit(User $user, array $data, ?UploadedFile $evidence = null): PointSubmission
    {
        $rate = $this->activeRate($data['point_rate_id']);
        $period = app(PeriodResolver::class)->forDate(Carbon::parse($data['activity_date']));
        $evidencePath = $evidence?->store('submissions', config('attendance.photo_disk'));

        return DB::transaction(function () use ($user, $data, $rate, $period, $evidencePath): PointSubmission {
            $submission = PointSubmission::create([
                'user_id' => $user->id,
                'point_category_id' => $rate->point_category_id,
                'period_id' => $period->id,
                'division_id' => $user->division_id,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'evidence_path' => $evidencePath,
                'points_requested' => $rate->points,
                'status' => 'menunggu',
                'revision_count' => 0,
            ]);
            $this->log($submission, null, 'menunggu', $user, 'Pengajuan dikirim.');

            return $submission->load(['pointCategory', 'period', 'division']);
        });
    }

    public function revise(PointSubmission $submission, User $user, array $data, ?UploadedFile $evidence = null): PointSubmission
    {
        if ($submission->user_id !== $user->id) {
            throw new DomainException('Anda tidak dapat merevisi pengajuan milik anggota lain.');
        }
        if ($submission->status !== 'ditolak' && $submission->status !== 'revisi') {
            throw new DomainException('Hanya pengajuan yang ditolak atau diminta revisi yang dapat dikirim ulang.');
        }
        $this->verificationState->assertCanTransition($submission->status, 'menunggu');
        if ($submission->revision_count >= config('attendance.submission_max_revisions')) {
            throw new DomainException('Batas revisi pengajuan sudah tercapai.');
        }

        $rate = $this->activeRate($data['point_rate_id']);
        $evidencePath = $evidence?->store('submissions', config('attendance.photo_disk'));

        return DB::transaction(function () use ($submission, $data, $rate, $evidencePath, $user): PointSubmission {
            $oldStatus = $submission->status;
            if ($evidencePath && $submission->evidence_path) {
                Storage::disk(config('attendance.photo_disk'))->delete($submission->evidence_path);
            }
            $submission->update([
                'point_category_id' => $rate->point_category_id,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'evidence_path' => $evidencePath ?: $submission->evidence_path,
                'points_requested' => $rate->points,
                'status' => 'menunggu',
                'rejection_reason' => null,
                'verified_by' => null,
                'verified_at' => null,
                'revision_count' => $submission->revision_count + 1,
            ]);
            $this->log($submission, $oldStatus, 'menunggu', $user, 'Pengajuan direvisi.');

            return $submission->refresh();
        });
    }

    public function verify(PointSubmission $submission, User $actor): PointSubmission
    {
        $this->verificationState->assertCanTransition($submission->status, 'disetujui');

        return DB::transaction(function () use ($submission, $actor): PointSubmission {
            $this->ledger->record(
                $submission->user,
                $submission->pointCategory,
                $submission->period,
                'pengajuan',
                $submission->id,
                $submission->points_requested,
                $actor,
                "Pengajuan: {$submission->title}",
            );
            $this->changeStatus($submission, 'disetujui', $actor);

            return $submission->refresh();
        });
    }

    public function reject(PointSubmission $submission, User $actor, string $reason): PointSubmission
    {
        $this->verificationState->assertCanTransition($submission->status, 'ditolak');
        if (trim($reason) === '') {
            throw new DomainException('Alasan penolakan wajib diisi.');
        }

        return DB::transaction(function () use ($submission, $actor, $reason): PointSubmission {
            $submission->rejection_reason = $reason;
            $this->changeStatus($submission, 'ditolak', $actor, $reason);

            return $submission->refresh();
        });
    }

    public function requestRevision(PointSubmission $submission, User $actor, string $reason): PointSubmission
    {
        $this->verificationState->assertCanTransition($submission->status, 'revisi');
        if (trim($reason) === '') {
            throw new DomainException('Alasan permintaan revisi wajib diisi.');
        }

        return DB::transaction(function () use ($submission, $actor, $reason): PointSubmission {
            $submission->rejection_reason = $reason;
            $this->changeStatus($submission, 'revisi', $actor, $reason);

            return $submission->refresh();
        });
    }

    private function activeRate(int $rateId): PointRate
    {
        $rate = PointRate::query()->whereKey($rateId)->where('is_active', true)->first();
        if (! $rate) {
            throw new DomainException('Tarif poin tidak tersedia atau sudah dinonaktifkan.');
        }

        return $rate;
    }

    private function changeStatus(PointSubmission $submission, string $status, User $actor, ?string $reason = null): void
    {
        $fromStatus = $submission->status;
        $this->verificationState->assertCanTransition($fromStatus, $status);

        $submission->update([
            'status' => $status,
            'verified_by' => $actor->id,
            'verified_at' => now(),
        ]);
        $this->log($submission, $fromStatus, $status, $actor, $reason);
    }

    private function log(PointSubmission $submission, ?string $fromStatus, string $toStatus, User $actor, ?string $reason): void
    {
        $submission->verificationLogs()->create([
            'actor_id' => $actor->id,
            'from_status' => $fromStatus,
            'to_status' => $toStatus,
            'reason' => $reason,
        ]);
    }
}
