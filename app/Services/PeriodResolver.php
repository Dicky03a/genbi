<?php

namespace App\Services;

use App\Models\Period;
use Carbon\Carbon;
use DomainException;

class PeriodResolver
{
    public function forDate(Carbon $date): Period
    {
        $period = Period::query()
            ->whereDate('starts_on', '<=', $date)
            ->whereDate('ends_on', '>=', $date)
            ->first();

        if (! $period) {
            throw new DomainException('Tidak ada periode yang mencakup tanggal aktivitas tersebut.');
        }

        return $period;
    }
}
