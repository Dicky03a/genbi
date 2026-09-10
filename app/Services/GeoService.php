<?php

namespace App\Services;

class GeoService
{
    public function haversine(float $latitudeOne, float $longitudeOne, float $latitudeTwo, float $longitudeTwo): float
    {
        $earthRadius = 6371000.0;
        $latitudeDelta = deg2rad($latitudeTwo - $latitudeOne);
        $longitudeDelta = deg2rad($longitudeTwo - $longitudeOne);
        $latitudeOne = deg2rad($latitudeOne);
        $latitudeTwo = deg2rad($latitudeTwo);

        $a = sin($latitudeDelta / 2) ** 2
              + cos($latitudeOne) * cos($latitudeTwo) * sin($longitudeDelta / 2) ** 2;

        return $earthRadius * 2 * atan2(sqrt($a), sqrt(1 - $a));
    }
}
