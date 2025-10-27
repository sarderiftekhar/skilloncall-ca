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
        if (!Schema::hasTable('subscription_plans')) {
            Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., 'Basic', 'Professional', 'Enterprise'
            $table->string('slug')->unique(); // e.g., 'basic', 'professional', 'enterprise'
            $table->text('description');
            $table->enum('type', ['employer', 'worker']); // Plan type
            $table->decimal('price', 10, 2); // Monthly price
            $table->decimal('yearly_price', 10, 2)->nullable(); // Yearly price (discounted)
            $table->string('currency', 3)->default('CAD');
            $table->enum('billing_interval', ['monthly', 'yearly'])->default('monthly');
            
            // Limits and features
            $table->integer('job_posts_limit')->nullable(); // For employers
            $table->integer('job_applications_limit')->nullable(); // For workers
            $table->integer('featured_jobs_limit')->nullable(); // Featured job posts
            $table->integer('team_members_limit')->nullable(); // Team members for employers
            $table->boolean('priority_support')->default(false);
            $table->boolean('advanced_analytics')->default(false);
            $table->boolean('custom_branding')->default(false);
            $table->boolean('api_access')->default(false);
            
            // Plan settings
            $table->boolean('is_active')->default(true);
            $table->boolean('is_popular')->default(false); // Highlight as popular
            $table->integer('sort_order')->default(0);
            
            // Metadata
            $table->json('features')->nullable(); // Additional features as JSON
            $table->json('metadata')->nullable(); // Additional metadata
            
            $table->timestamps();
            
            // Indexes
            $table->index(['type', 'is_active']);
            $table->index('slug');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};