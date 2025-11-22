# Paddle Setup Guide - Pro Employee Plan

Follow these steps to set up your Pro Employee subscription plan in Paddle Sandbox.

## ✅ What's Already Done

- ✅ Laravel Cashier Paddle installed
- ✅ Database migrations run
- ✅ User model configured with Billable trait
- ✅ Controllers set up
- ✅ Frontend ready
- ✅ Helper commands created

## 📋 Your Checklist - What YOU Need to Do in Paddle

### Step 1: Get Authentication Credentials

You're already on this page: `https://vendors.paddle.com/authentication-v2`

#### 1.1 Get Seller ID
- Look at the top of the Authentication page
- You should see your **Seller ID** (format: `sel_01xxxxxxxxxxxxx`)
- **Copy it** and save for Step 7

#### 1.2 Get API Key
- You already have: `pdl_live_apikey_01kamdpd4d***`
- **⚠️ IMPORTANT**: Since you're in **Paddle Billing** (not Classic), this should work for sandbox too
- Click the **three dots (...)** next to "Skill On Call" API key
- Click **"Reveal"** to see the full key
- **Copy the FULL key** and save for Step 7

#### 1.3 Get Client-Side Token
- On the same Authentication page, scroll down to **"Client-side tokens"** section
- Click **"+ New client-side token"** if you don't have one
- Give it a name: "SkillOnCall Checkout"
- **Copy the token** (format: `test_xxxxxxxxxxxxx`) and save for Step 7

---

### Step 2: Create "Pro Employee" Product

1. Click **"Catalog"** in the left sidebar
2. Click **"Products"**
3. Click **"+ Create product"** button
4. Fill in:
   - **Name**: `Pro Employee Plan`
   - **Description**: `Enhanced profile with portfolio showcase, priority in search results, advanced job filters, application tracking, performance analytics, priority support, and skills verification badges`
   - **Tax category**: Choose **"Standard"** or **"Digital goods"**
   - **Image**: Optional
5. Click **"Save"** or **"Create"**
6. **📝 COPY THE PRODUCT ID** (format: `pro_01xxxxxxxxxxxxx`) - you'll need this for Step 7!

---

### Step 3: Create Monthly Price

1. On the product page you just created, scroll to the **"Prices"** section
2. Click **"+ Add price"** or **"Create price"**
3. Fill in:
   - **Description**: `Pro Employee - Monthly`
   - **Price**:
     - **Amount**: `19.99`
     - **Currency**: `CAD` (or USD)
   - **Billing period**:
     - **Interval**: Select **"Month"**
     - **Frequency**: `1`
   - **Trial period**: `0` days (or set if you want trials)
4. Click **"Save"** or **"Create"**
5. **📝 COPY THE PRICE ID** (format: `pri_01xxxxxxxxxxxxx`) - this is your MONTHLY price ID!

---

### Step 4: Create Yearly Price

1. Still on the same product page, click **"+ Add price"** again
2. Fill in:
   - **Description**: `Pro Employee - Yearly`
   - **Price**:
     - **Amount**: `199.00` (gives ~17% discount vs monthly)
     - **Currency**: `CAD`
   - **Billing period**:
     - **Interval**: Select **"Year"**
     - **Frequency**: `1`
   - **Trial period**: `0` days
3. Click **"Save"** or **"Create"**
4. **📝 COPY THE PRICE ID** - this is your YEARLY price ID!

---

### Step 5: Set Up Webhooks

1. Click **"Developer Tools"** → **"Notifications"** in left sidebar
2. Click **"+ Create notification destination"** or **"New destination"**
3. Fill in:
   - **Description**: `SkillOnCall Webhook`
   - **Destination type**: **Webhook**
   - **URL**: 
     - For now, use: `https://webhook.site` (get a temporary URL)
     - Later we'll update this with ngrok/expose URL
4. **Select these events** (check all that apply):
   - ✅ `subscription.created`
   - ✅ `subscription.updated`
   - ✅ `subscription.activated`
   - ✅ `subscription.past_due`
   - ✅ `subscription.paused`
   - ✅ `subscription.resumed`
   - ✅ `subscription.canceled`
   - ✅ `transaction.completed`
   - ✅ `transaction.payment_failed`
5. Click **"Save"**
6. **📝 COPY THE WEBHOOK SECRET KEY** that appears (format: `pdl_ntfset_01xxxxxxxxxxxxx`)

---

### Step 6: Install ngrok or Expose (for local testing)

Since you're testing locally on `skilloncall-ca.test`, Paddle can't reach you. You need a tunnel:

**Option A: Expose (Recommended for Laravel)**
```bash
composer global require beyondcode/expose
expose share http://skilloncall-ca.test
```

**Option B: ngrok**
```bash
# Download from https://ngrok.com/download
ngrok http 80 --host-header=skilloncall-ca.test
```

After running, you'll get a public URL like:
- Expose: `https://skilloncall-ca-xxxxx.sharedwithexpose.com`
- ngrok: `https://xxxx-xx-xxx-xxx-xx.ngrok-free.app`

**Then go back to Paddle** → Developer Tools → Notifications → Edit your webhook → Update URL to:
```
https://your-tunnel-url/paddle/webhook
```

---

### Step 7: Update Your .env File

Now open your `.env` file and fill in ALL the values you collected:

```env
PADDLE_SANDBOX=true
PADDLE_SELLER_ID=sel_01xxxxxxxxxxxxx          # From Step 1.1
PADDLE_API_KEY=pdl_live_apikey_01xxxxx...     # From Step 1.2 (FULL key!)
PADDLE_CLIENT_SIDE_TOKEN=test_xxxxxxxxxxxxx   # From Step 1.3
PADDLE_WEBHOOK_SECRET=pdl_ntfset_01xxxxxxx    # From Step 5
PADDLE_RETAIN_KEY=                             # Leave empty
```

**Save the file!**

---

### Step 8: Map Product to Database

Run this command with YOUR values from Steps 2-4:

```bash
php artisan paddle:map-product "Pro Employee" pro_01xxxxxxxxxxxxx pri_01xxxxxxxxxxxxx pri_01xxxxxxxxxxxxx
```

Replace:
- `pro_01xxxxxxxxxxxxx` = Product ID from Step 2
- First `pri_01xxxxxxxxxxxxx` = Monthly Price ID from Step 3
- Second `pri_01xxxxxxxxxxxxx` = Yearly Price ID from Step 4

Example:
```bash
php artisan paddle:map-product "Pro Employee" pro_01j9abc123def456 pri_01j9month789xyz pri_01j9year456abc
```

---

## 🎯 Summary - What You Need to Collect

| Item | Where to Find | Format | What to do with it |
|------|---------------|--------|-------------------|
| **Seller ID** | Developer Tools → Authentication (top of page) | `sel_01xxxxx` | Add to `.env` |
| **API Key** | Developer Tools → Authentication → Reveal "Skill On Call" key | `pdl_live_apikey_01xxxxx` | Add to `.env` |
| **Client-Side Token** | Developer Tools → Authentication → Client-side tokens | `test_xxxxx` | Add to `.env` |
| **Product ID** | Catalog → Products (after creating) | `pro_01xxxxx` | Use in Step 8 command |
| **Monthly Price ID** | Product → Prices (after creating monthly) | `pri_01xxxxx` | Use in Step 8 command |
| **Yearly Price ID** | Product → Prices (after creating yearly) | `pri_01xxxxx` | Use in Step 8 command |
| **Webhook Secret** | Developer Tools → Notifications (after creating) | `pdl_ntfset_01xxxxx` | Add to `.env` |

---

## 🧪 After Setup - Test It!

1. List your plans to verify mapping:
   ```bash
   php artisan paddle:list-plans
   ```

2. Log into your app as an **employee** user

3. Go to `/subscriptions` page

4. Click **"Upgrade Now"** on Pro Employee plan

5. You should be redirected to Paddle checkout!

6. Use test card: `4242 4242 4242 4242` (any future date, any CVV)

7. Complete checkout

8. Check database:
   ```bash
   php artisan tinker
   DB::table('paddle_subscriptions')->latest()->first();
   ```

---

## ❓ Need Help?

Run these commands anytime:

```bash
# List all plans and their mapping status
php artisan paddle:list-plans

# Map a product
php artisan paddle:map-product "Plan Name" pro_xxx pri_monthly_xxx pri_yearly_xxx

# Check your config
php artisan tinker
config('paddle')
```

---

## 🎉 Once This Works...

Repeat the same process for **Premium Employee** plan with $39.99/month pricing!

