<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\CheckUserActive;
use App\Http\Middleware\EmployerMiddleware;
use App\Http\Middleware\EmployeeMiddleware;
use App\Http\Middleware\EnsureEmployeeProfileComplete;
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
            'employee' => EmployeeMiddleware::class,
            'worker' => WorkerMiddleware::class, // Keep for backward compatibility
            'ensure.employee.profile.complete' => EnsureEmployeeProfileComplete::class,
            'ensure.worker.profile.complete' => EnsureWorkerProfileComplete::class, // Keep for backward compatibility
            'check.user.active' => CheckUserActive::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
