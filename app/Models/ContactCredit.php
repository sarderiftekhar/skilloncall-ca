<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactCredit extends Model
{
    use HasFactory;

    protected $fillable = [
        'employer_id',
        'subscription_id',
        'credits_available',
        'credits_used',
        'daily_limit',
        'monthly_limit',
        'last_reset_at',
        'expires_at',
    ];

    protected $casts = [
        'last_reset_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /**
     * Get the employer.
     */
    public function employer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employer_id');
    }

    /**
     * Get the subscription.
     */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(\Laravel\Paddle\Subscription::class);
    }

    /**
     * Check if employer has enough credits.
     */
    public function hasCredits(int $amount = 1): bool
    {
        // Check if credits expired
        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        return $this->credits_available >= $amount;
    }

    /**
     * Deduct credits.
     */
    public function deductCredits(int $amount = 1): bool
    {
        if (!$this->hasCredits($amount)) {
            return false;
        }

        $this->credits_available -= $amount;
        $this->credits_used += $amount;
        $this->save();

        return true;
    }

    /**
     * Add credits.
     */
    public function addCredits(int $amount): void
    {
        $this->credits_available += $amount;
        $this->save();
    }

    /**
     * Reset monthly credits based on subscription plan.
     */
    public function resetMonthlyCredits(int $amount): void
    {
        $this->credits_available = $amount;
        $this->credits_used = 0;
        $this->last_reset_at = now();
        $this->save();
    }

    /**
     * Check if daily limit reached.
     */
    public function dailyLimitReached(): bool
    {
        $todayReveals = ContactReveal::getTodayCount($this->employer_id);
        return $todayReveals >= $this->daily_limit;
    }

    /**
     * Check if monthly limit reached.
     */
    public function monthlyLimitReached(): bool
    {
        $monthReveals = ContactReveal::getMonthCount($this->employer_id);
        return $monthReveals >= $this->monthly_limit;
    }
}
