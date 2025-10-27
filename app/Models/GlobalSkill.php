<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GlobalSkill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'description',
        'requires_certification',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'requires_certification' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function workerProfiles(): BelongsToMany
    {
        return $this->belongsToMany(WorkerProfile::class, 'worker_skills')
                    ->withPivot(['proficiency_level', 'is_primary_skill'])
                    ->withTimestamps();
    }

    public function workExperiences(): HasMany
    {
        return $this->hasMany(WorkExperience::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeRequiresCertification($query)
    {
        return $query->where('requires_certification', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}
