<?php

use App\Models\Event;
use App\Models\Komisariat;
use App\Models\Period;
use App\Models\User;
use App\Services\EventService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

function eventPeriod(): Period
{
    return Period::create([
        'name' => 'Ganjil 2026-2027',
        'starts_on' => '2026-08-01',
        'ends_on' => '2027-01-31',
        'target_points' => 100,
    ]);
}
function eventPayload(int $komisariatId): array
{
    return [
        'komisariat_id' => $komisariatId,
        'title' => 'Pelatihan Kepemimpinan',
        'description' => 'Pelatihan anggota.',
        'starts_at' => '2026-09-10 09:00:00',
        'ends_at' => '2026-09-10 12:00:00',
    ];
}

function eventRoles(): array
{
    return [
        ['name' => 'Peserta', 'points' => 5],
        ['name' => 'Panitia', 'points' => 15],
    ];
}

beforeEach(function () {
    Role::findOrCreate('superadmin', 'web');
    Role::findOrCreate('admin_komisariat', 'web');
});

it('creates an event with its period resolved from starts_at and roles', function () {
    $komisariat = Komisariat::create(['name' => 'Komisariat Utara', 'code' => 'UTARA']);
    $actor = User::factory()->create(['komisariat_id' => $komisariat->id]);
    $actor->assignRole('superadmin');
    $period = eventPeriod();

    $event = app(EventService::class)->create($actor, eventPayload($komisariat->id), eventRoles());

    expect($event->period_id)->toBe($period->id)
        ->and($event->slug)->toBe('pelatihan-kepemimpinan')
        ->and($event->roles)->toHaveCount(2);
});

it('allows only the defined event status transitions', function () {
    $event = Event::create([
        ...eventPayload(Komisariat::create(['name' => 'Utara', 'code' => 'UTARA'])->id),
        'period_id' => eventPeriod()->id,
        'created_by' => User::factory()->create()->id,
        'slug' => 'pelatihan',
        'status' => 'draft',
    ]);
    $service = app(EventService::class);

    $service->transitionStatus($event, 'dibuka');

    expect($event->fresh()->status)->toBe('dibuka')
        ->and(fn () => $service->transitionStatus($event->fresh(), 'selesai'))
        ->toThrow(DomainException::class, 'tidak diizinkan');
});

it('denies an admin komisariat access to another komisariat event', function () {
    $first = Komisariat::create(['name' => 'Utara', 'code' => 'UTARA']);
    $second = Komisariat::create(['name' => 'Selatan', 'code' => 'SELATAN']);
    $actor = User::factory()->create(['komisariat_id' => $first->id]);
    $actor->assignRole('admin_komisariat');
    $event = Event::create([
        ...eventPayload($second->id),
        'period_id' => eventPeriod()->id,
        'created_by' => $actor->id,
        'slug' => 'acara-selatan',
    ]);

    $this->actingAs($actor)
        ->post(route('admin.events.status', $event), ['status' => 'dibuka'])
        ->assertForbidden();
});
