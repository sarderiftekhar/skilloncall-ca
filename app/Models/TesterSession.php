<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class TesterSession extends Model
{
    protected $table = 'uat_tester_sessions';

    protected $fillable = [
        'tester_name',
        'user_id',
        'session_start',
        'session_end',
        'date',
        'is_active',
        'total_time_seconds',
        'tests_completed',
        'tests_passed',
        'tests_failed',
    ];

    protected $casts = [
        'session_start' => 'datetime',
        'session_end' => 'datetime',
        'date' => 'date',
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function timeLogs()
    {
        return $this->hasMany(TestTimeLog::class);
    }

    public function customTests()
    {
        return $this->hasMany(CustomTest::class);
    }

    public static function startSession(string $testerName, ?int $userId = null): self
    {
        // End any existing active sessions for this tester
        self::where('tester_name', $testerName)
            ->where('is_active', true)
            ->update([
                'is_active' => false,
                'session_end' => now(),
            ]);

        return self::create([
            'tester_name' => $testerName,
            'user_id' => $userId,
            'session_start' => now(),
            'date' => now()->toDateString(),
            'is_active' => true,
        ]);
    }

    public static function getActiveSession(string $testerName): ?self
    {
        return self::where('tester_name', $testerName)
            ->where('is_active', true)
            ->first();
    }

    public function endSession(): void
    {
        $this->update([
            'is_active' => false,
            'session_end' => now(),
            'total_time_seconds' => $this->getElapsedTime(),
        ]);
    }

    public function getElapsedTime(): int
    {
        $end = $this->session_end ?? now();
        return $this->session_start->diffInSeconds($end);
    }

    public function getFormattedElapsedTime(): string
    {
        $seconds = $this->getElapsedTime();
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $secs = $seconds % 60;
        return sprintf('%02d:%02d:%02d', $hours, $minutes, $secs);
    }

    public function incrementTestCounters(string $status): void
    {
        $this->increment('tests_completed');
        
        if ($status === 'pass') {
            $this->increment('tests_passed');
        } elseif ($status === 'fail') {
            $this->increment('tests_failed');
        }
    }
}
