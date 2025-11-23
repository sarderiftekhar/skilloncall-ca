<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactReveal extends Model
{
    use HasFactory;

    /**
     * Disable updated_at timestamp.
     */
    const UPDATED_AT = null;

    /**
     * The name of the "created at" column.
     */
    const CREATED_AT = 'revealed_at';

    protected $fillable = [
        'employer_id',
        'employee_id',
        'ip_address',
        'user_agent',
        'credits_used',
    ];

    protected $casts = [
        'revealed_at' => 'datetime',
    ];

    /**
     * Get the employer who revealed the contact.
     */
    public function employer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employer_id');
    }

    /**
     * Get the employee whose contact was revealed.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    /**
     * Check if employer has already revealed this contact.
     */
    public static function hasRevealed(int $employerId, int $employeeId): bool
    {
        return self::where('employer_id', $employerId)
            ->where('employee_id', $employeeId)
            ->exists();
    }

    /**
     * Get count of reveals for employer today.
     */
    public static function getTodayCount(int $employerId): int
    {
        return self::where('employer_id', $employerId)
            ->whereDate('revealed_at', today())
            ->count();
    }

    /**
     * Get count of reveals for employer this month.
     */
    public static function getMonthCount(int $employerId): int
    {
        return self::where('employer_id', $employerId)
            ->whereYear('revealed_at', now()->year)
            ->whereMonth('revealed_at', now()->month)
            ->count();
    }
}
