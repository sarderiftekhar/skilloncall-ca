<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Add any routes that should be excluded from CSRF protection
        // Only add routes that are truly stateless or have alternative authentication
    ];

    /**
     * Determine if the session and input CSRF tokens match.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    protected function tokensMatch($request)
    {
        // If request is expecting JSON and has X-Inertia header, be more lenient
        if ($request->expectsJson() || $request->header('X-Inertia')) {
            // For Inertia requests, check both header and form data token
            $token = $request->input('_token') ?: $request->header('X-CSRF-TOKEN');
            
            return is_string($request->session()->token()) &&
                   is_string($token) &&
                   hash_equals($request->session()->token(), $token);
        }

        return parent::tokensMatch($request);
    }
}

