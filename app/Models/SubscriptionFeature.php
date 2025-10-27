<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionFeature extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'category',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Scope for active features
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for features by category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope for boolean features
     */
    public function scopeBoolean($query)
    {
        return $query->where('type', 'boolean');
    }

    /**
     * Scope for limit features
     */
    public function scopeLimit($query)
    {
        return $query->where('type', 'limit');
    }

    /**
     * Scope for quota features
     */
    public function scopeQuota($query)
    {
        return $query->where('type', 'quota');
    }

    /**
     * Check if feature is boolean type
     */
    public function isBoolean(): bool
    {
        return $this->type === 'boolean';
    }

    /**
     * Check if feature is limit type
     */
    public function isLimit(): bool
    {
        return $this->type === 'limit';
    }

    /**
     * Check if feature is quota type
     */
    public function isQuota(): bool
    {
        return $this->type === 'quota';
    }
}