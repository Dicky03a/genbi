<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BeasiswaSubscriber extends Model
{
    protected $fillable = [
        'beasiswa_id',
        'phone_number',
        'is_notified',
    ];

    protected $casts = [
        'is_notified' => 'boolean',
    ];

    public function beasiswa()
    {
        return $this->belongsTo(Beasiswa::class);
    }
}
