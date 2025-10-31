<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: Rename tables (only if not already renamed)
        if (Schema::hasTable('worker_profiles') && !Schema::hasTable('employee_profiles')) {
            Schema::rename('worker_profiles', 'employee_profiles');
        }
        if (Schema::hasTable('worker_skills') && !Schema::hasTable('employee_skills')) {
            Schema::rename('worker_skills', 'employee_skills');
        }
        if (Schema::hasTable('worker_languages') && !Schema::hasTable('employee_languages')) {
            Schema::rename('worker_languages', 'employee_languages');
        }
        if (Schema::hasTable('worker_service_areas') && !Schema::hasTable('employee_service_areas')) {
            Schema::rename('worker_service_areas', 'employee_service_areas');
        }
        if (Schema::hasTable('worker_references') && !Schema::hasTable('employee_references')) {
            Schema::rename('worker_references', 'employee_references');
        }
        if (Schema::hasTable('worker_certifications') && !Schema::hasTable('employee_certifications')) {
            Schema::rename('worker_certifications', 'employee_certifications');
        }
        if (Schema::hasTable('worker_availability') && !Schema::hasTable('employee_availability')) {
            Schema::rename('worker_availability', 'employee_availability');
        }

        // Step 2: Rename foreign key columns in employee tables (only if not already renamed)
        if (Schema::hasColumn('employee_skills', 'worker_profile_id')) {
            Schema::table('employee_skills', function (Blueprint $table) {
                $table->renameColumn('worker_profile_id', 'employee_profile_id');
            });
        }

        if (Schema::hasColumn('employee_languages', 'worker_profile_id')) {
            Schema::table('employee_languages', function (Blueprint $table) {
                $table->renameColumn('worker_profile_id', 'employee_profile_id');
            });
        }

        if (Schema::hasColumn('work_experiences', 'worker_profile_id')) {
            Schema::table('work_experiences', function (Blueprint $table) {
                $table->renameColumn('worker_profile_id', 'employee_profile_id');
            });
        }

        if (Schema::hasColumn('employee_service_areas', 'worker_profile_id')) {
            Schema::table('employee_service_areas', function (Blueprint $table) {
                $table->renameColumn('worker_profile_id', 'employee_profile_id');
            });
        }

        if (Schema::hasColumn('employee_references', 'worker_profile_id')) {
            Schema::table('employee_references', function (Blueprint $table) {
                $table->renameColumn('worker_profile_id', 'employee_profile_id');
            });
        }

        if (Schema::hasColumn('employee_certifications', 'worker_profile_id')) {
            Schema::table('employee_certifications', function (Blueprint $table) {
                $table->renameColumn('worker_profile_id', 'employee_profile_id');
            });
        }

        if (Schema::hasColumn('employee_availability', 'worker_profile_id')) {
            Schema::table('employee_availability', function (Blueprint $table) {
                $table->renameColumn('worker_profile_id', 'employee_profile_id');
            });
        }

        // Step 3: Update worker_id column in applications table if it exists
        if (Schema::hasColumn('applications', 'worker_id')) {
            Schema::table('applications', function (Blueprint $table) {
                $table->renameColumn('worker_id', 'employee_id');
            });
        }

        // Step 4: First, expand the enum to include both 'worker' and 'employee'
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'employer', 'worker', 'employee') DEFAULT 'worker'");
        
        // Step 5: Update existing user records with 'worker' role to 'employee'
        DB::table('users')
            ->where('role', 'worker')
            ->update(['role' => 'employee']);
        
        // Step 6: Remove 'worker' from the enum and set default to 'employee'
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'employer', 'employee') DEFAULT 'employee'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse Step 5: Update user role enum from 'employee' back to 'worker'
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'employer', 'worker', 'employee') DEFAULT 'worker'");
        
        // Reverse Step 4: Update existing user records with 'employee' role back to 'worker'
        DB::table('users')
            ->where('role', 'employee')
            ->update(['role' => 'worker']);
        
        // Now remove 'employee' from enum
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'employer', 'worker') DEFAULT 'worker'");

        // Reverse Step 3: Rename employee_id back to worker_id in applications table
        if (Schema::hasColumn('applications', 'employee_id')) {
            Schema::table('applications', function (Blueprint $table) {
                $table->renameColumn('employee_id', 'worker_id');
            });
        }

        // Reverse Step 2: Rename foreign key columns back
        Schema::table('employee_availability', function (Blueprint $table) {
            $table->renameColumn('employee_profile_id', 'worker_profile_id');
        });

        Schema::table('employee_certifications', function (Blueprint $table) {
            $table->renameColumn('employee_profile_id', 'worker_profile_id');
        });

        Schema::table('employee_references', function (Blueprint $table) {
            $table->renameColumn('employee_profile_id', 'worker_profile_id');
        });

        Schema::table('employee_service_areas', function (Blueprint $table) {
            $table->renameColumn('employee_profile_id', 'worker_profile_id');
        });

        Schema::table('work_experiences', function (Blueprint $table) {
            $table->renameColumn('employee_profile_id', 'worker_profile_id');
        });

        Schema::table('employee_languages', function (Blueprint $table) {
            $table->renameColumn('employee_profile_id', 'worker_profile_id');
        });

        Schema::table('employee_skills', function (Blueprint $table) {
            $table->renameColumn('employee_profile_id', 'worker_profile_id');
        });

        // Reverse Step 1: Rename tables back
        Schema::rename('employee_availability', 'worker_availability');
        Schema::rename('employee_certifications', 'worker_certifications');
        Schema::rename('employee_references', 'worker_references');
        Schema::rename('employee_service_areas', 'worker_service_areas');
        Schema::rename('employee_languages', 'worker_languages');
        Schema::rename('employee_skills', 'worker_skills');
        Schema::rename('employee_profiles', 'worker_profiles');
    }
};
