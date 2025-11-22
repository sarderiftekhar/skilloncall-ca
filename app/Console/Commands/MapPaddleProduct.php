<?php

namespace App\Console\Commands;

use App\Models\SubscriptionPlan;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MapPaddleProduct extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'paddle:map-product 
                            {plan_name : The name of the local subscription plan}
                            {paddle_product_id : The Paddle product ID (pro_xxxxx)}
                            {paddle_price_monthly : The Paddle monthly price ID (pri_xxxxx)}
                            {paddle_price_yearly : The Paddle yearly price ID (pri_xxxxx)}
                            {--environment=sandbox : Environment (sandbox or production)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Map a local subscription plan to Paddle product and price IDs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $planName = $this->argument('plan_name');
        $paddleProductId = $this->argument('paddle_product_id');
        $paddlePriceMonthly = $this->argument('paddle_price_monthly');
        $paddlePriceYearly = $this->argument('paddle_price_yearly');
        $environment = $this->option('environment');

        // Find the local subscription plan
        $plan = SubscriptionPlan::where('name', 'LIKE', "%{$planName}%")->first();

        if (!$plan) {
            $this->error("Subscription plan '{$planName}' not found!");
            $this->info("Available plans:");
            SubscriptionPlan::all()->each(function ($p) {
                $this->line("  - {$p->name} (ID: {$p->id}, Type: {$p->type})");
            });
            return 1;
        }

        $this->info("Found plan: {$plan->name} (ID: {$plan->id})");

        // Check if mapping already exists
        $existing = DB::table('paddle_products')
            ->where('subscription_plan_id', $plan->id)
            ->where('environment', $environment)
            ->first();

        if ($existing) {
            $this->warn("Mapping already exists for this plan in {$environment} environment!");
            if (!$this->confirm('Do you want to update it?')) {
                return 0;
            }

            DB::table('paddle_products')
                ->where('id', $existing->id)
                ->update([
                    'paddle_product_id' => $paddleProductId,
                    'paddle_price_id_monthly' => $paddlePriceMonthly,
                    'paddle_price_id_yearly' => $paddlePriceYearly,
                    'updated_at' => now(),
                ]);

            $this->info("✓ Updated Paddle product mapping!");
        } else {
            DB::table('paddle_products')->insert([
                'subscription_plan_id' => $plan->id,
                'paddle_product_id' => $paddleProductId,
                'paddle_price_id_monthly' => $paddlePriceMonthly,
                'paddle_price_id_yearly' => $paddlePriceYearly,
                'environment' => $environment,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->info("✓ Created Paddle product mapping!");
        }

        $this->newLine();
        $this->table(
            ['Field', 'Value'],
            [
                ['Plan Name', $plan->name],
                ['Plan ID', $plan->id],
                ['Paddle Product ID', $paddleProductId],
                ['Monthly Price ID', $paddlePriceMonthly],
                ['Yearly Price ID', $paddlePriceYearly],
                ['Environment', $environment],
            ]
        );

        return 0;
    }
}

