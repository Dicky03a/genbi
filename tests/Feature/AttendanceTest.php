<?php

use App\Models\Event;
use App\Models\EventRole;
use App\Models\Komisariat;
use App\Models\Period;
use App\Models\PointCategory;
use App\Models\User;
use App\Services\AttendanceService;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

function attendancePeriod(): Period
{
    return Period::create([
        'name' => 'Ganjil 2026-2027',
        'starts_on' => '2026-08-01',
        'ends_on' => '2027-01-31',
        'target_points' => 100,
    ]);
}

function attendanceEvent(User $creator, ?int $komisariatId = null, string $status = 'dibuka'): Event
{
    return Event::create([
        'period_id' => attendancePeriod()->id,
        'komisariat_id' => $komisariatId,
        'created_by' => $creator->id,
        'title' => 'Kegiatan Anggota',
        'slug' => 'kegiatan-anggota-'.uniqid(),
        'starts_at' => '2026-09-10 09:00:00',
        'ends_at' => '2026-09-10 12:00:00',
        'opens_at' => '2026-09-10 08:30:00',
        'closes_at' => '2026-09-10 12:30:00',
        'latitude' => -7.1500000,
        'longitude' => 111.8800000,
        'radius_m' => 100,
        'max_gps_accuracy_m' => 50,
        'status' => $status,
    ]);
}

function attendanceData(int $roleId, float $accuracy = 10): array
{
    return [
        'event_role_id' => $roleId,
        'captured_lat' => -7.1500000,
        'captured_lng' => 111.8800000,
        'gps_accuracy_m' => $accuracy,
    ];
}

beforeEach(function () {
    Carbon::setTestNow('2026-09-10 10:00:00');
    Storage::fake('local');
});

afterEach(function () {
    Carbon::setTestNow();
});

it('rejects attendance when the event is not open', function () {
    $user = User::factory()->create();
    $event = attendanceEvent($user, null, 'draft');
    $role = EventRole::create(['event_id' => $event->id, 'name' => 'Peserta', 'points' => 5]);

    expect(fn () => app(AttendanceService::class)->submit($user, $event, attendanceData($role->id), UploadedFile::fake()->image('photo.jpg')))
        ->toThrow(DomainException::class, 'belum dibuka');
});

it('rejects inaccurate gps before checking the location', function () {
    $user = User::factory()->create();
    $event = attendanceEvent($user);
    $role = EventRole::create(['event_id' => $event->id, 'name' => 'Peserta', 'points' => 5]);

    expect(fn () => app(AttendanceService::class)->submit($user, $event, attendanceData($role->id, 100), UploadedFile::fake()->image('photo.jpg')))
        ->toThrow(DomainException::class, 'Sinyal GPS');
});

it('rejects attendance outside the opening window', function () {
    Carbon::setTestNow('2026-09-10 13:00:00');
    $user = User::factory()->create();
    $event = attendanceEvent($user);
    $role = EventRole::create(['event_id' => $event->id, 'name' => 'Peserta', 'points' => 5]);

    expect(fn () => app(AttendanceService::class)->submit($user, $event, attendanceData($role->id), UploadedFile::fake()->image('photo.jpg')))
        ->toThrow(DomainException::class, 'Absensi sudah ditutup');
});

it('rejects attendance from another komisariat', function () {
    $eventKomisariat = Komisariat::create(['name' => 'Utara', 'code' => 'UTARA']);
    $userKomisariat = Komisariat::create(['name' => 'Selatan', 'code' => 'SELATAN']);
    $creator = User::factory()->create(['komisariat_id' => $eventKomisariat->id]);
    $user = User::factory()->create(['komisariat_id' => $userKomisariat->id]);
    $event = attendanceEvent($creator, $eventKomisariat->id);
    $role = EventRole::create(['event_id' => $event->id, 'name' => 'Peserta', 'points' => 5]);

    expect(fn () => app(AttendanceService::class)->submit($user, $event, attendanceData($role->id), UploadedFile::fake()->image('photo.jpg')))
        ->toThrow(DomainException::class, 'komisariat lain');
});

it('rejects attendance outside the event radius', function () {
    $user = User::factory()->create();
    $event = attendanceEvent($user);
    $role = EventRole::create(['event_id' => $event->id, 'name' => 'Peserta', 'points' => 5]);
    $data = [...attendanceData($role->id), 'captured_lat' => -7.1600000];

    expect(fn () => app(AttendanceService::class)->submit($user, $event, $data, UploadedFile::fake()->image('photo.jpg')))
        ->toThrow(DomainException::class, 'di luar lokasi');
});

it('rejects an event role belonging to another event', function () {
    $user = User::factory()->create();
    $event = attendanceEvent($user);
    $otherEvent = attendanceEvent($user);
    $role = EventRole::create(['event_id' => $otherEvent->id, 'name' => 'Peserta', 'points' => 5]);

    expect(fn () => app(AttendanceService::class)->submit($user, $event, attendanceData($role->id), UploadedFile::fake()->image('photo.jpg')))
        ->toThrow(DomainException::class, 'Peran acara tidak valid');
});

it('submits attendance, computes distance on the server, and writes an audit log', function () {
    $user = User::factory()->create();
    $event = attendanceEvent($user);
    $role = EventRole::create(['event_id' => $event->id, 'name' => 'Peserta', 'points' => 5]);

    $attendance = app(AttendanceService::class)->submit($user, $event, attendanceData($role->id), UploadedFile::fake()->image('photo.jpg'));

    expect($attendance->status)->toBe('menunggu')
        ->and((float) $attendance->distance_m)->toBe(0.0)
        ->and($attendance->verificationLogs)->toHaveCount(1)
        ->and(Storage::disk('local')->exists($attendance->photo_path))->toBeTrue();
});

it('rejects a duplicate attendance and verifies an accepted attendance into the ledger', function () {
    $user = User::factory()->create();
    $actor = User::factory()->create();
    $event = attendanceEvent($user);
    $role = EventRole::create(['event_id' => $event->id, 'name' => 'Peserta', 'points' => 5]);
    $data = attendanceData($role->id);
    $service = app(AttendanceService::class);
    $first = $service->submit($user, $event, $data, UploadedFile::fake()->image('photo.jpg'));

    expect(fn () => $service->submit($user, $event, $data, UploadedFile::fake()->image('photo-2.jpg')))
        ->toThrow(DomainException::class, 'sudah melakukan absensi');

    PointCategory::create(['name' => 'Kegiatan Organisasi', 'slug' => 'kegiatan-organisasi']);
    $verified = $service->verify($first, $actor);

    expect($verified->status)->toBe('disetujui')
        ->and($verified->verificationLogs)->toHaveCount(2)
        ->and($verified->user->pointTransactions()->count())->toBe(1);
});
