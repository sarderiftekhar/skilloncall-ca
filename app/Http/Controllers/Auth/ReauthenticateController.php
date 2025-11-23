<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ReauthenticateController extends Controller
{
    /**
     * Show the re-authentication modal.
     */
    public function show(Request $request): Response
    {
        return Inertia::render('auth/reauthenticate', [
            'timeout' => config('session.inactivity_timeout', 15),
        ]);
    }

    /**
     * Verify password and reset session activity.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Check password
        if (!Hash::check($request->password, $user->password)) {
            // Track failed attempts
            $failedAttempts = $request->session()->get('reauth_failed_attempts', 0) + 1;
            $request->session()->put('reauth_failed_attempts', $failedAttempts);

            // After 3 failed attempts, logout
            if ($failedAttempts >= 3) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()->route('login')->with('error', __('auth.reauth_failed_max_attempts'));
            }

            throw ValidationException::withMessages([
                'password' => __('auth.reauth_failed', ['attempts' => 3 - $failedAttempts]),
            ]);
        }

        // Password correct - reset session activity
        $request->session()->put('last_activity_at', now()->toDateTimeString());
        $request->session()->forget('requires_reauth');
        $request->session()->forget('reauth_required_at');
        $request->session()->forget('reauth_failed_attempts');

        // Log successful re-authentication
        \Illuminate\Support\Facades\Log::info('User re-authenticated after inactivity', [
            'user_id' => $user->id,
            'ip' => $request->ip(),
        ]);

        return back();
    }

    /**
     * Check if re-authentication is required (API endpoint).
     */
    public function check(Request $request)
    {
        $requiresReauth = $request->session()->get('requires_reauth', false);

        return response()->json([
            'requires_reauth' => $requiresReauth,
            'timeout' => config('session.inactivity_timeout', 15),
        ]);
    }
}

