<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PostRequest;
use App\Models\Category;
use App\Models\Post;
use App\Models\PostImage;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Post::class);

        $posts = Post::with(['category', 'author'])
            ->when($request->search, fn($q, $s) => $q->search($s))
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->category_id, fn($q, $c) => $q->where('category_id', $c))
            ->when($request->type, fn($q, $t) => $q->where('type', $t))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $categories = Category::active()->get(['id', 'name']);

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'filters' => $request->only(['search', 'status', 'category_id', 'type']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Post::class);

        $categories = Category::with('children')
            ->active()
            ->parentCategories()
            ->orderBy('order')
            ->get();
        $tags = Tag::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Posts/Form', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function store(PostRequest $request): RedirectResponse
    {
        $this->authorize('create', Post::class);

        DB::beginTransaction();
        try {
            $data = $request->validated();
            $data['author_id'] = auth()->id();
            $data['slug'] = $data['slug'] ?? Str::slug($data['title']) . '-' . Str::random(6);

            if ($request->hasFile('cover_image')) {
                $data['cover_image'] = $request->file('cover_image')->store('posts/covers', 'public');
            }

            if ($data['status'] === 'published' && empty($data['published_at'])) {
                $data['published_at'] = now();
            }

            $post = Post::create($data);

            if ($request->has('tags')) {
                $post->tags()->sync($request->tags);
            }

            if ($request->hasFile('gallery_images')) {
                foreach ($request->file('gallery_images') as $index => $image) {
                    $path = $image->store('posts/gallery', 'public');
                    $post->images()->create([
                        'image_path' => $path,
                        'order' => $index,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('admin.posts.index')
                ->with('success', 'អត្ថបទត្រូវបានបង្កើតដោយជោគជ័យ');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'មានបញ្ហាក្នុងការបង្កើតអត្ថបទ: ' . $e->getMessage());
        }
    }

    public function edit(Post $post): Response
    {
        $this->authorize('update', $post);

        $post->load(['tags', 'images']);
        $categories = Category::with('children')
            ->active()
            ->parentCategories()
            ->orderBy('order')
            ->get();
        $tags = Tag::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Posts/Form', [
            'post' => $post,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function update(PostRequest $request, Post $post): RedirectResponse
    {
        $this->authorize('update', $post);

        DB::beginTransaction();
        try {
            $data = $request->validated();

            if ($request->hasFile('cover_image')) {
                if ($post->cover_image) {
                    Storage::disk('public')->delete($post->cover_image);
                }
                $data['cover_image'] = $request->file('cover_image')->store('posts/covers', 'public');
            }

            if ($data['status'] === 'published' && !$post->published_at) {
                $data['published_at'] = now();
            }

            $post->update($data);

            if ($request->has('tags')) {
                $post->tags()->sync($request->tags);
            }

            if ($request->hasFile('gallery_images')) {
                $maxOrder = $post->images()->max('order') ?? -1;
                foreach ($request->file('gallery_images') as $index => $image) {
                    $path = $image->store('posts/gallery', 'public');
                    $post->images()->create([
                        'image_path' => $path,
                        'order' => $maxOrder + $index + 1,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('admin.posts.index')
                ->with('success', 'អត្ថបទត្រូវបានកែប្រែដោយជោគជ័យ');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'មានបញ្ហាក្នុងការកែប្រែអត្ថបទ: ' . $e->getMessage());
        }
    }

    public function destroy(Post $post): RedirectResponse
    {
        $this->authorize('delete', $post);

        if ($post->cover_image) {
            Storage::disk('public')->delete($post->cover_image);
        }

        foreach ($post->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $post->delete();

        return redirect()->route('admin.posts.index')
            ->with('success', 'អត្ថបទត្រូវបានលុបដោយជោគជ័យ');
    }

    public function deleteImage(PostImage $image): RedirectResponse
    {
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('success', 'រូបភាពត្រូវបានលុបដោយជោគជ័យ');
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        $request->validate(['ids' => 'required|array', 'ids.*' => 'exists:posts,id']);

        $posts = Post::whereIn('id', $request->ids)->get();

        foreach ($posts as $post) {
            $this->authorize('delete', $post);

            if ($post->cover_image) {
                Storage::disk('public')->delete($post->cover_image);
            }
            foreach ($post->images as $image) {
                Storage::disk('public')->delete($image->image_path);
            }
            $post->delete();
        }

        return back()->with('success', 'អត្ថបទត្រូវបានលុបដោយជោគជ័យ');
    }
}
