<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserAvailability;

class UserAvailabilityPolicy
{
    /**
     * @param User $user
     * @param UserAvailability $userAvailability
     * @return bool
     */
    public function update(User $user, UserAvailability $userAvailability): bool
    {
        return $user->id === $userAvailability->user_id || $user->getIsAdmin();
    }

    /**
     * @param User $user
     * @param UserAvailability $userAvailability
     * @return bool
     */
    public function delete(User $user, UserAvailability $userAvailability): bool
    {
        return $user->id === $userAvailability->user_id || $user->getIsAdmin();
    }
}
