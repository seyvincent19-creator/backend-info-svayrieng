<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostListResource;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $posts = Post::with(['category', 'author'])
            ->published()
            ->when($request->type, fn($q, $type) => $q->where('type', $type))
            ->when($request->category_id, fn($q, $categoryId) => $q->where('category_id', $categoryId))
            ->latest('published_at')
            ->paginate($request->per_page ?? 12);

        return PostListResource::collection($posts);
    }

    public function featured(): AnonymousResourceCollection
    {
        $posts = Post::with(['category', 'author'])
            ->published()
            ->featured()
            ->latest('published_at')
            ->limit(10)
            ->get();

        return PostListResource::collection($posts);
    }

    public function breaking(): AnonymousResourceCollection
    {
        $posts = Post::with(['category', 'author'])
            ->published()
            ->breaking()
            ->latest('published_at')
            ->limit(10)
            ->get();

        return PostListResource::collection($posts);
    }

    public function show(string $slug): PostResource
    {
        $post = Post::with(['category.parent', 'author', 'tags', 'images'])
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        return new PostResource($post);
    }

    public function byCategory(string $slug, Request $request): AnonymousResourceCollection
    {
        $posts = Post::with(['category', 'author'])
            ->published()
            ->whereHas('category', function ($q) use ($slug) {
                $q->where('slug', $slug)
                  ->orWhereHas('parent', fn($q2) => $q2->where('slug', $slug));
            })
            ->latest('published_at')
            ->paginate($request->per_page ?? 12);

        return PostListResource::collection($posts);
    }

    public function incrementView(int $id): JsonResponse
    {
        $post = Post::published()->findOrFail($id);
        $post->incrementViews();

        return response()->json(['views' => $post->views]);
    }

    public function search(Request $request): AnonymousResourceCollection
    {
        $keyword = $request->get('q', '');

        $posts = Post::with(['category', 'author'])
            ->published()
            ->when($keyword, fn($q) => $q->search($keyword))
            ->latest('published_at')
            ->paginate($request->per_page ?? 12);

        return PostListResource::collection($posts);
    }

    public function related(string $slug): AnonymousResourceCollection
    {
        $post = Post::where('slug', $slug)->firstOrFail();

        $relatedPosts = Post::with(['category', 'author'])
            ->published()
            ->where('id', '!=', $post->id)
            ->where('category_id', $post->category_id)
            ->latest('published_at')
            ->limit(6)
            ->get();

        return PostListResource::collection($relatedPosts);
    }

    public function videos(Request $request): AnonymousResourceCollection
    {
        $posts = Post::with(['category', 'author'])
            ->published()
            ->videos()
            ->latest('published_at')
            ->paginate($request->per_page ?? 12);

        return PostListResource::collection($posts);
    }

    public function latest(Request $request): AnonymousResourceCollection
    {
        $posts = Post::with(['category', 'author'])
            ->published()
            ->latest('published_at')
            ->limit($request->limit ?? 10)
            ->get();

        return PostListResource::collection($posts);
    }
}
