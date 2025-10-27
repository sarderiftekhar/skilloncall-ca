<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('worker_profiles')) {
            Schema::create('worker_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Personal Information
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone');
            $table->string('profile_photo')->nullable();
            $table->date('date_of_birth');
            $table->text('bio')->nullable();
            
            // Address Information
            $table->string('address_line_1');
            $table->string('address_line_2')->nullable();
            $table->string('city');
            $table->string('province');
            $table->string('postal_code');
            $table->string('country')->default('Canada');
            
            // Canadian Compliance Requirements
            $table->string('sin_number')->nullable(); // Encrypted
            $table->enum('work_authorization', [
                'canadian_citizen', 
                'permanent_resident', 
                'work_permit', 
                'student_permit'
            ]);
            $table->string('work_permit_expiry')->nullable();
            $table->boolean('has_criminal_background_check')->default(false);
            $table->date('background_check_date')->nullable();
            
            // Professional Details
            $table->decimal('hourly_rate_min', 8, 2);
            $table->decimal('hourly_rate_max', 8, 2)->nullable();
            $table->integer('travel_distance_max'); // km radius
            $table->boolean('has_vehicle')->default(false);
            $table->boolean('has_tools_equipment')->default(false);
            $table->boolean('is_insured')->default(false);
            $table->boolean('has_wcb_coverage')->default(false);
            
            // Emergency Contact
            $table->string('emergency_contact_name');
            $table->string('emergency_contact_phone');
            $table->string('emergency_contact_relationship');
            
            // Availability & Preferences
            $table->json('availability_schedule')->nullable();
            $table->json('work_preferences')->nullable(); // types of work preferred
            $table->json('portfolio_photos')->nullable();
            $table->json('certifications')->nullable();
            $table->json('social_media_links')->nullable();
            
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

    public function down(): void
    {
        Schema::dropIfExists('worker_profiles');
    }
};


