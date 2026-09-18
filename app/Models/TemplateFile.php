<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemplateFile extends Model
{
    protected $fillable = [
        'name',
        'file_path',
    ];
}
