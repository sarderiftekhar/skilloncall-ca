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
        if (!Schema::hasTable('employer_profiles')) {
            Schema::create('employer_profiles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                
                // Business Information
                $table->string('business_name');
                $table->string('phone');
                $table->foreignId('global_industry_id')->nullable()->constrained('global_industries')->onDelete('set null');
                $table->text('bio')->nullable();
                
                // Address Information (nullable for step 1)
                $table->string('address_line_1')->nullable();
                $table->string('address_line_2')->nullable();
                $table->string('city')->nullable();
                $table->string('province')->nullable();
                $table->string('postal_code')->nullable();
                $table->string('country')->default('Canada');
                $table->foreignId('global_province_id')->nullable()->constrained('global_provinces')->onDelete('set null');
                $table->foreignId('global_city_id')->nullable()->constrained('global_cities')->onDelete('set null');
                
                // Onboarding Progress
                $table->boolean('is_profile_complete')->default(false);
                $table->integer('onboarding_step')->default(1);
                $table->timestamp('profile_completed_at')->nullable();
                
                $table->timestamps();
                
                // Indexes for search
                $table->index(['city', 'province', 'postal_code']);
                $table->index('is_profile_complete');
                $table->index('onboarding_step');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employer_profiles');
    }
};
