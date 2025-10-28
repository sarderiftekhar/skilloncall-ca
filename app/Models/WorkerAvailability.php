<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkerAvailability extends Model
{
    use HasFactory;

    // Match the table name created in the migration (singular)
    protected $table = 'worker_availability';

    protected $fillable = [
        'worker_profile_id',
        'effective_month',
        'day_of_week',
        'start_time',
        'end_time',
        'is_available',
        'rate_multiplier',
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'is_available' => 'boolean',
        'rate_multiplier' => 'decimal:2',
    ];

    // Relationships
    public function workerProfile(): BelongsTo
    {
        return $this->belongsTo(WorkerProfile::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    public function scopeForMonth($query, $month)
    {
        return $query->where('effective_month', $month);
    }

    public function scopeCurrentMonth($query)
    {
        return $query->where('effective_month', now()->format('Y-m'));
    }

    public function scopeNextMonth($query)
    {
        return $query->where('effective_month', now()->addMonth()->format('Y-m'));
    }

    public function scopeWeekdays($query)
    {
        return $query->whereIn('day_of_week', [1, 2, 3, 4, 5]);
    }

    public function scopeWeekends($query)
    {
        return $query->whereIn('day_of_week', [0, 6]);
    }

    // Accessors
    public function getDayNameAttribute(): string
    {
        $days = [
            0 => 'Sunday',
            1 => 'Monday', 
            2 => 'Tuesday',
            3 => 'Wednesday',
            4 => 'Thursday',
            5 => 'Friday',
            6 => 'Saturday'
        ];
        
        return $days[$this->day_of_week] ?? '';
    }

    public function getHoursAttribute(): float
    {
        if (!$this->is_available || !$this->start_time || !$this->end_time) {
            return 0;
        }
        
        $start = new \DateTime($this->start_time);
        $end = new \DateTime($this->end_time);
        
        return ($end->getTimestamp() - $start->getTimestamp()) / 3600;
    }
}


