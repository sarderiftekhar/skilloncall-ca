<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

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
    public function workerProfile(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(WorkerProfile::class);
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

    public function isWorker(): bool
    {
        return $this->role === 'worker';
    }

    /**
     * Get the jobs posted by the employer.
     */
    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class, 'employer_id');
    }

    /**
     * Get the applications submitted by the worker.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'worker_id');
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
     * Get the skills of the worker.
     */
    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class, 'user_id');
    }

    /**
     * Get the portfolios of the worker.
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
}
