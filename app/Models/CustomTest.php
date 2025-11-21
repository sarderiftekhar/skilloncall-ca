<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomTest extends Model
{
    protected $table = 'uat_custom_tests';

    protected $fillable = [
        'tester_name',
        'user_id',
        'tester_session_id',
        'section_name',
        'what_is_tested',
        'result_or_feedback',
        'page_url',
        'screenshots',
    ];

    protected $casts = [
        'screenshots' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function testerSession()
    {
        return $this->belongsTo(TesterSession::class);
    }
}
