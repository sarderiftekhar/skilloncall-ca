<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Global Skills Table
        if (!Schema::hasTable('global_skills')) {
            Schema::create('global_skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category');
            $table->text('description')->nullable();
            $table->boolean('requires_certification')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->index(['category', 'is_active']);
            $table->index('name');
            });
        }

        // Global Industries Table
        if (!Schema::hasTable('global_industries')) {
            Schema::create('global_industries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->index(['category', 'is_active']);
            $table->index('name');
            });
        }

        // Global Languages Table
        if (!Schema::hasTable('global_languages')) {
            Schema::create('global_languages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 10); // ISO 639-1 codes (en, fr, es, etc.)
            $table->boolean('is_official_canada')->default(false); // English/French
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->index(['is_official_canada', 'is_active']);
            $table->index('code');
            });
        }

        // Global Certifications Table (Canadian specific)
        if (!Schema::hasTable('global_certifications')) {
            Schema::create('global_certifications', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('issuing_authority');
            $table->string('skill_category');
            $table->string('province')->nullable(); // Some certs are provincial
            $table->boolean('is_required')->default(false); // mandatory vs optional
            $table->boolean('has_expiry')->default(false);
            $table->integer('validity_years')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['skill_category', 'province', 'is_active'], 'global_cert_category_prov_active_idx');
            });
        }

        // Canadian Postal Codes (sample data for major cities)
        if (!Schema::hasTable('global_postal_codes')) {
            Schema::create('global_postal_codes', function (Blueprint $table) {
            $table->id();
            $table->string('postal_code', 7); // K1A 0A6 format
            $table->string('city');
            $table->string('province');
            $table->string('country')->default('Canada');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('postal_code');
            $table->index(['city', 'province']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('global_postal_codes');
        Schema::dropIfExists('global_certifications');
        Schema::dropIfExists('global_languages');
        Schema::dropIfExists('global_industries');
        Schema::dropIfExists('global_skills');
    }
};


