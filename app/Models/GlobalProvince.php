<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GlobalProvince extends Model
{
    protected $fillable = [
        'name',
        'code',
    ];

    public $timestamps = false;

    /**
     * Get all cities in this province
     */
    public function cities(): HasMany
    {
        return $this->hasMany(GlobalCity::class, 'global_province_id');
    }

    /**
     * Get all employee profiles in this province
     */
    public function employeeProfiles(): HasMany
    {
        return $this->hasMany(EmployeeProfile::class, 'global_province_id');
    }
}
