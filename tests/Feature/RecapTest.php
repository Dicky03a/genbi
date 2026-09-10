<?php

use App\Models\Period;
use App\Models\PointCategory;
use App\Models\User;
use App\Services\PointLedgerService;
use App\Services\RecapService;

function recapPeriod(): Period
{
      return Period::create([
            'name' => 'Ganjil 2026-2027',
            'starts_on' => '2026-08-01',
            'ends_on' => '2027-01-31',
            'target_points' => 100,
      ]);
}

it('excludes reversed transactions from user recap and progress', function () {
      $user = User::factory()->create();
      $actor = User::factory()->create();
      $period = recapPeriod();
      $category = PointCategory::create(['name' => 'Kegiatan Organisasi', 'slug' => 'kegiatan-organisasi']);
      $ledger = app(PointLedgerService::class);
      $effective = $ledger->record($user, $category, $period, 'pengajuan', 10, 30);
      $reversed = $ledger->record($user, $category, $period, 'absensi', 11, 70);
      $ledger->reverse($reversed, $actor, 'Duplikat.');

      $recap = app(RecapService::class)->forUser($user, $period);

      expect($recap['total_points'])->toBe(30)
            ->and($recap['progress']['percentage'])->toBe(30.0)
            ->and($recap['transactions'])->toHaveCount(1)
            ->and($recap['transactions']->first()->id)->toBe($effective->id);
});

it('ranks active users and supports komisariat and division filters', function () {
      $period = recapPeriod();
      $category = PointCategory::create(['name' => 'Prestasi', 'slug' => 'prestasi']);
      $first = User::factory()->create(['name' => 'A First']);
      $second = User::factory()->create(['name' => 'B Second']);
      app(PointLedgerService::class)->record($first, $category, $period, 'manual', null, 50, $second, 'A');
      app(PointLedgerService::class)->record($second, $category, $period, 'manual', null, 20, $first, 'B');

      $ranking = app(RecapService::class)->forPeriod($period);

      expect($ranking->first()['user']->id)->toBe($first->id)
            ->and($ranking->first()['rank'])->toBe(1)
            ->and($ranking->last()['total_points'])->toBe(20);
});
