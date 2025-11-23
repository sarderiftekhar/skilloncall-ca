<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckInactivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only check for authenticated users
        if (!Auth::check()) {
            return $next($request);
        }

        $timeoutMinutes = (int) config('session.inactivity_timeout', 15);
        $session = $request->session();

        // Get last activity timestamp from session
        $lastActivity = $session->get('last_activity_at');

        // If last activity exists, check if timeout exceeded
        if ($lastActivity) {
            $lastActivityTime = \Carbon\Carbon::parse($lastActivity);
            $inactiveMinutes = now()->diffInMinutes($lastActivityTime);

            if ($inactiveMinutes >= $timeoutMinutes) {
                // Mark session as requiring re-authentication
                $session->put('requires_reauth', true);
                $session->put('reauth_required_at', now()->toDateTimeString());
            } else {
                // Clear re-auth flag if user is still active
                $session->forget('requires_reauth');
            }
        }

        // Update last activity timestamp on each request
        $session->put('last_activity_at', now()->toDateTimeString());

        $response = $next($request);

        // Add inactivity status to response headers for frontend
        if ($response instanceof \Illuminate\Http\Response) {
            $response->headers->set('X-Inactivity-Timeout', $timeoutMinutes);
            $response->headers->set('X-Requires-Reauth', $session->get('requires_reauth', false) ? '1' : '0');
        }

        return $response;
    }
}

