<?php

use App\Models\Period;
use App\Models\PointCategory;
use App\Models\PointRate;
use App\Models\PointTransaction;
use App\Models\User;
use App\Services\PeriodResolver;
use App\Services\PointLedgerService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

function ledgerPeriod(): Period
{
    return Period::create([
        'name' => 'Ganjil 2026-2027',
        'starts_on' => '2026-08-01',
        'ends_on' => '2027-01-31',
        'target_points' => 100,
    ]);
}

function ledgerCategory(): PointCategory
{
    return PointCategory::create([
        'name' => 'Kepemimpinan',
        'slug' => 'kepemimpinan',
    ]);
}

it('records the same source only once', function () {
    $service = app(PointLedgerService::class);
    $user = User::factory()->create();
    $category = ledgerCategory();
    $period = ledgerPeriod();

    $first = $service->record($user, $category, $period, 'pengajuan', 42, 20);
    $second = $service->record($user, $category, $period, 'pengajuan', 42, 99);

    expect($second->id)->toBe($first->id)
        ->and($second->points)->toBe(20)
        ->and(PointTransaction::count())->toBe(1);
});

it('reverses a transaction without changing its points and rejects a second reversal', function () {
    $service = app(PointLedgerService::class);
    $user = User::factory()->create();
    $actor = User::factory()->create();
    $transaction = $service->record($user, ledgerCategory(), ledgerPeriod(), 'absensi', 7, 15);

    $reversed = $service->reverse($transaction, $actor, 'Data absensi dibatalkan.');

    expect($reversed->points)->toBe(15)
        ->and($reversed->reversed_at)->not->toBeNull()
        ->and(PointTransaction::effective()->count())->toBe(0)
        ->and(fn () => $service->reverse($reversed, $actor, 'Coba lagi'))
        ->toThrow(DomainException::class, 'sudah dibatalkan');
});

it('requires a reason for manual adjustments and allows negative points', function () {
    $service = app(PointLedgerService::class);
    $user = User::factory()->create();
    $actor = User::factory()->create();
    $category = ledgerCategory();
    $period = ledgerPeriod();

    expect(fn () => $service->adjust($user, $category, $period, -5, $actor, ''))
        ->toThrow(DomainException::class, 'Alasan koreksi');

    $transaction = $service->adjust($user, $category, $period, -5, $actor, 'Koreksi administrasi.');

    expect($transaction->source)->toBe('manual')
        ->and($transaction->points)->toBe(-5);
});

it('resolves a period from the activity date', function () {
    $period = ledgerPeriod();

    expect(app(PeriodResolver::class)->forDate(Carbon::parse('2026-09-08'))->is($period))->toBeTrue()
        ->and(fn () => app(PeriodResolver::class)->forDate(Carbon::parse('2027-02-01')))
        ->toThrow(DomainException::class, 'Tidak ada periode');
});

it('keeps the recorded point snapshot after the rate changes', function () {
    $category = ledgerCategory();
    $rate = PointRate::create([
        'point_category_id' => $category->id,
        'name' => 'Koordinator',
        'points' => 20,
    ]);
    $transaction = app(PointLedgerService::class)->record(
        User::factory()->create(),
        $category,
        ledgerPeriod(),
        'pengajuan',
        88,
        $rate->points,
    );

    $rate->update(['points' => 50]);

    expect($transaction->fresh()->points)->toBe(20);
});
