<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{

    /**
     * @param User $user
     * @param Project $project
     * @return bool
     */
    public function update(User $user, Project $project): bool
    {
        return $user->id === $project->creator_id || $user->getIsAdmin();
    }

    /**
     * @param User $user
     * @param Project $project
     * @return bool
     */
    public function delete(User $user, Project $project): bool
    {
        return $user->id === $project->creator_id || $user->getIsAdmin();

    }

    /**
     * @param User $user
     * @param Project $project
     * @return bool
     */
    public function view(User $user, Project $project): bool
    {
        return $project->creator_id === $user->id ||
            $project->members()->where('user_id', $user->id)
                ->where('status', 'accepted')->exists();
    }

    /**
     * @param User $user
     * @param Project $project
     * @return bool
     */
    public function manage(User $user, Project $project): bool
    {
        return $user->id === $project->creator_id || $user->getIsAdmin();
    }
}
