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
        if (!Schema::hasTable('uat_tester_sessions')) {
            Schema::create('uat_tester_sessions', function (Blueprint $table) {
                $table->id();
                $table->string('tester_name');
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->timestamp('session_start');
                $table->timestamp('session_end')->nullable();
                $table->date('date');
                $table->boolean('is_active')->default(true);
                $table->integer('total_time_seconds')->default(0);
                $table->integer('tests_completed')->default(0);
                $table->integer('tests_passed')->default(0);
                $table->integer('tests_failed')->default(0);
                $table->timestamps();
                
                $table->index('tester_name');
                $table->index('is_active');
                $table->index('date');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uat_tester_sessions');
    }
};
