<?php

namespace App\Providers;

use App\Events\Employee\EmployeeRegistered;
use App\Listeners\SendEmployeeRegistrationEmail;
use App\Models\Application;
use App\Models\Job;
use App\Models\Payment;
use App\Models\User;
use App\Observers\ApplicationObserver;
use App\Observers\JobObserver;
use App\Observers\PaymentObserver;
use App\Observers\UserObserver;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        EmployeeRegistered::class => [
            SendEmployeeRegistrationEmail::class,
        ],
        \Laravel\Paddle\Events\TransactionCompleted::class => [
            \App\Listeners\RecordSubscriptionPayment::class,
        ],
    ];

    /**
     * The model observers for your application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $observers = [
        User::class => [
            UserObserver::class,
        ],
        Job::class => [
            JobObserver::class,
        ],
        Application::class => [
            ApplicationObserver::class,
        ],
        Payment::class => [
            PaymentObserver::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}

