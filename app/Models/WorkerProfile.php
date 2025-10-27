<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'phone',
        'profile_photo',
        'date_of_birth',
        'bio',
        'address_line_1',
        'address_line_2',
        'city',
        'province',
        'postal_code',
        'country',
        'sin_number',
        'work_authorization',
        'work_permit_expiry',
        'has_criminal_background_check',
        'background_check_date',
        'hourly_rate_min',
        'hourly_rate_max',
        'travel_distance_max',
        'has_vehicle',
        'has_tools_equipment',
        'is_insured',
        'has_wcb_coverage',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',
        'availability_schedule',
        'work_preferences',
        'portfolio_photos',
        'certifications',
        'social_media_links',
        'is_profile_complete',
        'onboarding_step',
        'profile_completed_at',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'background_check_date' => 'date',
        'work_permit_expiry' => 'date',
        'profile_completed_at' => 'datetime',
        'hourly_rate_min' => 'decimal:2',
        'hourly_rate_max' => 'decimal:2',
        'has_vehicle' => 'boolean',
        'has_tools_equipment' => 'boolean',
        'is_insured' => 'boolean',
        'has_wcb_coverage' => 'boolean',
        'has_criminal_background_check' => 'boolean',
        'is_profile_complete' => 'boolean',
        'availability_schedule' => 'array',
        'work_preferences' => 'array',
        'portfolio_photos' => 'array',
        'certifications' => 'array',
        'social_media_links' => 'array',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(GlobalSkill::class, 'worker_skills')
            ->withPivot(['proficiency_level', 'is_primary_skill'])
            ->withTimestamps();
    }

    public function languages(): BelongsToMany
    {
        return $this->belongsToMany(GlobalLanguage::class, 'worker_languages')
            ->withPivot(['proficiency_level', 'is_primary_language'])
            ->withTimestamps();
    }

    public function workExperiences(): HasMany
    {
        return $this->hasMany(WorkExperience::class);
    }

    public function serviceAreas(): HasMany
    {
        return $this->hasMany(WorkerServiceArea::class);
    }

    public function references(): HasMany
    {
        return $this->hasMany(WorkerReference::class);
    }

    public function certifications(): HasMany
    {
        return $this->hasMany(WorkerCertification::class);
    }

    public function availability(): HasMany
    {
        return $this->hasMany(WorkerAvailability::class);
    }

    // Scopes
    public function scopeComplete($query)
    {
        return $query->where('is_profile_complete', true);
    }

    public function scopeIncomplete($query)
    {
        return $query->where('is_profile_complete', false);
    }

    public function scopeByProvince($query, $province)
    {
        return $query->where('province', $province);
    }

    public function scopeByPostalCode($query, $postalCode)
    {
        return $query->where('postal_code', 'LIKE', $postalCode.'%');
    }

    // Accessors & Mutators
    public function getFullNameAttribute(): string
    {
        return $this->first_name.' '.$this->last_name;
    }

    public function setSinNumberAttribute($value)
    {
        // Encrypt SIN for security
        $this->attributes['sin_number'] = $value ? encrypt($value) : null;
    }

    public function getSinNumberAttribute($value)
    {
        // Decrypt SIN
        return $value ? decrypt($value) : null;
    }

    // Helper Methods
    public function calculateProfileCompletion(): int
    {
        $requiredFields = [
            'first_name',
            'last_name',
            'phone',
            'date_of_birth',
            'address_line_1',
            'city',
            'province',
            'postal_code',
            'work_authorization',
            'hourly_rate_min',
            'travel_distance_max',
            'emergency_contact_name',
            'emergency_contact_phone',
            'emergency_contact_relationship',
        ];

        $completedFields = 0;
        $totalFields = count($requiredFields);

        foreach ($requiredFields as $field) {
            if (! empty($this->$field)) {
                $completedFields++;
            }
        }

        // Check relationships
        if ($this->skills()->count() > 0) {
            $completedFields++;
            $totalFields++;
        }
        if ($this->languages()->count() > 0) {
            $completedFields++;
            $totalFields++;
        }
        if ($this->workExperiences()->count() > 0) {
            $completedFields++;
            $totalFields++;
        }
        if ($this->availability()->where('is_available', true)->count() > 0) {
            $completedFields++;
            $totalFields++;
        }

        return round(($completedFields / $totalFields) * 100);
    }

    public function canCompleteOnboarding(): bool
    {
        return $this->calculateProfileCompletion() >= 80;
    }

    public function getPrimarySkill()
    {
        return $this->skills()->wherePivot('is_primary_skill', true)->first();
    }

    public function getPrimaryLanguage()
    {
        return $this->languages()->wherePivot('is_primary_language', true)->first();
    }

    public function getAvailableHours(): float
    {
        return $this->availability()
            ->where('is_available', true)
            ->get()
            ->sum(function ($slot) {
                $start = new \DateTime($slot->start_time);
                $end = new \DateTime($slot->end_time);

                return ($end->getTimestamp() - $start->getTimestamp()) / 3600;
            });
    }
}
