<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageResource;
use App\Models\Page;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PageController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $pages = Page::active()->get();
        return PageResource::collection($pages);
    }

    public function show(string $slug): PageResource
    {
        $page = Page::active()->where('slug', $slug)->firstOrFail();
        return new PageResource($page);
    }
}
