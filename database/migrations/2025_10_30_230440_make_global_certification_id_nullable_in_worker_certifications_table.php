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
        Schema::table('worker_certifications', function (Blueprint $table) {
            // Make global_certification_id nullable to allow custom certifications
            $table->foreignId('global_certification_id')->nullable()->change();
            
            // Add fields for custom certifications
            $table->string('name')->nullable()->after('global_certification_id');
            $table->string('issuing_organization')->nullable()->after('name');
            $table->string('credential_id')->nullable()->after('certificate_number');
            $table->string('verification_url')->nullable()->after('credential_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('worker_certifications', function (Blueprint $table) {
            // Drop custom certification fields
            $table->dropColumn(['name', 'issuing_organization', 'credential_id', 'verification_url']);
            
            // Make global_certification_id required again
            $table->foreignId('global_certification_id')->nullable(false)->change();
        });
    }
};
