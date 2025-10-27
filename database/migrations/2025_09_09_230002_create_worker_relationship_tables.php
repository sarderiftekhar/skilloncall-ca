<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Worker Skills (Many-to-Many)
        if (!Schema::hasTable('worker_skills')) {
            Schema::create('worker_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_profile_id')->constrained()->onDelete('cascade');
            $table->foreignId('global_skill_id')->constrained()->onDelete('cascade');
            $table->enum('proficiency_level', ['beginner', 'intermediate', 'advanced', 'expert']);
            $table->boolean('is_primary_skill')->default(false);
            $table->timestamps();
            
            $table->unique(['worker_profile_id', 'global_skill_id']);
            $table->index('is_primary_skill');
            });
        }

        // Worker Languages (Many-to-Many)
        if (!Schema::hasTable('worker_languages')) {
            Schema::create('worker_languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_profile_id')->constrained()->onDelete('cascade');
            $table->foreignId('global_language_id')->constrained()->onDelete('cascade');
            $table->enum('proficiency_level', ['basic', 'conversational', 'fluent', 'native']);
            $table->boolean('is_primary_language')->default(false);
            $table->timestamps();
            
            $table->unique(['worker_profile_id', 'global_language_id']);
            $table->index('is_primary_language');
            });
        }

        // Work Experience History
        if (!Schema::hasTable('work_experiences')) {
            Schema::create('work_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_profile_id')->constrained()->onDelete('cascade');
            $table->foreignId('global_skill_id')->constrained();
            $table->foreignId('global_industry_id')->constrained();
            
            $table->string('company_name');
            $table->string('job_title');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_current')->default(false);
            $table->text('description')->nullable();
            $table->string('supervisor_name')->nullable();
            $table->string('supervisor_contact')->nullable();
            
            $table->timestamps();
            
            $table->index(['worker_profile_id', 'is_current']);
            $table->index('start_date');
            });
        }

        // Worker Service Areas
        if (!Schema::hasTable('worker_service_areas')) {
            Schema::create('worker_service_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_profile_id')->constrained()->onDelete('cascade');
            $table->string('postal_code', 7);
            $table->string('city');
            $table->string('province');
            $table->integer('travel_time_minutes')->nullable();
            $table->decimal('additional_charge', 8, 2)->default(0);
            $table->boolean('is_primary_area')->default(false);
            $table->timestamps();
            
            $table->index(['worker_profile_id', 'is_primary_area']);
            $table->index('postal_code');
            });
        }

        // Worker References
        if (!Schema::hasTable('worker_references')) {
            Schema::create('worker_references', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_profile_id')->constrained()->onDelete('cascade');
            
            $table->string('reference_name');
            $table->string('reference_phone');
            $table->string('reference_email')->nullable();
            $table->enum('relationship', [
                'previous_employer', 
                'previous_supervisor', 
                'satisfied_client', 
                'colleague', 
                'business_partner'
            ]);
            $table->string('company_name')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('permission_to_contact')->default(true);
            
            $table->timestamps();
            
            $table->index('worker_profile_id');
            });
        }

        // Worker Certifications
        if (!Schema::hasTable('worker_certifications')) {
            Schema::create('worker_certifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_profile_id')->constrained()->onDelete('cascade');
            $table->foreignId('global_certification_id')->constrained();
            
            $table->string('certificate_number')->nullable();
            $table->date('issued_date');
            $table->date('expiry_date')->nullable();
            $table->string('certificate_file')->nullable(); // PDF/image upload
            $table->enum('verification_status', ['pending', 'verified', 'expired', 'invalid'])->default('pending');
            $table->timestamp('verified_at')->nullable();
            
            $table->timestamps();
            
            $table->index(['worker_profile_id', 'verification_status'], 'worker_cert_profile_status_idx');
            $table->index('expiry_date');
            });
        }

        // Worker Availability Schedule (detailed)
        if (!Schema::hasTable('worker_availability')) {
            Schema::create('worker_availability', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_profile_id')->constrained()->onDelete('cascade');
            
            $table->integer('day_of_week'); // 0=Sunday, 1=Monday, etc.
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_available')->default(true);
            $table->decimal('rate_multiplier', 3, 2)->default(1.00); // weekend/evening rates
            
            $table->timestamps();
            
            $table->index(['worker_profile_id', 'day_of_week']);
            $table->unique(['worker_profile_id', 'day_of_week', 'start_time'], 'worker_avail_profile_day_time_unique');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('worker_availability');
        Schema::dropIfExists('worker_certifications');
        Schema::dropIfExists('worker_references');
        Schema::dropIfExists('worker_service_areas');
        Schema::dropIfExists('work_experiences');
        Schema::dropIfExists('worker_languages');
        Schema::dropIfExists('worker_skills');
    }
};


