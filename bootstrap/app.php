<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\CheckSubscriptionPlan;
use App\Http\Middleware\CheckUserActive;
use App\Http\Middleware\EmployerMiddleware;
use App\Http\Middleware\EmployeeMiddleware;
use App\Http\Middleware\EnsureEmployeeProfileComplete;
use App\Http\Middleware\EnsureWorkerProfileComplete;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\LocaleFromQuery;
use App\Http\Middleware\CheckInactivity;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\WorkerMiddleware;
use App\Models\ExceptionLog;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            SecurityHeaders::class,
            CheckInactivity::class,
            LocaleFromQuery::class,
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => RoleMiddleware::class,
            'admin' => AdminMiddleware::class,
            'employer' => EmployerMiddleware::class,
            'employee' => EmployeeMiddleware::class,
            'worker' => WorkerMiddleware::class, // Keep for backward compatibility
            'ensure.employee.profile.complete' => EnsureEmployeeProfileComplete::class,
            'ensure.worker.profile.complete' => EnsureWorkerProfileComplete::class, // Keep for backward compatibility
            'check.user.active' => CheckUserActive::class,
            'subscription.plan' => CheckSubscriptionPlan::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (Throwable $e) {
            if ($e instanceof ValidationException) {
                return;
            }

            if ($e instanceof HttpExceptionInterface && $e->getStatusCode() < 500) {
                return;
            }

            if (! app()->bound('db')) {
                return;
            }

            static $tableChecked = false;
            static $tableExists = false;

            if (! $tableChecked) {
                try {
                    $tableExists = Schema::hasTable('exception_logs');
                } catch (Throwable) {
                    $tableExists = false;
                }
                $tableChecked = true;
            }

            if (! $tableExists) {
                return;
            }

            try {
                $request = app()->bound('request') ? request() : null;

                $headers = $request
                    ? collect($request->headers->all())
                        ->map(fn ($values) => $values[0] ?? $values)
                        ->take(25)
                        ->toArray()
                    : null;

                $payload = $request
                    ? collect(Arr::except($request->all(), ['password', 'password_confirmation', 'current_password']))
                        ->map(function ($value) {
                            if (is_string($value) && mb_strlen($value) > 500) {
                                return mb_substr($value, 0, 500).'...';
                            }

                            if (is_scalar($value) || $value === null) {
                                return $value;
                            }

                            return json_decode(json_encode($value), true);
                        })
                        ->take(25)
                        ->toArray()
                    : null;

                ExceptionLog::create([
                    'exception_class' => get_class($e),
                    'message' => Str::limit($e->getMessage(), 1000),
                    'trace' => mb_substr($e->getTraceAsString(), 0, 65000),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'request_url' => $request?->fullUrl(),
                    'request_method' => $request?->method(),
                    'request_payload' => empty($payload) ? null : $payload,
                    'headers' => empty($headers) ? null : $headers,
                    'user_id' => $request?->user()?->id,
                    'ip_address' => $request?->ip(),
                ]);
            } catch (Throwable) {
                // Swallow logging exceptions to avoid interrupting the main request flow.
            }
        });

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
