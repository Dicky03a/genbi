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
        $event = $this->route('event');
        $pointType = $event ? $event->point_type : 'role';

        $rules = [
            'photo' => ['required', 'file', 'image', 'max:'.config('attendance.photo_max_kb')],
        ];

        if ($pointType === 'point_rate') {
            $rules['point_rate_id'] = ['required', 'integer', 'exists:point_rates,id'];
        } else {
            $rules['event_role_id'] = ['required', 'integer', 'exists:event_roles,id'];
        }

        return $rules;
    }
}
