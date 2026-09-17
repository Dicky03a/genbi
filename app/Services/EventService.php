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
            $pointRateIds = $data['point_rate_ids'] ?? [];
            unset($data['roles'], $data['point_rate_ids']);
            $data['period_id'] = app(PeriodResolver::class)
                ->forDate(now()->parse($data['starts_at']))
                ->id;
            $data['created_by'] = $actor->id;
            $data['slug'] = $this->uniqueSlug($data['title']);
            $data['status'] = !empty($data['is_open']) ? 'dibuka' : 'draft';
            unset($data['is_open']);

            if (isset($data['poster']) && $data['poster'] instanceof \Illuminate\Http\UploadedFile) {
                $data['poster_path'] = $data['poster']->storePublicly('events/posters', 'public');
            }
            unset($data['poster']);

            $event = Event::create($data);
            if (($data['point_type'] ?? 'role') === 'role' && !empty($roles)) {
                $event->roles()->createMany($roles);
            } elseif (($data['point_type'] ?? 'role') === 'point_rate') {
                $event->pointRates()->sync($pointRateIds);
            }

            return $event->load(['period', 'komisariat', 'roles', 'pointRates']);
        });
    }

    public function update(Event $event, User $actor, array $data, array $roles): Event
    {
        $this->assertActorScope($actor, $data['komisariat_id'] ?? $event->komisariat_id);
        $this->assertDateWindow($data);

        return DB::transaction(function () use ($event, $data, $roles): Event {
            $pointRateIds = $data['point_rate_ids'] ?? [];
            unset($data['roles'], $data['point_rate_ids']);
            $data['period_id'] = app(PeriodResolver::class)
                ->forDate(now()->parse($data['starts_at']))
                ->id;
            $data['slug'] = $event->slug;
            
            if ($event->status !== 'selesai') {
                $data['status'] = !empty($data['is_open']) ? 'dibuka' : 'ditutup';
            }
            unset($data['is_open']);

            if (array_key_exists('poster', $data)) {
                if ($data['poster'] instanceof \Illuminate\Http\UploadedFile) {
                    if ($event->poster_path) {
                        \Illuminate\Support\Facades\Storage::disk('public')->delete($event->poster_path);
                    }
                    $data['poster_path'] = $data['poster']->storePublicly('events/posters', 'public');
                } elseif ($data['poster'] === null && $event->poster_path) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($event->poster_path);
                    $data['poster_path'] = null;
                }
            }
            unset($data['poster']);

            $event->update($data);
            $event->roles()->delete();
            if (($data['point_type'] ?? 'role') === 'role' && !empty($roles)) {
                $event->roles()->createMany($roles);
                $event->pointRates()->sync([]);
            } elseif (($data['point_type'] ?? 'role') === 'point_rate') {
                $event->pointRates()->sync($pointRateIds);
            }

            return $event->refresh()->load(['period', 'komisariat', 'roles', 'pointRates']);
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

        if ($startsAt->greaterThanOrEqualTo($endsAt)) {
            throw new DomainException('Waktu mulai acara harus sebelum waktu selesai.');
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
