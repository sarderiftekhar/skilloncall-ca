<?php

namespace App\Listeners;

use App\Events\Employee\EmployeeRegistered;
use App\Services\EmailService;
use Illuminate\Support\Facades\Log;

class SendEmployeeRegistrationEmail
{
    /**
     * Create the event listener.
     */
    public function __construct(
        protected EmailService $emailService
    ) {}

    /**
     * Handle the event.
     */
    public function handle(EmployeeRegistered $event): void
    {
        try {
            $user = $event->user;
            
            $result = $this->emailService->sendEmployeeRegistrationEmail(
                $user->email,
                $user->name
            );

            if ($result) {
                Log::info('Employee registration email sent successfully', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                ]);
            } else {
                Log::warning('Employee registration email failed to send', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error sending employee registration email', [
                'user_id' => $event->user->id,
                'email' => $event->user->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}

