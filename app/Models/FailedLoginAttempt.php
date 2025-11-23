<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FailedLoginAttempt extends Model
{
    use HasFactory;

    /**
     * Disable timestamps.
     */
    public $timestamps = false;

    protected $fillable = [
        'email',
        'ip_address',
        'user_agent',
        'attempted_at',
        'locked_until',
    ];

    protected $casts = [
        'attempted_at' => 'datetime',
        'locked_until' => 'datetime',
    ];

    /**
     * Check if account is currently locked.
     */
    public static function isLocked(string $email): bool
    {
        $attempt = self::where('email', $email)
            ->where('locked_until', '>', now())
            ->first();

        return $attempt !== null;
    }

    /**
     * Get remaining lockout time in minutes.
     */
    public static function lockoutTimeRemaining(string $email): int
    {
        $attempt = self::where('email', $email)
            ->where('locked_until', '>', now())
            ->first();

        if (!$attempt) {
            return 0;
        }

        return now()->diffInMinutes($attempt->locked_until, false);
    }

    /**
     * Clear old failed attempts (older than 24 hours).
     */
    public static function clearOldAttempts(): void
    {
        self::where('attempted_at', '<', now()->subHours(24))
            ->where(function ($query) {
                $query->whereNull('locked_until')
                    ->orWhere('locked_until', '<', now());
            })
            ->delete();
    }

    /**
     * Get recent failed attempts count for an email.
     */
    public static function getRecentAttempts(string $email, int $minutes = 30): int
    {
        return self::where('email', $email)
            ->where('attempted_at', '>=', now()->subMinutes($minutes))
            ->count();
    }
}
