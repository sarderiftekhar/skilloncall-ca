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

    /**
     * Get the translated name for this city
     * This uses a slug-based lookup in translation files
     */
    public function getTranslatedNameAttribute(): string
    {
        // Create a slug for translation lookup
        $slug = \Illuminate\Support\Str::slug($this->name);
        
        // Try to get translation, fall back to original name
        $translationKey = 'geo.cities.' . $slug;
        $translated = __($translationKey);
        
        // If no translation found, return original name
        if ($translated === $translationKey) {
            return $this->name;
        }
        
        return $translated;
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
