# Subscription Plan Checking Guide

This guide shows you all the ways to check if a user has a Professional (or any other) subscription plan in your application.

## 📱 Frontend (React/Inertia)

### Basic Usage in React Components

```tsx
import { usePage } from '@inertiajs/react';

export default function SomeComponent() {
    const { subscriptionStatus, subscription } = usePage().props;
    
    // Check if user has Professional plan
    if (subscriptionStatus.has_professional) {
        return (
            <div className="premium-feature">
                <h3>Advanced Analytics</h3>
                <p>You have access to advanced analytics!</p>
            </div>
        );
    }
    
    // Check if user has Enterprise plan
    if (subscriptionStatus.has_enterprise) {
        return (
            <div className="enterprise-feature">
                <h3>API Access</h3>
                <p>You have full API access!</p>
            </div>
        );
    }
    
    // Show current plan name
    return (
        <div>
            <p>Current Plan: {subscription?.plan_name || 'Free'}</p>
            {!subscriptionStatus.has_paid_plan && (
                <a href="/subscriptions">Upgrade Now</a>
            )}
        </div>
    );
}
```

### Conditional Rendering Based on Plan

```tsx
export default function Dashboard() {
    const { subscriptionStatus } = usePage().props;
    
    return (
        <div>
            <h1>Dashboard</h1>
            
            {/* Show only for Professional or Enterprise */}
            {(subscriptionStatus.has_professional || subscriptionStatus.has_enterprise) && (
                <section>
                    <h2>Advanced Features</h2>
                    <ul>
                        <li>Featured Job Listings</li>
                        <li>Advanced Worker Search</li>
                        <li>Priority Messaging</li>
                    </ul>
                </section>
            )}
            
            {/* Show only for Enterprise */}
            {subscriptionStatus.has_enterprise && (
                <section>
                    <h2>Enterprise Features</h2>
                    <ul>
                        <li>Unlimited Job Postings</li>
                        <li>Custom Branding</li>
                        <li>API Access</li>
                        <li>Dedicated Account Manager</li>
                    </ul>
                </section>
            )}
            
            {/* Show upgrade prompt for free tier */}
            {!subscriptionStatus.has_paid_plan && (
                <div className="upgrade-banner">
                    <p>Unlock premium features with a paid plan!</p>
                    <a href="/subscriptions">View Plans</a>
                </div>
            )}
        </div>
    );
}
```

### Creating a Subscription Guard Component

```tsx
// components/SubscriptionGuard.tsx
import { usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

interface SubscriptionGuardProps extends PropsWithChildren {
    plan: 'professional' | 'enterprise' | 'pro_employee' | 'premium_employee' | 'any_paid';
    fallback?: React.ReactNode;
}

export default function SubscriptionGuard({ plan, fallback, children }: SubscriptionGuardProps) {
    const { subscriptionStatus } = usePage().props;
    
    const hasAccess = {
        professional: subscriptionStatus.has_professional,
        enterprise: subscriptionStatus.has_enterprise,
        pro_employee: subscriptionStatus.has_pro_employee,
        premium_employee: subscriptionStatus.has_premium_employee,
        any_paid: subscriptionStatus.has_paid_plan,
    }[plan];
    
    if (!hasAccess) {
        return fallback || (
            <div className="upgrade-prompt">
                <p>This feature requires a {plan.replace('_', ' ')} subscription.</p>
                <a href="/subscriptions">Upgrade Now</a>
            </div>
        );
    }
    
    return <>{children}</>;
}

// Usage:
<SubscriptionGuard plan="professional">
    <AdvancedAnalytics />
</SubscriptionGuard>
```

## 🔧 Backend (PHP/Laravel)

### In Controllers

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmployerController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        
        // Check if user has Professional plan
        if ($user->hasProfessionalPlan()) {
            // Allow access to advanced features
            $analytics = $this->getAdvancedAnalytics();
        }
        
        // Get current plan
        $currentPlan = $user->getCurrentPlan();
        
        return inertia('employer/dashboard', [
            'current_plan' => $currentPlan,
            'has_professional' => $user->hasProfessionalPlan(),
            'has_enterprise' => $user->hasEnterprisePlan(),
        ]);
    }
    
    public function advancedFeature()
    {
        $user = Auth::user();
        
        // Check if user has required plan
        if (!$user->hasProfessionalPlan() && !$user->hasEnterprisePlan()) {
            return redirect()
                ->route('subscriptions.index')
                ->with('error', 'This feature requires Professional or Enterprise plan.');
        }
        
        // User has access, continue...
        return inertia('employer/advanced-feature');
    }
}
```

### In Routes (Using Middleware)

```php
// routes/web.php

// Only Professional plan users can access these routes
Route::middleware(['auth', 'subscription.plan:Professional'])->group(function () {
    Route::get('/employer/analytics', [AnalyticsController::class, 'index']);
    Route::get('/employer/featured-jobs', [JobController::class, 'featured']);
    Route::get('/employer/team-management', [TeamController::class, 'index']);
});

// Only Enterprise plan users can access these routes
Route::middleware(['auth', 'subscription.plan:Enterprise'])->group(function () {
    Route::get('/employer/api-settings', [ApiController::class, 'settings']);
    Route::get('/employer/custom-branding', [BrandingController::class, 'index']);
    Route::get('/employer/dedicated-support', [SupportController::class, 'dedicated']);
});

// Multiple plan access (Professional OR Enterprise)
Route::middleware(['auth'])->group(function () {
    Route::get('/employer/premium-feature', function () {
        $user = Auth::user();
        
        if (!$user->hasProfessionalPlan() && !$user->hasEnterprisePlan()) {
            abort(403, 'Requires Professional or Enterprise plan');
        }
        
        return inertia('employer/premium-feature');
    });
});
```

### Creating a Custom Can Check

```php
// In a Service Provider (e.g., AppServiceProvider)

use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    // Define a gate for Professional plan features
    Gate::define('use-professional-features', function ($user) {
        return $user->hasProfessionalPlan() || $user->hasEnterprisePlan();
    });
    
    Gate::define('use-enterprise-features', function ($user) {
        return $user->hasEnterprisePlan();
    });
}

// Usage in controllers:
if (Gate::allows('use-professional-features')) {
    // User can access Professional features
}

// Or in Blade:
@can('use-professional-features')
    <div>Professional features here</div>
@endcan
```

### In API Resources

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'subscription' => [
                'current_plan' => $this->getCurrentPlan()?->name,
                'has_professional' => $this->hasProfessionalPlan(),
                'has_enterprise' => $this->hasEnterprisePlan(),
                'has_paid_plan' => $this->hasPaidSubscription(),
            ],
        ];
    }
}
```

## 🎯 Available Helper Methods

### User Model Methods

```php
// Check specific plans
$user->hasProfessionalPlan()     // Returns bool
$user->hasEnterprisePlan()       // Returns bool
$user->hasProEmployeePlan()      // Returns bool (for employees)
$user->hasPremiumEmployeePlan()  // Returns bool (for employees)

// Generic plan check (by name)
$user->hasActivePlan('Professional')  // Returns bool

// Get current plan
$currentPlan = $user->getCurrentPlan();  // Returns SubscriptionPlan|null

// Check if user has any paid subscription
$user->hasPaidSubscription()  // Returns bool

// Cashier Paddle methods (also available)
$user->subscribed()                              // Has any active subscription
$user->subscribedToProduct($paddleProductId)     // Subscribed to specific product
$user->subscribedToPrice($paddlePriceId)         // Subscribed to specific price
```

### Frontend Props (Inertia)

All Inertia pages automatically receive these props:

```typescript
{
    subscription: {
        plan_name: string,      // e.g., "Professional"
        plan_slug: string,      // e.g., "professional"
        plan_type: string,      // "employer" or "employee"
        price: number,          // Monthly price
        is_free_tier: boolean,
    } | null,
    
    subscriptionStatus: {
        has_professional: boolean,
        has_enterprise: boolean,
        has_pro_employee: boolean,
        has_premium_employee: boolean,
        has_paid_plan: boolean,
    },
    
    isFreeTier: boolean,
}
```

## 🔐 Middleware Usage

The `subscription.plan` middleware has been registered. Use it like this:

```php
// Single plan required
Route::middleware(['subscription.plan:Professional'])->group(function () {
    // Routes here
});

// In controller constructor
public function __construct()
{
    $this->middleware('subscription.plan:Professional')->only(['advancedFeature']);
    $this->middleware('subscription.plan:Enterprise')->only(['enterpriseFeature']);
}
```

## 🧪 Testing Subscription Checks

```php
// In your tests
use App\Models\User;
use App\Models\SubscriptionPlan;

public function test_professional_user_can_access_feature()
{
    $user = User::factory()->create(['role' => 'employer']);
    $plan = SubscriptionPlan::where('name', 'Professional')->first();
    
    // Create subscription (you'll need to set this up properly with Paddle)
    // ...
    
    $this->actingAs($user)
        ->get('/employer/advanced-analytics')
        ->assertStatus(200);
}

public function test_free_user_cannot_access_professional_feature()
{
    $user = User::factory()->create(['role' => 'employer']);
    
    $this->actingAs($user)
        ->get('/employer/advanced-analytics')
        ->assertRedirect(route('subscriptions.index'));
}
```

## 📝 Example: Complete Feature Implementation

Here's a complete example of implementing a "Team Management" feature that requires Professional plan:

**Route:**
```php
Route::middleware(['auth', 'subscription.plan:Professional'])
    ->get('/employer/team', [TeamController::class, 'index'])
    ->name('employer.team');
```

**Controller:**
```php
public function index()
{
    $user = Auth::user();
    $currentPlan = $user->getCurrentPlan();
    
    // Get team member limit from plan
    $teamLimit = $currentPlan->team_members_limit ?? 0;
    
    return inertia('employer/team', [
        'team_limit' => $teamLimit,
        'current_team_size' => $user->teamMembers()->count(),
    ]);
}
```

**React Component:**
```tsx
export default function TeamManagement({ team_limit, current_team_size }) {
    const { subscriptionStatus, subscription } = usePage().props;
    
    const canAddMembers = current_team_size < team_limit;
    
    return (
        <div>
            <h1>Team Management</h1>
            <p>Current Plan: {subscription.plan_name}</p>
            <p>Team Members: {current_team_size} / {team_limit}</p>
            
            {canAddMembers ? (
                <button>Add Team Member</button>
            ) : (
                <div className="upgrade-prompt">
                    <p>You've reached your team member limit.</p>
                    {!subscriptionStatus.has_enterprise && (
                        <a href="/subscriptions">Upgrade to Enterprise for unlimited members</a>
                    )}
                </div>
            )}
        </div>
    );
}
```

## 🚀 Quick Reference

**Frontend:**
- `subscriptionStatus.has_professional` - Boolean check
- `subscription.plan_name` - Current plan name
- `isFreeTier` - Quick free tier check

**Backend:**
- `$user->hasProfessionalPlan()` - Boolean check
- `$user->getCurrentPlan()` - Get full plan object
- `@can('use-professional-features')` - In Blade templates

**Routes:**
- `->middleware('subscription.plan:Professional')` - Require specific plan
- `Gate::allows('use-professional-features')` - Check permissions

---

**Remember:** Always check subscription status before allowing access to premium features! 🎯

