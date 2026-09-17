<?php

namespace App\Http\Requests\Admin;

class UpdateEventRequest extends StoreEventRequest
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
            'is_open' => ['nullable', 'boolean'],
            'point_type' => ['required', 'string', 'in:role,point_rate'],
            'roles' => ['array', 'min:1', 'required_if:point_type,role'],
            'roles.*.name' => ['required_if:point_type,role', 'nullable', 'string', 'max:255'],
            'roles.*.points' => ['required_if:point_type,role', 'nullable', 'integer', 'min:0'],
            'point_rate_ids' => ['array', 'min:1', 'required_if:point_type,point_rate'],
            'point_rate_ids.*' => ['required_if:point_type,point_rate', 'integer', 'exists:point_rates,id'],
            'poster' => ['nullable', 'image', 'max:2048'],
        ];
    }
}
