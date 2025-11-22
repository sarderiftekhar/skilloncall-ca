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
        Schema::create('paddle_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_plan_id')->unique()->constrained('subscription_plans')->onDelete('cascade');
            $table->string('paddle_product_id');
            $table->string('paddle_price_id_monthly')->nullable();
            $table->string('paddle_price_id_yearly')->nullable();
            $table->enum('environment', ['sandbox', 'production'])->default('sandbox');
            $table->timestamps();
            
            // Indexes
            $table->index('paddle_product_id');
            $table->index(['subscription_plan_id', 'environment']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paddle_products');
    }
};
