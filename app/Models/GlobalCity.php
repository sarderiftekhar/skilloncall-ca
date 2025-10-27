<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GlobalCity extends Model
{
    protected $fillable = [
        'name',
        'global_province_id',
    ];

    public $timestamps = false;

    /**
     * Get the province this city belongs to
     */
    public function province(): BelongsTo
    {
        return $this->belongsTo(GlobalProvince::class, 'global_province_id');
    }

    /**
     * Get all worker profiles in this city
     */
    public function workerProfiles(): HasMany
    {
        return $this->hasMany(WorkerProfile::class, 'global_city_id');
    }
}
