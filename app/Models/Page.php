<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Page extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'title_en',
        'slug',
        'content',
        'content_en',
        'featured_image',
        'is_active',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Sanitize slug - remove leading/trailing slashes
    public function setSlugAttribute($value)
    {
        $this->attributes['slug'] = trim($value, '/');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($page) {
            if (empty($page->slug)) {
                // Generate slug - use transliteration for Latin chars, or ID-based for Khmer
                $slug = Str::slug($page->title);
                if (empty($slug)) {
                    // For non-Latin titles (Khmer), use a URL-safe version
                    $slug = 'page-' . time() . '-' . Str::random(5);
                }
                $page->slug = $slug;
            }
        });
    }

    public function getFeaturedImageUrlAttribute(): ?string
    {
        return $this->featured_image ? asset('storage/' . $this->featured_image) : null;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
