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
        // Step 1: Update subscription_plans table type enum
        // First expand the enum to include both 'worker' and 'employee'
        DB::statement("ALTER TABLE subscription_plans MODIFY COLUMN type ENUM('employer', 'worker', 'employee') NOT NULL");
        
        // Update existing records with 'worker' type to 'employee'
        DB::table('subscription_plans')
            ->where('type', 'worker')
            ->update(['type' => 'employee']);
        
        // Remove 'worker' from the enum
        DB::statement("ALTER TABLE subscription_plans MODIFY COLUMN type ENUM('employer', 'employee') NOT NULL");

        // Step 2: Update reviews table type enum
        // First expand the enum to include both old and new values
        DB::statement("ALTER TABLE reviews MODIFY COLUMN type ENUM('employer_to_worker', 'worker_to_employer', 'employer_to_employee', 'employee_to_employer')");
        
        // Update existing records
        DB::table('reviews')
            ->where('type', 'employer_to_worker')
            ->update(['type' => 'employer_to_employee']);
            
        DB::table('reviews')
            ->where('type', 'worker_to_employer')
            ->update(['type' => 'employee_to_employer']);
        
        // Remove old values from the enum
        DB::statement("ALTER TABLE reviews MODIFY COLUMN type ENUM('employer_to_employee', 'employee_to_employer')");

        // Step 3: Update slugs in subscription_plans if they contain 'worker'
        DB::table('subscription_plans')
            ->where('slug', 'like', '%worker%')
            ->update([
                'slug' => DB::raw("REPLACE(slug, 'worker', 'employee')")
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse Step 3: Revert slugs
        DB::table('subscription_plans')
            ->where('slug', 'like', '%employee%')
            ->update([
                'slug' => DB::raw("REPLACE(slug, 'employee', 'worker')")
            ]);

        // Reverse Step 2: Revert reviews table type enum
        DB::statement("ALTER TABLE reviews MODIFY COLUMN type ENUM('employer_to_worker', 'worker_to_employer', 'employer_to_employee', 'employee_to_employer')");
        
        DB::table('reviews')
            ->where('type', 'employer_to_employee')
            ->update(['type' => 'employer_to_worker']);
            
        DB::table('reviews')
            ->where('type', 'employee_to_employer')
            ->update(['type' => 'worker_to_employer']);
        
        DB::statement("ALTER TABLE reviews MODIFY COLUMN type ENUM('employer_to_worker', 'worker_to_employer')");

        // Reverse Step 1: Revert subscription_plans table type enum
        DB::statement("ALTER TABLE subscription_plans MODIFY COLUMN type ENUM('employer', 'worker', 'employee') NOT NULL");
        
        DB::table('subscription_plans')
            ->where('type', 'employee')
            ->update(['type' => 'worker']);
        
        DB::statement("ALTER TABLE subscription_plans MODIFY COLUMN type ENUM('employer', 'worker') NOT NULL");
    }
};
