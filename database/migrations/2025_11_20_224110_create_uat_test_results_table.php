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
        if (!Schema::hasTable('uat_test_results')) {
            Schema::create('uat_test_results', function (Blueprint $table) {
                $table->id();
                $table->string('test_id')->unique();
                $table->string('category');
                $table->string('feature');
                $table->text('scenario');
                $table->text('steps')->nullable();
                $table->text('expected_result');
                $table->json('expected_outcomes')->nullable();
                $table->text('observed_outcome')->nullable();
                $table->integer('sequence_index')->nullable();
                $table->string('flow_group')->nullable();
                $table->enum('test_status', ['not_tested', 'pass', 'fail', 'blocked'])->default('not_tested');
                $table->boolean('issue_resolved')->default(false);
                $table->text('actual_result')->nullable();
                $table->text('notes')->nullable();
                $table->json('screenshots')->nullable();
                $table->string('tested_by')->nullable();
                $table->timestamp('tested_at')->nullable();
                $table->timestamps();
                
                $table->index('category');
                $table->index('test_status');
                $table->index('test_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uat_test_results');
    }
};
