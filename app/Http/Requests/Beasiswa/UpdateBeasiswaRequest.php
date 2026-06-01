<?php

namespace App\Http\Requests\Beasiswa;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBeasiswaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'procedures' => ['required', 'string'],
            'requirements' => ['required', 'string'],
            'required_files' => ['required', 'string'],
            'flow' => ['required', 'string'],
            'link' => ['nullable', 'url', 'max:255'],
            'poster' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'is_published' => ['required', 'boolean'],
        ];
    }
}
