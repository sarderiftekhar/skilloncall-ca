<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GlobalProvince extends Model
{
    use HasFactory;

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
     * Get all worker profiles in this province
     */
    public function workerProfiles(): HasMany
    {
        return $this->hasMany(WorkerProfile::class, 'global_province_id');
    }
}
