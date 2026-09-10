<?php

namespace App\Http\Requests\Admin\PointRate;

use Illuminate\Foundation\Http\FormRequest;

class StorePointRateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'point_category_id' => ['required', 'integer', 'exists:point_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'points' => ['required', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
