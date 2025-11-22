<?php

namespace App\Console\Commands;

use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Laravel\Paddle\Transaction;

class SyncPaddleTransactions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'paddle:sync-transactions {--force : Force sync even if payment exists}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync Paddle transactions to payments table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Syncing Paddle transactions to payments table...');

        $transactions = Transaction::where('status', 'completed')
            ->orWhere('status', 'processing')
            ->get();

        if ($transactions->isEmpty()) {
            $this->warn('No transactions found.');
            return Command::SUCCESS;
        }

        $this->info("Found {$transactions->count()} transactions to sync.");

        $synced = 0;
        $skipped = 0;
        $errors = 0;

        foreach ($transactions as $transaction) {
            try {
                // Check if payment already exists
                $existingPayment = Payment::where('transaction_id', $transaction->paddle_id)
                    ->where('type', 'subscription')
                    ->first();

                if ($existingPayment && !$this->option('force')) {
                    $this->line("  ⏭ Skipping transaction {$transaction->paddle_id} (already exists)");
                    $skipped++;
                    continue;
                }

                $user = $transaction->billable;

                if (!$user) {
                    $this->warn("  ⚠ No billable user found for transaction {$transaction->paddle_id}");
                    $errors++;
                    continue;
                }

                // Find subscription
                $subscription = Subscription::where('user_id', $user->id)
                    ->where(function($query) use ($transaction) {
                        $query->where('paddle_subscription_id', $transaction->paddle_subscription_id)
                              ->orWhere('payment_id', $transaction->paddle_id);
                    })
                    ->latest()
                    ->first();

                // Convert amounts
                $amount = (float) str_replace(',', '', $transaction->total);
                $tax = (float) str_replace(',', '', $transaction->tax ?? '0');
                $netAmount = $amount - $tax;

                // Create or update payment
                $paymentData = [
                    'subscription_id' => $subscription?->id,
                    'payer_id' => $user->id,
                    'payee_id' => null,
                    'amount' => $amount,
                    'commission_amount' => 0,
                    'net_amount' => $netAmount,
                    'currency' => $transaction->currency ?? 'CAD',
                    'status' => $transaction->status === 'completed' ? 'completed' : 'processing',
                    'type' => 'subscription',
                    'payment_method' => 'paddle',
                    'transaction_id' => $transaction->paddle_id,
                    'processed_at' => $transaction->billed_at ?? now(),
                    'notes' => 'Subscription payment for ' . ($subscription?->plan?->name ?? 'Unknown Plan'),
                ];

                if ($existingPayment && $this->option('force')) {
                    $existingPayment->update($paymentData);
                    $this->line("  ✅ Updated payment for transaction {$transaction->paddle_id}");
                } else {
                    Payment::create($paymentData);
                    $this->line("  ✅ Created payment for transaction {$transaction->paddle_id}");
                }

                $synced++;
            } catch (\Exception $e) {
                $this->error("  ❌ Error syncing transaction {$transaction->paddle_id}: {$e->getMessage()}");
                $errors++;
            }
        }

        $this->newLine();
        $this->info("Sync complete!");
        $this->line("  ✅ Synced: {$synced}");
        $this->line("  ⏭ Skipped: {$skipped}");
        if ($errors > 0) {
            $this->line("  ❌ Errors: {$errors}");
        }

        return Command::SUCCESS;
    }
}
