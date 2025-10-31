<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedJob extends Model
{
    protected $fillable = [
        'user_id',
        'job_id',
    ];

    /**
     * Get the user that saved the job.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the job that was saved.
     */
    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
