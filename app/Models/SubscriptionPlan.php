<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'price',
        'yearly_price',
        'currency',
        'billing_interval',
        'job_posts_limit',
        'job_applications_limit',
        'featured_jobs_limit',
        'team_members_limit',
        'priority_support',
        'advanced_analytics',
        'custom_branding',
        'api_access',
        'is_active',
        'is_popular',
        'sort_order',
        'features',
        'metadata',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'yearly_price' => 'decimal:2',
        'job_posts_limit' => 'integer',
        'job_applications_limit' => 'integer',
        'featured_jobs_limit' => 'integer',
        'team_members_limit' => 'integer',
        'priority_support' => 'boolean',
        'advanced_analytics' => 'boolean',
        'custom_branding' => 'boolean',
        'api_access' => 'boolean',
        'is_active' => 'boolean',
        'is_popular' => 'boolean',
        'sort_order' => 'integer',
        'features' => 'array',
        'metadata' => 'array',
    ];

    /**
     * Get subscriptions for this plan
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get active subscriptions for this plan
     */
    public function activeSubscriptions(): HasMany
    {
        return $this->subscriptions()->where('status', 'active');
    }

    /**
     * Scope for employer plans
     */
    public function scopeForEmployers($query)
    {
        return $query->where('type', 'employer');
    }

    /**
     * Scope for worker plans
     */
    public function scopeForWorkers($query)
    {
        return $query->where('type', 'worker');
    }

    /**
     * Scope for active plans
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for popular plans
     */
    public function scopePopular($query)
    {
        return $query->where('is_popular', true);
    }

    /**
     * Get the price for a specific billing interval
     */
    public function getPriceForInterval(string $interval): float
    {
        return $interval === 'yearly' && $this->yearly_price 
            ? $this->yearly_price 
            : $this->price;
    }

    /**
     * Get yearly savings amount
     */
    public function getYearlySavings(): float
    {
        if (!$this->yearly_price) {
            return 0;
        }

        $monthlyYearly = $this->price * 12;
        return $monthlyYearly - $this->yearly_price;
    }

    /**
     * Get yearly savings percentage
     */
    public function getYearlySavingsPercentage(): int
    {
        if (!$this->yearly_price) {
            return 0;
        }

        $monthlyYearly = $this->price * 12;
        return round((($monthlyYearly - $this->yearly_price) / $monthlyYearly) * 100);
    }

    /**
     * Check if plan has a specific feature
     */
    public function hasFeature(string $feature): bool
    {
        $features = $this->features ?? [];
        return in_array($feature, $features) || $this->{$feature} ?? false;
    }

    /**
     * Get feature limit
     */
    public function getFeatureLimit(string $feature): ?int
    {
        return $this->{$feature . '_limit'} ?? null;
    }

    /**
     * Check if plan is free
     */
    public function isFree(): bool
    {
        return $this->price == 0;
    }

    /**
     * Get formatted price
     */
    public function getFormattedPrice(string $interval = 'monthly'): string
    {
        $price = $this->getPriceForInterval($interval);
        
        if ($price == 0) {
            return 'Free';
        }

        return '$' . number_format($price, 2) . '/' . ($interval === 'yearly' ? 'year' : 'month');
    }
}