<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscription;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class NewsletterController extends Controller
{
    protected EmailService $emailService;

    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }

    /**
     * Handle newsletter subscription
     */
    public function subscribe(Request $request): JsonResponse
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'name' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please enter a valid email address.',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $email = strtolower(trim($data['email']));

        try {
            // Check if email already exists
            $existingSubscription = NewsletterSubscription::where('email', $email)->first();

            if ($existingSubscription) {
                if ($existingSubscription->is_active) {
                    return response()->json([
                        'success' => true,
                        'message' => 'You are already subscribed to our newsletter!',
                        'already_subscribed' => true
                    ]);
                } else {
                    // Reactivate subscription
                    $existingSubscription->update([
                        'is_active' => true,
                        'subscribed_at' => now(),
                        'unsubscribed_at' => null,
                        'source' => $data['source'] ?? null,
                    ]);
                }
            } else {
                // Create new subscription
                NewsletterSubscription::create([
                    'email' => $email,
                    'name' => $data['name'] ?? null,
                    'is_active' => true,
                    'subscribed_at' => now(),
                    'source' => $data['source'] ?? null,
                ]);
            }

            // Send confirmation email
            $newsletterData = [
                'email' => $email,
                'name' => $data['name'] ?? 'Subscriber'
            ];
            
            $emailSent = $this->emailService->sendNewsletterConfirmation($newsletterData);
            
            if (!$emailSent) {
                Log::warning('Newsletter subscription saved but confirmation email failed', ['email' => $email]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Thank you for subscribing to our newsletter! A confirmation email has been sent.',
                'already_subscribed' => false
            ]);

        } catch (\Exception $e) {
            Log::error('Newsletter subscription error', [
                'email' => $email,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Sorry, there was an error processing your subscription. Please try again later.'
            ], 500);
        }
    }
}
