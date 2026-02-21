<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public API Routes
Route::prefix('v1')->group(function () {
    // Posts
    Route::get('posts', [PostController::class, 'index'])->name('api.posts.index');
    Route::get('posts/featured', [PostController::class, 'featured'])->name('api.posts.featured');
    Route::get('posts/breaking', [PostController::class, 'breaking'])->name('api.posts.breaking');
    Route::get('posts/latest', [PostController::class, 'latest'])->name('api.posts.latest');
    Route::get('posts/videos', [PostController::class, 'videos'])->name('api.posts.videos');
    Route::get('posts/search', [PostController::class, 'search'])->name('api.posts.search');
    Route::get('posts/category/{slug}', [PostController::class, 'byCategory'])->name('api.posts.by-category');
    Route::get('posts/{slug}', [PostController::class, 'show'])->name('api.posts.show');
    Route::get('posts/{slug}/related', [PostController::class, 'related'])->name('api.posts.related');
    Route::post('posts/{id}/view', [PostController::class, 'incrementView'])->name('api.posts.view');

    // Categories
    Route::get('categories', [CategoryController::class, 'index'])->name('api.categories.index');
    Route::get('categories/{slug}', [CategoryController::class, 'show'])->name('api.categories.show');

    // Settings
    Route::get('settings', [SettingController::class, 'index'])->name('api.settings.index');

    // Pages
    Route::get('pages', [PageController::class, 'index'])->name('api.pages.index');
    Route::get('pages/{slug}', [PageController::class, 'show'])->name('api.pages.show');
});
