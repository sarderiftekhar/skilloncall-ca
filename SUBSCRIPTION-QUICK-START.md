# 🚀 Subscription Checking - Quick Start Guide

## ✅ You're All Set!

Your subscription checking system is now fully configured. Here's how to use it:

---

## 🎯 **Frontend (React) - Most Common Usage**

### 1. Basic Check in Any Component

```tsx
import { usePage } from '@inertiajs/react';

export default function MyComponent() {
    const { subscriptionStatus, subscription } = usePage().props;
    
    // Check if user has Professional plan
    if (subscriptionStatus.has_professional) {
        return <div>You have Professional access! 🎉</div>;
    }
    
    // Show current plan
    return <div>Current Plan: {subscription?.plan_name || 'Free'}</div>;
}
```

### 2. Conditional Rendering

```tsx
export default function Dashboard() {
    const { subscriptionStatus } = usePage().props;
    
    return (
        <div>
            {/* Show only for Professional users */}
            {subscriptionStatus.has_professional && (
                <AdvancedAnalytics />
            )}
            
            {/* Show only for Enterprise users */}
            {subscriptionStatus.has_enterprise && (
                <APISettings />
            )}
            
            {/* Show for free users */}
            {!subscriptionStatus.has_paid_plan && (
                <UpgradePrompt />
            )}
        </div>
    );
}
```

### 3. Using SubscriptionGuard Component

```tsx
import SubscriptionGuard from '@/components/SubscriptionGuard';

export default function TeamPage() {
    return (
        <SubscriptionGuard plan="professional">
            <TeamManagementFeature />
        </SubscriptionGuard>
    );
}
```

### 4. Using FeatureFlag Component

```tsx
import { FeatureFlag } from '@/components/SubscriptionGuard';

export default function Navbar() {
    return (
        <nav>
            <FeatureFlag requires="professional">
                <a href="/analytics">Analytics</a>
            </FeatureFlag>
            
            <FeatureFlag requires="enterprise">
                <a href="/api-settings">API</a>
            </FeatureFlag>
        </nav>
    );
}
```

---

## 🔧 **Backend (PHP) - Most Common Usage**

### 1. In Controllers

```php
use Illuminate\Support\Facades\Auth;

public function analytics()
{
    $user = Auth::user();
    
    // Check if user has Professional plan
    if ($user->hasProfessionalPlan()) {
        return inertia('employer/analytics');
    }
    
    return redirect()->route('subscriptions.index')
        ->with('error', 'Professional plan required');
}
```

### 2. In Routes (Using Middleware)

```php
// Only Professional users can access
Route::middleware(['auth', 'subscription.plan:Professional'])->group(function () {
    Route::get('/analytics', [AnalyticsController::class, 'index']);
    Route::get('/team', [TeamController::class, 'index']);
});

// Only Enterprise users can access
Route::middleware(['auth', 'subscription.plan:Enterprise'])->group(function () {
    Route::get('/api-settings', [ApiController::class, 'index']);
});
```

### 3. Multiple Plan Check

```php
$user = Auth::user();

if ($user->hasProfessionalPlan() || $user->hasEnterprisePlan()) {
    // User has Professional OR Enterprise
}

// Or use helper:
if ($user->hasPaidSubscription()) {
    // User has ANY paid plan
}
```

---

## 📋 **Available Checks**

### Frontend Props (Always Available)

```typescript
subscriptionStatus.has_professional      // Boolean
subscriptionStatus.has_enterprise        // Boolean
subscriptionStatus.has_pro_employee      // Boolean
subscriptionStatus.has_premium_employee  // Boolean
subscriptionStatus.has_paid_plan         // Boolean

subscription.plan_name                   // String (e.g., "Professional")
subscription.price                       // Number
subscription.is_free_tier                // Boolean
```

### Backend Methods

```php
// Check specific plans
$user->hasProfessionalPlan()      // Boolean
$user->hasEnterprisePlan()        // Boolean
$user->hasProEmployeePlan()       // Boolean (for employees)
$user->hasPremiumEmployeePlan()   // Boolean (for employees)

// Check by name
$user->hasActivePlan('Professional')  // Boolean

// Get full plan object
$plan = $user->getCurrentPlan();  // SubscriptionPlan|null

// Check if any paid plan
$user->hasPaidSubscription()      // Boolean

// Cashier Paddle methods
$user->subscribed()               // Boolean - has any subscription
$user->subscription()             // Get Paddle subscription object
```

---

## 🎨 **Common Patterns**

### Pattern 1: Gated Feature

```tsx
// Frontend
export default function AdvancedFeature() {
    const { subscriptionStatus } = usePage().props;
    
    if (!subscriptionStatus.has_professional) {
        return (
            <div>
                <h2>Upgrade Required</h2>
                <a href="/subscriptions">Upgrade to Professional</a>
            </div>
        );
    }
    
    return <ActualFeature />;
}
```

### Pattern 2: Progressive Disclosure

```tsx
// Show different content based on plan level
export default function JobPosting() {
    const { subscriptionStatus } = usePage().props;
    
    return (
        <div>
            {/* All users */}
            <BasicJobForm />
            
            {/* Professional and up */}
            {subscriptionStatus.has_professional && (
                <FeaturedJobOption />
            )}
            
            {/* Enterprise only */}
            {subscriptionStatus.has_enterprise && (
                <CustomBrandingOption />
            )}
        </div>
    );
}
```

### Pattern 3: Usage Limits

```php
// Backend
public function createJob(Request $request)
{
    $user = Auth::user();
    $plan = $user->getCurrentPlan();
    
    // Check job posting limit
    $jobsThisMonth = $user->jobs()->whereMonth('created_at', now()->month)->count();
    $limit = $plan->job_posts_limit ?? 1;
    
    if ($jobsThisMonth >= $limit) {
        if ($user->hasProfessionalPlan()) {
            return back()->with('error', 'Monthly job posting limit reached');
        } else {
            return redirect()->route('subscriptions.index')
                ->with('error', 'Upgrade to post more jobs');
        }
    }
    
    // Create job...
}
```

---

## 🧪 **Quick Test**

To test if everything is working:

1. **Login as an employer**
2. **Subscribe to Professional plan** at `/subscriptions`
3. **Add this to any page:**

```tsx
export default function TestPage() {
    const { subscriptionStatus, subscription } = usePage().props;
    
    return (
        <div className="p-8">
            <h1>Subscription Status Test</h1>
            <pre>{JSON.stringify({ subscriptionStatus, subscription }, null, 2)}</pre>
        </div>
    );
}
```

You should see your Professional plan status!

---

## 📚 **Full Documentation**

For complete details, see:
- `documentation/subscription-checking-guide.md` - Complete guide with all examples
- `resources/js/types/subscription.ts` - TypeScript types
- `resources/js/components/SubscriptionGuard.tsx` - Reusable components

---

## 🆘 **Need Help?**

**Common Issue**: Props not updating after subscription?
**Fix**: Clear cache: `php artisan optimize:clear`

**Common Issue**: Middleware not working?
**Fix**: Make sure route has both `auth` and `subscription.plan:PlanName`

---

**You're all set! Start building subscription-gated features! 🚀**

