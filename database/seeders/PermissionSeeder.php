<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Posts
            'posts.view',
            'posts.create',
            'posts.edit',
            'posts.delete',
            'posts.publish',

            // Categories
            'categories.manage',

            // Tags
            'tags.manage',

            // Users
            'users.manage',

            // Roles
            'roles.manage',

            // Permissions
            'permissions.manage',

            // Settings
            'settings.manage',

            // Pages
            'pages.manage',

            // Media
            'media.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create roles and assign permissions
        $roles = [
            'Super Admin' => $permissions,
            'Admin' => [
                'posts.view', 'posts.create', 'posts.edit', 'posts.delete', 'posts.publish',
                'categories.manage', 'tags.manage', 'users.manage', 'pages.manage', 'media.manage',
            ],
            'Editor' => [
                'posts.view', 'posts.create', 'posts.edit', 'posts.delete', 'posts.publish',
                'categories.manage', 'tags.manage', 'media.manage',
            ],
            'Author' => [
                'posts.view', 'posts.create', 'posts.edit',
                'tags.manage', 'media.manage',
            ],
            'Moderator' => [
                'posts.view', 'posts.edit', 'posts.publish',
            ],
            'Viewer' => [
                'posts.view',
            ],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($rolePermissions);
        }
    }
}
