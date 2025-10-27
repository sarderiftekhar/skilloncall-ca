<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkExperience extends Model
{
    use HasFactory;

    protected $fillable = [
        'worker_profile_id',
        'global_skill_id',
        'global_industry_id',
        'company_name',
        'job_title',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'supervisor_name',
        'supervisor_contact',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
    ];

    // Relationships
    public function workerProfile(): BelongsTo
    {
        return $this->belongsTo(WorkerProfile::class);
    }

    public function skill(): BelongsTo
    {
        return $this->belongsTo(GlobalSkill::class, 'global_skill_id');
    }

    public function industry(): BelongsTo
    {
        return $this->belongsTo(GlobalIndustry::class, 'global_industry_id');
    }

    // Scopes
    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }

    public function scopePrevious($query)
    {
        return $query->where('is_current', false);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('is_current', 'desc')
                     ->orderBy('start_date', 'desc');
    }

    // Accessors
    public function getDurationAttribute(): string
    {
        $start = $this->start_date;
        $end = $this->is_current ? now() : $this->end_date;
        
        if (!$start || !$end) return '';

        $diff = $start->diff($end);
        $years = $diff->y;
        $months = $diff->m;

        if ($years > 0) {
            return $years . ' year' . ($years > 1 ? 's' : '') . 
                   ($months > 0 ? ' ' . $months . ' month' . ($months > 1 ? 's' : '') : '');
        }
        
        return $months . ' month' . ($months > 1 ? 's' : '');
    }
}


