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
        if (!Schema::hasTable('reviews')) {
            Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained('job_postings')->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('reviewee_id')->constrained('users')->onDelete('cascade');
            $table->integer('rating')->unsigned(); // 1-5 stars
            $table->text('comment')->nullable();
            $table->foreignId('application_id')->nullable()->after('job_id')->constrained('applications')->onDelete('cascade');
            $table->enum('type', ['employer_to_employee', 'employee_to_employer']);
            $table->timestamps();
            
            $table->unique(['application_id', 'reviewer_id', 'reviewee_id'], 'reviews_application_reviewer_reviewee_unique');
            $table->index(['reviewee_id', 'rating']);
            $table->index(['application_id']);
            $table->index(['reviewer_id', 'type']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
