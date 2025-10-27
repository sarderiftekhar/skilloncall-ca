<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\EmailService;

class SendTestEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test {email=sarder2008@gmail.com}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test email to verify Resend integration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info("Sending subscription system test email to: {$email}");
        $this->line("");
        
        try {
            // Check if Resend API key is configured
            $apiKey = config('services.resend.key');
            if (empty($apiKey)) {
                $this->error("❌ ERROR: Resend API key is not configured!");
                $this->warn("💡 Please add RESEND_API_KEY to your .env file");
                return Command::FAILURE;
            }
            
            $this->info("🔑 Resend API key found: " . substr($apiKey, 0, 10) . "...");
            
            $emailService = new EmailService();
            
            // Create a custom test email data for the subscription system
            $testData = [
                'name' => 'SkillOnCall.ca System Test',
                'email' => $email,
                'phone' => '+1 (555) 123-4567',
                'message' => '🎉 SUBSCRIPTION SYSTEM IMPLEMENTATION COMPLETE! 🎉

Great news! The comprehensive subscription system for SkillOnCall.ca has been successfully implemented and is now fully operational.

✅ What\'s Been Built:
• Employer Plans: Starter (Free), Professional ($49.99/mo), Enterprise ($149.99/mo)
• Worker Plans: Basic (Free), Pro Worker ($19.99/mo), Premium Worker ($39.99/mo)
• Features: Usage tracking, billing intervals, plan upgrades, analytics
• API Endpoints: Subscribe, cancel, change plans, usage statistics
• Database: Complete subscription management system

🎯 Key Features:
• Role-based subscription plans (Employers vs Workers)
• Usage limits and feature tracking
• Monthly/yearly billing with 20% yearly discounts
• Prorated billing for plan changes
• Automatic subscription management
• Comprehensive analytics and reporting
• Email notifications via Resend integration

🚀 Ready for Production!
The subscription system is enterprise-ready and can be integrated with payment processors like Stripe or PayPal. All database tables, models, services, and API endpoints are fully functional.

This is a test email from SkillOnCall.ca - Subscription System Implementation Complete!'
            ];
            
            $result = $emailService->sendContactFormEmail($testData);
            
            if ($result) {
                $this->info("✅ SUCCESS: Subscription system test email sent successfully!");
                $this->info("📧 Sent to: {$email}");
                $this->info("📬 Subject: New Contact Form Submission from SkillOnCall.ca");
                $this->line("");
                $this->info("🎉 The subscription system test email has been delivered!");
                $this->info("💡 Check your inbox at {$email} for the detailed subscription system report.");
                
                return Command::SUCCESS;
            } else {
                $this->error("❌ ERROR: Failed to send email - EmailService returned false");
                return Command::FAILURE;
            }
            
        } catch (\Exception $e) {
            $this->error("❌ ERROR: Failed to send subscription system test email");
            $this->error("Error message: " . $e->getMessage());
            $this->line("");
            $this->warn("💡 Make sure your Resend API key is properly configured in the .env file");
            
            return Command::FAILURE;
        }
    }
}