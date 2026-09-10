<?php

namespace App\Http\Requests\Admin\PointCategory;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePointCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $category = $this->route('pointCategory');

        return [
            'name' => ['required', 'string', 'max:255', 'unique:point_categories,name,'.$category->id],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
