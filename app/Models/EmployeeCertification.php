<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeCertification extends Model
{
    use HasFactory;

    protected $table = 'employee_certifications';

    protected $fillable = [
        'employee_profile_id',
        'global_certification_id',
        'certificate_number',
        'issued_date',
        'expiry_date',
        'certificate_file',
        'verification_status',
        'verified_at',
    ];

    protected $casts = [
        'issued_date' => 'date',
        'expiry_date' => 'date',
        'verified_at' => 'datetime',
    ];

    // Relationships
    public function employeeProfile(): BelongsTo
    {
        return $this->belongsTo(EmployeeProfile::class);
    }

    public function certification(): BelongsTo
    {
        return $this->belongsTo(GlobalCertification::class, 'global_certification_id');
    }

    // Scopes
    public function scopeVerified($query)
    {
        return $query->where('verification_status', 'verified');
    }

    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now());
    }

    public function scopeValid($query)
    {
        return $query->where('verification_status', 'verified')
                    ->where(function ($q) {
                        $q->whereNull('expiry_date')->orWhere('expiry_date', '>=', now());
                    });
    }

    // Accessors
    public function getIsExpiredAttribute(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    public function getIsValidAttribute(): bool
    {
        return $this->verification_status === 'verified' && !$this->is_expired;
    }
}

