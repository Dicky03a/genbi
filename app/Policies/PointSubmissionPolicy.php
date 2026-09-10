<?php

namespace App\Policies;

use App\Models\PointSubmission;
use App\Models\User;

class PointSubmissionPolicy
{
    public function before(User $user): ?bool
    {
        return $user->hasAnyRole(['superadmin', 'admin_korkom', 'Superadmin', 'admin']) ? true : null;
    }

    public function revise(User $user, PointSubmission $submission): bool
    {
        return $submission->user_id === $user->id;
    }

    public function verify(User $user, PointSubmission $submission): bool
    {
        return $user->hasRole('admin_komisariat')
              && $submission->user?->komisariat_id === $user->komisariat_id;
    }

    public function reject(User $user, PointSubmission $submission): bool
    {
        return $this->verify($user, $submission);
    }
}
