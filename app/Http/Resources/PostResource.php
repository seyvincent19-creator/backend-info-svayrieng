<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'title_en' => $this->title_en,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'excerpt_en' => $this->excerpt_en,
            'content' => $this->when($request->routeIs('api.posts.show') || $request->routeIs('admin.*'), $this->content),
            'content_en' => $this->when($request->routeIs('api.posts.show') || $request->routeIs('admin.*'), $this->content_en),
            'cover_image' => $this->cover_image,
            'cover_image_url' => $this->cover_image_url,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'author' => new UserResource($this->whenLoaded('author')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'images' => PostImageResource::collection($this->whenLoaded('images')),
            'type' => $this->type,
            'video_url' => $this->video_url,
            'is_featured' => $this->is_featured,
            'is_breaking' => $this->is_breaking,
            'status' => $this->status,
            'published_at' => $this->published_at?->format('Y-m-d H:i:s'),
            'published_at_formatted' => $this->published_at?->diffForHumans(),
            'views' => $this->views,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
