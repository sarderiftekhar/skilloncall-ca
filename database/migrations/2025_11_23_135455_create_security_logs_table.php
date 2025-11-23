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
        Schema::create('security_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('event_type', 50)->index(); // failed_login, contact_reveal, profile_view, etc.
            $table->string('severity', 20)->default('info'); // info, warning, critical
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->json('metadata')->nullable(); // Additional event data
            $table->text('description')->nullable();
            $table->timestamp('created_at')->index();
            
            // Indexes for common queries
            $table->index(['event_type', 'created_at']);
            $table->index(['severity', 'created_at']);
            $table->index('ip_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('security_logs');
    }
};
