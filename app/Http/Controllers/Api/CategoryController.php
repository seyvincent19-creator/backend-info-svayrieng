<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $categories = Category::with(['children' => function ($q) {
            $q->active()->orderBy('order');
        }])
            ->active()
            ->parentCategories()
            ->orderBy('order')
            ->get();

        return CategoryResource::collection($categories);
    }

    public function show(string $slug): CategoryResource
    {
        $category = Category::with(['children', 'parent'])
            ->active()
            ->where('slug', $slug)
            ->firstOrFail();

        return new CategoryResource($category);
    }
}
