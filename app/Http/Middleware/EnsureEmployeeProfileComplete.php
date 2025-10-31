<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\EmployeeProfile;

class EnsureEmployeeProfileComplete
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Skip if user is not an employee
        if (!$user || $user->role !== 'employee') {
            return $next($request);
        }

        // Skip if accessing onboarding routes
        if ($request->routeIs('employee.onboarding*')) {
            return $next($request);
        }

        // Skip for auth routes and API routes
        if ($request->routeIs('auth.*') || $request->routeIs('api.*')) {
            return $next($request);
        }

        // Check if employee has completed profile
        $employeeProfile = EmployeeProfile::where('user_id', $user->id)->first();

        if (!$employeeProfile || !$employeeProfile->is_profile_complete) {
            // Redirect to onboarding if profile is incomplete
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Profile setup required',
                    'redirect' => route('employee.onboarding.index')
                ], 403);
            }

            return redirect()->route('employee.onboarding.index')
                ->with('warning', 'Please complete your profile setup to access employee features.');
        }

        return $next($request);
    }
}


