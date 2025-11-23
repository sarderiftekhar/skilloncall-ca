<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SecurityLog extends Model
{
    use HasFactory;

    /**
     * Disable updated_at timestamp.
     */
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'event_type',
        'severity',
        'ip_address',
        'user_agent',
        'metadata',
        'description',
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];

    // Event types constants
    const EVENT_FAILED_LOGIN = 'failed_login';
    const EVENT_SUCCESSFUL_LOGIN = 'successful_login';
    const EVENT_LOGOUT = 'logout';
    const EVENT_CONTACT_REVEAL = 'contact_reveal';
    const EVENT_PROFILE_VIEW = 'profile_view';
    const EVENT_ACCOUNT_LOCKED = 'account_locked';
    const EVENT_ACCOUNT_UNLOCKED = 'account_unlocked';
    const EVENT_PASSWORD_CHANGED = 'password_changed';
    const EVENT_EMAIL_CHANGED = 'email_changed';
    const EVENT_SUSPICIOUS_ACTIVITY = 'suspicious_activity';
    const EVENT_RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded';
    const EVENT_REAUTHENTICATION = 'reauthentication';
    const EVENT_SESSION_TIMEOUT = 'session_timeout';

    // Severity levels
    const SEVERITY_INFO = 'info';
    const SEVERITY_WARNING = 'warning';
    const SEVERITY_CRITICAL = 'critical';

    /**
     * Get the user that triggered this event.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for critical events.
     */
    public function scopeCritical($query)
    {
        return $query->where('severity', self::SEVERITY_WARNING);
    }

    /**
     * Scope for specific event type.
     */
    public function scopeEventType($query, string $type)
    {
        return $query->where('event_type', $type);
    }

    /**
     * Scope for recent events.
     */
    public function scopeRecent($query, int $hours = 24)
    {
        return $query->where('created_at', '>=', now()->subHours($hours));
    }
}
