<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function before(User $user): ?bool
    {
        return $user->hasAnyRole(['superadmin', 'admin_korkom', 'Superadmin', 'admin']) ? true : null;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['admin_komisariat']);
    }

    public function update(User $user, Event $event): bool
    {
        return $user->hasRole('admin_komisariat') && $user->komisariat_id === $event->komisariat_id;
    }

    public function transitionStatus(User $user, Event $event): bool
    {
        return $this->update($user, $event);
    }
}
