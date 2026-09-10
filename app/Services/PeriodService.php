<?php

namespace App\Services;

use App\Models\Period;
use Carbon\Carbon;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class PeriodService
{
    public function getAll(): Collection
    {
        return Period::query()->latest('starts_on')->get();
    }

    public function create(array $data): Period
    {
        $this->assertValidDates($data);
        $this->assertNoOverlap($data['starts_on'], $data['ends_on']);

        return Period::create($data);
    }

    public function update(Period $period, array $data): Period
    {
        $this->assertValidDates($data);
        $this->assertNoOverlap($data['starts_on'], $data['ends_on'], $period);

        $period->update($data);

        return $period->refresh();
    }

    public function activate(Period $period): Period
    {
        return DB::transaction(function () use ($period): Period {
            Period::query()->whereKeyNot($period->id)->update(['is_active' => false]);
            $period->update(['is_active' => true]);

            return $period->refresh();
        });
    }

    public function delete(Period $period): void
    {
        if ($period->events()->exists() || $period->pointTransactions()->exists() || $period->pointSubmissions()->exists()) {
            throw new DomainException('Periode yang sudah dirujuk tidak boleh dihapus. Nonaktifkan periode tersebut.');
        }

        $period->delete();
    }

    private function assertValidDates(array $data): void
    {
        if (Carbon::parse($data['starts_on'])->greaterThan(Carbon::parse($data['ends_on']))) {
            throw new DomainException('Tanggal mulai periode harus sebelum atau sama dengan tanggal selesai.');
        }
    }

    private function assertNoOverlap(string $startsOn, string $endsOn, ?Period $except = null): void
    {
        $query = Period::query()
            ->where('starts_on', '<=', $endsOn)
            ->where('ends_on', '>=', $startsOn);

        if ($except) {
            $query->whereKeyNot($except->id);
        }

        if ($query->exists()) {
            throw new DomainException('Periode bertabrakan dengan periode yang sudah ada.');
        }
    }
}
