<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\EmailService;

class TestNewsletterEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'newsletter:test-email {email=sarder2008@gmail.com}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test newsletter confirmation email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info("Sending newsletter confirmation test email...");
        $this->info("📧 Email: {$email}");
        $this->line("");
        
        try {
            $emailService = new EmailService();
            
            // Sample newsletter confirmation data
            $newsletterData = [
                'email' => $email,
                'name' => 'Newsletter Subscriber'
            ];
            
            $result = $emailService->sendNewsletterConfirmation($newsletterData);
            
            if ($result) {
                $this->info("✅ SUCCESS: Newsletter confirmation email sent successfully!");
                $this->info("📧 Sent to: {$email}");
                $this->info("📬 Subject: 📧 Welcome to SkillOnCall.ca Newsletter!");
                $this->line("");
                $this->info("🎉 The newsletter confirmation email has been delivered!");
                $this->info("💡 Check your inbox at {$email} for the welcome message.");
                $this->line("");
                $this->info("📋 Email includes:");
                $this->info("   • Welcome message and community introduction");
                $this->info("   • List of what subscribers will receive");
                $this->info("   • Getting started tips for job seekers and employers");
                $this->info("   • Direct link to explore the platform");
                $this->info("   • Support contact information");
                
                return Command::SUCCESS;
            } else {
                $this->error("❌ ERROR: Failed to send newsletter confirmation email");
                return Command::FAILURE;
            }
            
        } catch (\Exception $e) {
            $this->error("❌ ERROR: Failed to send newsletter confirmation email");
            $this->error("Error message: " . $e->getMessage());
            $this->line("");
            $this->warn("💡 Make sure your Resend API key is properly configured");
            
            return Command::FAILURE;
        }
    }
}