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
        Schema::table('worker_availability', function (Blueprint $table) {
            // Add effective_month column to track which month the availability applies to
            $table->string('effective_month', 7)->after('worker_profile_id')->nullable();
        });

        // Set default effective_month for existing records to current month
        $currentMonth = now()->format('Y-m');
        DB::table('worker_availability')
            ->whereNull('effective_month')
            ->update(['effective_month' => $currentMonth]);

        // Make the column non-nullable after setting defaults
        Schema::table('worker_availability', function (Blueprint $table) {
            $table->string('effective_month', 7)->nullable(false)->change();
            
            // Add composite unique index to prevent duplicates
            $table->unique(['worker_profile_id', 'day_of_week', 'effective_month'], 'worker_availability_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('worker_availability', function (Blueprint $table) {
            $table->dropUnique('worker_availability_unique');
            $table->dropColumn('effective_month');
        });
    }
};
