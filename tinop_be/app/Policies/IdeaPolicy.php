<?php

namespace App\Policies;

use App\Models\Idea;
use App\Models\User;

class IdeaPolicy
{
    public function update(User $user, Idea $idea)
    {
        return $user->id === $idea->user_id || $user->getIsAdmin();
    }

    public function delete(User $user, Idea $idea)
    {
        return $user->id === $idea->user_id || $user->getIsAdmin();
    }
}
