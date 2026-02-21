<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('posts.view');
    }

    public function view(User $user, Post $post): bool
    {
        return $user->hasPermissionTo('posts.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('posts.create');
    }

    public function update(User $user, Post $post): bool
    {
        if ($user->hasPermissionTo('posts.edit')) {
            return true;
        }

        return $user->id === $post->author_id;
    }

    public function delete(User $user, Post $post): bool
    {
        if ($user->hasPermissionTo('posts.delete')) {
            return true;
        }

        return $user->id === $post->author_id;
    }

    public function publish(User $user, Post $post): bool
    {
        return $user->hasPermissionTo('posts.publish');
    }
}
