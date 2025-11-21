<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestTimeLog extends Model
{
    protected $table = 'uat_test_time_logs';

    protected $fillable = [
        'tester_session_id',
        'test_id',
        'action',
        'timestamp',
    ];

    protected $casts = [
        'timestamp' => 'datetime',
    ];

    public function testerSession()
    {
        return $this->belongsTo(TesterSession::class);
    }
}
