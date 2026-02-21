<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'title_en',
        'slug',
        'excerpt',
        'excerpt_en',
        'content',
        'content_en',
        'cover_image',
        'category_id',
        'author_id',
        'type',
        'video_url',
        'is_featured',
        'is_breaking',
        'status',
        'published_at',
        'views',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_breaking' => 'boolean',
        'published_at' => 'datetime',
        'views' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title) . '-' . Str::random(6);
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    public function images(): HasMany
    {
        return $this->hasMany(PostImage::class)->orderBy('order');
    }

    public function getCoverImageUrlAttribute(): ?string
    {
        return $this->cover_image ? asset('storage/' . $this->cover_image) : null;
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->where('published_at', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeBreaking($query)
    {
        return $query->where('is_breaking', true);
    }

    public function scopeVideos($query)
    {
        return $query->where('type', 'video');
    }

    public function scopeNormal($query)
    {
        return $query->where('type', 'normal');
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeSearch($query, $keyword)
    {
        return $query->where(function ($q) use ($keyword) {
            $q->where('title', 'like', "%{$keyword}%")
              ->orWhere('excerpt', 'like', "%{$keyword}%")
              ->orWhere('content', 'like', "%{$keyword}%");
        });
    }

    public function incrementViews(): void
    {
        $this->increment('views');
    }
}
