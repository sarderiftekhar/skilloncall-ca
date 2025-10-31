<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeServiceArea extends Model
{
    use HasFactory;

    protected $table = 'employee_service_areas';

    protected $fillable = [
        'employee_profile_id',
        'postal_code',
        'city',
        'province',
        'travel_time_minutes',
        'additional_charge',
        'is_primary_area',
    ];

    protected $casts = [
        'additional_charge' => 'decimal:2',
        'is_primary_area' => 'boolean',
    ];

    // Relationships
    public function employeeProfile(): BelongsTo
    {
        return $this->belongsTo(EmployeeProfile::class);
    }

    // Scopes
    public function scopePrimary($query)
    {
        return $query->where('is_primary_area', true);
    }

    public function scopeByProvince($query, $province)
    {
        return $query->where('province', $province);
    }

    public function scopeByPostalCode($query, $postalCode)
    {
        return $query->where('postal_code', 'LIKE', $postalCode . '%');
    }
}

