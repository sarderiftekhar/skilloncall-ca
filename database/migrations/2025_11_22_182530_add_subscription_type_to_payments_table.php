<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Make payee_id nullable for subscription payments (platform receives payment, no payee)
            $table->foreignId('payee_id')->nullable()->change();
            
            // Add subscription_id to link subscription payments to subscriptions
            $table->foreignId('subscription_id')->nullable()->after('job_id')->constrained('subscriptions')->onDelete('set null');
        });

        // Modify enum to include 'subscription' type
        DB::statement("ALTER TABLE payments MODIFY COLUMN type ENUM('job_payment', 'refund', 'bonus', 'fee', 'subscription') DEFAULT 'job_payment'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['subscription_id']);
            $table->dropColumn('subscription_id');
            
            // Revert payee_id to not nullable (but this might fail if there are subscription payments)
            // $table->foreignId('payee_id')->nullable(false)->change();
        });

        // Revert enum (remove subscription type)
        DB::statement("ALTER TABLE payments MODIFY COLUMN type ENUM('job_payment', 'refund', 'bonus', 'fee') DEFAULT 'job_payment'");
    }
};
