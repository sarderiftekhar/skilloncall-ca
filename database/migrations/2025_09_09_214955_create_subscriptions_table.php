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
        if (!Schema::hasTable('subscriptions')) {
            Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_plan_id')->constrained()->onDelete('cascade');
            
            // Subscription details
            $table->string('status')->default('active'); // active, cancelled, expired, suspended
            $table->decimal('amount', 10, 2); // Amount paid
            $table->string('currency', 3)->default('CAD');
            $table->enum('billing_interval', ['monthly', 'yearly']);
            
            // Dates
            $table->timestamp('starts_at');
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            
            // Payment information
            $table->string('payment_method')->nullable(); // stripe, paypal, etc.
            $table->string('payment_id')->nullable(); // External payment ID
            $table->string('customer_id')->nullable(); // External customer ID
            $table->string('subscription_id')->nullable(); // External subscription ID
            
            // Usage tracking
            $table->json('usage')->nullable(); // Track feature usage
            $table->timestamp('last_payment_at')->nullable();
            $table->timestamp('next_payment_at')->nullable();
            
            // Metadata
            $table->json('metadata')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'status']);
            $table->index('status');
            $table->index('ends_at');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};