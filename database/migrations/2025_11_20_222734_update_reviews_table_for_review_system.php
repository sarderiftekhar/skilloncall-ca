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
        if (Schema::hasTable('reviews')) {
            // Update enum values if they exist
            DB::statement("ALTER TABLE reviews MODIFY COLUMN type ENUM('employer_to_employee', 'employee_to_employer') NOT NULL");
            
            // Add application_id column if it doesn't exist
            if (!Schema::hasColumn('reviews', 'application_id')) {
                Schema::table('reviews', function (Blueprint $table) {
                    $table->foreignId('application_id')->nullable()->after('job_id')->constrained('applications')->onDelete('cascade');
                });
            }
            
            // Drop old unique constraint if it exists (check first to avoid foreign key issues)
            try {
                // Check if the unique constraint exists by trying to get table info
                $indexes = DB::select("SHOW INDEX FROM reviews WHERE Key_name = 'reviews_job_id_reviewer_id_reviewee_id_unique'");
                if (!empty($indexes)) {
                    // Drop foreign keys that might reference this index first
                    $foreignKeys = DB::select("
                        SELECT CONSTRAINT_NAME 
                        FROM information_schema.KEY_COLUMN_USAGE 
                        WHERE TABLE_SCHEMA = DATABASE() 
                        AND TABLE_NAME = 'reviews' 
                        AND CONSTRAINT_NAME != 'PRIMARY'
                    ");
                    
                    // Then drop the unique constraint
                    DB::statement("ALTER TABLE reviews DROP INDEX reviews_job_id_reviewer_id_reviewee_id_unique");
                }
            } catch (\Exception $e) {
                // Constraint might not exist or already dropped, continue
            }
            
            // Add new unique constraint with application_id
            Schema::table('reviews', function (Blueprint $table) {
                $table->unique(['application_id', 'reviewer_id', 'reviewee_id'], 'reviews_application_reviewer_reviewee_unique');
            });
            
            // Add additional indexes
            Schema::table('reviews', function (Blueprint $table) {
                $table->index(['application_id']);
                $table->index(['reviewer_id', 'type']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('reviews')) {
            // Revert enum values
            DB::statement("ALTER TABLE reviews MODIFY COLUMN type ENUM('employer_to_worker', 'worker_to_employer') NOT NULL");
            
            // Drop new unique constraint
            Schema::table('reviews', function (Blueprint $table) {
                $table->dropUnique('reviews_application_reviewer_reviewee_unique');
            });
            
            // Restore old unique constraint
            Schema::table('reviews', function (Blueprint $table) {
                $table->unique(['job_id', 'reviewer_id', 'reviewee_id']);
            });
            
            // Drop additional indexes
            Schema::table('reviews', function (Blueprint $table) {
                $table->dropIndex(['application_id']);
                $table->dropIndex(['reviewer_id', 'type']);
            });
            
            // Drop application_id column if it exists
            if (Schema::hasColumn('reviews', 'application_id')) {
                Schema::table('reviews', function (Blueprint $table) {
                    $table->dropForeign(['application_id']);
                    $table->dropColumn('application_id');
                });
            }
        }
    }
};
