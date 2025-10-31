<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmployerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'phone',
        'global_industry_id',
        'bio',
        'address_line_1',
        'address_line_2',
        'city',
        'province',
        'postal_code',
        'country',
        'global_province_id',
        'global_city_id',
        'is_profile_complete',
        'onboarding_step',
        'profile_completed_at',
    ];

    protected $casts = [
        'profile_completed_at' => 'datetime',
        'is_profile_complete' => 'boolean',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function industry(): BelongsTo
    {
        return $this->belongsTo(GlobalIndustry::class, 'global_industry_id');
    }

    public function globalProvince(): BelongsTo
    {
        return $this->belongsTo(GlobalProvince::class, 'global_province_id');
    }

    public function globalCity(): BelongsTo
    {
        return $this->belongsTo(GlobalCity::class, 'global_city_id');
    }

    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class, 'employer_id', 'user_id');
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

    // Helper Methods
    public function canCompleteOnboarding(): bool
    {
        // Check for essential fields that are captured in onboarding
        $essentialFields = [
            'business_name',
            'phone',
            'address_line_1',
            'city',
            'province',
            'postal_code',
        ];
        
        // Check all essential fields are present
        foreach ($essentialFields as $field) {
            if (empty($this->$field)) {
                return false;
            }
        }
        
        return true;
    }
}

