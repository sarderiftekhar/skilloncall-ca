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
        Schema::create('contact_credits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->constrained('subscriptions')->onDelete('set null');
            $table->integer('credits_available')->default(0);
            $table->integer('credits_used')->default(0);
            $table->integer('daily_limit')->default(10); // Max reveals per day
            $table->integer('monthly_limit')->default(100); // Max reveals per month
            $table->timestamp('last_reset_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            
            // One credits record per employer
            $table->unique('employer_id');
            
            // Index for expiry checks
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_credits');
    }
};
