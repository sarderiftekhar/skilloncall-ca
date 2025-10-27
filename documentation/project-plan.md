# SkillOnCall.ca – Project Summary

## 1. Concept

SkillOnCall is a **Canadian local on-demand hiring platform**. It connects small businesses (like restaurants, groceries, butcher shops, cafes, retail stores) with skilled physical workers (cashiers, cooks, stockers, cleaners, helpers).

* **Employers** can quickly post or search for workers when short-staffed.
* **Workers** can list their skills, availability, and get short-term shift work nearby.
* Goal: Fast, trusted, flexible hiring when needed most.

---

## 2. Users

**Employers:**

* Create business profiles
* Post jobs (shift-based)
* Search workers by skills, location, and ratings
* Message workers directly
* Save favorite workers
* Pay for membership via subscription or credits

**Workers:**

* Create skill profiles
* Upload experience & certifications
* Set availability & preferred location
* Get instant job alerts
* Accept/reject shifts
* Build reputation with ratings
* Free basic access, optional premium for visibility

**Admin:**

* Manage users, jobs, and payments
* Verify worker IDs and employer legitimacy
* Resolve disputes (no-shows, cancellations)
* Generate reports and analytics

---

## 3. Features

* **Job Posting & Alerts:** Employers post, workers get notified instantly.
* **Search & Matching:** Filter by skill, availability, distance, ratings.
* **Check-in/Check-out:** Workers verify presence with GPS, selfie, or employer QR.
* **Messaging:** Built-in chat for communication.
* **Ratings & Reviews:** Both sides leave feedback.
* **Payments:** Employers pay via Stripe (card, Apple Pay, Google Pay, QR link).
* **Membership:** Employers use credits or monthly subscription. Workers optional premium.
* **Anti-sharing Security:** OTP login, device limits, geofenced check-in, selfie verification, payouts tied to ID.

---

## 4. Platforms

* **Website (Web App)** – MVP first.
* **Mobile Apps (iOS & Android)** – Next phase (React Native or Flutter).
* **Admin Dashboard** – Internal management tool.

---

## 5. Technology

* **Frontend:** React/Next.js (web), React Native/Flutter (mobile).
* **Backend:** Node.js or Laravel (PHP).
* **Database:** MySQL/PostgreSQL.
* **Payments:** Stripe (supports Apple Pay, Google Pay, cards, QR checkout).
* **Notifications:** Firebase (push), Twilio (SMS).
* **Maps/Location:** Google Maps API.
* **Storage:** AWS S3 or similar for files (IDs, selfies).

---

## 6. Business Model

**Employers:**

* Free signup
* First job posting free
* After that:

  * Pay-per-job credits (e.g. \$5 per job)
  * OR subscription (e.g. \$49/month unlimited postings)

**Workers:**

* Free basic use
* Premium upgrade: highlighted profile, priority job access, verification badge

**Future:**

* Platform-managed payments between employer and worker with commission fee (Uber-style).

---

## 7. Security / Anti-Fraud

* OTP + passkeys for login
* Limit devices per account
* End previous session on new login
* Alerts for suspicious logins
* Worker check-in: GPS + selfie + optional QR scan
* Payout only to bank account in verified worker’s name
* Admin risk engine (flags on multi-device use, strange IPs, unrealistic work hours)

---

## 8. Marketing & Launch Plan

* **Launch city-first strategy**: Toronto, then expand.
* **Employers:** outreach to shops, free trial credits.
* **Workers:** Facebook ads, flyers near stores, referral bonuses.
* **Branding:** emphasize Canadian identity → `.ca` domain + maple leaf in logo.
* **Retention:** loyalty credits for frequent employers, premium perks for workers.

---

## 9. Timeline (MVP to Launch)

* **Month 1–2:** UX design, wireframes, backend planning.
* **Month 3–4:** Backend & database setup.
* **Month 5–6:** Employer & worker portals, payments, notifications.
* **Month 7:** Admin dashboard, verification system.
* **Month 8:** Beta testing in 1 city.
* **Month 9:** Official launch of web platform.
* **Month 10–12:** Mobile apps development (iOS & Android).

---

## 10. Logo & Branding

* Name: **SkillOnCall.ca**
* Concept: Skilled workers available instantly, Canadian identity.
* Logo: Bold modern design, red/gray with maple leaf, triangle inspiration.
* Tagline: *“Skilled hands when you need them most.”*

---

✅ In short: **SkillOnCall.ca will be the go-to Canadian platform for local businesses to instantly hire skilled shift workers — safe, flexible, and fast.**

