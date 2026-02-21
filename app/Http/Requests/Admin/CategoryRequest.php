<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('category')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'name_en' => ['nullable', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('categories')->ignore($categoryId)],
            'description' => ['nullable', 'string', 'max:1000'],
            'parent_id' => ['nullable', 'exists:categories,id', 'different:id'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'ឈ្មោះប្រភេទត្រូវការ',
            'parent_id.exists' => 'ប្រភេទមេមិនមាន',
            'parent_id.different' => 'ប្រភេទមេមិនអាចជាខ្លួនឯង',
        ];
    }
}
