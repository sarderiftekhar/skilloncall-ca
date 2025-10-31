<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\CheckUserActive;
use App\Http\Middleware\EmployerMiddleware;
use App\Http\Middleware\EnsureWorkerProfileComplete;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\LocaleFromQuery;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Middleware\WorkerMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            LocaleFromQuery::class,
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => RoleMiddleware::class,
            'admin' => AdminMiddleware::class,
            'employer' => EmployerMiddleware::class,
            'worker' => WorkerMiddleware::class,
            'ensure.worker.profile.complete' => EnsureWorkerProfileComplete::class,
            'check.user.active' => CheckUserActive::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Handle CSRF token mismatch errors for Inertia and AJAX requests
        $exceptions->render(function (\Illuminate\Session\TokenMismatchException $e, \Illuminate\Http\Request $request) {
            // Check if it's an Inertia request or AJAX request
            if ($request->expectsJson() || $request->header('X-Inertia') || $request->ajax()) {
                return response()->json([
                    'message' => '419 Page Expired',
                    'errors' => [
                        'form' => '419 Page Expired',
                    ],
                ], 419);
            }
        });
    })->create();
