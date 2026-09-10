<?php

namespace App\Http\Requests\Admin\Komisariat;

use Illuminate\Foundation\Http\FormRequest;

class StoreKomisariatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:komisariats,name'],
            'code' => ['required', 'string', 'max:20', 'unique:komisariats,code'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
