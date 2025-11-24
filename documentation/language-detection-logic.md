# Language Detection Logic

## Overview

SkillOnCall uses a priority-based system to determine the user's preferred language with automatic browser language detection.

---

## Language Support

**Supported Languages:**
- 🇬🇧 **English (en)** - Default
- 🇫🇷 **French (fr)** - Canadian French

**Future Languages:** The system is designed to support additional languages (Spanish, Mandarin, etc.) by simply adding more conditions to the detection logic.

---

## Detection Priority Order

The system checks for language preference in the following order (highest to lowest priority):

### 1. **URL Parameter** (Highest Priority)
```
https://skilloncall.ca/?lang=fr
```
- Always takes precedence
- Updates session and database (if authenticated)
- Valid values: `en`, `fr`

### 2. **Authenticated User's Database Preference**
```sql
SELECT locale FROM users WHERE id = ?
-- Returns: 'en' or 'fr'
```
- User's saved preference in `users.locale` column
- Set via settings page or language selection

### 3. **Guest's localStorage Preference**
```javascript
localStorage.getItem('skilloncall_locale')
// Returns: 'en' or 'fr'
```
- Sent via `X-Locale` header with all requests
- Set when user dismisses language banner or changes language

### 4. **Session Locale**
```php
session('locale')
```
- Temporary session storage
- Set on first visit or language change

### 5. **Browser Language Auto-Detection** (Last Resort)
```
Accept-Language: fr-CA,fr;q=0.9,en-US;q=0.8,en;q=0.7
```

**Detection Logic:**
```php
if (contains 'fr') {
    → Set to French
} else {
    → Default to English (for en, es, de, zh, ar, pt, etc.)
}
```

---

## Browser Language Examples

| Browser Language | Detected As | Reason |
|-----------------|-------------|---------|
| `fr-CA` (French Canada) | **French** | Contains 'fr' |
| `fr-FR` (French France) | **French** | Contains 'fr' |
| `en-US` (English USA) | **English** | Default |
| `en-CA` (English Canada) | **English** | Default |
| `en-GB` (English UK) | **English** | Default |
| `es-ES` (Spanish) | **English** | Not 'fr', defaults to English |
| `de-DE` (German) | **English** | Not 'fr', defaults to English |
| `zh-CN` (Chinese) | **English** | Not 'fr', defaults to English |
| `ar-SA` (Arabic) | **English** | Not 'fr', defaults to English |
| `pt-BR` (Portuguese) | **English** | Not 'fr', defaults to English |
| **(empty/missing)** | **English** | Default fallback |

---

## User Experience by Scenario

### Scenario 1: French Browser User (First Visit)
```
User Browser: Accept-Language: fr-CA,fr;q=0.9,en;q=0.8

1. No localStorage → Not found
2. No database preference (guest) → Not found
3. No session → Not found
4. Browser language detected → 'fr-CA' contains 'fr' ✓
5. Result: Page loads in FRENCH
6. Banner shows: "Nous avons sélectionné le français..."
```

### Scenario 2: English Browser User (First Visit)
```
User Browser: Accept-Language: en-US,en;q=0.9

1. No localStorage → Not found
2. No database preference (guest) → Not found
3. No session → Not found
4. Browser language detected → does NOT contain 'fr'
5. Result: Page loads in ENGLISH (default)
6. Banner shows: "We've selected English..."
```

### Scenario 3: Spanish Browser User (First Visit)
```
User Browser: Accept-Language: es-ES,es;q=0.9,en;q=0.8

1. No localStorage → Not found
2. No database preference (guest) → Not found
3. No session → Not found
4. Browser language detected → does NOT contain 'fr'
5. Result: Page loads in ENGLISH (default)
6. Banner shows: "We've selected English..."
7. User can click "Change to Français" if desired
```

### Scenario 4: Returning User (with Preference)
```
User has locale='fr' in localStorage

1. localStorage → 'fr' ✓
2. Result: Page loads in FRENCH
3. No banner shows (preference already known)
```

### Scenario 5: Authenticated User
```
User logged in with users.locale='fr'

1. Database → 'fr' ✓
2. Result: Page loads in FRENCH
3. No banner shows (preference already known)
```

### Scenario 6: URL Override
```
URL: https://skilloncall.ca/?lang=fr

1. URL parameter → 'fr' ✓
2. Result: Page loads in FRENCH
3. Updates localStorage and database
4. No banner shows (explicit choice)
```

---

## Language Banner Behavior

The dismissible banner appears **only when**:
- ✅ User has NO saved preference (localStorage empty)
- ✅ User is NOT authenticated OR has no database locale
- ✅ No URL parameter is present
- ✅ Language was auto-detected from browser

The banner **does NOT appear when**:
- ❌ User has localStorage preference
- ❌ Authenticated user has database preference
- ❌ URL contains `?lang=` parameter
- ❌ User previously dismissed the banner

**Banner Actions:**
1. **OK Button** → Saves detected language to localStorage, dismisses banner
2. **Change Language** → Switches to opposite language, reloads page
3. **× Close** → Saves detected language to localStorage, dismisses banner

---

## Code Implementation

### Backend (Laravel)
```php
// app/Http/Middleware/HandleInertiaRequests.php

// Auto-detection logic
if (!$locale) {
    $browserLanguage = $request->header('Accept-Language', '');
    
    if (!empty($browserLanguage) && str_contains(strtolower($browserLanguage), 'fr')) {
        $locale = 'fr';
    } else {
        $locale = 'en'; // Default for all other languages
    }
    
    $showLanguageBanner = true;
}
```

### Frontend (React)
```tsx
// resources/js/components/language-banner.tsx

export function LanguageBanner({ detectedLocale }: { detectedLocale: 'en' | 'fr' }) {
    // Shows message based on detected language
    // Allows user to dismiss or change language
}
```

---

## Testing Browser Language Detection

### Test with Different Browser Languages

**Chrome/Edge:**
```
Settings → Languages → Add languages
Move desired language to top
```

**Firefox:**
```
Settings → Language → Choose languages for displaying web pages
```

**Safari:**
```
System Preferences → Language & Region
```

### Test Commands (Browser Console)

**Check current locale:**
```javascript
console.log('Current locale:', document.documentElement.lang);
console.log('Stored locale:', localStorage.getItem('skilloncall_locale'));
```

**Clear preference to test auto-detection:**
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

**Simulate different languages:**
```javascript
// Cannot override Accept-Language from JS
// Must change browser settings
navigator.language // Shows browser language
```

---

## Adding New Language Support

To add Spanish support:

### Step 1: Update Detection Logic
```php
if (str_contains(strtolower($browserLanguage), 'fr')) {
    $locale = 'fr';
} elseif (str_contains(strtolower($browserLanguage), 'es')) {
    $locale = 'es';
} else {
    $locale = 'en'; // Default
}
```

### Step 2: Create Translation Files
```
resources/lang/es/
├── dashboard.php
├── geo.php
├── welcome.php
└── ...
```

### Step 3: Update Seeders
```php
$skill->setTranslation('name', 'es', 'Carpintería');
```

### Step 4: Update Language Banner
```tsx
detectedLocale: 'en' | 'fr' | 'es'
```

---

## Troubleshooting

### Issue: Wrong language detected
**Check:**
1. Browser's `Accept-Language` header
2. localStorage: `skilloncall_locale`
3. Database: `users.locale` column
4. Session: `locale` key

**Solution:**
```javascript
// Clear all preferences
localStorage.removeItem('skilloncall_locale');
// Then reload page
```

### Issue: Banner shows every time
**Check:**
- Is localStorage being cleared on logout?
- Is banner dismiss actually saving to localStorage?

**Solution:**
```javascript
// Verify localStorage is saving
localStorage.setItem('skilloncall_locale', 'en');
localStorage.getItem('skilloncall_locale'); // Should return 'en'
```

### Issue: Authenticated user sees wrong language
**Check database:**
```sql
SELECT id, name, email, locale FROM users WHERE id = ?;
```

**Update if needed:**
```sql
UPDATE users SET locale = 'fr' WHERE id = ?;
```

---

## Best Practices

1. ✅ **Respect user choice** - Always honor explicit language selection
2. ✅ **Provide easy switching** - Settings page + language banner
3. ✅ **Default to English** - Safe fallback for unsupported languages
4. ✅ **Persist preference** - Store in localStorage + database
5. ✅ **Don't block content** - Use dismissible banner, not modal
6. ✅ **Auto-detect intelligently** - Use browser language as hint
7. ✅ **Allow URL override** - Support `?lang=` parameter for sharing

---

## References

- [HTTP Accept-Language Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)
- [Laravel Localization](https://laravel.com/docs/localization)
- [Browser Language Detection Best Practices](https://www.w3.org/International/questions/qa-lang-priorities)

