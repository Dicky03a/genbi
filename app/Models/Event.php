<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $appends = ['poster_url'];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'radius_m' => 'integer',
            'max_gps_accuracy_m' => 'integer',
        ];
    }

    public function getPosterUrlAttribute(): ?string
    {
        return $this->poster_path ? \Illuminate\Support\Facades\Storage::url($this->poster_path) : null;
    }

    public function scopeOpenForAttendance(Builder $query): Builder
    {
        return $query->where('status', 'dibuka');
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    public function komisariat(): BelongsTo
    {
        return $this->belongsTo(Komisariat::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function roles(): HasMany
    {
        return $this->hasMany(EventRole::class);
    }

    public function pointRates(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(PointRate::class, 'event_point_rate');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }
}
