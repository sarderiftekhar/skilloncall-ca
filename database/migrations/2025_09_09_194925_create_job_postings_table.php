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
        if (!Schema::hasTable('job_postings')) {
            Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employer_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('category');
            $table->decimal('budget', 10, 2);
            $table->datetime('deadline')->nullable();
            $table->json('required_skills')->nullable();
            $table->string('location')->nullable();
            $table->enum('job_type', ['full_time', 'part_time', 'contract', 'freelance']);
            $table->enum('experience_level', ['entry', 'intermediate', 'expert']);
            $table->enum('status', ['draft', 'active', 'completed', 'cancelled', 'rejected'])->default('draft');
            $table->datetime('published_at')->nullable();
            $table->integer('views_count')->default(0);
            $table->integer('applications_count')->default(0);
            $table->enum('payment_status', ['pending', 'completed'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['status', 'published_at']);
            $table->index(['category', 'status']);
            $table->index('employer_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
