<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(Request $request): Response
    {
        // If redirect parameter is provided, set it as intended URL
        if ($request->has('redirect')) {
            $request->session()->put('url.intended', $request->get('redirect'));
        }

        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:employer,employee',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Check if there's an intended URL in session
        $intendedUrl = $request->session()->get('url.intended');
        
        // If there's an intended URL and user is employer, redirect there after onboarding check
        if ($intendedUrl && $user->role === 'employer') {
            // Check if profile is complete
            $employerProfile = \App\Models\EmployerProfile::where('user_id', $user->id)->first();
            if ($employerProfile && $employerProfile->is_profile_complete) {
                $request->session()->forget('url.intended');
                return redirect($intendedUrl);
            }
            // If profile not complete, go to onboarding first
            return redirect()->route('employer.onboarding.index');
        }

        // Redirect workers and employers directly to onboarding, others to dashboard
        if ($user->role === 'worker') {
            return redirect()->route('worker.onboarding.index');
        }

        if ($user->role === 'employer') {
            return redirect()->route('employer.onboarding.index');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
