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
        if (!Schema::hasTable('uat_test_time_logs')) {
            Schema::create('uat_test_time_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('tester_session_id')->constrained('uat_tester_sessions')->onDelete('cascade');
                $table->string('test_id');
                $table->enum('action', ['started', 'completed', 'status_changed']);
                $table->timestamp('timestamp');
                $table->timestamps();
                
                $table->index('tester_session_id');
                $table->index('test_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uat_test_time_logs');
    }
};
