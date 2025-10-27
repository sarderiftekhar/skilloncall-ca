# SkillOnCall.ca - Worker Platform Design & Implementation Plan

## Executive Summary

**SkillOnCall.ca is a CONNECTION PLATFORM** that enables Canadian workers and employers to find and contact each other. The platform facilitates discovery, communication, and reviews—but does NOT manage jobs, payments, or work safety.

**Business Model**: Subscription-based access and job posting fees. Workers and employers handle all work arrangements, payments, and safety independently.

Implementation spans 4 phases over 8-10 weeks.

---

## ⚠️ **CRITICAL: TARGET MARKET - LOW-SKILL SERVICE INDUSTRY WORK**

**This platform is specifically designed for the SERVICE INDUSTRY and LOW-SKILL ON-DEMAND WORK.**

### **Target Job Types**:
- **Food Service**: Chef, Cook, Barista, Server, Waiter, Dishwasher, Food Prep, Line Cook
- **Retail**: Cashier, Sales Associate, Stock Worker, Merchandise, Customer Service
- **Hospitality**: Hotel Housekeeping, Porter, Room Attendant, Concierge
- **Specialized Services**: Barber, Hair Stylist, Cleaner, Janitor, Maintenance
- **Specialized Retail**: Butcher, Deli Worker, Baker, Fishmonger
- **Logistics**: Delivery Driver, Courier, Warehouse Worker, Stocker
- **General Labor**: Helper, Laborer, Assistant, Loader

### **Target Employers**:
- Restaurants, Cafes, Bars, Pubs
- Retail Stores (clothing, electronics, grocery)
- Grocery Stores, Butcher Shops, Bakeries
- Hair Salons, Barbershops
- Hotels, Hostels, B&Bs
- Cleaning Companies, Maintenance Services
- Delivery Services, Courier Companies
- Small Businesses needing flexible staff

### **Why This Matters**:
- ✅ **Hourly rates**: $16-$30/hr (not project-based)
- ✅ **Shift-based work**: Hours, days, weeks (not months/years)
- ✅ **Quick hiring**: Need to fill gaps immediately
- ✅ **High volume**: Frequent job postings and worker turnover
- ✅ **Simple skills**: No complex onboarding or certifications needed
- ✅ **Flexible workforce**: Workers want immediate opportunities

**DO NOT design or develop with tech freelance jobs in mind. This is a service industry on-demand platform.**

---

## 📊 **Dummy Jobs for Development**

### **Required Dummy Job Examples** (for testing worker search/browse):

Instead of tech jobs, create realistic service industry jobs like:

#### **Food Service Jobs** (Food Safety, Cashier, Server skills):
1. "Evening Cashier - Metro Foods" - Toronto - $18-20/hr - Part-time
2. "Weekend Barista - Bean There Coffee" - Toronto - $16-18/hr - Flexible
3. "Line Cook - Restaurant Downtown" - Toronto - $22-25/hr - Full-time
4. "Server - Busy Pub" - Toronto - $17-19/hr + tips - Evening shifts
5. "Food Prep - Catering Company" - Toronto - $19-21/hr - Various shifts

#### **Retail Jobs** (Customer Service, POS, Cashier skills):
6. "Stock Worker - Grocery Store" - Toronto - $17.50-19/hr - Overnight
7. "Retail Associate - Fashion Store" - Toronto - $16-18/hr - Weekends
8. "Customer Service - Electronics Store" - Toronto - $18-20/hr - Flexible

#### **Specialized Services** (Specific certifications):
9. "Cleaner - Office Building" - Toronto - $18-20/hr - Evenings
10. "Butcher Assistant - Butcher Shop" - Toronto - $20-22/hr - Full-time
11. "Barber/Hair Stylist - Salon" - Toronto - $16-25/hr - Flexible

#### **Delivery & Logistics** (Transportation):
12. "Delivery Driver - Food Delivery" - Toronto - $18-22/hr - Flexible
13. "Warehouse Stocker - Distribution Center" - Toronto - $19-21/hr - Shifts

### **Job Schema Adjustments Needed**:
- Replace `budget` with `hourly_rate_min` and `hourly_rate_max`
- Replace `deadline` with `start_date` and `shift_pattern`
- Add `posted_by_employer_id` for tracking applications
- Add `location_postal_code` for geographic filtering
- Keep `required_skills` but populate with actual service industry skills
- Keep `experience_level` (entry, intermediate, expert)

---

## 🎯 Platform Scope & Limitations

### ✅ What SkillOnCall DOES:
- Connect workers with employers based on skills, location, and availability
- Enable messaging and communication
- Provide profile visibility and search
- Facilitate reviews and ratings **after** work completion
- Manage subscription memberships

### ❌ What SkillOnCall DOES NOT DO:
- ❌ Manage job execution, scheduling, or time tracking
- ❌ Process payments for work (workers/employers handle directly)
- ❌ Calculate breaks, overtime, or hours worked
- ❌ Check-in/check-out systems
- ❌ Escrow or payment protection
- ❌ Job safety monitoring
- ❌ Contract enforcement
- ❌ Dispute resolution

### 💡 Platform Responsibility:
**SkillOnCall.ca acts as a marketplace connector only. All work arrangements, safety, payments, and legal obligations are between the worker and employer directly.**

---

## 🔄 Job-Worker Connection Workflow

### How It Works (Interest-Based System with Privacy):

```
1. EMPLOYER POSTS JOB
   ↓
2. WORKER APPLIES (EXPRESSES INTEREST)
   • Worker sees job listing
   • Clicks "Apply" button
   • Simple interest notification sent to employer
   • Worker's contact details remain HIDDEN
   ↓
3. EMPLOYER GETS NOTIFICATION
   • "5 workers interested in your job posting"
   • Can view each interested worker's profile
   • Reviews skills, experience, ratings, availability
   ↓
4. EMPLOYER INITIATES CONTACT
   • Selects worker(s) to contact
   • Sends message through platform (instant messaging)
   • Worker receives message notification
   • Contact details stay hidden (privacy protected)
   ↓
5. INSTANT MESSAGING CONVERSATION
   • Both parties discuss job details via platform
   • Negotiate terms, rates, schedule
   • Share availability and requirements
   • No external contact needed
   ↓
6. EMPLOYER MARKS AS HIRED
   • Selects 1 worker as "hired" for this job
   • Worker gets notification
   • Job post marked as "Filled" or "Closed"
   ↓
7. WORK HAPPENS
   • Parties exchange contact details if needed
   • Work arranged directly between them
   • Platform NOT involved in execution
   ↓
8. EMPLOYER COMPLETES JOB
   • Marks job as "Completed" with hired worker
   • Both parties receive review request
   ↓
9. MUTUAL REVIEWS
   • Both leave ratings and feedback
   • Reviews visible after both submit (or 7 days)
```

### Key Points:
- ✅ **"Apply" button** - Workers express interest in jobs
- ✅ **Contact details HIDDEN** - Privacy protected until parties agree
- ✅ **Employer initiates contact** - Picks from interested workers
- ✅ **Instant messaging** - Built-in platform communication
- ✅ **Employer declares hired** - Closes job posting
- ✅ **Job statuses**: Active → Filled → Completed
- ✅ **Reviews triggered** - When employer completes job

### Privacy & Security:
- Worker phone/email hidden from employer initially
- Employer contact details hidden from workers
- All communication through platform messaging
- Parties can share contact info in messages if they choose
- Report/block features for safety

---

## 🇨🇦 Canadian Compliance Requirements

### Federal & Provincial Regulations

- **Privacy**: PIPEDA (Personal Information Protection and Electronic Documents Act)
- **Platform Liability**: Clear Terms of Service disclaiming work arrangement responsibility
- **Data Protection**: Secure storage of personal information
- **Work Authorization**: Display only (not verification responsibility)
- **Certification Display**: User-provided information (not platform-validated)
- **Accessibility**: WCAG 2.1 AA compliance
- **Bilingual Support**: English/French for federal requirement areas

### Key Compliance Features

- **SIN Protection**: Optional field, encrypted if provided (for worker tax purposes)
- **Privacy Consent**: Clear opt-in for profile visibility
- **Data Retention**: 7 years for tax/legal (CRA requirement)
- **Right to be Forgotten**: PIPEDA Article 9 compliance
- **Terms of Service**: Clear disclaimers about platform scope
- **User Verification**: Optional badges (admin-approved)

---

## 📋 Complete Worker Menu Structure

### Primary Navigation (Sidebar - Left)

```
┌─────────────────────────────┐
│ [Logo] SkillOnCall.ca      │
├─────────────────────────────┤
│ 🏠 Dashboard               │
│ 🔍 Browse Jobs             │
│ 💬 Messages                │
│ ⏰ My Availability         │
│ 👤 My Profile              │
│ 💳 Subscription   [Badge]  │
├─────────────────────────────┤
│ 📊 Analytics      [PRO]    │
│ 📹 Profile Video  [ELITE]  │
│ 🎓 Certifications          │
│ ⭐ Reviews & Ratings       │
│ 📁 Portfolio               │
├─────────────────────────────┤
│ ⚙️ Settings                │
│ 🆘 Support                 │
│ 📚 Help Center             │
│ 🚪 Logout                  │
└─────────────────────────────┘
```

**Removed**:
- ❌ My Applications (no formal application system)
- ❌ Booking Requests (no booking management)
- ❌ Earnings & Payments (handled externally)

---

## 📄 Detailed Page Specifications

### 1. 🏠 DASHBOARD PAGE

**Route**: `/worker/dashboard`

**Purpose**: Overview of worker's platform activity and visibility

**Layout Structure**:

```
┌────────────────────────────────────────────────────────────┐
│ HEADER: "Worker Dashboard"                                 │
│ Subtitle: "Welcome back! Here's your activity overview."   │
│ Right: [Profile Complete Badge] [Active Worker Status]     │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─ SUBSCRIPTION BANNER (if Free/Pro) ──────────────────┐  │
│ │ 🎯 Current Plan: FREE                                 │  │
│ │ Upgrade to Pro for featured visibility & more!        │  │
│ │                                      [Upgrade Now →]  │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── QUICK STATS (4 Cards) ──────────────────────────────┐ │
│ │ [Profile Views]    [Applications]                     │ │
│ │      145                5                             │ │
│ │  +23% from last mo  Pending                          │ │
│ │                                                        │ │
│ │ [Employer Msgs]    [Average Rating]                  │ │
│ │      3                 4.8/5                          │ │
│ │  New replies        Based on 12 reviews              │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌── ANALYTICS SUMMARY (Pro/Elite Only) ────────────────┐  │
│ │ 📈 This Week's Performance                            │  │
│ │ • Profile Views: 45 (+12%)                           │  │
│ │ • Search Appearances: 123                            │  │
│ │ • Employer Contact Rate: 15%                         │  │
│ │                         [View Full Analytics →]      │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── RECENT MESSAGES ───────────────────────────────────┐  │
│ │ 💬 Recent Conversations (3 new)                       │  │
│ │                                                        │  │
│ │ Restaurant Downtown - "Are you available..."         │  │
│ │ Cafe Express - "Thanks for your interest..."         │  │
│ │                                                        │  │
│ │                              [View All Messages →]   │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── RECENT JOB POSTINGS IN YOUR AREA ─────────────────┐  │
│ │ 🔍 New Opportunities (23 new this week)               │  │
│ │                                                        │  │
│ │ [JOB CARD] Evening Cashier - Metro Foods             │  │
│ │ $18-20/hr • 2.3km away • Posted 2h ago              │  │
│ │                                                        │  │
│ │                              [Browse All Jobs →]     │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌─ AVAILABILITY ────┐  ┌─ PROFILE COMPLETION ──────────┐ │
│ │ ⏰ This Week       │  │ ✅ Profile: 85%               │ │
│ │ Status: Available  │  │ • Add portfolio photos        │ │
│ │ 35 hours set       │  │ • Get verified badge          │ │
│ │ [Edit Schedule]    │  │ [Complete Profile →]          │ │
│ └────────────────────┘  └───────────────────────────────┘ │
│                                                             │
│ ┌── PENDING REVIEWS ───────────────────────────────────┐  │
│ │ ⚠️ You have 2 completed jobs awaiting reviews        │  │
│ │ Help other workers by leaving feedback!               │  │
│ │                              [Review Now →]          │  │
│ └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

**Features**:
- Real-time profile performance statistics
- Subscription status and upgrade prompts
- Recent messages and job opportunities
- Availability status at a glance
- Profile completion percentage
- Review reminders

---

### 2. 🔍 BROWSE JOBS PAGE

**Route**: `/worker/jobs`

**Purpose**: Search and discover job postings from employers

**Features**:
- Advanced search and filters
- Location-based results (postal code proximity)
- Skill matching percentage
- Saved searches
- Job interest notifications (not formal applications)

**Layout**:

```
┌────────────────────────────────────────────────────────────┐
│ HEADER: "Browse Jobs"                                      │
│ Subtitle: "Discover opportunities that match your skills"  │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌── SEARCH & FILTERS ─────────────────────────────────┐   │
│ │ [Search: "e.g., Cashier, Cook..."]    [🔍 Search]   │   │
│ │                                                       │   │
│ │ Filters:                                             │   │
│ │ [Location: Your Area ▼] [Skills: All ▼]            │   │
│ │ [Rate: $15-$50/hr ▼]   [Type: All ▼]               │   │
│ │ [Distance: 25km ▼]     [Posted: Any time ▼]        │   │
│ │                                                       │   │
│ │ ☑ Verified employers only                           │   │
│ │ ☐ Urgent needs        ☐ Long-term positions        │   │
│ │                                                       │   │
│ │ [💾 Save This Search]    [Clear Filters]            │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌── RESULTS: 43 jobs found ────────────────────────────┐  │
│ │                                                        │  │
│ │ ┌─ JOB CARD ──────────────────────────────────────┐  │  │
│ │ │ [URGENT] Evening Shift Cashier                   │  │  │
│ │ │ Metro Foods • Toronto, ON • 2.3 km away          │  │  │
│ │ │                                                   │  │  │
│ │ │ Expected Rate: $18-$20/hr (negotiable)           │  │  │
│ │ │ Type: Part-time • Flexible hours                 │  │  │
│ │ │ Posted 2 hours ago • 5 workers interested        │  │  │
│ │ │                                                   │  │  │
│ │ │ Skills Needed: Cashier, Customer Service, POS   │  │  │
│ │ │ ✓ Your skills match: 95%                        │  │  │
│ │ │                                                   │  │  │
│ │ │ Looking for reliable cashier for evening...     │  │  │
│ │ │                                                   │  │  │
│ │ │ [💾 Save]     [View Details]     [Apply Now]    │  │  │
│ │ └──────────────────────────────────────────────────┘  │  │
│ │                                                        │  │
│ │ ┌─ JOB CARD ──────────────────────────────────────┐  │  │
│ │ │ Weekend Barista - Flexible Hours                 │  │  │
│ │ │ Bean There Coffee • Toronto, ON • 5.1 km         │  │  │
│ │ │ Expected Rate: $16-18/hr (negotiable)            │  │  │
│ │ │ ...                                              │  │  │
│ │ └──────────────────────────────────────────────────┘  │  │
│ │                                                        │  │
│ │ [Load More Jobs]                                      │  │
│ └────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

**Job Detail Page/Modal**:

```
┌────────────────────────────────────────────────────────────┐
│ Evening Shift Cashier                            [✕ Close] │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ [Employer: Metro Foods] [✓ Verified]                       │
│ Toronto, ON M5V 3A8 • 2.3 km from you                      │
│ Posted: 2 hours ago • 5 workers interested                 │
│                                                             │
│ ┌── JOB DETAILS ────────────────────────────────────────┐  │
│ │ Position: Evening Shift Cashier                        │  │
│ │ Expected Rate: $18-$20/hr (negotiable)                 │  │
│ │ Type: Part-time                                        │  │
│ │ Hours: Evenings, flexible schedule                     │  │
│ │ Start: Immediate                                       │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── DESCRIPTION ────────────────────────────────────────┐  │
│ │ We're looking for a reliable evening cashier to...    │  │
│ │ [Full job description text]                            │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── REQUIREMENTS ───────────────────────────────────────┐  │
│ │ ✓ Cashier experience (you have this!)                 │  │
│ │ ✓ Customer service skills (you have this!)            │  │
│ │ ✓ POS system knowledge (you have this!)               │  │
│ │ ○ Food Safe certification (optional)                   │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── EMPLOYER INFO ──────────────────────────────────────┐  │
│ │ Metro Foods                                            │  │
│ │ ⭐ 4.7 (23 reviews from workers)                       │  │
│ │ "Great place to work, flexible hours..."              │  │
│ │                            [View Employer Profile →]  │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ⚠️ IMPORTANT: SkillOnCall connects you with employers.    │
│ All work terms, payment, and safety are your              │
│ responsibility to negotiate and manage directly.          │
│                                                             │
│ ℹ️ HOW IT WORKS:                                           │
│ 1. Click "Apply" to express interest in this job         │
│ 2. Employer will be notified and can view your profile   │
│ 3. If interested, employer will message you               │
│ 4. Your contact details stay private until you share     │
│ 5. Discuss details via platform instant messaging        │
│ 6. After work completion, you can review each other      │
│                                                             │
│ [💾 Save Job]        [✅ Apply to This Job]               │
└────────────────────────────────────────────────────────────┘
```

**Apply Action**:
- Worker clicks "Apply" button
- System sends notification to employer
- Worker's profile becomes viewable to employer (but contact details hidden)
- Employer can see: Profile, skills, experience, portfolio, reviews, availability
- Employer CANNOT see: Phone number, email, address (until messaging)
- Employer can initiate conversation if interested
- Worker gets notification when employer messages them

---

### 3. 💬 MESSAGES PAGE

**Route**: `/worker/messages`

**Purpose**: Communication center for employer conversations

**Features**:
- Real-time messaging
- Conversation threads with employers
- File sharing (resume, certificates, portfolio)
- Quick reply templates
- Message search and archive
- Safety reporting

**Layout**:

```
┌────────────────────────────────────────────────────────────┐
│ HEADER: "Messages"                                         │
│ Subtitle: "Communicate with employers"                     │
├────────────────────────────────────────────────────────────┤
│ ┌─ CONVERSATIONS LIST ──┐ ┌─ CHAT AREA ─────────────────┐ │
│ │ [Search messages...]  │ │ Metro Foods                  │ │
│ │                       │ │ [●] Online • Toronto, ON     │ │
│ │ ┌─────────────────┐  │ │ ⭐ 4.7 rating                │ │
│ │ │ Metro Foods  [2]│  │ │                              │ │
│ │ │ Are you avail...│  │ │ ┌──────────────────────────┐ │ │
│ │ │ 2 min ago       │  │ │ │ [THEM] Hi! I saw your    │ │ │
│ │ └─────────────────┘  │ │ │ profile and you'd be a   │ │ │
│ │                       │ │ │ great fit for our...     │ │ │
│ │ ┌─────────────────┐  │ │ │ 10:45 AM                 │ │ │
│ │ │ Cafe Express    │  │ │ └──────────────────────────┘ │ │
│ │ │ Thanks for...   │  │ │                              │ │
│ │ │ Yesterday       │  │ │ ┌──────────────────────────┐ │ │
│ │ └─────────────────┘  │ │ │ [YOU] Thanks for reaching│ │ │
│ │                       │ │ │ out! I'd be interested...│ │ │
│ │ ┌─────────────────┐  │ │ │ 10:50 AM        ✓✓       │ │ │
│ │ │ Restaurant DT   │  │ │ └──────────────────────────┘ │ │
│ │ │ Let's discuss...│  │ │                              │ │
│ │ │ 2 days ago      │  │ │ ┌──────────────────────────┐ │ │
│ │ └─────────────────┘  │ │ │ [THEM] Great! When can   │ │ │
│ │                       │ │ │ you start? Rate is...    │ │ │
│ │ [View Archived (3)]   │ │ │ 11:05 AM                 │ │ │
│ └───────────────────────┘ │ └──────────────────────────┘ │ │
│                            │                              │ │
│                            │ ┌──────────────────────────┐ │ │
│                            │ │ [Type message...]        │ │ │
│                            │ │                          │ │ │
│                            │ │ Quick Actions:           │ │ │
│                            │ │ [Share Resume]           │ │ │
│                            │ │ [Share Availability]     │ │ │
│                            │ │ [Share Portfolio]        │ │ │
│                            │ │                          │ │ │
│                            │ │ [📎] [😊] [Send →]       │ │ │
│                            │ └──────────────────────────┘ │ │
│                            │                              │ │
│                            │ [⚠️ Report] [🚫 Block User] │ │
│                            └──────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

**Message Templates** (Quick Actions):
- "Job Application Follow-up": Check status of interest expressed
- "Share Availability": Automatically sends worker's availability calendar
- "Share Resume": Attaches resume/profile summary
- "Share Portfolio": Links to portfolio items
- "Request Job Details": Template asking for job specifics (hours, start date, etc.)
- "Discuss Rate": Template for rate negotiation

**Communication Flow**:
1. Worker applies to job → Employer notified
2. Employer views worker profile (contact hidden)
3. Employer initiates conversation if interested
4. Worker receives message from employer
5. Both discuss via instant messaging
6. Contact details shared only if both agree

**Privacy Protection**:
- Worker's phone/email hidden until shared in messages
- Employer's contact details protected
- All conversations through secure platform messaging
- Either party can report/block inappropriate behavior

**Safety Features**:
- Report inappropriate messages
- Block users
- Warning indicators for suspicious requests
- Terms reminder about direct arrangements

---

### 4. ⏰ MY AVAILABILITY PAGE

**Route**: `/worker/availability`

**Purpose**: Display availability to employers (informational only)

**Features**:
- Weekly schedule display
- Recurring availability patterns
- One-time availability changes
- Time-off blocking
- Employer-facing availability calendar

**Layout**:

```
┌────────────────────────────────────────────────────────────┐
│ HEADER: "My Availability"                                  │
│ Subtitle: "Let employers know when you're available"       │
│ Right: Profile Status: [Available ▼] [Actively Seeking]   │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ ℹ️ NOTE: This is your general availability. Specific work  │
│ schedules and hours are negotiated directly with employers.│
│                                                             │
│ ┌── WEEKLY AVAILABILITY ────────────────────────────────┐  │
│ │                                                         │  │
│ │ Week View: Jan 15-21, 2025  [◄] [Today] [►]          │  │
│ │                                                         │  │
│ │ ┌─ MONDAY ───────────────────────────────────────────┐ │  │
│ │ │ Status: ● Available                                │ │  │
│ │ │ Times: 8:00 AM - 5:00 PM                          │ │  │
│ │ │ Preferred Rate: $20-25/hr (negotiable)            │ │  │
│ │ │                                        [Edit Day]  │ │  │
│ │ └────────────────────────────────────────────────────┘ │  │
│ │                                                         │  │
│ │ ┌─ TUESDAY ──────────────────────────────────────────┐ │  │
│ │ │ Status: ○ Unavailable                              │ │  │
│ │ │                            [+ Mark Available]      │ │  │
│ │ └────────────────────────────────────────────────────┘ │  │
│ │                                                         │  │
│ │ ┌─ WEDNESDAY ────────────────────────────────────────┐ │  │
│ │ │ Status: ● Available                                │ │  │
│ │ │ Times: 10:00 AM - 8:00 PM                         │ │  │
│ │ │ Note: Prefer evening shifts                       │ │  │
│ │ │                                        [Edit Day]  │ │  │
│ │ └────────────────────────────────────────────────────┘ │  │
│ │                                                         │  │
│ │ [+ Add Availability] [Copy Last Week] [Apply to All]  │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── UPCOMING TIME OFF ──────────────────────────────────┐  │
│ │ Feb 10-14: Vacation (marked unavailable)              │  │
│ │                                 [+ Add Time Off]      │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── VISIBILITY SETTINGS ────────────────────────────────┐  │
│ │ ☑ Show availability to all employers                  │  │
│ │ ☐ Only show to employers I've contacted               │  │
│ │ ☐ Hide availability (not actively seeking)            │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ [Save Changes]                                             │
└────────────────────────────────────────────────────────────┘
```

**Features**:
- Display general availability (not actual commitments)
- Indicate preferred hours and rates
- Mark time off/vacation
- Visibility controls
- Employers see this as part of worker profile

**Important**: No booking system, check-in/out, or hour tracking. This is purely informational for employers to know when workers are generally available.

---

### 5. 👤 MY PROFILE PAGE

**Route**: `/worker/profile`

**Purpose**: Complete worker profile visible to employers

**Features**:
- Profile photo/video (Elite)
- Skills, certifications, experience
- Availability overview
- Portfolio samples
- Reviews and ratings
- Contact preferences
- Profile preview (employer view)

**Layout**:

```
┌────────────────────────────────────────────────────────────┐
│ HEADER: "My Profile"                                       │
│ Right: [👁️ Preview as Employer] [Profile: 85% Complete]  │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌── PROFILE HEADER ──────────────────────────────────────┐ │
│ │ [Profile Photo]        John Smith                       │ │
│ │  [Upload New]          [✓ Verified Badge] [PRO]        │ │
│ │                                                          │ │
│ │                        Professional Cook                │ │
│ │                        Toronto, ON M5V 3A8              │ │
│ │                        ⭐ 4.8 (12 employer reviews)     │ │
│ │                        📍 Available within 25km         │ │
│ │                                                          │ │
│ │ [🎥 Profile Video] [ELITE FEATURE]                      │ │
│ │ [▶️ Watch My Introduction]  [Upload Video]             │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌── TABS ───────────────────────────────────────────────┐  │
│ │ [About] [Skills] [Experience] [Certifications]         │  │
│ │ [Portfolio] [Availability] [Reviews]                   │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── ABOUT TAB ──────────────────────────────────────────┐  │
│ │ Professional Summary (500 chars)                       │  │
│ │ [Experienced cook with 5+ years in busy              │  │
│ │  restaurants. Red Seal certified...]                  │  │
│ │                                         [Edit]         │  │
│ │                                                          │  │
│ │ Contact Information                                    │  │
│ │ • Preferred Contact: Email                            │  │
│ │ • Languages: English, French (bilingual)              │  │
│ │ • Location: Toronto, ON                               │  │
│ │ • Travel: Up to 25 km                                 │  │
│ │                                                          │  │
│ │ Rate Information                                       │  │
│ │ • Preferred Rate: $20-25/hr (negotiable)              │  │
│ │ • Experience Level: 5+ years                          │  │
│ │ • Availability: Weekdays, some evenings               │  │
│ │                                                          │  │
│ │ Work Preferences                                       │  │
│ │ • Types: Full-time, Part-time, Contract              │  │
│ │ • Industries: Restaurants, Catering, Food Service    │  │
│ │ • Has Vehicle: Yes                                    │  │
│ │ • Has Equipment: Yes                                  │  │
│ │                                                          │  │
│ │ Certifications & Safety (Optional)                    │  │
│ │ • Red Seal Cook (Red Seal Program)                   │  │
│ │ • Food Safe Level 1                                   │  │
│ │ • Criminal Background Check: Current                  │  │
│ │ • WCB Coverage: Personal coverage                     │  │
│ │                                                          │  │
│ │ ℹ️ Note: Certifications are self-reported. Employers  │  │
│ │ should verify credentials directly.                    │  │
│ │                                                          │  │
│ │ [Save Changes]                                         │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── SKILLS TAB ─────────────────────────────────────────┐  │
│ │ Primary Skills                                          │  │
│ │ [Professional Cooking ★★★★★ Expert]                   │  │
│ │ [Food Safety ★★★★★ Expert] [Red Seal]                │  │
│ │ [Menu Planning ★★★★☆ Advanced]                        │  │
│ │                                                          │  │
│ │ Additional Skills                                      │  │
│ │ [Baking ★★★★☆] [Inventory Management ★★★☆☆]         │  │
│ │                                                          │  │
│ │ [+ Add Skill]                                          │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── REVIEWS TAB ───────────────────────────────────────┐  │
│ │ Overall Rating: ⭐ 4.8 / 5.0 (12 reviews)             │  │
│ │                                                          │  │
│ │ ┌─ REVIEW CARD ────────────────────────────────────┐  │  │
│ │ │ ⭐⭐⭐⭐⭐ Metro Foods (Verified Employer)        │  │  │
│ │ │ "Excellent worker, punctual and professional.    │  │  │
│ │ │  Would definitely hire again!"                   │  │  │
│ │ │ Jan 2025                                          │  │  │
│ │ └──────────────────────────────────────────────────┘  │  │
│ │                                                          │  │
│ │ [Show All Reviews]                                     │  │
│ └────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

**Key Points**:
- All information is self-reported by worker
- Platform displays "as-is" with disclaimers
- Employers responsible for verification
- Reviews come from confirmed work connections (both parties must confirm work occurred)

---

### 6. 💳 SUBSCRIPTION PAGE

**Route**: `/worker/subscription/plans`

**Purpose**: Manage membership subscription

**Features**:
- Plan comparison (Free, Pro $9.99, Elite $19.99)
- Current plan status
- Upgrade/downgrade options
- Billing history
- Usage statistics

**Layout**:

```
┌────────────────────────────────────────────────────────────┐
│ HEADER: "Subscription Plans"                               │
│ Subtitle: "Upgrade for better visibility and features"     │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌── CURRENT PLAN ───────────────────────────────────────┐  │
│ │ You're currently on: FREE PLAN                         │  │
│ │ Profile views this month: 45 • Messages: 8             │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── BILLING TOGGLE ─────────────────────────────────────┐  │
│ │     [Monthly •]   [Yearly ○]  Save 20% yearly!        │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │  FREE         │    PRO ⭐       │    ELITE 👑           ││
│ │               │  Most Popular    │  Best Value          ││
│ ├───────────────┼──────────────────┼──────────────────────┤│
│ │  $0/month     │  $9.99/month     │  $19.99/month       ││
│ │               │  $95.90/year     │  $191.90/year       ││
│ │               │  (Save $24)      │  (Save $48)         ││
│ ├───────────────┼──────────────────┼──────────────────────┤│
│ │               │                  │                      ││
│ │ Basic Profile │✓ FEATURED        │✓ TOP VISIBILITY     ││
│ │ Visibility    │  Profile         │  (appears first)    ││
│ │               │                  │                      ││
│ │ Limited       │✓ VERIFIED        │✓ Verified Badge     ││
│ │ Contact       │  Badge Option    │                      ││
│ │               │                  │                      ││
│ │ Basic Search  │✓ Priority in     │✓ Priority in ALL    ││
│ │ Results       │  Search Results  │  Searches           ││
│ │               │                  │                      ││
│ │ 3 Messages/   │✓ Unlimited       │✓ Unlimited          ││
│ │ Month         │  Messaging       │  Messaging          ││
│ │               │                  │                      ││
│ │ Standard      │✓ Analytics       │✓ Advanced Analytics ││
│ │ Support       │  Dashboard       │  + Market Insights  ││
│ │               │                  │                      ││
│ │               │✓ Monthly         │✓ PROFILE VIDEO      ││
│ │               │  Performance     │  Upload             ││
│ │               │  Reports         │                      ││
│ │               │                  │                      ││
│ │               │                  │✓ Priority Support   ││
│ │               │                  │  (24hr response)    ││
│ │               │                  │                      ││
│ │               │                  │✓ Featured in        ││
│ │               │                  │  Newsletter         ││
│ ├───────────────┼──────────────────┼──────────────────────┤│
│ │ [Current]     │[Upgrade to Pro]  │[Upgrade to Elite]   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌── WHAT'S INCLUDED ────────────────────────────────────┐  │
│ │ ✓ All plans: Create profile, set availability,        │  │
│ │   receive employer messages, leave reviews             │  │
│ │ ✓ Pro/Elite: Better visibility = More opportunities    │  │
│ │ ✓ Verified Badge: Builds trust with employers (Pro+)   │  │
│ │ ✓ Cancel anytime, no contracts                         │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── FAQs ───────────────────────────────────────────────┐  │
│ │ ▼ What does "featured" visibility mean?               │  │
│ │ ▼ How do I get verified?                              │  │
│ │ ▼ Can I change plans anytime?                         │  │
│ │ ▼ Do employers pay separately?                        │  │
│ └────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

**Subscription Benefits Focus**:
- **Visibility**: Higher ranking in employer searches
- **Trust**: Verified badge option (admin approval)
- **Analytics**: Track profile performance
- **Communication**: Unlimited employer contacts
- **Featured**: Newsletter inclusion, top results

---

### 7. 📊 ANALYTICS PAGE (Pro/Elite Only)

**Route**: `/worker/analytics`

**Purpose**: Track profile performance and market insights

**Features**:
- Profile view statistics
- Search appearance tracking
- Employer contact rate
- Market rate comparisons
- Geographic demand insights

**Layout**:

```
┌────────────────────────────────────────────────────────────┐
│ HEADER: "Analytics Dashboard" [PRO/ELITE]                  │
│ Subtitle: "Track your profile performance"                 │
│ Right: Period: [Last 30 Days ▼] [Export Report PDF]       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌── KEY METRICS (4 Cards) ──────────────────────────────┐  │
│ │                                                          │  │
│ │ Profile Views    Search Appears  Employer Contacts  Msgs│  │
│ │    245              123              18              32 │  │
│ │  +18% ↑          +15% ↑           +25% ↑         +12% ↑│  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── PROFILE PERFORMANCE CHART ──────────────────────────┐  │
│ │ Profile Views Over Time (Last 30 Days)                 │  │
│ │ [Line Chart showing daily profile views]               │  │
│ │ Peak days: Mondays, Thursdays                          │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── EMPLOYER ENGAGEMENT ────────────────────────────────┐  │
│ │ Profile Views → Messages → Work Completed              │  │
│ │     245 (100%)  →  32 (13%)  →  8 confirmed           │  │
│ │                                                          │  │
│ │ Conversion Rate: 3.3% (profile view to work)          │  │
│ │ Industry Average: 2.8%  [You're above average! 📈]    │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── MARKET INSIGHTS ────────────────────────────────────┐  │
│ │ 💰 Rate Comparison (Professional Cook - Toronto)       │  │
│ │                                                          │  │
│ │ Your Rate: $20-25/hr                                   │  │
│ │ Market Average: $22/hr                                 │  │
│ │ Top 25%: $26-30/hr                                     │  │
│ │                                                          │  │
│ │ 📊 Demand Trends:                                      │  │
│ │ • Professional Cooking: ↑ High demand                  │  │
│ │ • Food Safety: ↑ Very high demand                      │  │
│ │ • Weekend availability: ↑ Premium rates                │  │
│ │                                                          │  │
│ │ 🎯 Recommendations:                                     │  │
│ │ • Consider increasing rate to $23-27/hr                │  │
│ │ • Add weekend availability for better visibility       │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── PROFILE STRENGTH ───────────────────────────────────┐  │
│ │ Overall Score: 85/100  [Very Strong]                   │  │
│ │                                                          │  │
│ │ ✓ Profile Photo: Excellent                            │  │
│ │ ✓ Skills Listed: 5 skills (good)                      │  │
│ │ ✓ Portfolio: 6 photos (excellent)                     │  │
│ │ ✓ Reviews: 12 reviews, 4.8★ (excellent)              │  │
│ │ ⚠ Video: Not added (add for Elite boost!)            │  │
│ │                                                          │  │
│ │ [Improve Profile]                                      │  │
│ └────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

**Analytics Focus**:
- Profile visibility and engagement
- Market positioning
- Competitive insights
- Actionable recommendations
- NO job management metrics (no hours worked, payments, etc.)

---

### 8. ⭐ REVIEWS & RATINGS PAGE

**Route**: `/worker/reviews`

**Purpose**: Manage reviews from employers after work completion

**Features**:
- Display all received reviews
- Request reviews from employers
- Respond to reviews
- Report inappropriate reviews
- Review statistics

**Layout**:

```
┌────────────────────────────────────────────────────────────┐
│ HEADER: "Reviews & Ratings"                                │
│ Subtitle: "Build your reputation with employer feedback"   │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌── RATING OVERVIEW ────────────────────────────────────┐  │
│ │                                                          │  │
│ │        ⭐ 4.8 / 5.0                                     │  │
│ │     Based on 12 reviews                                │  │
│ │                                                          │  │
│ │ ★★★★★ (10) ████████████████░░ 83%                     │  │
│ │ ★★★★☆ (2)  ███░░░░░░░░░░░░░░ 17%                      │  │
│ │ ★★★☆☆ (0)  ░░░░░░░░░░░░░░░░░  0%                      │  │
│ │ ★★☆☆☆ (0)  ░░░░░░░░░░░░░░░░░  0%                      │  │
│ │ ★☆☆☆☆ (0)  ░░░░░░░░░░░░░░░░░  0%                      │  │
│ │                                                          │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── PENDING REVIEW REQUESTS ───────────────────────────┐  │
│ │ ⚠️ You have 2 employers you can review:                │  │
│ │                                                          │  │
│ │ Restaurant Downtown - Work completed Jan 20, 2025      │  │
│ │ [Leave Review]                                         │  │
│ │                                                          │  │
│ │ Cafe Express - Work completed Jan 15, 2025            │  │
│ │ [Leave Review]                                         │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── FILTERS & SORTING ──────────────────────────────────┐  │
│ │ [All Reviews ▼]  [Newest First ▼]  [Export PDF]       │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── REVIEWS LIST ───────────────────────────────────────┐  │
│ │                                                          │  │
│ │ ┌─ REVIEW CARD ────────────────────────────────────┐   │  │
│ │ │ ⭐⭐⭐⭐⭐                                           │   │  │
│ │ │ Metro Foods (Verified Employer)                  │   │  │
│ │ │ Reviewed: Jan 22, 2025                           │   │  │
│ │ │                                                   │   │  │
│ │ │ "Excellent worker! John was punctual,            │   │  │
│ │ │  professional, and handled the evening rush      │   │  │
│ │ │  with ease. Would definitely hire again."        │   │  │
│ │ │                                                   │   │  │
│ │ │ Skills mentioned: Professional Cooking,          │   │  │
│ │ │ Customer Service, Teamwork                       │   │  │
│ │ │                                                   │   │  │
│ │ │ [👍 Helpful (5)]  [Your Response] [⚠️ Report]   │   │  │
│ │ └──────────────────────────────────────────────────┘   │  │
│ │                                                          │  │
│ │ ┌─ REVIEW CARD ────────────────────────────────────┐   │  │
│ │ │ ⭐⭐⭐⭐☆                                           │   │  │
│ │ │ Cafe Express (Verified Employer)                 │   │  │
│ │ │ Reviewed: Jan 18, 2025                           │   │  │
│ │ │                                                   │   │  │
│ │ │ "Great barista skills. Arrived on time and       │   │  │
│ │ │  learned our system quickly. Only 4 stars        │   │  │
│ │ │  because availability was limited."              │   │  │
│ │ │                                                   │   │  │
│ │ │ Your Response: "Thank you! I've since updated    │   │  │
│ │ │ my availability to include more weekend shifts." │   │  │
│ │ │                                                   │   │  │
│ │ │ [👍 Helpful (2)]  [Edit Response] [⚠️ Report]   │   │  │
│ │ └──────────────────────────────────────────────────┘   │  │
│ │                                                          │  │
│ │ [Load More Reviews]                                     │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌── HOW REVIEWS WORK ───────────────────────────────────┐  │
│ │ • Reviews can only be left after confirmed work        │  │
│ │ • Both worker and employer must confirm work occurred  │  │
│ │ • Reviews are mutual - you can also review employers   │  │
│ │ • Reviews appear on your public profile                │  │
│ │ • Inappropriate reviews can be reported                │  │
│ └────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

**Review Process**:
1. Employer marks job as "completed" with specific worker
2. Both worker and employer receive review request
3. Both must confirm work occurred (prevents fake reviews)
4. Each can leave 1 review for the other (star rating + written feedback)
5. Reviews become visible only after both parties submit (or after 7 days)
6. Reviews are mutual and appear on public profiles
7. Platform moderates for inappropriate/abusive content

**Triggering Reviews**:
- Employer action: "Mark job as completed" → selects hired worker
- System sends review requests to both parties
- Optional: Either party can request review through messaging

---

## 🎨 Subscription Plans - Feature Breakdown

### FREE Plan ($0/month)
**Target**: Workers testing the platform
- Basic profile creation
- Limited search visibility
- 3 employer messages per month
- View job postings
- Set availability
- Standard support

### PRO Plan ($9.99/month)
**Target**: Active job seekers ⭐ Most Popular
- **Featured profile** in search results
- **Verified badge** option (admin approval)
- **Unlimited messaging** with employers
- **Analytics dashboard**
- Monthly performance reports
- Priority in search rankings
- Standard support

### ELITE Plan ($19.99/month)
**Target**: Premium professionals 👑
- **TOP visibility** (appears first in searches)
- **Profile video** upload (30-60 seconds)
- **Advanced analytics** + market insights
- **Verified badge** included
- **Unlimited messaging**
- **Featured in newsletter** to employers
- **Priority support** (24hr response time)
- Highlighted profile badge
- All Pro features included

---

## 📅 Implementation Phases

### **PHASE 1: Foundation (Weeks 1-2)**

**Goal**: Core platform with profile and subscription infrastructure

**Tasks**:

1. ✅ Database updates
   - Simplify worker_profiles (remove job management fields)
   - Add profile_views tracking table
   - Add employer_worker_connections table (for reviews)
   - Update subscription features

2. ✅ Worker dashboard
   - Stats: Profile views, messages, rating
   - Recent messages preview
   - Job postings preview
   - Subscription status banner

3. ✅ Subscription system
   - Update plans and features
   - Visibility ranking algorithm
   - Usage tracking (message limits for Free tier)
   - Upgrade/downgrade flows

4. ✅ Profile system
   - Enhanced profile editor
   - Availability calendar
   - Portfolio management
   - Preview as employer view

**Deliverables**:
- Working dashboard
- Complete profile system
- Subscription tiers functional
- Basic visibility ranking

---

### **PHASE 2: Connection Features (Weeks 3-5)**

**Goal**: Enable worker-employer connections

**Tasks**:

1. ✅ Job browsing and applications
   - Search and filters
   - Skill matching
   - Location-based results
   - Save searches
   - **Apply button** (express interest, not full application)
   - View job status (active/filled/closed)
   - Track applied jobs

2. ✅ Messaging system
   - Real-time chat
   - Conversation threads
   - File sharing (resumes, certificates)
   - Quick action templates
   - Safety features (report/block)

3. ✅ Contact workflows and privacy
   - "Apply" button from job listing
   - Application notification to employer
   - Employer initiates conversation
   - Contact details hidden (privacy)
   - Instant messaging platform
   - Track applications submitted
   - Notification when employer messages

4. ✅ Availability management
   - Weekly calendar
   - Recurring patterns
   - Time-off blocking
   - Employer-facing display

**Deliverables**:
- Complete job browsing
- Full messaging system
- Availability calendar
- Contact workflows

---

### **PHASE 3: Premium Features & Reviews (Weeks 6-8)**

**Goal**: Pro/Elite features and review system

**Tasks**:

1. ✅ Analytics dashboard (Pro/Elite)
   - Profile view tracking
   - Search appearances
   - Engagement metrics
   - Market insights
   - Performance recommendations

2. ✅ Verification system
   - Admin approval workflow
   - Verified badge display
   - Document upload/review
   - Badge management

3. ✅ Profile video (Elite)
   - Video upload (30-60 sec limit)
   - Cloud storage integration
   - Video player
   - Display in profile and search results

4. ✅ Review system
   - Triggered by employer marking job as "completed"
   - Employer selects which worker was hired
   - Both parties receive review request
   - Mutual confirmation required (work occurred)
   - Star ratings + written reviews
   - Reviews visible after both submit (or 7 days)
   - Review display and management
   - Report inappropriate reviews

**Deliverables**:
- Analytics platform
- Verification system
- Video profiles
- Complete review system

---

### **PHASE 4: Polish & Launch (Weeks 9-10)**

**Goal**: Production readiness and compliance

**Tasks**:

1. ✅ Canadian compliance
   - Terms of Service (platform scope disclaimers)
   - Privacy Policy (PIPEDA compliant)
   - SIN encryption (optional field)
   - Data retention policies
   - Bilingual support (EN/FR)

2. ✅ Search optimization
   - Featured/Elite ranking
   - Relevance algorithm
   - Location-based sorting
   - Skill matching improvements

3. ✅ Performance optimization
   - Database indexing
   - Image optimization
   - Caching strategy
   - Mobile performance

4. ✅ Testing & QA
   - End-to-end testing
   - Accessibility audit (WCAG 2.1 AA)
   - Security review
   - User acceptance testing

**Deliverables**:
- Fully compliant platform
- Optimized performance
- Complete documentation
- Production-ready application

---

## 🔐 Legal & Compliance

### Platform Disclaimers

**Must be clearly displayed**:

1. **Terms of Service** (mandatory acceptance):
   - Platform facilitates connections only
   - No job management or payment processing
   - Workers and employers are independent parties
   - Platform not responsible for work arrangements
   - Safety and legal compliance are user responsibilities
   - Users must follow applicable employment laws

2. **In Job Postings**:
   - "Rates are indicative and negotiable"
   - "Work terms arranged directly between parties"
   - "SkillOnCall.ca is not a party to any work arrangement"

3. **In Worker Profiles**:
   - "Information is self-reported by workers"
   - "Employers should verify credentials and requirements"
   - "Platform does not validate certifications"

4. **Before Messaging**:
   - "Communicate professionally and safely"
   - "Do not share sensitive financial information"
   - "Report inappropriate behavior"

### PIPEDA Compliance (Privacy)

- Clear privacy policy
- User consent for data collection
- Secure data storage (encrypted)
- Right to access personal data
- Right to correct/delete data
- Data breach notification procedures
- Minimal data collection principle

### Accessibility (AODA/WCAG 2.1 AA)

- Keyboard navigation
- Screen reader compatible
- Color contrast compliance
- Alternative text for images
- Clear error messages
- Accessible forms

---

## 🎯 Success Metrics

### User Engagement
- Daily active workers: >70%
- Profile completion rate: >85%
- Employer contact rate: >15%
- Message response rate: >60%
- Return visitor rate: >50%

### Subscription Conversion
- Free to Pro conversion: 10%
- Pro to Elite upgrade: 5%
- Monthly churn rate: <5%
- Average subscription lifetime: >12 months

### Connection Success
- Worker-employer connections: 500+/month
- Successful work arrangements: 300+/month (estimated)
- Review completion rate: >40%
- Platform NPS score: >50

### Business Impact
- Year 1 paid workers: 500 (10% of 5,000)
- Year 1 worker revenue: $59,940
- Average profile views: 50+/month (Pro/Elite)
- Platform satisfaction: 4.5+ stars

---

## 📱 Mobile Considerations

All pages must be:

- ✅ Fully responsive (320px to 1920px+)
- ✅ Touch-friendly (44px minimum tap targets)
- ✅ Fast loading (<3 seconds)
- ✅ PWA-capable (offline profile viewing)
- ✅ Native-like interactions
- ✅ Optimized for Canadian mobile networks

**Mobile-First Features**:
- Tap to call/message employers
- Quick-apply with saved information
- Mobile-optimized availability calendar
- Push notifications for messages
- GPS-based location services

---

## 🌐 Bilingual Support (Canadian Requirement)

### Implementation
- Use i18n library (react-i18next)
- EN/FR translation files
- Language switcher in header
- Automatic language detection
- Bilingual email templates
- Bilingual support documentation

### Required Translations
- All UI elements
- Help documentation
- Email notifications
- Terms of Service
- Privacy Policy
- Support content

---

## 📊 Revenue Model Alignment

### Worker Subscriptions (Primary Revenue)

**Year 1 Projections** (from business report):
- Total Workers: 5,000
- Paid Conversion: 10% (500 workers)
- Avg subscription value: $9.99/month
- **Worker Revenue Year 1**: $59,940

**Subscription Distribution** (estimated):
- Free: 4,500 workers (90%)
- Pro ($9.99): 450 workers (9%)
- Elite ($19.99): 50 workers (1%)

### Employer Revenue (Separate)
- Employer subscriptions
- Job posting fees
- (Tracked separately in employer plan)

---

## ✅ Final Checklist

### Before Launch

**Technical**:
- [ ] All pages responsive
- [ ] Payment integration (Stripe)
- [ ] Email system (notifications)
- [ ] Performance optimized
- [ ] Security audit complete
- [ ] Data backups configured

**Legal**:
- [ ] Terms of Service finalized
- [ ] Privacy Policy published
- [ ] PIPEDA compliance verified
- [ ] Disclaimer language everywhere
- [ ] Accessibility audit passed

**Content**:
- [ ] Help documentation complete
- [ ] FAQ sections written
- [ ] Bilingual translations done
- [ ] Email templates ready
- [ ] Support resources prepared

**Testing**:
- [ ] End-to-end tests passing
- [ ] User acceptance testing done
- [ ] Mobile testing complete
- [ ] Cross-browser compatibility
- [ ] Load testing successful

---

**This comprehensive plan provides the complete roadmap for building SkillOnCall.ca as a CONNECTION PLATFORM that facilitates worker-employer discovery and communication—without the complexity or liability of job/payment management.**

---

**Last Updated:** January 2025  
**Status:** Ready for Implementation  
**Business Model**: Connection Platform (Subscription-Based)  
**Estimated Timeline:** 10 weeks (4 phases)
