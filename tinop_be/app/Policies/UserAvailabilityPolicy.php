<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserAvailability;

class UserAvailabilityPolicy
{
    public function update(User $user, UserAvailability $userAvailability)
    {
        return $user->id === $userAvailability->user_id || $user->getIsAdmin();
    }

    public function delete(User $user, UserAvailability $userAvailability)
    {
        return $user->id === $userAvailability->user_id || $user->getIsAdmin();
    }
}
