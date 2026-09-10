<?php

namespace App\Http\Requests\Admin;

class UpdateEventRequest extends StoreEventRequest
{
    public function authorize(): bool
    {
        return true;
    }
}
