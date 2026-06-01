<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class About extends Model
{
    /** @use HasFactory<\Database\Factories\AboutFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tagline',
        'vision',
        'mission',
        'profile',
    ];

    /**
     * Interact with the mission field.
     */
    protected function mission(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? explode("\n", $value) : [],
            set: fn ($value) => is_array($value) ? implode("\n", $value) : $value,
        );
    }
}
