<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Job;
use App\Models\Application;
use App\Models\Payment;
use App\Models\Portfolio;
use App\Observers\UserObserver;
use App\Observers\JobObserver;
use App\Observers\ApplicationObserver;
use App\Observers\PaymentObserver;
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
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register model observers
        User::observe(UserObserver::class);
        Job::observe(JobObserver::class);
        Application::observe(ApplicationObserver::class);
        Payment::observe(PaymentObserver::class);

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
