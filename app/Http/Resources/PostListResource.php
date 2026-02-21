<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostListResource extends JsonResource
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
            'cover_image' => $this->cover_image,
            'cover_image_url' => $this->cover_image_url,
            'category' => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'name_en' => $this->category?->name_en,
                'slug' => $this->category?->slug,
            ],
            'author' => [
                'id' => $this->author?->id,
                'name' => $this->author?->name,
            ],
            'type' => $this->type,
            'video_url' => $this->type === 'video' ? $this->video_url : null,
            'is_featured' => $this->is_featured,
            'is_breaking' => $this->is_breaking,
            'status' => $this->status,
            'published_at' => $this->published_at?->format('Y-m-d H:i:s'),
            'published_at_formatted' => $this->published_at?->diffForHumans(),
            'views' => $this->views,
        ];
    }
}
