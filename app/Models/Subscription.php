<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subscription_plan_id',
        'status',
        'amount',
        'currency',
        'billing_interval',
        'starts_at',
        'ends_at',
        'cancelled_at',
        'trial_ends_at',
        'payment_method',
        'payment_id',
        'customer_id',
        'subscription_id',
        'usage',
        'last_payment_at',
        'next_payment_at',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'trial_ends_at' => 'datetime',
        'last_payment_at' => 'datetime',
        'next_payment_at' => 'datetime',
        'usage' => 'array',
        'metadata' => 'array',
    ];

    /**
     * Get the user that owns the subscription
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the subscription plan
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

    /**
     * Scope for active subscriptions
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for cancelled subscriptions
     */
    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    /**
     * Scope for expired subscriptions
     */
    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    /**
     * Scope for subscriptions ending soon
     */
    public function scopeEndingSoon($query, int $days = 7)
    {
        return $query->where('ends_at', '<=', now()->addDays($days))
                    ->where('status', 'active');
    }

    /**
     * Check if subscription is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && 
               (!$this->ends_at || $this->ends_at->isFuture());
    }

    /**
     * Check if subscription is cancelled
     */
    public function isCancelled(): bool
    {
        return $this->status === 'cancelled' || $this->cancelled_at !== null;
    }

    /**
     * Check if subscription is expired
     */
    public function isExpired(): bool
    {
        return $this->status === 'expired' || 
               ($this->ends_at && $this->ends_at->isPast());
    }

    /**
     * Check if subscription is on trial
     */
    public function onTrial(): bool
    {
        return $this->trial_ends_at && $this->trial_ends_at->isFuture();
    }

    /**
     * Get days until expiration
     */
    public function daysUntilExpiration(): ?int
    {
        if (!$this->ends_at) {
            return null;
        }

        return max(0, now()->diffInDays($this->ends_at, false));
    }

    /**
     * Get usage for a specific feature
     */
    public function getUsage(string $feature): int
    {
        $usage = $this->usage ?? [];
        return $usage[$feature] ?? 0;
    }

    /**
     * Set usage for a specific feature
     */
    public function setUsage(string $feature, int $count): void
    {
        $usage = $this->usage ?? [];
        $usage[$feature] = $count;
        $this->update(['usage' => $usage]);
    }

    /**
     * Increment usage for a specific feature
     */
    public function incrementUsage(string $feature, int $increment = 1): int
    {
        $currentUsage = $this->getUsage($feature);
        $newUsage = $currentUsage + $increment;
        $this->setUsage($feature, $newUsage);
        return $newUsage;
    }

    /**
     * Check if feature usage is within limit
     */
    public function withinLimit(string $feature): bool
    {
        $limit = $this->plan->getFeatureLimit($feature);
        
        if ($limit === null) {
            return true; // No limit
        }

        return $this->getUsage($feature) < $limit;
    }

    /**
     * Get remaining usage for a feature
     */
    public function getRemainingUsage(string $feature): ?int
    {
        $limit = $this->plan->getFeatureLimit($feature);
        
        if ($limit === null) {
            return null; // Unlimited
        }

        return max(0, $limit - $this->getUsage($feature));
    }

    /**
     * Cancel subscription
     */
    public function cancel(?Carbon $at = null): bool
    {
        $cancelledAt = $at ?? now();
        
        return $this->update([
            'status' => 'cancelled',
            'cancelled_at' => $cancelledAt,
        ]);
    }

    /**
     * Renew subscription
     */
    public function renew(?Carbon $until = null): bool
    {
        $endsAt = $until ?? now()->add($this->billing_interval, 1);
        
        return $this->update([
            'status' => 'active',
            'ends_at' => $endsAt,
            'cancelled_at' => null,
        ]);
    }

    /**
     * Get formatted amount
     */
    public function getFormattedAmount(): string
    {
        return '$' . number_format($this->amount, 2);
    }

    /**
     * Get next billing date
     */
    public function getNextBillingDate(): ?Carbon
    {
        if (!$this->isActive() || $this->isCancelled()) {
            return null;
        }

        return $this->next_payment_at ?? $this->ends_at;
    }
}