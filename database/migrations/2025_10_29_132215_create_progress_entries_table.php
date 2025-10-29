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
        Schema::create('progress_entries', function (Blueprint $table) {
            $table->id();
            $table->string('project')->index();
            $table->string('main_section');
            $table->string('feature_section')->nullable();
            $table->text('conditions_applied')->nullable();
            $table->enum('designed', ['YES', 'NO', 'PENDING'])->default('PENDING');
            $table->enum('testing', ['YES', 'NO', 'PENDING'])->default('PENDING');
            $table->enum('debug', ['YES', 'NO', 'PENDING'])->default('PENDING');
            $table->enum('confirm', ['YES', 'NO', 'PENDING'])->default('PENDING');
            $table->enum('uat', ['YES', 'NO', 'PENDING'])->default('PENDING');
            $table->text('notes_comments')->nullable();
            $table->string('page_url_link')->nullable();
            $table->json('screenshots_pictures')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('progress_entries');
    }
};
