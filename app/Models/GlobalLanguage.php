<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class GlobalLanguage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'is_official_canada',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_official_canada' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function workerProfiles(): BelongsToMany
    {
        return $this->belongsToMany(WorkerProfile::class, 'worker_languages')
                    ->withPivot(['proficiency_level', 'is_primary_language'])
                    ->withTimestamps();
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOfficial($query)
    {
        return $query->where('is_official_canada', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('is_official_canada', 'desc')
                     ->orderBy('sort_order')
                     ->orderBy('name');
    }
}


