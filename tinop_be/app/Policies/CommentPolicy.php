<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Comment;

class CommentPolicy
{
    public function update(User $user, Comment $comment)
    {
        return $user->id === $comment->user_id || $user->getIsAdmin();
    }

    public function delete(User $user, Comment $comment)
    {
        return $user->id === $comment->user_id || $user->getIsAdmin();
    }
}
