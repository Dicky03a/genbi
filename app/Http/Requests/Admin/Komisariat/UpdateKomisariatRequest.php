<?php

namespace App\Http\Requests\Admin\Komisariat;

use Illuminate\Foundation\Http\FormRequest;

class UpdateKomisariatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $komisariat = $this->route('komisariat');

        return [
            'name' => ['required', 'string', 'max:255', 'unique:komisariats,name,'.$komisariat->id],
            'code' => ['required', 'string', 'max:20', 'unique:komisariats,code,'.$komisariat->id],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
