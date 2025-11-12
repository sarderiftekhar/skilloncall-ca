<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user();

        // Add avatar and display name from worker profile if available
        if ($user) {
            $avatar = null;
            $displayName = $user->name; // Default to user's name

            try {
                if ($user->role === 'worker' && $user->workerProfile) {
                    // Use worker profile photo if available
                    if ($user->workerProfile->profile_photo) {
                        $avatar = asset('storage/'.$user->workerProfile->profile_photo);
                    }
                    
                    // Use worker profile name if available
                    if ($user->workerProfile->first_name && $user->workerProfile->last_name) {
                        $displayName = $user->workerProfile->first_name . ' ' . $user->workerProfile->last_name;
                    }
                }
            } catch (\Exception $e) {
                // Fallback to default values if worker profile access fails
                Log::warning('Failed to load worker profile in HandleInertiaRequests: ' . $e->getMessage());
            }

            $user->avatar = $avatar;
            $user->display_name = $displayName;
        }

        // Get current subscription info
        $subscription = null;
        if ($user) {
            try {
                $activeSubscription = $user->activeSubscription();
                if ($activeSubscription) {
                    $subscription = [
                        'plan_name' => $activeSubscription->plan->name,
                        'plan_type' => $activeSubscription->plan->type,
                        'status' => $activeSubscription->status,
                        'ends_at' => $activeSubscription->ends_at?->format('M j, Y'),
                        'days_until_expiration' => $activeSubscription->daysUntilExpiration(),
                        'is_cancelled' => $activeSubscription->isCancelled(),
                    ];
                }
            } catch (\Exception $e) {
                Log::warning('Failed to load subscription in HandleInertiaRequests: ' . $e->getMessage());
            }
        }

        // Get current locale and translations
        $locale = $request->get('lang', session('locale', config('app.locale', 'en')));
        
        // Store the locale in session if provided via URL parameter
        if ($request->has('lang') && in_array($request->get('lang'), ['en', 'fr'])) {
            session(['locale' => $request->get('lang')]);
            $locale = $request->get('lang');
        }
        
        app()->setLocale($locale);
        
        // Load translations for the current page
        $translations = [];
        try {
            // Get current route to determine which translations to load
            $routeName = $request->route()?->getName();
            $currentPath = $request->path();
            
            // Load dashboard translations for all employee pages since they share navigation
            if (str_contains($routeName ?? '', 'dashboard') || 
                str_contains($currentPath, 'employee/') || 
                str_contains($routeName ?? '', 'employee.') ||
                str_contains($currentPath, 'worker/') || 
                str_contains($routeName ?? '', 'worker.') ||
                str_contains($currentPath, 'subscriptions') ||
                str_contains($currentPath, 'settings/') ||
                str_contains($currentPath, 'admin/') ||
                str_contains($currentPath, 'employer/')) {
                $translations = __('dashboard');
                
                // Load jobs translations for employer job pages
                if (str_contains($routeName ?? '', 'jobs') || str_contains($currentPath, 'jobs')) {
                    $jobsTranslations = __('jobs');
                    if (is_array($jobsTranslations)) {
                        $translations = array_merge($translations ?? [], ['jobs' => $jobsTranslations]);
                    }
                }
            } elseif (str_contains($routeName ?? '', 'onboarding')) {
                $translations = __('onboarding');
            } elseif (str_contains($routeName ?? '', 'welcome') || str_contains($routeName ?? '', 'home') || $currentPath === '/') {
                $translations = __('welcome');
            }
            
            // Always include common translations
            if (is_array($translations)) {
                $translations = array_merge($translations, [
                    'common' => [
                        'loading' => __('Loading...'),
                        'save' => __('Save'),
                        'cancel' => __('Cancel'),
                        'edit' => __('Edit'),
                        'delete' => __('Delete'),
                        'confirm' => __('Confirm'),
                        'yes' => __('Yes'),
                        'no' => __('No'),
                    ]
                ]);
            }
        } catch (\Exception $e) {
            Log::warning('Failed to load translations: ' . $e->getMessage());
            $translations = [];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user,
            ],
            'subscription' => $subscription,
            'locale' => $locale,
            'translations' => $translations,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            // Include CSRF token in every response so frontend can update meta tag
            'csrfToken' => $request->session()->token(),
        ];
    }
}
