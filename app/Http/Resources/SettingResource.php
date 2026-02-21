<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'key' => $this->key,
            'value' => $this->type === 'image' && $this->value ? asset('storage/' . $this->value) : $this->value,
            'type' => $this->type,
            'group' => $this->group,
        ];
    }
}
