# Paddle Payment Integration with Laravel Cashier

## Overview

This project uses **Laravel Cashier Paddle** for subscription management. Cashier Paddle is Laravel's official package for integrating with Paddle's billing service, providing a clean, fluent API for subscription billing services.

## Migration from Custom Implementation

We have migrated from a custom Paddle integration to Laravel Cashier Paddle for the following benefits:
- **Official Support**: Maintained by the Laravel team
- **Simpler API**: Less boilerplate code
- **Automatic Webhook Handling**: Built-in webhook processing
- **Better Testing**: Well-tested and documented
- **Feature Rich**: Supports trials, swapping, pausing, and more out-of-the-box

## Configuration

### Environment Variables

Add these variables to your `.env` file:

```env
# Paddle Configuration (Laravel Cashier Paddle)
PADDLE_SANDBOX=true                     # Set to false for production
PADDLE_SELLER_ID=your_seller_id        # Your Paddle Seller ID
PADDLE_API_KEY=your_api_key            # Your Paddle API Key
PADDLE_CLIENT_SIDE_TOKEN=your_token    # Client-side token for Paddle.js
PADDLE_WEBHOOK_SECRET=your_secret      # Webhook signing secret
PADDLE_RETAIN_KEY=your_retain_key      # Optional: For Retain integration
```

### Getting Your Paddle Credentials

1. **Seller ID**: Found in your Paddle Dashboard → Developer Tools → Authentication
2. **API Key**: Create one in Developer Tools → Authentication → API Keys
3. **Client-Side Token**: Found in Developer Tools → Authentication → Client-Side Tokens
4. **Webhook Secret**: Set up webhooks in Developer Tools → Notifications, then copy the signing secret

## Database Structure

Laravel Cashier Paddle creates the following tables:

1. **`customers`**: Stores Paddle customer information
2. **`paddle_subscriptions`**: Stores subscription data (renamed from `subscriptions` to avoid conflicts)
3. **`subscription_items`**: Stores subscription line items
4. **`transactions`**: Stores transaction/payment records

Additionally, we maintain our custom tables:

1. **`subscription_plans`**: Local plan definitions
2. **`paddle_products`**: Maps local plans to Paddle product/price IDs
3. **`subscriptions`**: Our legacy subscription table (for reference)

## Key Components

### User Model

The `User` model now uses the `Billable` trait from Cashier:

```php
use Laravel\Paddle\Billable;

class User extends Authenticatable
{
    use Billable;
    // ...
}
```

### Subscription Controller

Simplified to use Cashier's built-in methods:

- **`subscribe()`**: Creates Paddle checkout using `$user->checkout($priceId)`
- **`cancel()`**: Cancels subscription using `$subscription->cancel()`
- **`resume()`**: Resumes a cancelled subscription using `$subscription->resume()`
- **`swap()`**: Changes to a different plan using `$subscription->swap($newPriceId)`

### Frontend Integration

The subscription page (`resources/js/pages/subscriptions/index.tsx`) makes a fetch request to the backend, which returns a Paddle checkout URL. The user is then redirected to Paddle's hosted checkout page.

## Creating Plans in Paddle

### Step 1: Create Products in Paddle

1. Log into Paddle Dashboard
2. Navigate to **Catalog** → **Products**
3. Create a product for each subscription plan (e.g., "Basic Employee Plan", "Pro Employee Plan", "Premium Employee Plan")
4. Note the Product ID for each

### Step 2: Create Prices

For each product, create two prices:
1. **Monthly Price**: `billing_cycle: month, interval: 1`
2. **Yearly Price**: `billing_cycle: year, interval: 1`

Note the Price ID for each.

### Step 3: Map to Local Plans

Insert records into the `paddle_products` table to map your local `subscription_plans` to Paddle products:

```sql
INSERT INTO paddle_products (subscription_plan_id, paddle_product_id, paddle_price_id_monthly, paddle_price_id_yearly, environment) VALUES
(1, 'pro_01234567890', 'pri_monthly_01234567890', 'pri_yearly_01234567890', 'sandbox');
```

Or create a seeder:

```php
PaddleProduct::create([
    'subscription_plan_id' => $plan->id,
    'paddle_product_id' => 'pro_01234567890',
    'paddle_price_id_monthly' => 'pri_monthly_01234567890',
    'paddle_price_id_yearly' => 'pri_yearly_01234567890',
    'environment' => config('paddle.sandbox') ? 'sandbox' : 'production',
]);
```

## Webhooks

### Setup

Cashier Paddle automatically registers webhook routes at `/paddle/webhook`. Configure this in your Paddle Dashboard:

1. Go to **Developer Tools** → **Notifications**
2. Create a new webhook endpoint: `https://yourdomain.com/paddle/webhook`
3. Copy the webhook signing secret and add it to your `.env` as `PADDLE_WEBHOOK_SECRET`

### Handled Events

Cashier automatically handles:
- `subscription.created`
- `subscription.updated`
- `subscription.activated`
- `subscription.paused`
- `subscription.resumed`
- `subscription.canceled`
- `transaction.completed`
- `transaction.updated`

## Testing

### Sandbox Mode

Always test in sandbox mode first:

```env
PADDLE_SANDBOX=true
```

### Test Cards

Paddle provides test card numbers for sandbox testing. See [Paddle's Testing Guide](https://developer.paddle.com/concepts/payment-methods/credit-debit-card#test-card-numbers).

### Webhook Testing

Use Paddle's webhook testing tool in the Dashboard to simulate webhook events.

## Subscription Flow

1. **User selects a plan** on `/subscriptions`
2. **Frontend calls** `POST /subscriptions/subscribe` with `plan_id` and `billing_interval`
3. **Backend creates Paddle checkout** using `$user->checkout($priceId)->returnTo(route('subscriptions.paddle.callback'))->create()`
4. **User is redirected** to Paddle's hosted checkout page
5. **User completes payment** on Paddle
6. **Paddle sends webhook** to `/paddle/webhook` (handled automatically by Cashier)
7. **Cashier creates subscription** in `paddle_subscriptions` table
8. **User is redirected back** to the callback URL with success message

## Subscription Management

### Checking Subscription Status

```php
$user = Auth::user();

// Get active subscription
$subscription = $user->subscription();

// Check status
if ($subscription && $subscription->recurring()) {
    // User has active subscription
}

// Check if on trial
if ($subscription && $subscription->onTrial()) {
    // User is on trial
}

// Check if cancelled (but still in grace period)
if ($subscription && $subscription->cancelled()) {
    // Subscription is cancelled but still active until period end
}
```

### Cancel Subscription

```php
$subscription = $user->subscription();
$subscription->cancel(); // Cancels at period end
```

### Resume Subscription

```php
$subscription = $user->subscription();
if ($subscription->cancelled()) {
    $subscription->resume();
}
```

### Swap Plans

```php
$subscription = $user->subscription();
$subscription->swap($newPriceId); // Prorates automatically
```

## Security

- **Webhook Verification**: Cashier automatically verifies webhook signatures
- **HTTPS Required**: Always use HTTPS in production
- **API Keys**: Never expose API keys in frontend code
- **Environment**: Use separate Paddle accounts for sandbox and production

## Troubleshooting

### Webhook Not Firing

1. Check that webhook URL is correct in Paddle Dashboard
2. Verify `PADDLE_WEBHOOK_SECRET` is set correctly
3. Check Laravel logs: `storage/logs/laravel.log`
4. Use Paddle's webhook testing tool

### Subscription Not Created

1. Check Cashier's table: `paddle_subscriptions`
2. Verify price ID exists in Paddle
3. Check for errors in `transactions` table
4. Review Laravel logs

### Checkout Fails

1. Verify `PADDLE_SELLER_ID` and `PADDLE_API_KEY` are correct
2. Check that price ID exists in `paddle_products` table
3. Ensure sandbox mode matches Paddle environment

## Resources

- [Laravel Cashier Paddle Documentation](https://laravel.com/docs/11.x/cashier-paddle)
- [Paddle API Documentation](https://developer.paddle.com/api-reference/overview)
- [Paddle Dashboard](https://vendors.paddle.com)

## Files Modified/Created

### Created
- `config/cashier.php` - Cashier configuration
- `database/migrations/*_create_customers_table.php`
- `database/migrations/*_create_paddle_subscriptions_table.php`
- `database/migrations/*_create_subscription_items_table.php`
- `database/migrations/*_create_transactions_table.php`

### Modified
- `app/Models/User.php` - Added `Billable` trait
- `app/Http/Controllers/SubscriptionController.php` - Simplified to use Cashier methods
- `routes/web.php` - Updated subscription routes
- `.env` - Added Cashier Paddle configuration
- `resources/js/pages/subscriptions/index.tsx` - Updated to handle Paddle checkout redirect

### Removed (Custom Implementation)
- `app/Services/PaddleService.php`
- `app/Http/Controllers/PaddleWebhookController.php`
- `app/Jobs/ProcessPaddleWebhook.php`
- `config/paddle.php`
- `app/Models/PaddleProduct.php`

## Next Steps

1. ✅ Install Laravel Cashier Paddle
2. ✅ Configure environment variables
3. ✅ Run migrations
4. ✅ Update User model with Billable trait
5. ✅ Simplify controllers to use Cashier methods
6. ⏳ Create products and prices in Paddle Dashboard
7. ⏳ Map Paddle products to local plans in `paddle_products` table
8. ⏳ Set up webhook endpoint in Paddle
9. ⏳ Test subscription flow in sandbox
10. ⏳ Test webhook events
11. ⏳ Move to production with real Paddle credentials

