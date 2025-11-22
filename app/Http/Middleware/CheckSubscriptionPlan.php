<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscriptionPlan
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $planName): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Check if user has the required plan
        if (!$user->hasActivePlan($planName)) {
            return redirect()
                ->route('subscriptions.index')
                ->with('error', "This feature requires the {$planName} plan. Please upgrade your subscription.");
        }

        return $next($request);
    }
}
