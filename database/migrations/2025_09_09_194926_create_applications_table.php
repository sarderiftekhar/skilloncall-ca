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
        if (!Schema::hasTable('applications')) {
            Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained('job_postings')->onDelete('cascade');
            $table->foreignId('worker_id')->constrained('users')->onDelete('cascade');
            $table->text('cover_letter')->nullable();
            $table->decimal('proposed_rate', 8, 2)->nullable();
            $table->integer('estimated_duration')->nullable(); // in hours
            $table->enum('status', ['pending', 'accepted', 'rejected', 'withdrawn', 'completed', 'cancelled'])->default('pending');
            $table->datetime('applied_at')->nullable();
            $table->datetime('accepted_at')->nullable();
            $table->datetime('rejected_at')->nullable();
            $table->datetime('completed_at')->nullable();
            $table->datetime('withdrawn_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['job_id', 'worker_id']);
            $table->index(['worker_id', 'status']);
            $table->index(['job_id', 'status']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
