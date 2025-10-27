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
        if (!Schema::hasTable('subscription_features')) {
            Schema::create('subscription_features', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Feature name
            $table->string('slug')->unique(); // Feature slug
            $table->text('description');
            $table->enum('type', ['boolean', 'limit', 'quota']); // Feature type
            $table->string('category')->nullable(); // Feature category
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->index('slug');
            $table->index(['category', 'is_active']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_features');
    }
};