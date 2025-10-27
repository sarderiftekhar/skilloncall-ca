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
        Schema::table('worker_profiles', function (Blueprint $table) {
            $table->foreignId('global_province_id')->nullable()->after('postal_code')->constrained('global_provinces')->onDelete('set null');
            $table->foreignId('global_city_id')->nullable()->after('global_province_id')->constrained('global_cities')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('worker_profiles', function (Blueprint $table) {
            $table->dropForeign(['global_province_id']);
            $table->dropForeign(['global_city_id']);
            $table->dropColumn(['global_province_id', 'global_city_id']);
        });
    }
};
