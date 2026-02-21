<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'image_path' => $this->image_path,
            'image_url' => $this->image_url,
            'caption' => $this->caption,
            'order' => $this->order,
        ];
    }
}
