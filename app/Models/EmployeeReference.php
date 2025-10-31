<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeReference extends Model
{
    use HasFactory;

    protected $table = 'employee_references';

    protected $fillable = [
        'employee_profile_id',
        'reference_name',
        'reference_phone',
        'reference_email',
        'relationship',
        'company_name',
        'notes',
        'permission_to_contact',
    ];

    protected $casts = [
        'permission_to_contact' => 'boolean',
    ];

    // Relationships
    public function employeeProfile(): BelongsTo
    {
        return $this->belongsTo(EmployeeProfile::class);
    }

    // Scopes
    public function scopeContactable($query)
    {
        return $query->where('permission_to_contact', true);
    }
}

