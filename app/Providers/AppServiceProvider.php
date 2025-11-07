<?php

namespace App\Providers;

use App\Models\Application;
use App\Models\Job;
use App\Models\Payment;
use App\Models\Portfolio;
use App\Policies\JobPolicy;
use App\Policies\ApplicationPolicy;
use App\Policies\PaymentPolicy;
use App\Policies\PortfolioPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register ImageCompressionService as singleton
        $this->app->singleton(\App\Services\ImageCompressionService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register authorization policies
        Gate::policy(Job::class, JobPolicy::class);
        Gate::policy(Application::class, ApplicationPolicy::class);
        Gate::policy(Payment::class, PaymentPolicy::class);
        Gate::policy(Portfolio::class, PortfolioPolicy::class);

        // Share current locale with Inertia
        Inertia::share('locale', function () {
            return app()->getLocale();
        });
    }
}
