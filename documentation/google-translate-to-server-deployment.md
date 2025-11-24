# Google Translate to Server Deployment Guide

## 📋 **Overview**

This guide walks you through deploying the multilingual translation system to your production server (skilloncall.ca).

**What this deploys:**
- Google Cloud Translate API integration
- 607 database records translated to French
- JSON column support for multilingual content
- Language selection with auto-detect + dismissible banner
- Bilingual API endpoints

**Estimated Time:** 15 minutes  
**Downtime Required:** 5 minutes (during migration)  
**Cost:** Already paid (~$0.15)

---

## ⚠️ **IMPORTANT: Before You Start**

### **Prerequisites**

- ✅ Code is pushed to GitHub (`Language/translation-method` branch)
- ✅ Google Translate API key: `AIzaSyDoQvXVFoboRuwBxyDMW9slSOgLNdFwhWE`
- ✅ Server access (Laravel Forge or SSH)
- ✅ Database backup capability
- ✅ 15 minutes of uninterrupted time

### **What Will Happen**

1. ✅ Database columns converted from VARCHAR to JSON
2. ✅ All existing English data preserved as `{"en": "value"}`
3. ✅ French translations added: `{"en": "Plumbing", "fr": "Plomberie"}`
4. ✅ APIs automatically return data in user's language
5. ✅ Language banner appears for first-time visitors

### **Risks**

- ⚠️ **Low Risk:** Migration is tested and reversible
- ⚠️ **Database Backup Required:** Always backup before migrations
- ⚠️ **Brief Downtime:** 2-3 minutes during translation process

---

## 🔒 **STEP 1: BACKUP DATABASE (CRITICAL!)**

**⏱️ Time:** 2 minutes  
**⚠️ DO NOT SKIP THIS STEP!**

### **Option A: Via Laravel Forge (Recommended)**

1. **Login to Laravel Forge**
   - Go to: https://forge.laravel.com
   - Select your server

2. **Navigate to Database**
   - Click on your site: `skilloncall.ca`
   - Click "Database" in the left sidebar

3. **Create Backup**
   - Click "Backup Now" button
   - Wait for confirmation message
   - Download the backup file (optional but recommended)

### **Option B: Via SSH**

```bash
# Connect to server
ssh forge@your-server-ip

# Create backup with timestamp
mysqldump -u root -p skillca > ~/skillca_backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup was created
ls -lh ~/skillca_backup_*.sql
```

**Expected Output:**
```
-rw-r--r-- 1 forge forge 25M Nov 24 01:30 skillca_backup_20251124_013045.sql
```

---

## 🔀 **STEP 2: MERGE CODE TO MAIN BRANCH**

**⏱️ Time:** 2 minutes

### **Option A: Via GitHub (Recommended)**

1. **Go to GitHub Repository**
   - URL: https://github.com/sarderiftekhar/skilloncall-ca

2. **Create Pull Request**
   - Click "Pull requests" tab
   - Click "New pull request"
   - Base: `main` ← Compare: `Language/translation-method`
   - Click "Create pull request"

3. **Review Changes**
   - Review the files changed:
     - `app/Console/Commands/TranslateGlobalData.php` (new)
     - `database/migrations/2025_11_25_000002_add_translations_to_global_tables.php` (new)
     - `app/Models/GlobalSkill.php` (modified)
     - And others...

4. **Merge**
   - Click "Merge pull request"
   - Click "Confirm merge"
   - Optionally: Delete branch `Language/translation-method`

### **Option B: Via Command Line**

```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge translation branch
git merge Language/translation-method

# Push to GitHub
git push origin main
```

---

## 🔐 **STEP 3: ADD API KEY TO SERVER**

**⏱️ Time:** 1 minute

### **Via Laravel Forge**

1. **Go to Site Settings**
   - Click on `skilloncall.ca` site
   - Click "Environment" tab

2. **Add API Key**
   - Scroll to bottom of environment file
   - Add this line:
   ```env
   GOOGLE_TRANSLATE_API_KEY=AIzaSyDoQvXVFoboRuwBxyDMW9slSOgLNdFwhWE
   ```

3. **Save**
   - Click "Save" button
   - Wait for confirmation

### **Via SSH**

```bash
# Connect to server
ssh forge@your-server-ip

# Navigate to project
cd /home/forge/skilloncall.ca

# Edit .env file
nano .env

# Add this line at the bottom:
# GOOGLE_TRANSLATE_API_KEY=AIzaSyDoQvXVFoboRuwBxyDMW9slSOgLNdFwhWE

# Save and exit: Ctrl+X, then Y, then Enter

# Verify it was added
grep GOOGLE_TRANSLATE_API_KEY .env
```

**Expected Output:**
```
GOOGLE_TRANSLATE_API_KEY=AIzaSyDoQvXVFoboRuwBxyDMW9slSOgLNdFwhWE
```

---

## 🚀 **STEP 4: DEPLOY CODE TO SERVER**

**⏱️ Time:** 3 minutes

### **Via Laravel Forge**

1. **Navigate to Deployments**
   - Click "Deployments" tab in Forge

2. **Deploy**
   - Click "Deploy Now" button
   - Watch the deployment log
   - Wait for "Successfully deployed" message

3. **Verify Deployment**
   - Check that deployment shows green checkmark
   - Note the timestamp

### **Via SSH (Manual Deployment)**

```bash
# Connect to server
ssh forge@your-server-ip

# Navigate to project
cd /home/forge/skilloncall.ca

# Pull latest code
git pull origin main

# Install Composer dependencies
composer install --no-dev --optimize-autoloader

# Expected output: "Installing dependencies from lock file"
```

---

## 🗄️ **STEP 5: RUN DATABASE MIGRATION**

**⏱️ Time:** 1 minute  
**⚠️ This converts VARCHAR columns to JSON**

### **SSH into Server**

```bash
# If not already connected
ssh forge@your-server-ip

# Navigate to project
cd /home/forge/skilloncall.ca
```

### **Run Migration**

```bash
php artisan migrate --force
```

**Expected Output:**
```
Running migrations.

2025_11_25_000002_add_translations_to_global_tables ........... 302.44ms DONE
```

**What This Does:**
- ✅ Converts `global_skills.name` from VARCHAR to JSON
- ✅ Converts `global_industries.name` from VARCHAR to JSON
- ✅ Converts `global_certifications.name` from VARCHAR to JSON
- ✅ Converts `global_languages.name` from VARCHAR to JSON
- ✅ Wraps existing English data: `"Plumbing"` → `{"en": "Plumbing"}`

### **Verify Migration**

```bash
php artisan migrate:status
```

**Expected Output:**
```
Migration name .................................................. Status
2025_11_25_000002_add_translations_to_global_tables ............. Ran
```

---

## 🌍 **STEP 6: TRANSLATE ALL DATA**

**⏱️ Time:** 2-3 minutes  
**⚠️ This makes Google Translate API calls**

### **Run Translation Command**

```bash
php artisan translate:global-data --model=all --report
```

**What You'll See:**

```
🌐 SkillOnCall Global Data Translation
=====================================

✓ Google Translate API key loaded

📝 Translating Skills...
  0/454 [>---------------------------]   0%
  ...
 454/454 [============================] 100%

🏭 Translating Industries...
  0/81 [>---------------------------]   0%
  ...
  81/81 [============================] 100%

🏅 Translating Certifications...
  0/25 [>---------------------------]   0%
  ...
  25/25 [============================] 100%

🗣️ Translating Languages...
  0/47 [>---------------------------]   0%
  ...
  47/47 [============================] 100%

=================================
📊 Translation Summary
=================================
✓ Successful: 607
⊘ Skipped (already translated): 0
✗ Errors: 0

📄 Translation report saved: /home/forge/skilloncall.ca/storage/app/translations_2025-11-24_012125.csv
```

### **If Translation Fails**

**Check API Key:**
```bash
# Verify API key is set
php artisan tinker --execute="echo env('GOOGLE_TRANSLATE_API_KEY');"
```

**Clear Config Cache:**
```bash
php artisan config:clear
php artisan config:cache
```

**Test API Key Manually:**
```bash
curl "https://translation.googleapis.com/language/translate/v2?key=AIzaSyDoQvXVFoboRuwBxyDMW9slSOgLNdFwhWE&q=Hello&target=fr"
```

**Expected Response:**
```json
{
  "data": {
    "translations": [
      {"translatedText": "Bonjour"}
    ]
  }
}
```

**Re-run Translation:**
```bash
# If it failed, fix the issue and run again
php artisan translate:global-data --model=all --report
```

---

## 🧹 **STEP 7: CLEAR CACHES**

**⏱️ Time:** 30 seconds

```bash
# Still in project directory: /home/forge/skilloncall.ca

# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Rebuild optimized cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Expected Output:**
```
Configuration cache cleared successfully.
Application cache cleared successfully.
Route cache cleared successfully.
Compiled views cleared successfully.
Configuration cached successfully.
Routes cached successfully.
Blade templates cached successfully.
```

---

## ✅ **STEP 8: VERIFY DEPLOYMENT**

**⏱️ Time:** 2 minutes

### **Test 1: English Skills API**

```bash
curl "https://skilloncall.ca/employee/api/skills" | head -5
```

**Expected Output:**
```json
[
  {"id":1,"name":"Acne Specialist","category":"Personal Care"},
  {"id":2,"name":"Acupuncturist","category":"Personal Care"},
  {"id":3,"name":"Air Conditioning Repair","category":"Automotive"}
]
```

### **Test 2: French Skills API**

```bash
curl "https://skilloncall.ca/employee/api/skills?lang=fr" | head -5
```

**Expected Output:**
```json
[
  {"id":1,"name":"Spécialiste de l'acné","category":"Personal Care"},
  {"id":2,"name":"Acupuncteur","category":"Personal Care"},
  {"id":3,"name":"Réparation de climatiseurs","category":"Automotive"}
]
```

### **Test 3: Browser Testing**

1. **Visit English Version:**
   - URL: https://skilloncall.ca/?lang=en
   - Should show English content

2. **Visit French Version:**
   - URL: https://skilloncall.ca/?lang=fr
   - Should show French content
   - Language banner may appear

3. **Test API in Browser:**
   - English: https://skilloncall.ca/employee/api/skills
   - French: https://skilloncall.ca/employee/api/skills?lang=fr

### **Test 4: Check Database**

```bash
php artisan tinker
```

```php
// Get first skill
$skill = App\Models\GlobalSkill::first();

// Check English
app()->setLocale('en');
echo $skill->name; // Should output: "Acne Specialist"

// Check French
app()->setLocale('fr');
echo $skill->name; // Should output: "Spécialiste de l'acné"

// Check raw data
echo json_encode($skill->getTranslations('name'));
// Should output: {"en":"Acne Specialist","fr":"Spécialiste de l'acné"}

// Exit tinker
exit
```

### **Test 5: Check Error Logs**

```bash
# Check for any errors
tail -50 storage/logs/laravel.log
```

**Should NOT see:**
- Translation errors
- JSON parsing errors
- Database errors

---

## 📊 **STEP 9: REVIEW TRANSLATION QUALITY (OPTIONAL)**

**⏱️ Time:** 5 minutes

### **View Translation Report**

```bash
# List all translation reports
ls -lh storage/app/translations_*.csv

# View first 20 translations
head -20 storage/app/translations_*.csv
```

**Expected Output:**
```csv
Type,ID,Category,English,French,Status
Skill,1,Personal Care,Acne Specialist,Spécialiste de l'acné,✓
Skill,2,Personal Care,Acupuncturist,Acupuncteur,✓
Skill,3,Automotive,Air Conditioning Repair,Réparation de climatiseurs,✓
```

### **Download Report for Review**

```bash
# From your local computer
scp forge@your-server-ip:/home/forge/skilloncall.ca/storage/app/translations_*.csv ~/Downloads/
```

### **Fix Any Translation (If Needed)**

```bash
php artisan tinker
```

```php
// Find the record
$skill = App\Models\GlobalSkill::find(123);

// Update French translation
$skill->setTranslation('name', 'fr', 'Better Translation');
$skill->save();

exit
```

---

## 🎉 **STEP 10: FINAL CLEANUP**

**⏱️ Time:** 1 minute

### **Restart Services (Optional)**

```bash
# Restart PHP-FPM (if needed)
sudo systemctl restart php8.2-fpm

# Restart Nginx (if needed)
sudo systemctl restart nginx

# Or use Forge's restart button
```

### **Enable Maintenance Mode During Translation (Optional)**

If you want zero user interruption during translation:

```bash
# Before Step 6 (translation)
php artisan down --message="Adding French translations, back in 5 minutes"

# Do translation (Step 6)
php artisan translate:global-data --model=all --report

# After translation
php artisan up
```

---

## 🚨 **TROUBLESHOOTING**

### **Problem 1: Migration Fails**

**Error:**
```
SQLSTATE[42000]: Syntax error: JSON column 'name' supports indexing...
```

**Solution:**
```bash
# Migration handles this automatically, but if it fails:
php artisan migrate:rollback --step=1
php artisan migrate --force
```

---

### **Problem 2: Translation Command Not Found**

**Error:**
```
Command "translate:global-data" is not defined.
```

**Solution:**
```bash
# Clear cache
php artisan config:clear

# Dump autoload
composer dump-autoload

# Try again
php artisan translate:global-data --model=all
```

---

### **Problem 3: API Key Not Found**

**Error:**
```
GOOGLE_TRANSLATE_API_KEY not set in .env
```

**Solution:**
```bash
# Check .env file
cat .env | grep GOOGLE_TRANSLATE_API_KEY

# If missing, add it
nano .env
# Add: GOOGLE_TRANSLATE_API_KEY=AIzaSyDoQvXVFoboRuwBxyDMW9slSOgLNdFwhWE
# Save: Ctrl+X, Y, Enter

# Clear config
php artisan config:clear
```

---

### **Problem 4: Translations Not Showing**

**Error:** API returns English even with `?lang=fr`

**Check 1: Verify Locale**
```bash
php artisan tinker
```
```php
app()->setLocale('fr');
echo app()->getLocale(); // Should output: "fr"
exit
```

**Check 2: Verify Database**
```bash
php artisan tinker
```
```php
$skill = App\Models\GlobalSkill::first();
dd($skill->getTranslations('name'));
// Should show: ["en" => "...", "fr" => "..."]
exit
```

**Check 3: Re-run Translation**
```bash
php artisan translate:global-data --model=all --report
```

---

### **Problem 5: 500 Internal Server Error**

**Solution:**
```bash
# Check logs
tail -100 storage/logs/laravel.log

# Clear all caches
php artisan optimize:clear

# Rebuild cache
php artisan optimize

# Check permissions
chmod -R 775 storage bootstrap/cache
chown -R forge:forge storage bootstrap/cache
```

---

### **Problem 6: Google Translate API Quota Exceeded**

**Error:**
```
User Rate Limit Exceeded
```

**Solution:**
- **Wait 24 hours** (quota resets daily)
- **Or** increase quota in Google Cloud Console
- **Or** run in batches:
  ```bash
  php artisan translate:global-data --model=skill
  # Wait a few hours
  php artisan translate:global-data --model=industry
  ```

---

## 📋 **DEPLOYMENT CHECKLIST**

### **Pre-Deployment**
- [ ] Read this entire guide
- [ ] Database backup completed
- [ ] Code merged to `main` branch
- [ ] Google API key ready
- [ ] Server access confirmed

### **During Deployment**
- [ ] API key added to `.env`
- [ ] Code deployed to server
- [ ] Migration run successfully
- [ ] Translation command completed (607 records)
- [ ] Caches cleared

### **Post-Deployment**
- [ ] English API tested (returns English)
- [ ] French API tested (returns French)
- [ ] Browser test completed
- [ ] Error logs checked (no errors)
- [ ] Translation report reviewed
- [ ] Services restarted (if needed)

---

## 📊 **EXPECTED RESULTS**

After successful deployment:

### **Database Changes**
✅ Migration `2025_11_25_000002_add_translations_to_global_tables` applied  
✅ 607 records have bilingual data in JSON format  
✅ All existing English data preserved  

### **API Responses**
✅ `/employee/api/skills` → Returns English names  
✅ `/employee/api/skills?lang=fr` → Returns French names  
✅ Same for industries, certifications, languages  

### **User Experience**
✅ Language auto-detected from browser  
✅ Dismissible banner shows on first visit  
✅ Settings page has language selector  
✅ All reference data displays in selected language  

### **Performance**
✅ API response time: <1 second  
✅ No increase in memory usage  
✅ No production errors  

---

## 💰 **COST SUMMARY**

| Item | Cost |
|------|------|
| Google Cloud Translate API | ~$0.15 (one-time) |
| Google Cloud Credit Remaining | $299.85 |
| Server Resources | No additional cost |
| **Total Cost** | **$0.15** |

---

## ⏱️ **TIME SUMMARY**

| Step | Time |
|------|------|
| Database backup | 2 min |
| Merge to main | 2 min |
| Add API key | 1 min |
| Deploy code | 3 min |
| Run migration | 1 min |
| Translate data | 2-3 min |
| Clear caches | 30 sec |
| Verify deployment | 2 min |
| **Total Time** | **~13-14 min** |

---

## 📞 **SUPPORT**

If you encounter issues during deployment:

1. **Check Logs:**
   ```bash
   tail -100 storage/logs/laravel.log
   ```

2. **Check This Guide:**
   - Review troubleshooting section
   - Follow verification steps

3. **Rollback (If Needed):**
   ```bash
   # Rollback migration
   php artisan migrate:rollback --step=1
   
   # Restore database backup
   mysql -u root -p skillca < ~/skillca_backup_YYYYMMDD_HHMMSS.sql
   ```

4. **Contact Developer:**
   - Provide error logs
   - Specify which step failed
   - Include output of failed command

---

## 🎊 **SUCCESS!**

Once all steps are complete and verified:

✅ **Your SkillOnCall platform is now fully bilingual!**

**What's Different:**
- Users see content in their preferred language
- All 607 reference data items translated
- Professional French translations
- Language auto-detection works
- Settings page allows language changes

**What's Next:**
- Monitor API performance
- Review translation quality
- Collect user feedback
- Add more languages (optional)

---

## 📝 **NOTES**

- **Reversible:** Migration can be rolled back if needed
- **Scalable:** Easy to add Spanish, German, etc. later
- **Maintainable:** Translation command can be re-run anytime
- **Production-Ready:** Fully tested, zero errors

---

**Document Version:** 1.0  
**Last Updated:** November 24, 2025  
**Deployment Target:** skilloncall.ca (Production)  
**Status:** ✅ Ready for Deployment


