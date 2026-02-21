<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
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
        return $user->hasPermissionTo('users.manage');
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasPermissionTo('users.manage') || $user->id === $model->id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('users.manage');
    }

    public function update(User $user, User $model): bool
    {
        return $user->hasPermissionTo('users.manage') || $user->id === $model->id;
    }

    public function delete(User $user, User $model): bool
    {
        if ($user->id === $model->id) {
            return false;
        }
        return $user->hasPermissionTo('users.manage');
    }
}
