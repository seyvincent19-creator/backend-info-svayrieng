<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

// Redirect root to admin login
Route::get('/', function () {
    return redirect()->route('admin.login');
});

// Admin Auth Routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthController::class, 'showLogin'])->name('login');
        Route::post('login', [AuthController::class, 'login'])->name('login.submit');
    });

    Route::post('logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');
});

// Admin Dashboard Routes
Route::prefix('admin')->name('admin.')->middleware(['auth'])->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Posts
    Route::resource('posts', PostController::class)->except(['show']);
    Route::delete('posts/image/{image}', [PostController::class, 'deleteImage'])->name('posts.image.delete');
    Route::post('posts/bulk-delete', [PostController::class, 'bulkDelete'])->name('posts.bulk-delete');

    // Categories
    Route::resource('categories', CategoryController::class)->except(['show']);

    // Tags
    Route::resource('tags', TagController::class)->except(['show']);

    // Users
    Route::resource('users', UserController::class)->except(['show'])
        ->middleware('permission:users.manage');

    // Roles
    Route::resource('roles', RoleController::class)->except(['show'])
        ->middleware('permission:roles.manage');

    // Pages
    Route::resource('pages', PageController::class)->except(['show']);

    // Settings
    Route::get('settings', [SettingController::class, 'index'])->name('settings.index')
        ->middleware('permission:settings.manage');
    Route::post('settings', [SettingController::class, 'update'])->name('settings.update')
        ->middleware('permission:settings.manage');

    // Media
    Route::post('media/upload', [MediaController::class, 'upload'])->name('media.upload');
    Route::post('media/delete', [MediaController::class, 'delete'])->name('media.delete');
    Route::get('media/list', [MediaController::class, 'list'])->name('media.list');
});
