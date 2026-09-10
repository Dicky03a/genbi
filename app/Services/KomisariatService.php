<?php

namespace App\Services;

use App\Models\Komisariat;
use DomainException;
use Illuminate\Database\Eloquent\Collection;

class KomisariatService
{
    public function getAll(): Collection
    {
        return Komisariat::query()->withCount('users')->latest()->get();
    }

    public function create(array $data): Komisariat
    {
        return Komisariat::create($data);
    }

    public function update(Komisariat $komisariat, array $data): Komisariat
    {
        $komisariat->update($data);

        return $komisariat->refresh();
    }

    public function delete(Komisariat $komisariat): void
    {
        if ($komisariat->users()->exists() || $komisariat->events()->exists()) {
            throw new DomainException('Komisariat yang sudah dirujuk tidak boleh dihapus. Nonaktifkan komisariat tersebut.');
        }

        $komisariat->delete();
    }
}
