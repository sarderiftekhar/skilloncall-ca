<?php

namespace App\Services;

use Resend\Laravel\Facades\Resend;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use App\Jobs\SendEmailJob;

class EmailService
{
    /**
     * Send contact form email (queued for better performance)
     */
    public function sendContactFormEmail(array $data): bool
    {
        try {
            // Dispatch email to queue instead of sending synchronously
            SendEmailJob::dispatch($data, 'contact');

            Log::info('Contact form email queued successfully', [
                'to' => $data['email'],
                'queued_at' => now()
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to queue contact form email', [
                'error' => $e->getMessage(),
                'error_class' => get_class($e),
                'data' => $data
            ]);

            // Fallback: try to send directly with timeout
            return $this->sendEmailDirectlyWithTimeout([
                'from' => 'SkillOnCall <onboarding@resend.dev>',
                'to' => [$data['email']],
                'subject' => '🎉 Contact Form Received - SkillOnCall.ca',
                'html' => $this->buildContactEmailHtml($data),
                'text' => $this->buildContactEmailText($data),
            ], 'contact', $data['email']);
        }
    }

    /**
     * Send newsletter subscription confirmation email (queued)
     */
    public function sendNewsletterConfirmation(array $data): bool
    {
        try {
            // Dispatch to low priority queue since it's not urgent
            SendEmailJob::dispatch($data, 'newsletter');

            Log::info('Newsletter confirmation email queued successfully', [
                'to' => $data['email'],
                'queued_at' => now()
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to queue newsletter confirmation email', [
                'error' => $e->getMessage(),
                'error_class' => get_class($e),
                'data' => $data
            ]);

            // Fallback: try to send directly with timeout
            return $this->sendEmailDirectlyWithTimeout([
                'from' => 'SkillOnCall <onboarding@resend.dev>',
                'to' => [$data['email']],
                'subject' => '📧 Welcome to SkillOnCall.ca Newsletter!',
                'html' => $this->buildNewsletterConfirmationHtml($data),
                'text' => $this->buildNewsletterConfirmationText($data),
            ], 'newsletter', $data['email']);
        }
    }

    /**
     * Send subscription confirmation email
     */
    public function sendSubscriptionConfirmation(array $data): bool
    {
        try {
            $result = Resend::emails()->send([
                'from' => 'SkillOnCall <onboarding@resend.dev>',
                'to' => [$data['user_email']],
                'subject' => '🎉 Subscription Confirmed - Welcome to ' . $data['plan_name'] . '!',
                'html' => $this->buildSubscriptionConfirmationHtml($data),
                'text' => $this->buildSubscriptionConfirmationText($data),
            ]);

            Log::info('Subscription confirmation email sent successfully', [
                'email_id' => $result['id'] ?? null,
                'to' => $data['user_email'],
                'plan' => $data['plan_name']
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send subscription confirmation email', [
                'error' => $e->getMessage(),
                'error_class' => get_class($e),
                'trace' => $e->getTraceAsString(),
                'data' => $data
            ]);

            if (app()->runningInConsole()) {
                echo "Subscription Email Error: " . $e->getMessage() . "\n";
            }

            return false;
        }
    }

    /**
     * Send welcome email to new users (queued with high priority)
     */
    public function sendWelcomeEmail(string $userEmail, string $userName): bool
    {
        try {
            $data = [
                'email' => $userEmail,
                'name' => $userName
            ];
            
            // Dispatch to high priority queue since it's part of registration flow
            SendEmailJob::dispatch($data, 'welcome');

            Log::info('Welcome email queued successfully', [
                'to' => $userEmail,
                'queued_at' => now()
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to queue welcome email', [
                'error' => $e->getMessage(),
                'to' => $userEmail
            ]);

            // Fallback: try to send directly with timeout
            return $this->sendEmailDirectlyWithTimeout([
                'from' => 'welcome@skilloncall.ca',
                'to' => [$userEmail],
                'subject' => 'Welcome to SkillOnCall.ca!',
                'html' => $this->buildWelcomeEmailHtml($userName),
                'text' => $this->buildWelcomeEmailText($userName),
            ], 'welcome', $userEmail);
        }
    }

    /**
     * Send email directly with timeout protection (fallback method)
     */
    private function sendEmailDirectlyWithTimeout(array $emailData, string $emailType, string $recipient): bool
    {
        try {
            // Set timeout for HTTP client used by Resend
            $oldTimeout = ini_get('default_socket_timeout');
            ini_set('default_socket_timeout', 10); // 10 second timeout
            
            $result = Resend::emails()->send($emailData);
            
            // Restore original timeout
            ini_set('default_socket_timeout', $oldTimeout);

            Log::info('Email sent directly (fallback)', [
                'email_type' => $emailType,
                'email_id' => $result['id'] ?? null,
                'to' => $recipient
            ]);

            return true;
        } catch (\Exception $e) {
            // Restore original timeout in case of exception
            if (isset($oldTimeout)) {
                ini_set('default_socket_timeout', $oldTimeout);
            }
            
            Log::error('Direct email sending failed (fallback)', [
                'email_type' => $emailType,
                'error' => $e->getMessage(),
                'error_class' => get_class($e),
                'to' => $recipient
            ]);

            return false;
        }
    }

    /**
     * Build HTML content for contact form email
     */
    private function buildContactEmailHtml(array $data): string
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <title>New Contact Form Submission</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #10B3D6; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f9f9f9; padding: 20px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #555; }
                .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #10B3D6; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>New Contact Form Submission</h1>
                    <p>SkillOnCall.ca</p>
                </div>
                <div class='content'>
                    <div class='field'>
                        <div class='label'>Name:</div>
                        <div class='value'>" . htmlspecialchars($data['name']) . "</div>
                    </div>
                    <div class='field'>
                        <div class='label'>Email:</div>
                        <div class='value'>" . htmlspecialchars($data['email']) . "</div>
                    </div>
                    " . (!empty($data['phone']) ? "
                    <div class='field'>
                        <div class='label'>Phone:</div>
                        <div class='value'>" . htmlspecialchars($data['phone']) . "</div>
                    </div>
                    " : "") . "
                    <div class='field'>
                        <div class='label'>Message:</div>
                        <div class='value'>" . nl2br(htmlspecialchars($data['message'])) . "</div>
                    </div>
                </div>
                <div class='footer'>
                    <p>This email was sent from the contact form on SkillOnCall.ca</p>
                    <p>Sent on " . now()->format('F j, Y \a\t g:i A T') . "</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    /**
     * Build text content for contact form email
     */
    private function buildContactEmailText(array $data): string
    {
        $text = "New Contact Form Submission - SkillOnCall.ca\n\n";
        $text .= "Name: " . $data['name'] . "\n";
        $text .= "Email: " . $data['email'] . "\n";
        
        if (!empty($data['phone'])) {
            $text .= "Phone: " . $data['phone'] . "\n";
        }
        
        $text .= "\nMessage:\n" . $data['message'] . "\n\n";
        $text .= "---\n";
        $text .= "This email was sent from the contact form on SkillOnCall.ca\n";
        $text .= "Sent on " . now()->format('F j, Y \a\t g:i A T');

        return $text;
    }

    /**
     * Build HTML content for welcome email
     */
    private function buildWelcomeEmailHtml(string $userName): string
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <title>Welcome to SkillOnCall.ca</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #10B3D6; color: white; padding: 30px; text-align: center; }
                .content { background-color: #f9f9f9; padding: 30px; }
                .button { display: inline-block; background-color: #10B3D6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Welcome to SkillOnCall.ca!</h1>
                    <p>Canada's Premier Platform for Skilled Workers</p>
                </div>
                <div class='content'>
                    <h2>Hello " . htmlspecialchars($userName) . "!</h2>
                    <p>Welcome to SkillOnCall.ca! We're excited to have you join our community of skilled workers and Canadian businesses.</p>
                    
                    <p>Here's what you can do next:</p>
                    <ul>
                        <li>Complete your profile to showcase your skills</li>
                        <li>Browse available job opportunities</li>
                        <li>Connect with local businesses in your area</li>
                        <li>Build your reputation through quality work</li>
                    </ul>
                    
                    <p style='text-align: center;'>
                        <a href='https://skilloncall.ca/dashboard' class='button'>Get Started</a>
                    </p>
                    
                    <p>If you have any questions, feel free to contact us at <a href='mailto:contact@skilloncall.ca'>contact@skilloncall.ca</a>.</p>
                    
                    <p>Welcome aboard!</p>
                    <p><strong>The SkillOnCall.ca Team</strong></p>
                </div>
                <div class='footer'>
                    <p>© 2025 SkillOnCall.ca. All rights reserved. Made with 🍁 in Canada.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    /**
     * Build text content for welcome email
     */
    private function buildWelcomeEmailText(string $userName): string
    {
        return "Welcome to SkillOnCall.ca!\n\n" .
               "Hello " . $userName . "!\n\n" .
               "Welcome to SkillOnCall.ca! We're excited to have you join our community of skilled workers and Canadian businesses.\n\n" .
               "Here's what you can do next:\n" .
               "- Complete your profile to showcase your skills\n" .
               "- Browse available job opportunities\n" .
               "- Connect with local businesses in your area\n" .
               "- Build your reputation through quality work\n\n" .
               "Visit your dashboard: https://skilloncall.ca/dashboard\n\n" .
               "If you have any questions, feel free to contact us at contact@skilloncall.ca.\n\n" .
               "Welcome aboard!\n" .
               "The SkillOnCall.ca Team\n\n" .
               "---\n" .
               "© 2025 SkillOnCall.ca. All rights reserved. Made with 🍁 in Canada.";
    }

    /**
     * Build HTML content for subscription confirmation email
     */
    private function buildSubscriptionConfirmationHtml(array $data): string
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <title>Subscription Confirmed - SkillOnCall.ca</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #10B3D6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background-color: #f9f9f9; padding: 30px; }
                .highlight-box { background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B3D6; }
                .feature-list { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .feature-item { display: flex; align-items: center; margin: 10px 0; }
                .checkmark { color: #10B3D6; font-weight: bold; margin-right: 10px; }
                .button { display: inline-block; background-color: #10B3D6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                .price { font-size: 24px; font-weight: bold; color: #10B3D6; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🎉 Subscription Confirmed!</h1>
                    <p>Welcome to SkillOnCall.ca " . htmlspecialchars($data['plan_name']) . "</p>
                </div>
                <div class='content'>
                    <h2>Hello " . htmlspecialchars($data['user_name']) . "!</h2>
                    <p>Thank you for subscribing to SkillOnCall.ca! Your subscription has been successfully activated.</p>
                    
                    <div class='highlight-box'>
                        <h3>📋 Subscription Details</h3>
                        <p><strong>Plan:</strong> " . htmlspecialchars($data['plan_name']) . "</p>
                        <p><strong>Amount:</strong> <span class='price'>" . htmlspecialchars($data['amount']) . "</span></p>
                        <p><strong>Billing:</strong> " . htmlspecialchars($data['billing_interval']) . "</p>
                        <p><strong>Next Billing Date:</strong> " . htmlspecialchars($data['next_billing_date']) . "</p>
                    </div>
                    
                    <div class='feature-list'>
                        <h3>✨ What's Included in Your Plan:</h3>
                        " . $this->buildFeatureList($data['features']) . "
                    </div>
                    
                    <p style='text-align: center;'>
                        <a href='https://skilloncall.ca/dashboard' class='button'>Access Your Dashboard</a>
                    </p>
                    
                    <p><strong>Getting Started:</strong></p>
                    <ul>
                        <li>Complete your profile to maximize your visibility</li>
                        <li>Explore the platform features included in your plan</li>
                        <li>Contact support if you have any questions</li>
                    </ul>
                    
                    <p>Need help? Our support team is here for you at <a href='mailto:support@skilloncall.ca'>support@skilloncall.ca</a></p>
                    
                    <p>Welcome aboard!</p>
                    <p><strong>The SkillOnCall.ca Team</strong></p>
                </div>
                <div class='footer'>
                    <p>© 2025 SkillOnCall.ca. All rights reserved. Made with 🍁 in Canada.</p>
                    <p>You can manage your subscription anytime in your <a href='https://skilloncall.ca/subscription'>account settings</a>.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    /**
     * Build text content for subscription confirmation email
     */
    private function buildSubscriptionConfirmationText(array $data): string
    {
        return "🎉 Subscription Confirmed - SkillOnCall.ca\n\n" .
               "Hello " . $data['user_name'] . "!\n\n" .
               "Thank you for subscribing to SkillOnCall.ca! Your subscription has been successfully activated.\n\n" .
               "📋 Subscription Details:\n" .
               "Plan: " . $data['plan_name'] . "\n" .
               "Amount: " . $data['amount'] . "\n" .
               "Billing: " . $data['billing_interval'] . "\n" .
               "Next Billing Date: " . $data['next_billing_date'] . "\n\n" .
               "✨ What's Included in Your Plan:\n" .
               $this->buildFeatureListText($data['features']) . "\n\n" .
               "Getting Started:\n" .
               "- Complete your profile to maximize your visibility\n" .
               "- Explore the platform features included in your plan\n" .
               "- Contact support if you have any questions\n\n" .
               "Access your dashboard: https://skilloncall.ca/dashboard\n\n" .
               "Need help? Contact us at support@skilloncall.ca\n\n" .
               "Welcome aboard!\n" .
               "The SkillOnCall.ca Team\n\n" .
               "---\n" .
               "© 2025 SkillOnCall.ca. All rights reserved. Made with 🍁 in Canada.\n" .
               "Manage your subscription: https://skilloncall.ca/subscription";
    }

    /**
     * Build feature list HTML
     */
    private function buildFeatureList(array $features): string
    {
        $html = '';
        foreach ($features as $feature) {
            $html .= "<div class='feature-item'><span class='checkmark'>✓</span> " . htmlspecialchars($feature) . "</div>";
        }
        return $html;
    }

    /**
     * Build feature list text
     */
    private function buildFeatureListText(array $features): string
    {
        $text = '';
        foreach ($features as $feature) {
            $text .= "✓ " . $feature . "\n";
        }
        return $text;
    }

    /**
     * Build HTML content for newsletter confirmation email
     */
    private function buildNewsletterConfirmationHtml(array $data): string
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <title>Welcome to SkillOnCall.ca Newsletter</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #10B3D6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background-color: #f9f9f9; padding: 30px; }
                .highlight-box { background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B3D6; }
                .feature-list { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .feature-item { display: flex; align-items: center; margin: 10px 0; }
                .checkmark { color: #10B3D6; font-weight: bold; margin-right: 10px; }
                .button { display: inline-block; background-color: #10B3D6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>📧 Welcome to Our Newsletter!</h1>
                    <p>Thank you for joining the SkillOnCall.ca community</p>
                </div>
                <div class='content'>
                    <h2>Hello!</h2>
                    <p>Thank you for subscribing to the SkillOnCall.ca newsletter! We're excited to keep you updated with the latest opportunities and platform news.</p>
                    
                    <div class='highlight-box'>
                        <h3>📬 What You'll Receive:</h3>
                        <div class='feature-list'>
                            <div class='feature-item'><span class='checkmark'>✓</span> New job opportunities in your area</div>
                            <div class='feature-item'><span class='checkmark'>✓</span> Platform updates and new features</div>
                            <div class='feature-item'><span class='checkmark'>✓</span> Industry news and trends</div>
                            <div class='feature-item'><span class='checkmark'>✓</span> Success stories from our community</div>
                            <div class='feature-item'><span class='checkmark'>✓</span> Tips for job seekers and employers</div>
                            <div class='feature-item'><span class='checkmark'>✓</span> Exclusive promotions and offers</div>
                        </div>
                    </div>
                    
                    <p style='text-align: center;'>
                        <a href='https://skilloncall.ca' class='button'>Explore SkillOnCall.ca</a>
                    </p>
                    
                    <p><strong>Ready to get started?</strong></p>
                    <ul>
                        <li><strong>Job Seekers:</strong> Create your profile and start browsing opportunities</li>
                        <li><strong>Employers:</strong> Post your first job and find skilled workers</li>
                        <li><strong>Stay Connected:</strong> Follow us for daily updates and tips</li>
                    </ul>
                    
                    <p>Questions? Reply to this email or contact us at <a href='mailto:support@skilloncall.ca'>support@skilloncall.ca</a></p>
                    
                    <p>Welcome to the community!</p>
                    <p><strong>The SkillOnCall.ca Team</strong></p>
                </div>
                <div class='footer'>
                    <p>© 2025 SkillOnCall.ca. All rights reserved. Made with 🍁 in Canada.</p>
                    <p>You're receiving this because you subscribed to our newsletter at SkillOnCall.ca</p>
                    <p>Don't want to receive these emails? <a href='#'>Unsubscribe here</a></p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    /**
     * Build text content for newsletter confirmation email
     */
    private function buildNewsletterConfirmationText(array $data): string
    {
        return "📧 Welcome to SkillOnCall.ca Newsletter!\n\n" .
               "Hello!\n\n" .
               "Thank you for subscribing to the SkillOnCall.ca newsletter! We're excited to keep you updated with the latest opportunities and platform news.\n\n" .
               "📬 What You'll Receive:\n" .
               "✓ New job opportunities in your area\n" .
               "✓ Platform updates and new features\n" .
               "✓ Industry news and trends\n" .
               "✓ Success stories from our community\n" .
               "✓ Tips for job seekers and employers\n" .
               "✓ Exclusive promotions and offers\n\n" .
               "Ready to get started?\n" .
               "• Job Seekers: Create your profile and start browsing opportunities\n" .
               "• Employers: Post your first job and find skilled workers\n" .
               "• Stay Connected: Follow us for daily updates and tips\n\n" .
               "Visit SkillOnCall.ca: https://skilloncall.ca\n\n" .
               "Questions? Reply to this email or contact us at support@skilloncall.ca\n\n" .
               "Welcome to the community!\n" .
               "The SkillOnCall.ca Team\n\n" .
               "---\n" .
               "© 2025 SkillOnCall.ca. All rights reserved. Made with 🍁 in Canada.\n" .
               "You're receiving this because you subscribed to our newsletter at SkillOnCall.ca\n" .
               "Don't want to receive these emails? Unsubscribe here: https://skilloncall.ca/unsubscribe";
    }
}
