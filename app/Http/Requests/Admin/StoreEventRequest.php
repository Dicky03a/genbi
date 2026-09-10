<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'komisariat_id' => ['nullable', 'integer', 'exists:komisariats,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
            'opens_at' => ['required', 'date'],
            'closes_at' => ['required', 'date', 'after:opens_at'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'radius_m' => ['required', 'integer', 'min:1'],
            'max_gps_accuracy_m' => ['nullable', 'integer', 'min:1'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*.name' => ['required', 'string', 'max:255'],
            'roles.*.points' => ['required', 'integer', 'min:0'],
        ];
    }
}
