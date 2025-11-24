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
        // First, wrap existing data in JSON format {"en": "value"}
        // Then convert column types to JSON
        
        // Convert GlobalSkills
        $this->convertToJson('global_skills', ['name', 'description']);
        
        // Convert GlobalIndustries  
        $this->convertToJson('global_industries', ['name', 'description']);
        
        // Convert GlobalCertifications
        $this->convertToJson('global_certifications', ['name', 'issuing_authority']);
        
        // Convert GlobalLanguages
        $this->convertToJson('global_languages', ['name']);

        // Note: GlobalProvince and GlobalCity will use translation files instead
    }
    
    /**
     * Helper to convert VARCHAR/TEXT columns to JSON with existing data as English
     */
    private function convertToJson(string $table, array $columns): void
    {
        foreach ($columns as $column) {
            // First, wrap existing non-null values in JSON format
            DB::statement("
                UPDATE `{$table}` 
                SET `{$column}` = JSON_OBJECT('en', `{$column}`)
                WHERE `{$column}` IS NOT NULL 
                AND `{$column}` != ''
                AND JSON_VALID(`{$column}`) = 0
            ");
            
            // Now convert the column type to JSON
            try {
                DB::statement("ALTER TABLE `{$table}` MODIFY COLUMN `{$column}` JSON NULL");
            } catch (\Exception $e) {
                // If it fails due to index, drop the index first
                if (str_contains($e->getMessage(), 'supports indexing only via generated columns')) {
                    // Drop any indexes on this column
                    $indexes = DB::select("
                        SELECT DISTINCT INDEX_NAME 
                        FROM INFORMATION_SCHEMA.STATISTICS 
                        WHERE TABLE_SCHEMA = DATABASE() 
                        AND TABLE_NAME = '{$table}' 
                        AND COLUMN_NAME = '{$column}'
                        AND INDEX_NAME != 'PRIMARY'
                    ");
                    
                    foreach ($indexes as $index) {
                        DB::statement("ALTER TABLE `{$table}` DROP INDEX `{$index->INDEX_NAME}`");
                    }
                    
                    // Retry the column conversion
                    DB::statement("ALTER TABLE `{$table}` MODIFY COLUMN `{$column}` JSON NULL");
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to VARCHAR - Note: This will lose non-English translations
        Schema::table('global_skills', function (Blueprint $table) {
            DB::statement('ALTER TABLE global_skills MODIFY COLUMN name VARCHAR(255)');
            DB::statement('ALTER TABLE global_skills MODIFY COLUMN description TEXT NULL');
        });

        Schema::table('global_industries', function (Blueprint $table) {
            DB::statement('ALTER TABLE global_industries MODIFY COLUMN name VARCHAR(255)');
            DB::statement('ALTER TABLE global_industries MODIFY COLUMN description TEXT NULL');
        });

        Schema::table('global_certifications', function (Blueprint $table) {
            DB::statement('ALTER TABLE global_certifications MODIFY COLUMN name VARCHAR(255)');
            DB::statement('ALTER TABLE global_certifications MODIFY COLUMN issuing_authority VARCHAR(255)');
        });

        Schema::table('global_languages', function (Blueprint $table) {
            DB::statement('ALTER TABLE global_languages MODIFY COLUMN name VARCHAR(255)');
        });
    }
};

