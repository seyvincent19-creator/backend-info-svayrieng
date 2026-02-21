<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'title_en' => $this->title_en,
            'slug' => $this->slug,
            'content' => $this->content,
            'content_en' => $this->content_en,
            'featured_image' => $this->featured_image,
            'featured_image_url' => $this->featured_image_url,
            'is_active' => $this->is_active,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
