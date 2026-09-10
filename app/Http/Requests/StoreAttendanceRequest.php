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
            'captured_lat' => ['required', 'numeric', 'between:-90,90'],
            'captured_lng' => ['required', 'numeric', 'between:-180,180'],
            'gps_accuracy_m' => ['required', 'numeric', 'min:0'],
            'photo' => ['required', 'file', 'image', 'max:'.config('attendance.photo_max_kb')],
        ];
    }
}
