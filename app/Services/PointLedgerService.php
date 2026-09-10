<?php

namespace App\Services;

use App\Models\Period;
use App\Models\PointCategory;
use App\Models\PointTransaction;
use App\Models\User;
use DomainException;
use Illuminate\Support\Facades\DB;

class PointLedgerService
{
    private const SOURCES = ['absensi', 'pengajuan', 'manual'];

    public function record(
        User $user,
        PointCategory $category,
        Period $period,
        string $source,
        ?int $sourceId,
        int $points,
        ?User $actor = null,
        ?string $note = null,
    ): PointTransaction {
        $this->assertSource($source);

        if ($points === 0) {
            throw new DomainException('Poin transaksi tidak boleh nol.');
        }

        return DB::transaction(function () use ($user, $category, $period, $source, $sourceId, $points, $actor, $note): PointTransaction {
            $attributes = [
                'user_id' => $user->id,
                'point_category_id' => $category->id,
                'period_id' => $period->id,
                'source' => $source,
                'source_id' => $sourceId,
                'points' => $points,
                'actor_id' => $actor?->id,
                'note' => $note,
            ];

            if ($sourceId === null) {
                return PointTransaction::create($attributes);
            }

            return PointTransaction::query()->firstOrCreate(
                ['source' => $source, 'source_id' => $sourceId],
                $attributes,
            );
        });
    }

    public function reverse(PointTransaction $transaction, User $actor, string $reason): PointTransaction
    {
        if ($transaction->reversed_at !== null) {
            throw new DomainException('Transaksi poin sudah dibatalkan.');
        }

        if (trim($reason) === '') {
            throw new DomainException('Alasan pembatalan transaksi wajib diisi.');
        }

        $transaction->update([
            'reversed_at' => now(),
            'reversed_by' => $actor->id,
            'reversal_reason' => $reason,
        ]);

        return $transaction->refresh();
    }

    public function adjust(
        User $user,
        PointCategory $category,
        Period $period,
        int $points,
        User $actor,
        string $reason,
    ): PointTransaction {
        if ($points === 0) {
            throw new DomainException('Koreksi poin tidak boleh nol.');
        }

        if (trim($reason) === '') {
            throw new DomainException('Alasan koreksi poin wajib diisi.');
        }

        return $this->record($user, $category, $period, 'manual', null, $points, $actor, $reason);
    }

    private function assertSource(string $source): void
    {
        if (! in_array($source, self::SOURCES, true)) {
            throw new DomainException('Sumber transaksi poin tidak valid.');
        }
    }
}
