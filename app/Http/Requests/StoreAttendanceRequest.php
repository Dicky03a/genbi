<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_role_id' => ['required', 'integer', 'exists:event_roles,id'],
            'photo' => ['required', 'file', 'image', 'max:'.config('attendance.photo_max_kb')],
        ];
    }
}
