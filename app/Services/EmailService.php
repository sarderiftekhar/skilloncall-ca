<?php

namespace App\Services;

use Resend\Laravel\Facades\Resend;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use App\Jobs\SendEmailJob;

class EmailService
{
    /**
     * Get the from email address from config
     */
    private function getFromAddress(): string
    {
        $fromAddress = config('mail.from.address', 'noreply@skilloncall.ca');
        $fromName = config('mail.from.name', 'SkillOnCall');
        return $fromName . ' <' . $fromAddress . '>';
    }

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
                'from' => $this->getFromAddress(),
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
                'from' => $this->getFromAddress(),
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
                'from' => $this->getFromAddress(),
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
     * Send employee registration congratulations email
     */
    public function sendEmployeeRegistrationEmail(string $userEmail, string $userName): bool
    {
        try {
            $result = Resend::emails()->send([
                'from' => $this->getFromAddress(),
                'to' => [$userEmail],
                'subject' => '🎉 Congratulations! Welcome to SkillOnCall.ca as an Employee',
                'html' => $this->buildEmployeeRegistrationEmailHtml($userName),
                'text' => $this->buildEmployeeRegistrationEmailText($userName),
            ]);

            Log::info('Employee registration email sent successfully', [
                'email_id' => $result['id'] ?? null,
                'to' => $userEmail,
                'user_name' => $userName
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send employee registration email', [
                'error' => $e->getMessage(),
                'error_class' => get_class($e),
                'trace' => $e->getTraceAsString(),
                'to' => $userEmail,
                'user_name' => $userName
            ]);

            if (app()->runningInConsole()) {
                echo "Employee Registration Email Error: " . $e->getMessage() . "\n";
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
                'from' => $this->getFromAddress(),
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

    /**
     * Build HTML content for employee registration email
     */
    private function buildEmployeeRegistrationEmailHtml(string $userName): string
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Welcome to SkillOnCall.ca - Employee Registration</title>
            <style>
                body { 
                    font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #192341; 
                    margin: 0;
                    padding: 0;
                    background-color: #f6fbfd;
                }
                .email-container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background-color: #ffffff;
                }
                .header { 
                    background: linear-gradient(135deg, #10B3D6 0%, #0a8ba8 100%);
                    color: white; 
                    padding: 40px 30px; 
                    text-align: center; 
                    border-radius: 10px 10px 0 0;
                }
                .header h1 { 
                    margin: 0 0 10px 0; 
                    font-size: 32px; 
                    font-weight: 700;
                }
                .header p { 
                    margin: 0; 
                    font-size: 18px; 
                    opacity: 0.95;
                }
                .content { 
                    background-color: #ffffff; 
                    padding: 40px 30px; 
                }
                .congratulations-box {
                    background-color: #FCF2F0;
                    padding: 25px;
                    border-radius: 10px;
                    margin: 25px 0;
                    border-left: 4px solid #10B3D6;
                    text-align: center;
                }
                .congratulations-box h2 {
                    color: #10B3D6;
                    margin: 0 0 10px 0;
                    font-size: 24px;
                    font-weight: 600;
                }
                .congratulations-box p {
                    margin: 0;
                    color: #192341;
                    font-size: 16px;
                }
                .feature-list { 
                    background-color: #f6fbfd; 
                    padding: 25px; 
                    border-radius: 10px; 
                    margin: 25px 0; 
                }
                .feature-item { 
                    display: flex; 
                    align-items: flex-start; 
                    margin: 15px 0; 
                }
                .feature-icon { 
                    color: #10B3D6; 
                    font-weight: bold; 
                    margin-right: 12px; 
                    font-size: 20px;
                    flex-shrink: 0;
                    margin-top: 2px;
                }
                .feature-text {
                    flex: 1;
                }
                .feature-text strong {
                    color: #192341;
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 600;
                }
                .feature-text p {
                    margin: 0;
                    color: #555;
                    font-size: 15px;
                }
                .button { 
                    display: inline-block; 
                    background-color: #10B3D6; 
                    color: white; 
                    padding: 16px 32px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    margin: 25px 0; 
                    font-weight: 600;
                    font-size: 16px;
                    text-align: center;
                    transition: background-color 0.3s;
                }
                .button:hover {
                    background-color: #0a8ba8;
                }
                .button-container {
                    text-align: center;
                    margin: 30px 0;
                }
                .next-steps {
                    background-color: #ffffff;
                    border: 2px solid #10B3D6;
                    border-radius: 10px;
                    padding: 25px;
                    margin: 25px 0;
                }
                .next-steps h3 {
                    color: #10B3D6;
                    margin: 0 0 15px 0;
                    font-size: 20px;
                    font-weight: 600;
                }
                .next-steps ul {
                    margin: 0;
                    padding-left: 20px;
                }
                .next-steps li {
                    margin: 10px 0;
                    color: #192341;
                    line-height: 1.6;
                }
                .footer { 
                    text-align: center; 
                    padding: 30px; 
                    background-color: #f6fbfd;
                    color: #666; 
                    font-size: 13px; 
                    border-radius: 0 0 10px 10px;
                }
                .footer p {
                    margin: 8px 0;
                }
                .footer a {
                    color: #10B3D6;
                    text-decoration: none;
                }
                .maple-leaf {
                    display: inline-block;
                    font-size: 20px;
                    margin: 0 5px;
                }
                @media only screen and (max-width: 600px) {
                    .content, .header {
                        padding: 25px 20px;
                    }
                    .header h1 {
                        font-size: 26px;
                    }
                    .button {
                        display: block;
                        margin: 20px auto;
                    }
                }
            </style>
        </head>
        <body>
            <div class='email-container'>
                <div class='header'>
                    <h1>🎉 Congratulations!</h1>
                    <p>Welcome to SkillOnCall.ca</p>
                </div>
                <div class='content'>
                    <p style='font-size: 18px; color: #192341; margin-bottom: 20px;'>Hello <strong>" . htmlspecialchars($userName) . "</strong>,</p>
                    
                    <div class='congratulations-box'>
                        <h2>🎊 You're Now an Employee!</h2>
                        <p>We're thrilled to have you join Canada's premier platform for skilled workers and local businesses.</p>
                    </div>
                    
                    <p style='color: #192341; font-size: 16px; line-height: 1.7;'>
                        Thank you for registering as an employee on <strong>SkillOnCall.ca</strong>! You've taken the first step towards connecting with amazing opportunities across Canada. Our platform is designed to help skilled workers like you find flexible, rewarding work with local businesses.
                    </p>
                    
                    <div class='feature-list'>
                        <h3 style='color: #192341; margin-top: 0; margin-bottom: 20px; font-size: 20px; font-weight: 600;'>✨ What You Can Do Now:</h3>
                        
                        <div class='feature-item'>
                            <span class='feature-icon'>📋</span>
                            <div class='feature-text'>
                                <strong>Complete Your Profile</strong>
                                <p>Build a comprehensive profile showcasing your skills, experience, and certifications. The more complete your profile, the more opportunities you'll discover.</p>
                            </div>
                        </div>
                        
                        <div class='feature-item'>
                            <span class='feature-icon'>🔍</span>
                            <div class='feature-text'>
                                <strong>Browse Job Opportunities</strong>
                                <p>Explore thousands of job postings from local businesses looking for skilled workers like you. Filter by location, skills, and availability.</p>
                            </div>
                        </div>
                        
                        <div class='feature-item'>
                            <span class='feature-icon'>💼</span>
                            <div class='feature-text'>
                                <strong>Apply for Jobs</strong>
                                <p>Submit applications to businesses that match your skills and interests. Stand out with your detailed profile and portfolio.</p>
                            </div>
                        </div>
                        
                        <div class='feature-item'>
                            <span class='feature-icon'>⭐</span>
                            <div class='feature-text'>
                                <strong>Build Your Reputation</strong>
                                <p>Complete jobs successfully and earn great reviews. Build a strong reputation that opens doors to better opportunities.</p>
                            </div>
                        </div>
                        
                        <div class='feature-item'>
                            <span class='feature-icon'>📅</span>
                            <div class='feature-text'>
                                <strong>Set Your Availability</strong>
                                <p>Control when and where you work. Set your availability schedule and let employers know when you're ready to work.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class='next-steps'>
                        <h3>🚀 Your Next Steps:</h3>
                        <ul>
                            <li><strong>Step 1:</strong> Complete your employee profile with personal information, skills, and experience</li>
                            <li><strong>Step 2:</strong> Add your certifications and work history to showcase your expertise</li>
                            <li><strong>Step 3:</strong> Set your service areas and availability schedule</li>
                            <li><strong>Step 4:</strong> Upload your portfolio and work samples to stand out</li>
                            <li><strong>Step 5:</strong> Start browsing and applying for jobs that match your skills!</li>
                        </ul>
                    </div>
                    
                    <div class='button-container'>
                        <a href='https://skilloncall.ca/dashboard' class='button'>Complete Your Profile →</a>
                    </div>
                    
                    <p style='color: #192341; font-size: 16px; line-height: 1.7; margin-top: 30px;'>
                        <strong>Why SkillOnCall.ca?</strong><br>
                        We're Canada's trusted platform connecting skilled workers with local businesses. Whether you're a chef, barista, retail associate, cleaner, or any other skilled professional, we're here to help you find flexible work opportunities that fit your schedule.
                    </p>
                    
                    <p style='color: #192341; font-size: 16px; line-height: 1.7;'>
                        Our platform is designed with Canadian workers in mind, supporting work authorization verification, provincial certifications, and local job matching across all provinces and territories.
                    </p>
                    
                    <p style='color: #192341; font-size: 16px; line-height: 1.7; margin-top: 25px;'>
                        Need help getting started? Our support team is here for you! Simply reply to this email or contact us at <a href='mailto:support@skilloncall.ca' style='color: #10B3D6; text-decoration: none;'>support@skilloncall.ca</a>
                    </p>
                    
                    <p style='color: #192341; font-size: 16px; line-height: 1.7; margin-top: 25px;'>
                        Welcome aboard, and we can't wait to see you succeed!<br>
                        <strong style='color: #10B3D6;'>The SkillOnCall.ca Team</strong>
                    </p>
                </div>
                <div class='footer'>
                    <p><strong>SkillOnCall.ca</strong> - Canada's Premier Platform for Skilled Workers</p>
                    <p>© 2025 SkillOnCall.ca. All rights reserved. <span class='maple-leaf'>🍁</span> Made with pride in Canada.</p>
                    <p>
                        <a href='https://skilloncall.ca'>Visit Website</a> | 
                        <a href='https://skilloncall.ca/support'>Support</a> | 
                        <a href='https://skilloncall.ca/privacy'>Privacy Policy</a>
                    </p>
                    <p style='font-size: 12px; color: #999; margin-top: 15px;'>
                        You're receiving this email because you registered as an employee on SkillOnCall.ca.<br>
                        If you have any questions, please don't hesitate to reach out to our support team.
                    </p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    /**
     * Build text content for employee registration email
     */
    private function buildEmployeeRegistrationEmailText(string $userName): string
    {
        return "🎉 Congratulations! Welcome to SkillOnCall.ca as an Employee\n\n" .
               "Hello " . $userName . ",\n\n" .
               "We're thrilled to have you join Canada's premier platform for skilled workers and local businesses.\n\n" .
               "🎊 You're Now an Employee!\n" .
               "Thank you for registering as an employee on SkillOnCall.ca! You've taken the first step towards connecting with amazing opportunities across Canada.\n\n" .
               "✨ What You Can Do Now:\n\n" .
               "📋 Complete Your Profile\n" .
               "Build a comprehensive profile showcasing your skills, experience, and certifications. The more complete your profile, the more opportunities you'll discover.\n\n" .
               "🔍 Browse Job Opportunities\n" .
               "Explore thousands of job postings from local businesses looking for skilled workers like you. Filter by location, skills, and availability.\n\n" .
               "💼 Apply for Jobs\n" .
               "Submit applications to businesses that match your skills and interests. Stand out with your detailed profile and portfolio.\n\n" .
               "⭐ Build Your Reputation\n" .
               "Complete jobs successfully and earn great reviews. Build a strong reputation that opens doors to better opportunities.\n\n" .
               "📅 Set Your Availability\n" .
               "Control when and where you work. Set your availability schedule and let employers know when you're ready to work.\n\n" .
               "🚀 Your Next Steps:\n\n" .
               "Step 1: Complete your employee profile with personal information, skills, and experience\n" .
               "Step 2: Add your certifications and work history to showcase your expertise\n" .
               "Step 3: Set your service areas and availability schedule\n" .
               "Step 4: Upload your portfolio and work samples to stand out\n" .
               "Step 5: Start browsing and applying for jobs that match your skills!\n\n" .
               "Complete Your Profile: https://skilloncall.ca/dashboard\n\n" .
               "Why SkillOnCall.ca?\n" .
               "We're Canada's trusted platform connecting skilled workers with local businesses. Whether you're a chef, barista, retail associate, cleaner, or any other skilled professional, we're here to help you find flexible work opportunities that fit your schedule.\n\n" .
               "Our platform is designed with Canadian workers in mind, supporting work authorization verification, provincial certifications, and local job matching across all provinces and territories.\n\n" .
               "Need help getting started? Our support team is here for you! Simply reply to this email or contact us at support@skilloncall.ca\n\n" .
               "Welcome aboard, and we can't wait to see you succeed!\n" .
               "The SkillOnCall.ca Team\n\n" .
               "---\n" .
               "SkillOnCall.ca - Canada's Premier Platform for Skilled Workers\n" .
               "© 2025 SkillOnCall.ca. All rights reserved. 🍁 Made with pride in Canada.\n\n" .
               "Visit Website: https://skilloncall.ca\n" .
               "Support: https://skilloncall.ca/support\n" .
               "Privacy Policy: https://skilloncall.ca/privacy\n\n" .
               "You're receiving this email because you registered as an employee on SkillOnCall.ca.\n" .
               "If you have any questions, please don't hesitate to reach out to our support team.";
    }
}
