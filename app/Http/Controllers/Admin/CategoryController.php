<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Category::class);

        $categories = Category::with(['parent', 'children'])
            ->withCount('posts')
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('order')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Category::class);

        $parentCategories = Category::parentCategories()->active()->orderBy('order')->get(['id', 'name']);

        return Inertia::render('Admin/Categories/Form', [
            'parentCategories' => $parentCategories,
        ]);
    }

    public function store(CategoryRequest $request): RedirectResponse
    {
        $this->authorize('create', Category::class);

        Category::create($request->validated());

        return redirect()->route('admin.categories.index')
            ->with('success', 'ប្រភេទត្រូវបានបង្កើតដោយជោគជ័យ');
    }

    public function edit(Category $category): Response
    {
        $this->authorize('update', $category);

        $parentCategories = Category::parentCategories()
            ->where('id', '!=', $category->id)
            ->active()
            ->orderBy('order')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Categories/Form', [
            'category' => $category,
            'parentCategories' => $parentCategories,
        ]);
    }

    public function update(CategoryRequest $request, Category $category): RedirectResponse
    {
        $this->authorize('update', $category);

        $category->update($request->validated());

        return redirect()->route('admin.categories.index')
            ->with('success', 'ប្រភេទត្រូវបានកែប្រែដោយជោគជ័យ');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $this->authorize('delete', $category);

        // Move children to become parent categories
        $category->children()->update(['parent_id' => null]);

        // Delete category (posts will be cascade deleted due to foreign key)
        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'ប្រភេទត្រូវបានលុបដោយជោគជ័យ');
    }
}
