<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Beasiswa extends Model
{
    /** @use HasFactory<\Database\Factories\BeasiswaFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'procedures',
        'requirements',
        'required_files',
        'flow',
        'link',
        'poster',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];
}
