<?php

namespace App\Policies;

use App\Models\User;

class MediaPolicy
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
        return $user->hasPermissionTo('media.manage');
    }

    public function upload(User $user): bool
    {
        return $user->hasPermissionTo('media.manage');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('media.manage');
    }
}
