<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('paddle_subscription_id')->nullable()->after('subscription_id');
            $table->string('paddle_customer_id')->nullable()->after('paddle_subscription_id');
            $table->string('paddle_transaction_id')->nullable()->after('paddle_customer_id');
            $table->string('paddle_checkout_id')->nullable()->after('paddle_transaction_id');
            $table->string('paddle_product_id')->nullable()->after('paddle_checkout_id');
            $table->string('paddle_price_id')->nullable()->after('paddle_product_id');
            
            // Indexes for Paddle fields
            $table->index('paddle_subscription_id');
            $table->index('paddle_customer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropIndex(['paddle_subscription_id']);
            $table->dropIndex(['paddle_customer_id']);
            $table->dropColumn([
                'paddle_subscription_id',
                'paddle_customer_id',
                'paddle_transaction_id',
                'paddle_checkout_id',
                'paddle_product_id',
                'paddle_price_id',
            ]);
        });
    }
};
