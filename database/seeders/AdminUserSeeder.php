<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@svayrieng.gov.kh'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password123'),
                'is_active' => true,
            ]
        );

        $admin->assignRole('Super Admin');

        // Create additional test users
        $editor = User::firstOrCreate(
            ['email' => 'editor@svayrieng.gov.kh'],
            [
                'name' => 'Editor User',
                'password' => Hash::make('password123'),
                'is_active' => true,
            ]
        );
        $editor->assignRole('Editor');

        $author = User::firstOrCreate(
            ['email' => 'author@svayrieng.gov.kh'],
            [
                'name' => 'Author User',
                'password' => Hash::make('password123'),
                'is_active' => true,
            ]
        );
        $author->assignRole('Author');
    }
}
