<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePointSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'point_rate_id' => ['required', 'integer', 'exists:point_rates,id'],
            'activity_date' => ['required', 'date'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'evidence' => ['nullable', 'file', 'max:'.config('attendance.photo_max_kb')],
        ];
    }
}
