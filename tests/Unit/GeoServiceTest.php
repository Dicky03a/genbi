<?php

use App\Services\GeoService;

it('calculates distance in meters using haversine', function () {
    $distance = app(GeoService::class)->haversine(-6.2000000, 106.8166667, -6.2010000, 106.8166667);

    expect($distance)->toBeGreaterThan(100)->toBeLessThan(120);
});
