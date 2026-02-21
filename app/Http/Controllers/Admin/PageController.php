<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PageRequest;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Page::class);

        $pages = Page::when($request->search, fn($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Page::class);

        return Inertia::render('Admin/Pages/Form');
    }

    public function store(PageRequest $request): RedirectResponse
    {
        $this->authorize('create', Page::class);

        $data = $request->validated();

        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('pages', 'public');
        }

        Page::create($data);

        return redirect()->route('admin.pages.index')
            ->with('success', 'ទំព័រត្រូវបានបង្កើតដោយជោគជ័យ');
    }

    public function edit(Page $page): Response
    {
        $this->authorize('update', $page);

        return Inertia::render('Admin/Pages/Form', [
            'page' => $page,
        ]);
    }

    public function update(PageRequest $request, Page $page): RedirectResponse
    {
        $this->authorize('update', $page);

        $data = $request->validated();

        if ($request->hasFile('featured_image')) {
            if ($page->featured_image) {
                Storage::disk('public')->delete($page->featured_image);
            }
            $data['featured_image'] = $request->file('featured_image')->store('pages', 'public');
        }

        $page->update($data);

        return redirect()->route('admin.pages.index')
            ->with('success', 'ទំព័រត្រូវបានកែប្រែដោយជោគជ័យ');
    }

    public function destroy(Page $page): RedirectResponse
    {
        $this->authorize('delete', $page);

        if ($page->featured_image) {
            Storage::disk('public')->delete($page->featured_image);
        }

        $page->delete();

        return redirect()->route('admin.pages.index')
            ->with('success', 'ទំព័រត្រូវបានលុបដោយជោគជ័យ');
    }
}
