<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\Setting;
use App\Models\Tag;
use App\Models\User;
use App\Policies\CategoryPolicy;
use App\Policies\MediaPolicy;
use App\Policies\PagePolicy;
use App\Policies\PostPolicy;
use App\Policies\RolePolicy;
use App\Policies\SettingPolicy;
use App\Policies\TagPolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    protected $policies = [
        Post::class => PostPolicy::class,
        Category::class => CategoryPolicy::class,
        Tag::class => TagPolicy::class,
        User::class => UserPolicy::class,
        Page::class => PagePolicy::class,
        Role::class => RolePolicy::class,
        Setting::class => SettingPolicy::class,
    ];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }


        foreach ($this->policies as $model => $policy) {
            Gate::policy($model, $policy);
        }

        // Register media policy for string-based authorization
        Gate::define('viewAny', function ($user, $resource) {
            if ($resource === 'media') {
                return $user->hasPermissionTo('media.manage');
            }
            return null;
        });

        Gate::define('upload', function ($user, $resource) {
            if ($resource === 'media') {
                return $user->hasPermissionTo('media.manage');
            }
            return null;
        });

        Gate::define('delete', function ($user, $resource) {
            if ($resource === 'media') {
                return $user->hasPermissionTo('media.manage');
            }
            return null;
        });

        Gate::before(function ($user, $ability) {
            return $user->hasRole('Super Admin') ? true : null;
        });
    }
}
