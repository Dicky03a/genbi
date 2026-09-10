<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class PointSubmission extends Model
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
            'points_requested' => 'integer',
            'verified_at' => 'datetime',
            'revision_count' => 'integer',
        ];
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    public function pointCategory(): BelongsTo
    {
        return $this->belongsTo(PointCategory::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
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
