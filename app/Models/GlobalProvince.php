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
     * Get all employee profiles in this province
     */
    public function employeeProfiles(): HasMany
    {
        return $this->hasMany(EmployeeProfile::class, 'global_province_id');
    }

    /**
     * Get the translated name for this province
     */
    public function getTranslatedNameAttribute(): string
    {
        if ($this->code) {
            return __('geo.provinces.' . $this->code);
        }
        return $this->name;
    }

    /**
     * Get the name in a specific locale
     */
    public function getNameInLocale(string $locale): string
    {
        $currentLocale = app()->getLocale();
        app()->setLocale($locale);
        $name = $this->translated_name;
        app()->setLocale($currentLocale);
        return $name;
    }
}
