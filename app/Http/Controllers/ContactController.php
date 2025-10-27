<?php

namespace App\Http\Controllers;

use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    protected EmailService $emailService;

    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }

    /**
     * Handle contact form submission
     */
    public function submit(Request $request): JsonResponse
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please check your input and try again.',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Check if this is a newsletter subscription
        $isNewsletterSubscription = str_contains(strtolower($data['message']), 'newsletter subscription');
        
        if ($isNewsletterSubscription) {
            // Send newsletter confirmation email
            $newsletterData = [
                'email' => $data['email'],
                'name' => $data['name']
            ];
            
            $emailSent = $this->emailService->sendNewsletterConfirmation($newsletterData);
            
            if ($emailSent) {
                return response()->json([
                    'success' => true,
                    'message' => 'Thank you for subscribing to our newsletter! A confirmation email has been sent.'
                ]);
            }
        } else {
            // Send regular contact form email
            $emailSent = $this->emailService->sendContactFormEmail($data);
            
            if ($emailSent) {
                return response()->json([
                    'success' => true,
                    'message' => 'Thank you for your message! We\'ll get back to you within 24 hours.'
                ]);
            }
        }

        if (!$emailSent) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, there was an error sending your message. Please try again later.'
            ], 500);
        }
    }
}
