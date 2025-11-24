<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        // If redirect parameter is provided, set it as intended URL
        if ($request->has('redirect')) {
            $request->session()->put('url.intended', $request->get('redirect'));
        }

        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Check if there's an intended URL in session
        $intendedUrl = $request->session()->get('url.intended');
        $user = Auth::user();
        
        // Sync locale from localStorage to database on first login
        // If user doesn't have a locale set and X-Locale header is present, sync it
        if ($user && !$user->locale && $request->header('X-Locale')) {
            $headerLocale = $request->header('X-Locale');
            if (in_array($headerLocale, ['en', 'fr'])) {
                try {
                    $user->update(['locale' => $headerLocale]);
                    session(['locale' => $headerLocale]);
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::warning('Failed to sync locale on login: ' . $e->getMessage());
                }
            }
        }

        // If there's an intended URL and user is employer, redirect there after profile check
        if ($intendedUrl && $user && $user->role === 'employer') {
            // Check if profile is complete
            $employerProfile = \App\Models\EmployerProfile::where('user_id', $user->id)->first();
            if ($employerProfile && $employerProfile->is_profile_complete) {
                $request->session()->forget('url.intended');
                return redirect($intendedUrl);
            }
            // If profile not complete, go to onboarding first
            return redirect()->route('employer.onboarding.index');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
