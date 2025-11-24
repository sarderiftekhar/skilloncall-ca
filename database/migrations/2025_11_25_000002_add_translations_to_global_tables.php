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
        // Convert GlobalSkills to support translations
        Schema::table('global_skills', function (Blueprint $table) {
            // Store existing English data
            DB::statement('ALTER TABLE global_skills MODIFY COLUMN name JSON');
            DB::statement('ALTER TABLE global_skills MODIFY COLUMN description JSON NULL');
        });

        // Convert GlobalIndustries to support translations
        Schema::table('global_industries', function (Blueprint $table) {
            DB::statement('ALTER TABLE global_industries MODIFY COLUMN name JSON');
            DB::statement('ALTER TABLE global_industries MODIFY COLUMN description JSON NULL');
        });

        // Convert GlobalCertifications to support translations
        Schema::table('global_certifications', function (Blueprint $table) {
            DB::statement('ALTER TABLE global_certifications MODIFY COLUMN name JSON');
            DB::statement('ALTER TABLE global_certifications MODIFY COLUMN issuing_authority JSON');
        });

        // Convert GlobalLanguages to support translations
        Schema::table('global_languages', function (Blueprint $table) {
            DB::statement('ALTER TABLE global_languages MODIFY COLUMN name JSON');
        });

        // Note: GlobalProvince and GlobalCity will use translation files instead
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

