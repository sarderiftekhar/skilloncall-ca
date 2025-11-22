<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

Route::get('/debug/last-error', function () {
    $logFile = storage_path('logs/laravel.log');
    
    if (File::exists($logFile)) {
        $lines = file($logFile);
        $lastLines = array_slice($lines, -100);
        
        return response('<pre>' . implode('', $lastLines) . '</pre>');
    }
    
    return 'No log file found';
});

Route::get('/debug/paddle-products', function () {
    $products = \App\Models\PaddleProduct::with('plan')->get();
    return response()->json($products->map(function ($p) {
        return [
            'plan_name' => $p->plan->name,
            'paddle_product_id' => $p->paddle_product_id,
            'monthly_price_id' => $p->paddle_price_id_monthly,
            'yearly_price_id' => $p->paddle_price_id_yearly,
            'environment' => $p->environment,
        ];
    }));
});

Route::get('/debug/paddle-config', function () {
    return response()->json([
        'seller_id' => config('cashier.seller_id'),
        'client_side_token' => config('cashier.client_side_token'),
        'api_key_present' => !empty(config('cashier.api_key')),
        'webhook_secret_present' => !empty(config('cashier.webhook_secret')),
        'sandbox' => config('cashier.sandbox'),
        'path' => config('cashier.path'),
    ]);
});

