<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PointRate extends Model
{
    use HasFactory;

    protected $fillable = ['point_category_id', 'name', 'points', 'is_active'];

    protected function casts(): array
    {
        return [
            'points' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function pointCategory(): BelongsTo
    {
        return $this->belongsTo(PointCategory::class);
    }
}
