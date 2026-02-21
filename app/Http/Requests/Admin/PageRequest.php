<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $pageId = $this->route('page')?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'title_en' => ['nullable', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('pages')->ignore($pageId)],
            'content' => ['required', 'string'],
            'content_en' => ['nullable', 'string'],
            'featured_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            'is_active' => ['boolean'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'ចំណងជើងត្រូវការ',
            'content.required' => 'ខ្លឹមសារត្រូវការ',
        ];
    }
}
