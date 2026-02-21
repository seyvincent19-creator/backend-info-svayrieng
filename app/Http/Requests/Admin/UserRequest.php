<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id;
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($userId)],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'phone' => ['nullable', 'string', 'max:20'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['exists:roles,name'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['exists:permissions,name'],
        ];

        if ($isUpdate) {
            $rules['password'] = ['nullable', 'string', Password::min(8), 'confirmed'];
        } else {
            $rules['password'] = ['required', 'string', Password::min(8), 'confirmed'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'ឈ្មោះត្រូវការ',
            'email.required' => 'អ៊ីមែលត្រូវការ',
            'email.email' => 'អ៊ីមែលមិនត្រឹមត្រូវ',
            'email.unique' => 'អ៊ីមែលនេះត្រូវបានប្រើរួចហើយ',
            'password.required' => 'ពាក្យសម្ងាត់ត្រូវការ',
            'password.min' => 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 8 តួអក្សរ',
            'password.confirmed' => 'ពាក្យសម្ងាត់មិនត្រូវគ្នា',
        ];
    }
}
