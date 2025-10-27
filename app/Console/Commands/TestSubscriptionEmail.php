<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\EmailService;

class TestSubscriptionEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscription:test-email {email=sarder2008@gmail.com} {plan=Professional}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test subscription confirmation email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $planName = $this->argument('plan');
        
        $this->info("Sending subscription confirmation test email...");
        $this->info("📧 Email: {$email}");
        $this->info("📋 Plan: {$planName}");
        $this->line("");
        
        try {
            $emailService = new EmailService();
            
            // Sample subscription confirmation data
            $subscriptionData = [
                'user_name' => 'Test User',
                'user_email' => $email,
                'plan_name' => $planName,
                'amount' => '$49.99/month',
                'billing_interval' => 'monthly',
                'next_billing_date' => now()->addMonth()->format('M j, Y'),
                'features' => [
                    '15 job posts per month',
                    '3 featured job listings',
                    'Advanced worker search',
                    'Priority messaging',
                    'Analytics dashboard',
                    'Priority support',
                    'Team collaboration tools'
                ]
            ];
            
            $result = $emailService->sendSubscriptionConfirmation($subscriptionData);
            
            if ($result) {
                $this->info("✅ SUCCESS: Subscription confirmation email sent successfully!");
                $this->info("📧 Sent to: {$email}");
                $this->info("📬 Subject: 🎉 Subscription Confirmed - Welcome to {$planName}!");
                $this->line("");
                $this->info("🎉 The subscription confirmation email has been delivered!");
                $this->info("💡 Check your inbox at {$email} for the confirmation.");
                $this->line("");
                $this->info("📋 Email includes:");
                $this->info("   • Subscription details and billing information");
                $this->info("   • Complete list of plan features");
                $this->info("   • Getting started guide");
                $this->info("   • Direct link to dashboard");
                $this->info("   • Support contact information");
                
                return Command::SUCCESS;
            } else {
                $this->error("❌ ERROR: Failed to send subscription confirmation email");
                return Command::FAILURE;
            }
            
        } catch (\Exception $e) {
            $this->error("❌ ERROR: Failed to send subscription confirmation email");
            $this->error("Error message: " . $e->getMessage());
            $this->line("");
            $this->warn("💡 Make sure your Resend API key is properly configured");
            
            return Command::FAILURE;
        }
    }
}