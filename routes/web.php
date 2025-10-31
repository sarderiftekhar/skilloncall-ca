<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function (Illuminate\Http\Request $request) {
    $user = $request->user();
    $isProfileComplete = false;
    
    if ($user && $user->role === 'employee') {
        $employeeProfile = \App\Models\EmployeeProfile::where('user_id', $user->id)->first();
        $isProfileComplete = $employeeProfile && $employeeProfile->is_profile_complete;
    }
    
    return Inertia::render('welcome', [
        'translations' => trans('welcome'),
        'isProfileComplete' => $isProfileComplete,
    ]);
})->name('home');

// Contact form route
Route::post('/contact', [App\Http\Controllers\ContactController::class, 'submit'])->name('contact.submit');

// Test route for Resend (remove this in production)
Route::get('/test-email', function () {
    try {
        $emailService = new App\Services\EmailService;
        $result = $emailService->sendContactFormEmail([
            'name' => 'SkillOnCall.ca Test',
            'email' => 'sarder2008@gmail.com',
            'phone' => '+1 (555) 123-4567',
            'message' => 'This is a test email from SkillOnCall.ca to verify the Resend email integration is working correctly. The subscription system has been successfully implemented!',
        ]);

        return response()->json([
            'success' => $result,
            'message' => $result ? 'Test email sent successfully to sarder2008@gmail.com!' : 'Failed to send test email',
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
        ]);
    }
})->name('test.email');

// Test subscription email
Route::get('/test-subscription-email', function () {
    try {
        $result = \Resend\Laravel\Facades\Resend::emails()->send([
            'from' => 'SkillOnCall <onboarding@resend.dev>',
            'to' => ['sarder2008@gmail.com'],
            'subject' => '🎉 SkillOnCall.ca Subscription System Test',
            'html' => '
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="background-color: #10B3D6; color: white; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">S</div>
                        <h1 style="color: #192341; margin: 0;">SkillOnCall.ca</h1>
                        <p style="color: #666; margin: 5px 0 0 0;">Canada\'s Premier Skilled Worker Platform</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                        <h2 style="color: #192341; margin-top: 0;">🚀 Subscription System Successfully Implemented!</h2>
                        <p style="color: #333; line-height: 1.6;">Great news! The comprehensive subscription system for SkillOnCall.ca has been successfully created and is now fully operational.</p>
                        
                        <h3 style="color: #10B3D6; margin-top: 25px;">✅ What\'s Been Built:</h3>
                        <ul style="color: #333; line-height: 1.8;">
                            <li><strong>Employer Plans:</strong> Starter (Free), Professional ($49.99/mo), Enterprise ($149.99/mo)</li>
                            <li><strong>Worker Plans:</strong> Basic (Free), Pro Worker ($19.99/mo), Premium Worker ($39.99/mo)</li>
                            <li><strong>Features:</strong> Usage tracking, billing intervals, plan upgrades, analytics</li>
                            <li><strong>API Endpoints:</strong> Subscribe, cancel, change plans, usage statistics</li>
                            <li><strong>Database:</strong> Complete subscription management system</li>
                        </ul>
                        
                        <h3 style="color: #10B3D6; margin-top: 25px;">🎯 Key Features:</h3>
                        <ul style="color: #333; line-height: 1.8;">
                            <li>Role-based subscription plans (Employers vs Workers)</li>
                            <li>Usage limits and feature tracking</li>
                            <li>Monthly/yearly billing with discounts</li>
                            <li>Prorated billing for plan changes</li>
                            <li>Automatic subscription management</li>
                            <li>Comprehensive analytics and reporting</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; padding: 20px; background-color: #192341; color: white; border-radius: 10px;">
                        <h3 style="margin-top: 0; color: #10B3D6;">Ready for Production!</h3>
                        <p style="margin-bottom: 0;">The subscription system is enterprise-ready and can be integrated with payment processors like Stripe or PayPal.</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #666; font-size: 14px; margin: 0;">
                            This is a test email from SkillOnCall.ca<br>
                            Sent via Resend Email Service
                        </p>
                    </div>
                </div>
            ',
            'text' => 'SkillOnCall.ca Subscription System Test

Great news! The comprehensive subscription system for SkillOnCall.ca has been successfully created and is now fully operational.

What\'s Been Built:
- Employer Plans: Starter (Free), Professional ($49.99/mo), Enterprise ($149.99/mo)
- Worker Plans: Basic (Free), Pro Worker ($19.99/mo), Premium Worker ($39.99/mo)
- Features: Usage tracking, billing intervals, plan upgrades, analytics
- API Endpoints: Subscribe, cancel, change plans, usage statistics
- Database: Complete subscription management system

Key Features:
- Role-based subscription plans (Employers vs Workers)
- Usage limits and feature tracking
- Monthly/yearly billing with discounts
- Prorated billing for plan changes
- Automatic subscription management
- Comprehensive analytics and reporting

Ready for Production!
The subscription system is enterprise-ready and can be integrated with payment processors like Stripe or PayPal.

This is a test email from SkillOnCall.ca
Sent via Resend Email Service',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subscription test email sent successfully to sarder2008@gmail.com!',
            'email_id' => $result->id,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
        ]);
    }
})->name('test.subscription.email');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (Illuminate\Http\Request $request) {
        $user = $request->user();

        // Redirect to role-specific dashboard
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->isEmployer()) {
            // For employers, check if profile is complete before redirecting
            $employerProfile = \App\Models\EmployerProfile::where('user_id', $user->id)->first();

            if (! $employerProfile || ! $employerProfile->is_profile_complete) {
                return redirect()->route('employer.onboarding.index');
            }

            return redirect()->route('employer.dashboard');
        } else {
            // For employees, check if profile is complete before redirecting
            $employeeProfile = \App\Models\EmployeeProfile::where('user_id', $user->id)->first();

            if (! $employeeProfile || ! $employeeProfile->is_profile_complete) {
                return redirect()->route('employee.onboarding.index');
            }

            return redirect()->route('employee.dashboard');
        }
    })->name('dashboard')->middleware('check.user.active');
});

// Include role-specific routes
// Subscription routes
Route::middleware(['auth', 'verified', 'check.user.active'])->group(function () {
    Route::get('/subscriptions', [App\Http\Controllers\SubscriptionController::class, 'index'])->name('subscriptions.index');
    Route::get('/subscription', [App\Http\Controllers\SubscriptionController::class, 'show'])->name('subscriptions.show');
    Route::post('/subscriptions/subscribe', [App\Http\Controllers\SubscriptionController::class, 'subscribe'])->name('subscriptions.subscribe');
    Route::post('/subscriptions/cancel', [App\Http\Controllers\SubscriptionController::class, 'cancel'])->name('subscriptions.cancel');
    Route::post('/subscriptions/change-plan', [App\Http\Controllers\SubscriptionController::class, 'changePlan'])->name('subscriptions.change-plan');
    Route::get('/subscriptions/usage', [App\Http\Controllers\SubscriptionController::class, 'usage'])->name('subscriptions.usage');
});

// SkillOnCall Progress Tracker routes (Public access)
Route::resource('progress', App\Http\Controllers\SkillOnCallProgressController::class)->names([
    'index' => 'progress.index',
    'create' => 'progress.create', 
    'store' => 'progress.store',
    'show' => 'progress.show',
    'edit' => 'progress.edit',
    'update' => 'progress.update',
    'destroy' => 'progress.destroy',
]);
Route::post('/progress/upload-screenshot', [App\Http\Controllers\SkillOnCallProgressController::class, 'uploadPastedScreenshot'])->name('progress.upload-screenshot');

require __DIR__.'/admin.php';
require __DIR__.'/employer.php';
require __DIR__.'/employee.php';

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
