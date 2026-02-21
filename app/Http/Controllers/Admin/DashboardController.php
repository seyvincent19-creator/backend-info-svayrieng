<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_posts' => Post::count(),
            'published_posts' => Post::where('status', 'published')->count(),
            'draft_posts' => Post::where('status', 'draft')->count(),
            'total_views' => Post::sum('views'),
            'total_categories' => Category::count(),
            'total_users' => User::count(),
        ];

        $latestPosts = Post::with(['category', 'author'])
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn($post) => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'status' => $post->status,
                'views' => $post->views,
                'category' => $post->category?->name,
                'author' => $post->author?->name,
                'created_at' => $post->created_at->format('Y-m-d H:i'),
            ]);

        $popularPosts = Post::with(['category'])
            ->published()
            ->orderBy('views', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($post) => [
                'id' => $post->id,
                'title' => $post->title,
                'views' => $post->views,
                'category' => $post->category?->name,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'latestPosts' => $latestPosts,
            'popularPosts' => $popularPosts,
        ]);
    }
}
