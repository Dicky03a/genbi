<?php

namespace App\Policies;

use App\Models\Attendance;
use App\Models\User;

class AttendancePolicy
{
    public function before(User $user): ?bool
    {
        return $user->hasAnyRole(['superadmin', 'admin_korkom', 'Superadmin', 'admin']) ? true : null;
    }

    public function verify(User $user, Attendance $attendance): bool
    {
        return $user->hasRole('admin_komisariat')
              && $attendance->event?->komisariat_id === $user->komisariat_id;
    }

    public function reject(User $user, Attendance $attendance): bool
    {
        return $this->verify($user, $attendance);
    }
}
