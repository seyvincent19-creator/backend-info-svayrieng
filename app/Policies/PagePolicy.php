<?php

namespace App\Policies;

use App\Models\Page;
use App\Models\User;

class PagePolicy
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
        return $user->hasPermissionTo('pages.manage');
    }

    public function view(User $user, Page $page): bool
    {
        return $user->hasPermissionTo('pages.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('pages.manage');
    }

    public function update(User $user, Page $page): bool
    {
        return $user->hasPermissionTo('pages.manage');
    }

    public function delete(User $user, Page $page): bool
    {
        return $user->hasPermissionTo('pages.manage');
    }
}
