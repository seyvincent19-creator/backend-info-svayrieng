<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'image_path',
        'caption',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function getImageUrlAttribute(): string
    {
        return asset('storage/' . $this->image_path);
    }
}
