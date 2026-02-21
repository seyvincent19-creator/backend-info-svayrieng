<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TagRequest;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Tag::class);

        $tags = Tag::withCount('posts')
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Tags/Index', [
            'tags' => $tags,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Tag::class);

        return Inertia::render('Admin/Tags/Form');
    }

    public function store(TagRequest $request): RedirectResponse
    {
        $this->authorize('create', Tag::class);

        Tag::create($request->validated());

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag ត្រូវបានបង្កើតដោយជោគជ័យ');
    }

    public function edit(Tag $tag): Response
    {
        $this->authorize('update', $tag);

        return Inertia::render('Admin/Tags/Form', [
            'tag' => $tag,
        ]);
    }

    public function update(TagRequest $request, Tag $tag): RedirectResponse
    {
        $this->authorize('update', $tag);

        $tag->update($request->validated());

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag ត្រូវបានកែប្រែដោយជោគជ័យ');
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        $this->authorize('delete', $tag);

        $tag->posts()->detach();
        $tag->delete();

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag ត្រូវបានលុបដោយជោគជ័យ');
    }
}
