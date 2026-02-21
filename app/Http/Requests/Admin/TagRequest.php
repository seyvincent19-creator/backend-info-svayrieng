<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TagRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tagId = $this->route('tag')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('tags')->ignore($tagId)],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'ឈ្មោះ Tag ត្រូវការ',
        ];
    }
}
