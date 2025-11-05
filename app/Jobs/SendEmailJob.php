<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Resend\Laravel\Facades\Resend;

class SendEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [10, 30, 60]; // Retry after 10s, 30s, 60s
    public $timeout = 30; // 30 second timeout

    protected array $emailData;
    protected string $emailType;

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
     * Create a new job instance.
     */
    public function __construct(array $emailData, string $emailType)
    {
        $this->emailData = $emailData;
        $this->emailType = $emailType;
        
        // Set queue priority based on email type
        $this->onQueue($this->getQueueName($emailType));
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $result = null;
            
            switch ($this->emailType) {
                case 'contact':
                    $result = $this->sendContactEmail();
                    break;
                case 'newsletter':
                    $result = $this->sendNewsletterEmail();
                    break;
                case 'subscription':
                    $result = $this->sendSubscriptionEmail();
                    break;
                case 'welcome':
                    $result = $this->sendWelcomeEmail();
                    break;
                default:
                    throw new \InvalidArgumentException("Unknown email type: {$this->emailType}");
            }

            Log::info('Email sent successfully via queue', [
                'email_type' => $this->emailType,
                'email_id' => $result['id'] ?? null,
                'to' => $this->emailData['to'] ?? $this->emailData['email'] ?? 'unknown'
            ]);

        } catch (\Exception $e) {
            Log::error('Email sending failed in queue', [
                'email_type' => $this->emailType,
                'error' => $e->getMessage(),
                'error_class' => get_class($e),
                'attempt' => $this->attempts(),
                'data' => $this->emailData
            ]);
            
            // If this is the final attempt, log it as critical
            if ($this->attempts() >= $this->tries) {
                Log::critical('Email sending failed after all retries', [
                    'email_type' => $this->emailType,
                    'final_error' => $e->getMessage(),
                    'data' => $this->emailData
                ]);
            }

            throw $e; // Re-throw to trigger retry logic
        }
    }

    /**
     * Handle job failure
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Email job permanently failed', [
            'email_type' => $this->emailType,
            'error' => $exception->getMessage(),
            'data' => $this->emailData
        ]);
        
        // Could send notification to admin about email failure
        // Or store failed emails for manual processing
    }

    /**
     * Send contact form email
     */
    private function sendContactEmail(): array
    {
        return Resend::emails()->send([
            'from' => $this->getFromAddress(),
            'to' => [$this->emailData['email']],
            'subject' => '🎉 Contact Form Received - SkillOnCall.ca',
            'html' => $this->buildContactEmailHtml($this->emailData),
            'text' => $this->buildContactEmailText($this->emailData),
        ]);
    }

    /**
     * Send newsletter confirmation email
     */
    private function sendNewsletterEmail(): array
    {
        return Resend::emails()->send([
            'from' => $this->getFromAddress(),
            'to' => [$this->emailData['email']],
            'subject' => '📧 Welcome to SkillOnCall.ca Newsletter!',
            'html' => $this->buildNewsletterConfirmationHtml($this->emailData),
            'text' => $this->buildNewsletterConfirmationText($this->emailData),
        ]);
    }

    /**
     * Send subscription confirmation email
     */
    private function sendSubscriptionEmail(): array
    {
        return Resend::emails()->send([
            'from' => $this->getFromAddress(),
            'to' => [$this->emailData['user_email']],
            'subject' => '🎉 Subscription Confirmed - Welcome to ' . $this->emailData['plan_name'] . '!',
            'html' => $this->buildSubscriptionConfirmationHtml($this->emailData),
            'text' => $this->buildSubscriptionConfirmationText($this->emailData),
        ]);
    }

    /**
     * Send welcome email
     */
    private function sendWelcomeEmail(): array
    {
        return Resend::emails()->send([
            'from' => $this->getFromAddress(),
            'to' => [$this->emailData['email']],
            'subject' => 'Welcome to SkillOnCall.ca!',
            'html' => $this->buildWelcomeEmailHtml($this->emailData['name']),
            'text' => $this->buildWelcomeEmailText($this->emailData['name']),
        ]);
    }

    /**
     * Get queue name based on email type
     */
    private function getQueueName(string $emailType): string
    {
        return match ($emailType) {
            'welcome', 'subscription' => 'high_priority_emails',
            'contact' => 'medium_priority_emails', 
            'newsletter' => 'low_priority_emails',
            default => 'default'
        };
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
     * Build HTML content for newsletter confirmation email (simplified)
     */
    private function buildNewsletterConfirmationHtml(array $data): string
    {
        return "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
            <div style='background-color: #10B3D6; color: white; padding: 30px; text-align: center;'>
                <h1>📧 Welcome to Our Newsletter!</h1>
                <p>Thank you for joining the SkillOnCall.ca community</p>
            </div>
            <div style='background-color: #f9f9f9; padding: 30px;'>
                <h2>Hello!</h2>
                <p>Thank you for subscribing to the SkillOnCall.ca newsletter!</p>
                <p>You'll receive updates about new job opportunities and platform features.</p>
                <p><a href='https://skilloncall.ca' style='background-color: #10B3D6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;'>Explore SkillOnCall.ca</a></p>
            </div>
        </div>
        ";
    }

    /**
     * Build text content for newsletter confirmation email
     */
    private function buildNewsletterConfirmationText(array $data): string
    {
        return "Welcome to SkillOnCall.ca Newsletter!\n\nThank you for subscribing! You'll receive updates about new job opportunities and platform features.\n\nVisit: https://skilloncall.ca";
    }

    /**
     * Build HTML content for subscription confirmation email (simplified)
     */
    private function buildSubscriptionConfirmationHtml(array $data): string
    {
        return "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
            <div style='background-color: #10B3D6; color: white; padding: 30px; text-align: center;'>
                <h1>🎉 Subscription Confirmed!</h1>
                <p>Welcome to SkillOnCall.ca " . htmlspecialchars($data['plan_name']) . "</p>
            </div>
            <div style='background-color: #f9f9f9; padding: 30px;'>
                <h2>Hello " . htmlspecialchars($data['user_name']) . "!</h2>
                <p>Your subscription has been successfully activated.</p>
                <p><strong>Plan:</strong> " . htmlspecialchars($data['plan_name']) . "</p>
                <p><a href='https://skilloncall.ca/dashboard' style='background-color: #10B3D6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;'>Access Dashboard</a></p>
            </div>
        </div>
        ";
    }

    /**
     * Build text content for subscription confirmation email
     */
    private function buildSubscriptionConfirmationText(array $data): string
    {
        return "Subscription Confirmed - SkillOnCall.ca\n\nHello " . $data['user_name'] . "!\n\nYour subscription to " . $data['plan_name'] . " has been activated.\n\nVisit: https://skilloncall.ca/dashboard";
    }

    /**
     * Build HTML content for welcome email
     */
    private function buildWelcomeEmailHtml(string $userName): string
    {
        return "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
            <div style='background-color: #10B3D6; color: white; padding: 30px; text-align: center;'>
                <h1>Welcome to SkillOnCall.ca!</h1>
                <p>Canada's Premier Platform for Skilled Workers</p>
            </div>
            <div style='background-color: #f9f9f9; padding: 30px;'>
                <h2>Hello " . htmlspecialchars($userName) . "!</h2>
                <p>Welcome to SkillOnCall.ca! We're excited to have you join our community.</p>
                <p><a href='https://skilloncall.ca/dashboard' style='background-color: #10B3D6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;'>Get Started</a></p>
            </div>
        </div>
        ";
    }

    /**
     * Build text content for welcome email
     */
    private function buildWelcomeEmailText(string $userName): string
    {
        return "Welcome to SkillOnCall.ca!\n\nHello " . $userName . "!\n\nWelcome to our community of skilled workers and businesses.\n\nGet started: https://skilloncall.ca/dashboard";
    }
}
