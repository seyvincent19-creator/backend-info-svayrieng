<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $postId = $this->route('post')?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'title_en' => ['nullable', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('posts')->ignore($postId)],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'excerpt_en' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'content_en' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            'category_id' => ['required', 'exists:categories,id'],
            'type' => ['required', Rule::in(['normal', 'video'])],
            'video_url' => ['nullable', 'required_if:type,video', 'url', 'max:500'],
            'is_featured' => ['boolean'],
            'is_breaking' => ['boolean'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'published_at' => ['nullable', 'date'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['exists:tags,id'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'ចំណងជើងត្រូវការ',
            'content.required' => 'ខ្លឹមសារត្រូវការ',
            'category_id.required' => 'ប្រភេទត្រូវការ',
            'category_id.exists' => 'ប្រភេទមិនមាន',
            'cover_image.image' => 'ឯកសារត្រូវតែជារូបភាព',
            'cover_image.max' => 'រូបភាពមិនអាចធំជាង 5MB',
            'video_url.required_if' => 'តំណវីដេអូត្រូវការសម្រាប់ប្រភេទវីដេអូ',
            'video_url.url' => 'តំណវីដេអូមិនត្រឹមត្រូវ',
        ];
    }
}
