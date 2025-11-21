<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestResult extends Model
{
    protected $table = 'uat_test_results';

    protected $fillable = [
        'test_id',
        'category',
        'feature',
        'scenario',
        'steps',
        'expected_result',
        'expected_outcomes',
        'observed_outcome',
        'sequence_index',
        'flow_group',
        'test_status',
        'issue_resolved',
        'actual_result',
        'notes',
        'screenshots',
        'tested_by',
        'tested_at',
    ];

    protected $casts = [
        'tested_at' => 'datetime',
        'expected_outcomes' => 'array',
        'screenshots' => 'array',
        'issue_resolved' => 'boolean',
    ];

    public static function getByCategory()
    {
        return self::orderBy('category')
            ->orderBy('feature')
            ->orderBy('sequence_index')
            ->get()
            ->groupBy('category');
    }

    public static function getSequential(string $flowGroup = null)
    {
        $query = self::orderBy('sequence_index')
            ->orderBy('test_id');
        if ($flowGroup) {
            $query->where('flow_group', $flowGroup);
        }
        return $query->get();
    }

    public static function getProgress()
    {
        $total = self::count();
        $tested = self::whereIn('test_status', ['pass', 'fail', 'blocked'])->count();
        $passed = self::where('test_status', 'pass')->count();
        $failed = self::where('test_status', 'fail')->count();
        $blocked = self::where('test_status', 'blocked')->count();
        $notTested = self::where('test_status', 'not_tested')->count();

        return [
            'total' => $total,
            'tested' => $tested,
            'passed' => $passed,
            'failed' => $failed,
            'blocked' => $blocked,
            'not_tested' => $notTested,
            'completion_percentage' => $total > 0 ? round(($tested / $total) * 100, 2) : 0,
            'pass_percentage' => $tested > 0 ? round(($passed / $tested) * 100, 2) : 0,
        ];
    }
}
