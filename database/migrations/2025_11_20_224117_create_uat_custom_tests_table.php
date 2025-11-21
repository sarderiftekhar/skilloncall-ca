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
        if (!Schema::hasTable('uat_custom_tests')) {
            Schema::create('uat_custom_tests', function (Blueprint $table) {
                $table->id();
                $table->string('tester_name');
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->foreignId('tester_session_id')->nullable()->constrained('uat_tester_sessions')->onDelete('set null');
                $table->string('section_name');
                $table->text('what_is_tested');
                $table->text('result_or_feedback')->nullable();
                $table->string('page_url')->nullable();
                $table->json('screenshots')->nullable();
                $table->timestamps();
                
                $table->index('tester_name');
                $table->index('user_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uat_custom_tests');
    }
};
