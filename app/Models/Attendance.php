<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Attendance extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'menunggu');
    }

    protected function casts(): array
    {
        return [
            'captured_lat' => 'decimal:7',
            'captured_lng' => 'decimal:7',
            'gps_accuracy_m' => 'decimal:2',
            'distance_m' => 'decimal:2',
            'verified_at' => 'datetime',
        ];
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function eventRole(): BelongsTo
    {
        return $this->belongsTo(EventRole::class);
    }

    public function pointRate(): BelongsTo
    {
        return $this->belongsTo(PointRate::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function verificationLogs(): MorphMany
    {
        return $this->morphMany(VerificationLog::class, 'verifiable');
    }
}
