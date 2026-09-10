<?php

namespace App\Http\Requests\Admin\PointCategory;

use Illuminate\Foundation\Http\FormRequest;

class StorePointCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:point_categories,name'],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
