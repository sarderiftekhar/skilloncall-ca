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
        Schema::create('exception_logs', function (Blueprint $table) {
            $table->id();
            $table->string('exception_class')->nullable();
            $table->string('message', 1000)->nullable();
            $table->text('trace')->nullable();
            $table->string('file')->nullable();
            $table->integer('line')->nullable();
            $table->text('request_url')->nullable();
            $table->string('request_method', 10)->nullable();
            $table->json('request_payload')->nullable();
            $table->json('headers')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exception_logs');
    }
};

