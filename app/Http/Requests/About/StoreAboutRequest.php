<?php

namespace App\Http\Requests\About;

use Illuminate\Foundation\Http\FormRequest;

class StoreAboutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tagline' => ['required', 'string', 'max:255'],
            'vision' => ['required', 'string'],
            'mission' => ['required', 'array'],
            'mission.*' => ['required', 'string'],
            'profile' => ['required', 'string'],
        ];
    }
}
