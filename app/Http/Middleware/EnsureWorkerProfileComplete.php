<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\WorkerProfile;

class EnsureWorkerProfileComplete
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Skip if user is not a worker
        if (!$user || $user->role !== 'worker') {
            return $next($request);
        }

        // Skip if accessing onboarding routes
        if ($request->routeIs('worker.onboarding*')) {
            return $next($request);
        }

        // Skip for auth routes and API routes
        if ($request->routeIs('auth.*') || $request->routeIs('api.*')) {
            return $next($request);
        }

        // Check if worker has completed profile
        $workerProfile = WorkerProfile::where('user_id', $user->id)->first();

        if (!$workerProfile || !$workerProfile->is_profile_complete) {
            // Redirect to onboarding if profile is incomplete
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Profile setup required',
                    'redirect' => route('worker.onboarding.index')
                ], 403);
            }

            return redirect()->route('worker.onboarding.index')
                ->with('warning', 'Please complete your profile setup to access worker features.');
        }

        return $next($request);
    }
}


