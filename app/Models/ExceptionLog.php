<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExceptionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'exception_class',
        'message',
        'trace',
        'file',
        'line',
        'request_url',
        'request_method',
        'request_payload',
        'headers',
        'user_id',
        'ip_address',
    ];

    protected $casts = [
        'request_payload' => 'array',
        'headers' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

