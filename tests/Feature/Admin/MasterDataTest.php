<?php

use App\Models\Komisariat;
use App\Models\Period;
use App\Models\PointCategory;
use App\Models\PointTransaction;
use App\Models\User;
use App\Services\KomisariatService;
use App\Services\PeriodService;

it('rejects overlapping periods', function () {
    $service = app(PeriodService::class);

    $service->create([
        'name' => 'Ganjil 2026-2027',
        'starts_on' => '2026-08-01',
        'ends_on' => '2027-01-31',
        'target_points' => 100,
    ]);

    expect(fn () => $service->create([
        'name' => 'Genap 2026-2027',
        'starts_on' => '2027-01-01',
        'ends_on' => '2027-06-30',
        'target_points' => 100,
    ]))->toThrow(DomainException::class, 'Periode bertabrakan');
});

it('activates one period and deactivates the other periods', function () {
    $first = Period::create([
        'name' => 'Ganjil 2026-2027',
        'starts_on' => '2026-08-01',
        'ends_on' => '2027-01-31',
        'target_points' => 100,
        'is_active' => true,
    ]);
    $second = Period::create([
        'name' => 'Genap 2026-2027',
        'starts_on' => '2027-02-01',
        'ends_on' => '2027-06-30',
        'target_points' => 100,
    ]);

    app(PeriodService::class)->activate($second);

    expect($second->fresh()->is_active)->toBeTrue()
        ->and($first->fresh()->is_active)->toBeFalse();
});

it('rejects deleting a komisariat referenced by a user', function () {
    $komisariat = Komisariat::create([
        'name' => 'Komisariat Utara',
        'code' => 'UTARA',
    ]);
    User::factory()->create(['komisariat_id' => $komisariat->id]);

    expect(fn () => app(KomisariatService::class)->delete($komisariat))
        ->toThrow(DomainException::class, 'Komisariat yang sudah dirujuk');
});

it('rejects deleting a period referenced by a transaction', function () {
    $period = Period::create([
        'name' => 'Ganjil 2026-2027',
        'starts_on' => '2026-08-01',
        'ends_on' => '2027-01-31',
        'target_points' => 100,
    ]);
    $category = PointCategory::create(['name' => 'Kepemimpinan', 'slug' => 'kepemimpinan']);
    PointTransaction::create([
        'user_id' => User::factory()->create()->id,
        'point_category_id' => $category->id,
        'period_id' => $period->id,
        'source' => 'manual',
        'points' => 10,
    ]);

    expect(fn () => app(PeriodService::class)->delete($period))
        ->toThrow(DomainException::class, 'Periode yang sudah dirujuk');
});
