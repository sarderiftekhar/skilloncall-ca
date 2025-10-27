# SkillOnCall.ca - Comprehensive Project Overview

## **🎯 Project Concept**

**SkillOnCall.ca** is a **Canadian local on-demand hiring platform** for the SERVICE INDUSTRY and LOW-SKILL WORK. It connects small businesses (restaurants, coffee shops, grocery stores, retail stores, butcher shops, hair salons, cleaning services) with workers seeking flexible, shift-based employment.

**Target Worker Market**:
- Chefs, Cooks, Baristas, Servers, Waiters
- Cashiers, Retail Associates, Stock Workers
- Barbers, Hair Stylists
- Butchers, Deli Workers
- Cleaners, Housekeeping Staff
- Delivery Drivers, Couriers
- General Laborers, Helpers

The platform enables:
- **Employers** to quickly post shift-based jobs when short-staffed
- **Workers** to find flexible, immediate work opportunities in their area
- **Goal**: Fast, trusted, flexible hiring for service industry positions

---

## **🛠️ Technology Stack**

### **Backend:**
- **Laravel 12** (PHP 8.2+)
- **Inertia.js** for seamless SPA experience
- **SQLite** (development) / MySQL (production)
- **Resend** for email services
- **Laravel Wayfinder** for routing
- **Pest** for testing

### **Frontend:**
- **React 19** with TypeScript
- **Vite 7** for build tooling
- **Tailwind CSS 4** for styling
- **Radix UI** component library (shadcn/ui-inspired)
- **Lucide React** & React Feather for icons
- **Inertia React** for client-side routing

### **Key Features:**
- Full SSR support with Inertia
- Mobile-first design philosophy
- Modern UI with custom design system

---

## **👥 User Roles & Features**

### **1. Workers (Job Seekers)**
- ✅ 6-step mobile-first onboarding system
- ✅ Comprehensive profile with skills, certifications, and work history
- ✅ Job browsing and application system
- ✅ Availability scheduling
- ✅ Portfolio and work samples
- ✅ Multi-language support
- ✅ Location-based matching (postal codes)
- ✅ Rate negotiation

### **2. Employers (Businesses)**
- ✅ Job posting and management
- ✅ Worker search and filtering
- ✅ Application management
- ✅ Payment processing
- ✅ Worker ratings and reviews
- ✅ Subscription-based pricing

### **3. Admin**
- ✅ User management
- ✅ Job approval/moderation
- ✅ Payment oversight
- ✅ Analytics and reporting
- ✅ System settings

---

## **🇨🇦 Canadian Compliance Features**

The platform has **exceptional Canadian compliance** built-in:

### **1. Work Authorization Tracking:**
- Canadian Citizen
- Permanent Resident
- Work Permit (with expiry tracking)
- Student Permit

### **2. Provincial Certifications:**
- Red Seal trades
- Food Safe
- HVAC licenses
- First Aid/CPR

### **3. Safety Requirements:**
- Criminal background checks
- WCB (WorkSafeBC) coverage tracking
- Insurance verification

### **4. Location-Based:**
- Canadian postal code validation (e.g., `K1A 0B1`)
- Province-specific regulations
- Service area management

### **5. Privacy & Security:**
- SIN number encryption
- GDPR-compliant data handling
- Emergency contact requirements

---

## **💎 Subscription System**

### **Employer Plans:**
1. **Starter** (Free) - Limited features
2. **Professional** ($49.99/month) - Unlimited job postings
3. **Enterprise** ($149.99/month) - Advanced features

### **Worker Plans:**
1. **Basic** (Free) - Basic access
2. **Pro Worker** ($19.99/month) - Featured profile
3. **Premium Worker** ($39.99/month) - Priority visibility

### **Features:**
- Usage tracking and limits
- Monthly/yearly billing
- Plan upgrades/downgrades
- Prorated billing

---

## **📊 Database Structure**

The application has **17 migrations** creating a comprehensive schema:

### **Core Tables:**
- `users` - Multi-role authentication (admin, employer, worker)
- `worker_profiles` - Comprehensive worker information
- `job_postings` - Employer job listings
- `applications` - Job applications with status tracking
- `payments` - Transaction management
- `reviews` - Bilateral rating system
- `subscriptions` - Subscription management

### **Global Reference Data:**
- `global_skills` - 60+ skills across 8 categories
- `global_industries` - 80+ Canadian business types
- `global_languages` - 45+ languages (prioritizing Canadian ones)
- `global_certifications` - 25+ Canadian certifications
- `global_postal_codes` - Location data

### **Worker Relationship Tables:**
- `worker_skills` - Skills with proficiency levels
- `worker_languages` - Language proficiency
- `work_experiences` - Employment history
- `worker_service_areas` - Geographic coverage
- `worker_references` - Professional references
- `worker_certifications` - Verified certifications
- `worker_availability` - Schedule management

---

## **🎨 UI/UX Design System**

The project has a **comprehensive UI guide** (`ui-guide.md`) with:

### **Brand Colors:**
- **Primary Cyan:** `#10B3D6` (CTAs, highlights, brand identity)
- **Dark Navy:** `#192341` (Headers, primary text)
- **Peach Surface:** `#FCF2F0` (Card backgrounds)
- **Off-White Cyan:** `#F6FBFD` (Page background)

### **Design Standards:**
- **Font:** Instrument Sans (400, 500, 600, 700)
- **Page Titles:** `text-2xl md:text-3xl` (32px mobile, 48px desktop)
- **Buttons:** Default height `2.7em`
- **Avatars:** Standard `30px × 30px` with `12px` font
- **Border Radius:** `0.625rem` (10px)

### **Interaction:**
- Smooth animations (float, bounce)
- Focus-visible rings for accessibility
- Cursor pointer on interactive elements
- Hover effects with scale/opacity

---

## **🚀 Worker Onboarding System**

A **6-step comprehensive onboarding** process:

### **Step 1: Personal Info**
- Name, photo, address
- Canadian work authorization
- Emergency contacts

### **Step 2: Skills & Experience**
- Interactive skill selection (60+ options)
- Proficiency levels (beginner to expert)
- Primary skill designation

### **Step 3: Work History**
- Employment status (employed/unemployed/self-employed)
- Work experience entries
- Professional references

### **Step 4: Location & Rates**
- Service areas with postal codes
- Hourly rate ranges
- Travel distance
- Vehicle/tools/insurance

### **Step 5: Languages & Schedule**
- Multi-language proficiency
- Weekly availability calendar
- Rate multipliers for different times

### **Step 6: Portfolio & Complete**
- Work samples (up to 6 photos)
- Social media links
- Profile finalization

### **Features:**
- ✅ Real-time validation with custom error messages
- ✅ Progress tracking (step-by-step persistence)
- ✅ Mobile-first design
- ✅ Smooth scrolling to error fields
- ✅ Modal feedback system
- ✅ Can't proceed without required fields

---

## **📁 Project Structure**

```
skilloncall-ca/
├── app/
│   ├── Http/Controllers/      # 32 controllers (Admin, Employer, Worker)
│   ├── Models/                # 20 Eloquent models
│   ├── Services/              # Business logic (Email, Subscription)
│   ├── Observers/             # Model event observers
│   └── Policies/              # Authorization policies
├── resources/
│   ├── js/
│   │   ├── components/        # 61 React components
│   │   ├── pages/             # 18 Inertia pages
│   │   ├── layouts/           # 8 layouts
│   │   └── lib/               # Utilities (validation, etc.)
│   └── css/                   # Tailwind styles
├── routes/
│   ├── web.php                # Public routes
│   ├── admin.php              # Admin routes
│   ├── employer.php           # Employer routes
│   ├── worker.php             # Worker routes
│   └── auth.php               # Authentication
├── database/
│   ├── migrations/            # 17 migrations
│   └── seeders/               # 8 seeders (skills, industries, etc.)
└── .cursor/rules/             # Project rules & UI guide
```

---

## **🔄 Recent Work & Current State**

### **Active Development:**
1. **Worker Onboarding** - Step 3 (Work History) validation improvements
2. **Employment Status Field** - New migration added (2025-10-23)
3. **Form Validation** - Enhanced validation for work experiences and references
4. **UI Components** - Combobox, Command, Popover refinements
5. **Validated Inputs** - Custom input/textarea components with validation

### **Modified Files (Not Staged):**
- `OnboardingController.php` - Validation logic updates
- `PersonalInfoStep.tsx`, `SkillsExperienceStep.tsx`, `WorkHistoryStep.tsx` - Frontend components
- `onboarding.tsx` - Main onboarding page
- Various UI components (combobox, command, popover, validated-input, validated-textarea)
- `validation.ts` & `validation.test.ts` - Validation utilities

### **Deployment Status:**
- ✅ Build issues resolved (memory allocation)
- ✅ Migrations made idempotent
- ✅ MySQL index name length issues fixed
- ✅ Ready for production deployment

---

## **🎯 Key Business Features**

### **1. Job Matching:**
- Skill-based filtering
- Location proximity (postal codes)
- Availability matching
- Rate negotiation

### **2. Payment System:**
- Stripe integration ready
- Credit-based or subscription models
- Transaction tracking
- Payment policies

### **3. Security & Anti-Fraud:**
- OTP authentication setup
- Device limits
- Background checks
- Verification badges
- SIN encryption

### **4. Analytics:**
- User statistics
- Job performance
- Payment reports
- Platform metrics

---

## **📈 Statistics & Metrics**

The platform showcases (from Welcome Page):
- **2,450** Active Workers (+12%)
- **1,230** Jobs Posted (+8%)
- **980** Successful Matches (+15%)
- **340** Verified Employers (+5%)

---

## **🚦 Development Guidelines**

From project rules:
- ✅ Never run destructive migrations (`migrate:refresh`, `migrate:fresh`)
- ✅ Don't delete database data
- ✅ Convert cursor to pointer on clickable elements
- ✅ Follow `ui-guide.md` for all UI work
- ✅ Light theme as default
- ✅ Don't modify Tailwind defaults
- ✅ Standard sizes: 30px avatars, 2.7em buttons, text-2xl/md:text-3xl titles

---

## **🧪 Testing**

- **Pest PHP** for backend tests
- Test structure in place
- Feature tests for Auth, Dashboard, Settings
- Unit tests available

---

## **📝 Documentation**

Available documentation:
- ✅ `project-plan.md` - Complete business plan
- ✅ `setup-onboarding.md` - Onboarding system guide
- ✅ `ui-guide.md` - Comprehensive UI/UX standards
- ✅ `DEPLOYMENT-FIXES-APPLIED.md` - Deployment troubleshooting
- ✅ `project-description.md` - This comprehensive overview

---

## **💪 Strengths of the Project**

1. **Comprehensive Planning** - Extremely well-documented
2. **Canadian Focus** - Strong compliance with Canadian regulations
3. **Modern Stack** - Latest versions of Laravel, React, TypeScript
4. **Mobile-First** - Responsive design throughout
5. **Scalable Architecture** - Clean separation of concerns
6. **Production-Ready** - Subscription system, payments, onboarding complete
7. **Accessibility** - Focus on WCAG compliance
8. **Security** - Encryption, validation, authorization policies

---

## **🎭 Current Focus**

Currently working on **Step 3 of the worker onboarding** (Work History), specifically:
- Employment status validation
- Work experience entry management
- Professional references
- Form validation and error handling

---

## **🚀 What's Ready**

- ✅ Complete authentication system
- ✅ Worker onboarding (6 steps)
- ✅ Subscription management
- ✅ Job posting/application flow
- ✅ Payment tracking
- ✅ Review system
- ✅ Admin dashboard
- ✅ Email integration (Resend)
- ✅ Beautiful welcome page
- ✅ Mobile-responsive UI

---

## **Summary**

This is an **impressively comprehensive, production-ready platform** with:
- **Clear business model** (subscriptions + marketplace)
- **Strong Canadian identity** and compliance
- **Modern, maintainable codebase**
- **Excellent documentation**
- **Beautiful, accessible UI**
- **Scalable architecture**

The project shows professional-grade planning and execution. The attention to detail in Canadian regulations, UI consistency, and user experience is exceptional. This platform is built to genuinely serve the Canadian gig economy market! 🍁

---

## **Business Model**

### **For Employers:**
- Free signup
- First job posting free
- After that:
  - Pay-per-job credits (e.g., $5 per job)
  - OR subscription (e.g., $49/month unlimited postings)

### **For Workers:**
- Free basic use
- Premium upgrade: highlighted profile, priority job access, verification badge

### **Future:**
- Platform-managed payments between employer and worker with commission fee (Uber-style)

---

## **Marketing & Launch Strategy**

- **Launch city-first strategy**: Toronto, then expand
- **Employers**: outreach to shops, free trial credits
- **Workers**: Facebook ads, flyers near stores, referral bonuses
- **Branding**: emphasize Canadian identity → `.ca` domain + maple leaf in logo
- **Retention**: loyalty credits for frequent employers, premium perks for workers

---

## **Timeline (MVP to Launch)**

- **Month 1–2:** UX design, wireframes, backend planning ✅
- **Month 3–4:** Backend & database setup ✅
- **Month 5–6:** Employer & worker portals, payments, notifications ✅
- **Month 7:** Admin dashboard, verification system ✅
- **Month 8:** Beta testing in 1 city (In Progress)
- **Month 9:** Official launch of web platform (Upcoming)
- **Month 10–12:** Mobile apps development (iOS & Android) (Future)

---

## **Logo & Branding**

- **Name:** SkillOnCall.ca
- **Concept:** Skilled workers available instantly, Canadian identity
- **Logo:** Bold modern design, red/gray with maple leaf, triangle inspiration
- **Tagline:** *"Skilled hands when you need them most."*

---

**Last Updated:** October 23, 2025

