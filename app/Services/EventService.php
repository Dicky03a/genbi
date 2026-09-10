<?php

namespace App\Services;

use App\Models\Event;
use App\Models\User;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EventService
{
    private const TRANSITIONS = [
        'draft' => ['dibuka'],
        'dibuka' => ['ditutup'],
        'ditutup' => ['selesai'],
        'selesai' => [],
    ];

    public function getAll(): Collection
    {
        return Event::query()->with(['period', 'komisariat', 'roles'])->latest('starts_at')->get();
    }

    public function create(User $actor, array $data, array $roles): Event
    {
        $this->assertActorScope($actor, $data['komisariat_id'] ?? null);
        $this->assertDateWindow($data);

        return DB::transaction(function () use ($actor, $data, $roles): Event {
            unset($data['roles']);
            $data['period_id'] = app(PeriodResolver::class)
                ->forDate(now()->parse($data['starts_at']))
                ->id;
            $data['created_by'] = $actor->id;
            $data['slug'] = $this->uniqueSlug($data['title']);
            $data['status'] = 'draft';

            $event = Event::create($data);
            $event->roles()->createMany($roles);

            return $event->load(['period', 'komisariat', 'roles']);
        });
    }

    public function update(Event $event, User $actor, array $data, array $roles): Event
    {
        $this->assertActorScope($actor, $data['komisariat_id'] ?? $event->komisariat_id);
        $this->assertDateWindow($data);

        return DB::transaction(function () use ($event, $data, $roles): Event {
            unset($data['roles']);
            $data['period_id'] = app(PeriodResolver::class)
                ->forDate(now()->parse($data['starts_at']))
                ->id;
            $data['slug'] = $event->slug;
            $event->update($data);
            $event->roles()->delete();
            $event->roles()->createMany($roles);

            return $event->refresh()->load(['period', 'komisariat', 'roles']);
        });
    }

    public function transitionStatus(Event $event, string $status): Event
    {
        if (! in_array($status, self::TRANSITIONS[$event->status] ?? [], true)) {
            throw new DomainException("Transisi status {$event->status} ke {$status} tidak diizinkan.");
        }

        $event->update(['status' => $status]);

        return $event->refresh();
    }

    private function assertActorScope(User $actor, ?int $komisariatId): void
    {
        if ($actor->hasAnyRole(['superadmin', 'admin_korkom', 'Superadmin', 'admin'])) {
            return;
        }

        if ($actor->hasRole('admin_komisariat') && $actor->komisariat_id === $komisariatId) {
            return;
        }

        throw new DomainException('Admin komisariat hanya dapat mengelola acara komisariatnya.');
    }

    private function assertDateWindow(array $data): void
    {
        $startsAt = now()->parse($data['starts_at']);
        $endsAt = now()->parse($data['ends_at']);
        $opensAt = now()->parse($data['opens_at']);
        $closesAt = now()->parse($data['closes_at']);

        if ($startsAt->greaterThanOrEqualTo($endsAt)) {
            throw new DomainException('Waktu mulai acara harus sebelum waktu selesai.');
        }

        if ($opensAt->greaterThanOrEqualTo($closesAt)) {
            throw new DomainException('Jendela absensi harus memiliki waktu mulai dan selesai yang valid.');
        }
    }

    private function uniqueSlug(string $title): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $counter = 2;

        while (Event::query()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
