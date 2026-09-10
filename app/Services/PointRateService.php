<?php

namespace App\Services;

use App\Models\PointRate;
use Illuminate\Database\Eloquent\Collection;

class PointRateService
{
    public function getAll(): Collection
    {
        return PointRate::query()->with('pointCategory')->latest()->get();
    }

    public function create(array $data): PointRate
    {
        return PointRate::create($data);
    }

    public function update(PointRate $rate, array $data): PointRate
    {
        $rate->update($data);

        return $rate->refresh();
    }

    public function delete(PointRate $rate): void
    {
        $rate->delete();
    }
}
