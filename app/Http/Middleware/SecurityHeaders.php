<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Content Security Policy
        // Build CSP based on environment
        $isDevelopment = app()->environment(['local', 'development']);
        
        // Skip CSP in development to allow Vite HMR without issues
        // Re-enable in production with proper configuration
        if (!$isDevelopment) {
            // Production CSP - strict
            $csp = "default-src 'self'; " .
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.paddle.com https://js.stripe.com; " .
                   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.bunny.net; " .
                   "font-src 'self' https://fonts.gstatic.com https://fonts.bunny.net data:; " .
                   "img-src 'self' data: https: blob:; " .
                   "connect-src 'self' https://api.paddle.com https://sandbox-api.paddle.com https://api.stripe.com wss: ws:; " .
                   "frame-src 'self' https://cdn.paddle.com https://js.stripe.com; " .
                   "object-src 'none'; " .
                   "base-uri 'self'; " .
                   "form-action 'self'; " .
                   "frame-ancestors 'none'; " .
                   "upgrade-insecure-requests;";
            
            $response->headers->set('Content-Security-Policy', $csp);
        }

        // X-Frame-Options: Prevent clickjacking
        $response->headers->set('X-Frame-Options', 'DENY');

        // X-Content-Type-Options: Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Referrer-Policy: Control referrer information
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permissions-Policy: Control browser features
        $permissionsPolicy = "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()";
        $response->headers->set('Permissions-Policy', $permissionsPolicy);

        // Strict-Transport-Security (HSTS): Force HTTPS for 1 year
        // Only set in production with HTTPS
        if (app()->environment('production') && $request->secure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        // X-XSS-Protection: Enable XSS filter (legacy, but still useful)
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        return $response;
    }
}

