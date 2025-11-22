<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaddleProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'subscription_plan_id',
        'paddle_product_id',
        'paddle_price_id_monthly',
        'paddle_price_id_yearly',
        'environment',
    ];

    protected $casts = [
        'environment' => 'string',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }
}

