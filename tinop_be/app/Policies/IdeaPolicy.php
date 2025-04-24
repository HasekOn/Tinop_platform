<?php

namespace App\Policies;

use App\Models\Idea;
use App\Models\User;

class IdeaPolicy
{
    /**
     * @param User $user
     * @param Idea $idea
     * @return bool
     */
    public function update(User $user, Idea $idea): bool
    {
        return $user->id === $idea->user_id || $user->getIsAdmin();
    }

    /**
     * @param User $user
     * @param Idea $idea
     * @return bool
     */
    public function delete(User $user, Idea $idea): bool
    {
        return $user->id === $idea->user_id || $user->getIsAdmin();
    }
}
