<?php

use App\Models\Division;
use App\Models\Period;
use App\Models\PointCategory;
use App\Models\PointRate;
use App\Models\User;
use App\Services\PointSubmissionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    Role::findOrCreate('superadmin', 'web');
});

function submissionPeriod(): Period
{
    return Period::create([
        'name' => 'Ganjil 2026-2027',
        'starts_on' => '2026-08-01',
        'ends_on' => '2027-01-31',
        'target_points' => 100,
    ]);
}

function submissionRate(int $points = 20): PointRate
{
    $category = PointCategory::create(['name' => 'Kegiatan Organisasi', 'slug' => 'kegiatan-organisasi']);

    return PointRate::create([
        'point_category_id' => $category->id,
        'name' => 'Peserta kegiatan',
        'points' => $points,
        'is_active' => true,
    ]);
}

function submissionData(int $rateId): array
{
    return [
        'point_rate_id' => $rateId,
        'activity_date' => '2026-09-10',
        'title' => 'Kegiatan organisasi',
        'description' => 'Kontribusi pada kegiatan organisasi.',
    ];
}

it('submits a point claim with locked period, division, and rate snapshot', function () {
    $division = Division::create(['name' => 'PSDM']);
    $user = User::factory()->create(['division_id' => $division->id]);
    $period = submissionPeriod();
    $rate = submissionRate(20);

    $submission = app(PointSubmissionService::class)->submit($user, submissionData($rate->id));
    $rate->update(['points' => 50]);

    expect($submission->period_id)->toBe($period->id)
        ->and($submission->division_id)->toBe($division->id)
        ->and($submission->points_requested)->toBe(20)
        ->and($submission->status)->toBe('menunggu')
        ->and($submission->verificationLogs)->toHaveCount(1);
});

it('requires a rejection reason and supports revise then verify with one ledger row', function () {
    $user = User::factory()->create();
    $actor = User::factory()->create();
    submissionPeriod();
    $rate = submissionRate();
    $service = app(PointSubmissionService::class);
    $submission = $service->submit($user, submissionData($rate->id));

    expect(fn () => $service->reject($submission, $actor, ''))
        ->toThrow(DomainException::class, 'Alasan penolakan');

    $service->reject($submission, $actor, 'Bukti kurang jelas.');
    $revised = $service->revise($submission->fresh(), $user, submissionData($rate->id));
    $verified = $service->verify($revised, $actor);

    expect($verified->status)->toBe('disetujui')
        ->and($verified->revision_count)->toBe(1)
        ->and($verified->verificationLogs)->toHaveCount(4)
        ->and($user->pointTransactions()->where('source', 'pengajuan')->count())->toBe(1);
});

it('rejects a revision by another user and enforces the revision limit', function () {
    config(['attendance.submission_max_revisions' => 1]);
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $actor = User::factory()->create();
    submissionPeriod();
    $rate = submissionRate();
    $service = app(PointSubmissionService::class);
    $submission = $service->submit($user, submissionData($rate->id));
    $service->reject($submission, $actor, 'Perlu diperbaiki.');

    expect(fn () => $service->revise($submission->fresh(), $otherUser, submissionData($rate->id)))
        ->toThrow(DomainException::class, 'milik anggota lain');

    $service->revise($submission->fresh(), $user, submissionData($rate->id));
    $service->reject($submission->fresh(), $actor, 'Masih perlu diperbaiki.');

    expect(fn () => $service->revise($submission->fresh(), $user, submissionData($rate->id)))
        ->toThrow(DomainException::class, 'Batas revisi');
});

it('returns forbidden when another user tries to open a revision form', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    submissionPeriod();
    $rate = submissionRate();
    $submission = app(PointSubmissionService::class)->submit($owner, submissionData($rate->id));

    $this->actingAs($otherUser)
        ->get(route('submissions.edit', $submission))
        ->assertForbidden();
});

it('requires a reason when rejecting through the admin endpoint', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $admin->assignRole('superadmin');
    submissionPeriod();
    $rate = submissionRate();
    $submission = app(PointSubmissionService::class)->submit($owner, submissionData($rate->id));

    $this->actingAs($admin)
        ->patch(route('admin.submissions.reject', $submission), ['reason' => ''])
        ->assertSessionHasErrors('reason');
});

it('rejects invalid verification transitions through a central rule', function () {
    $service = app(\App\Services\VerificationStateService::class);

    expect(fn () => $service->assertCanTransition('ditolak', 'menunggu'))
        ->toThrow(DomainException::class, 'Transisi status tidak valid');

    expect(fn () => $service->assertCanTransition('disetujui', 'ditolak'))
        ->toThrow(DomainException::class, 'Transisi status tidak valid');
});
