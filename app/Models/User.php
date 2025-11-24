<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Laravel\Paddle\Billable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'locale',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => 'string',
        ];
    }

    /**
     * Relationships
     */
    public function employeeProfile(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(EmployeeProfile::class);
    }

    public function employerProfile(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(EmployerProfile::class);
    }

    /**
     * Role helpers
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isEmployer(): bool
    {
        return $this->role === 'employer';
    }

    public function isEmployee(): bool
    {
        return $this->role === 'employee';
    }

    /**
     * Get the user's preferred locale
     */
    public function getPreferredLocale(): string
    {
        return $this->locale ?? 'en';
    }

    /**
     * Subscription helpers
     */
    
    /**
     * Check if user has an active subscription to a specific plan
     * using the local subscriptions table.
     */
    public function hasActivePlan(string $planName): bool
    {
        $subscription = $this->activeSubscription();

        if (! $subscription || ! $subscription->plan) {
            return false;
        }

        return $subscription->plan->name === $planName;
    }

    /**
     * Check if employer has Professional plan
     */
    public function hasProfessionalPlan(): bool
    {
        return $this->hasActivePlan('Professional');
    }

    /**
     * Check if employer has Enterprise plan
     */
    public function hasEnterprisePlan(): bool
    {
        return $this->hasActivePlan('Enterprise');
    }

    /**
     * Check if employee has Pro Employee plan
     */
    public function hasProEmployeePlan(): bool
    {
        return $this->hasActivePlan('Pro Employee');
    }

    /**
     * Check if employee has Premium Employee plan
     */
    public function hasPremiumEmployeePlan(): bool
    {
        return $this->hasActivePlan('Premium Employee');
    }

    /**
     * Get the user's current active plan based on the local subscriptions table.
     */
    public function getCurrentPlan(): ?SubscriptionPlan
    {
        return $this->subscriptionPlan();
    }

    /**
     * Check if user has any active paid subscription
     */
    public function hasPaidSubscription(): bool
    {
        $plan = $this->getCurrentPlan();
        return $plan && !$plan->isFree();
    }

    /**
     * Get the jobs posted by the employer.
     */
    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class, 'employer_id');
    }

    /**
     * Get the applications submitted by the employee.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'employee_id');
    }

    /**
     * Get the payments sent by the user.
     */
    public function sentPayments(): HasMany
    {
        return $this->hasMany(Payment::class, 'payer_id');
    }

    /**
     * Get the payments received by the user.
     */
    public function receivedPayments(): HasMany
    {
        return $this->hasMany(Payment::class, 'payee_id');
    }

    /**
     * Get the reviews written by the user.
     */
    public function writtenReviews(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    /**
     * Get the reviews received by the user.
     */
    public function receivedReviews(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewee_id');
    }

    /**
     * Get the skills of the employee.
     */
    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class, 'user_id');
    }

    /**
     * Get the portfolios of the employee.
     */
    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class, 'user_id');
    }

    /**
     * Get the jobs saved by the worker.
     */
    public function savedJobs(): HasMany
    {
        return $this->hasMany(SavedJob::class);
    }

    // Subscription relationships
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function activeSubscription(): ?Subscription
    {
        return $this->subscriptions()
                   ->where('status', 'active')
                   ->where(function ($query) {
                       $query->whereNull('ends_at')
                             ->orWhere('ends_at', '>', now());
                   })
                   ->first();
    }

    public function hasActiveSubscription(): bool
    {
        return $this->activeSubscription() !== null;
    }

    public function subscriptionPlan(): ?SubscriptionPlan
    {
        $subscription = $this->activeSubscription();
        return $subscription ? $subscription->plan : null;
    }

    public function canUseFeature(string $feature): bool
    {
        $subscription = $this->activeSubscription();
        
        if (!$subscription) {
            return false; // No active subscription
        }

        return $subscription->plan->hasFeature($feature) && 
               $subscription->withinLimit($feature);
    }

    public function getFeatureUsage(string $feature): int
    {
        $subscription = $this->activeSubscription();
        return $subscription ? $subscription->getUsage($feature) : 0;
    }

    public function getRemainingFeatureUsage(string $feature): ?int
    {
        $subscription = $this->activeSubscription();
        return $subscription ? $subscription->getRemainingUsage($feature) : null;
    }

    /**
     * Get the average rating for this user.
     */
    public function getAverageRating(): float
    {
        $reviews = $this->receivedReviews;
        if ($reviews->isEmpty()) {
            return 0.0;
        }
        
        return round($reviews->avg('rating'), 2);
    }

    /**
     * Get review statistics for this user.
     */
    public function getReviewStats(): array
    {
        $reviews = $this->receivedReviews;
        $total = $reviews->count();
        
        if ($total === 0) {
            return [
                'total' => 0,
                'average' => 0.0,
                'distribution' => [1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0],
            ];
        }
        
        $distribution = [1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0];
        foreach ($reviews as $review) {
            $distribution[$review->rating]++;
        }
        
        return [
            'total' => $total,
            'average' => $this->getAverageRating(),
            'distribution' => $distribution,
        ];
    }
}
