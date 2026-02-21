<?php

namespace App\Policies;

use App\Models\User;

class SettingPolicy
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
        return $user->hasPermissionTo('settings.manage');
    }

    public function update(User $user): bool
    {
        return $user->hasPermissionTo('settings.manage');
    }
}
