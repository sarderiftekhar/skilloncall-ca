<?php

namespace App\Services\Security;

use App\Models\SecurityLog;
use App\Models\User;
use Illuminate\Support\Facades\Request;

class SecurityLogService
{
    /**
     * Log a security event.
     */
    public static function log(
        string $eventType,
        ?User $user = null,
        string $severity = SecurityLog::SEVERITY_INFO,
        ?string $description = null,
        array $metadata = []
    ): SecurityLog {
        return SecurityLog::create([
            'user_id' => $user?->id,
            'event_type' => $eventType,
            'severity' => $severity,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'metadata' => $metadata,
            'description' => $description,
        ]);
    }

    /**
     * Log failed login attempt.
     */
    public static function logFailedLogin(string $email, ?string $reason = null): void
    {
        self::log(
            SecurityLog::EVENT_FAILED_LOGIN,
            null,
            SecurityLog::SEVERITY_WARNING,
            "Failed login attempt for {$email}",
            [
                'email' => $email,
                'reason' => $reason,
            ]
        );
    }

    /**
     * Log successful login.
     */
    public static function logSuccessfulLogin(User $user): void
    {
        self::log(
            SecurityLog::EVENT_SUCCESSFUL_LOGIN,
            $user,
            SecurityLog::SEVERITY_INFO,
            "User {$user->email} logged in successfully"
        );
    }

    /**
     * Log contact reveal.
     */
    public static function logContactReveal(User $employer, User $employee): void
    {
        self::log(
            SecurityLog::EVENT_CONTACT_REVEAL,
            $employer,
            SecurityLog::SEVERITY_INFO,
            "Employer {$employer->email} revealed contact for employee {$employee->email}",
            [
                'employer_id' => $employer->id,
                'employee_id' => $employee->id,
            ]
        );
    }

    /**
     * Log account lockout.
     */
    public static function logAccountLocked(string $email, int $minutes): void
    {
        self::log(
            SecurityLog::EVENT_ACCOUNT_LOCKED,
            null,
            SecurityLog::SEVERITY_CRITICAL,
            "Account {$email} locked for {$minutes} minutes due to failed login attempts",
            [
                'email' => $email,
                'lockout_minutes' => $minutes,
            ]
        );
    }

    /**
     * Log suspicious activity.
     */
    public static function logSuspiciousActivity(string $description, array $metadata = []): void
    {
        self::log(
            SecurityLog::EVENT_SUSPICIOUS_ACTIVITY,
            auth()->user(),
            SecurityLog::SEVERITY_CRITICAL,
            $description,
            $metadata
        );
    }

    /**
     * Log rate limit exceeded.
     */
    public static function logRateLimitExceeded(string $endpoint, ?User $user = null): void
    {
        self::log(
            SecurityLog::EVENT_RATE_LIMIT_EXCEEDED,
            $user,
            SecurityLog::SEVERITY_WARNING,
            "Rate limit exceeded for endpoint: {$endpoint}",
            [
                'endpoint' => $endpoint,
            ]
        );
    }

    /**
     * Log session timeout and re-authentication.
     */
    public static function logReauthentication(User $user, bool $successful = true): void
    {
        self::log(
            SecurityLog::EVENT_REAUTHENTICATION,
            $user,
            $successful ? SecurityLog::SEVERITY_INFO : SecurityLog::SEVERITY_WARNING,
            $successful 
                ? "User {$user->email} successfully re-authenticated after timeout"
                : "User {$user->email} failed re-authentication attempt"
        );
    }

    /**
     * Get recent critical events.
     */
    public static function getRecentCriticalEvents(int $hours = 24)
    {
        return SecurityLog::where('severity', SecurityLog::SEVERITY_CRITICAL)
            ->where('created_at', '>=', now()->subHours($hours))
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get failed login attempts for a user.
     */
    public static function getFailedLoginsForEmail(string $email, int $hours = 24)
    {
        return SecurityLog::where('event_type', SecurityLog::EVENT_FAILED_LOGIN)
            ->where('metadata->email', $email)
            ->where('created_at', '>=', now()->subHours($hours))
            ->orderBy('created_at', 'desc')
            ->get();
    }
}

