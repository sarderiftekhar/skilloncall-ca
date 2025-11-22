<?php

namespace App\Console\Commands;

use App\Models\SubscriptionPlan;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ListSubscriptionPlans extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'paddle:list-plans';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List all subscription plans and their Paddle mappings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('📋 Subscription Plans');
        $this->newLine();

        $plans = SubscriptionPlan::orderBy('type')->orderBy('price')->get();

        $tableData = [];

        foreach ($plans as $plan) {
            $mapping = DB::table('paddle_products')
                ->where('subscription_plan_id', $plan->id)
                ->where('environment', config('cashier.sandbox') ? 'sandbox' : 'production')
                ->first();

            $tableData[] = [
                $plan->id,
                $plan->name,
                $plan->type,
                '$' . number_format($plan->price, 2),
                $mapping ? '✓' : '✗',
                $mapping ? substr($mapping->paddle_product_id, 0, 20) . '...' : 'Not mapped',
            ];
        }

        $this->table(
            ['ID', 'Plan Name', 'Type', 'Price', 'Mapped', 'Paddle Product ID'],
            $tableData
        );

        $this->newLine();
        $this->info('Environment: ' . (config('cashier.sandbox') ? 'Sandbox' : 'Production'));
        
        $unmapped = $plans->filter(function ($plan) {
            return !DB::table('paddle_products')
                ->where('subscription_plan_id', $plan->id)
                ->where('environment', config('cashier.sandbox') ? 'sandbox' : 'production')
                ->exists();
        });

        if ($unmapped->count() > 0) {
            $this->newLine();
            $this->warn("⚠ {$unmapped->count()} plan(s) not mapped to Paddle");
        }

        return 0;
    }
}

