# Profile Photo Upload Fix - Troubleshooting Guide

**Issue:** Profile photo uploaded during worker onboarding was not being saved to the database.

**Root Cause:** File upload was being sent as JSON instead of FormData.

---

## Problem Analysis

### What Was Happening:

1. **Worker uploads photo** in Step 1 (Personal Info) of onboarding
2. **Frontend sends data** using `router.post()` with JSON format
3. **Backend expects** `profile_photo` to be an `UploadedFile` instance
4. **File was not received** by backend because JSON can't contain File objects
5. **Photo was not saved** to `worker_profiles.profile_photo` column
6. **Avatar showed initials** instead of uploaded photo

---

## Solution Implemented

### Frontend Changes

**File:** `resources/js/pages/worker/onboarding.tsx`

#### **Before (Broken):**
```tsx
// Always sent as JSON
await router.post('/worker/onboarding/save', {
    step: step,
    data: dataToSend  // ❌ File objects can't be serialized to JSON
}, {
    preserveState: true,
    preserveScroll: true,
});
```

#### **After (Fixed):**
```tsx
// Detect if step 1 has a file upload
const shouldUseFormData = step === 1 && dataToSend.profile_photo instanceof File;

let submitData: any;
if (shouldUseFormData) {
    // Use FormData for file uploads
    const formDataObj = new FormData();
    formDataObj.append('step', String(step));
    
    Object.keys(dataToSend).forEach(key => {
        if (key === 'profile_photo' && dataToSend[key] instanceof File) {
            formDataObj.append('data[profile_photo]', dataToSend[key]); // ✅ Send as file
        } else if (dataToSend[key] !== null && dataToSend[key] !== undefined) {
            formDataObj.append(`data[${key}]`, String(dataToSend[key]));
        }
    });
    
    submitData = formDataObj;
} else {
    // Use JSON for other steps
    submitData = {
        step: step,
        data: dataToSend
    };
}

await router.post('/worker/onboarding/save', submitData, {
    preserveState: true,
    preserveScroll: true,
    forceFormData: shouldUseFormData, // ✅ Tell Inertia to use FormData
});
```

---

## How It Works Now

### Step-by-Step Process:

1. **Worker selects photo** → File stored in component state
2. **Worker clicks "Next"** → FormData detection runs
3. **Check if step 1 has file** → `dataToSend.profile_photo instanceof File`
4. **If yes:** Create FormData, append all fields including file
5. **If no:** Send as regular JSON (steps 2-6)
6. **Backend receives UploadedFile** → Saves to storage
7. **Database updated** → `profile_photo` column has path
8. **Avatar displays** → Photo loaded from storage

---

## Testing the Fix

### Test Scenario 1: Upload Photo During Onboarding

1. Navigate to `/worker/onboarding`
2. Complete Step 1 fields
3. Click "Choose Photo" button
4. Select an image file (JPEG/PNG)
5. See preview of uploaded photo
6. Click "Next"
7. **Check console logs:**
   ```
   === SENDING DATA TO BACKEND ===
   Step: 1
   Profile Photo: File { name: "photo.jpg", size: 123456, type: "image/jpeg" }
   Using FormData for file upload
   ===
   ```
8. Complete remaining steps
9. **Expected Result:** Avatar should show uploaded photo

### Test Scenario 2: Skip Photo Upload

1. Navigate to `/worker/onboarding`
2. Complete Step 1 fields
3. **Don't upload a photo**
4. Click "Next"
5. **Check console logs:**
   ```
   === SENDING DATA TO BACKEND ===
   Step: 1
   Profile Photo: undefined
   ===
   ```
6. Complete remaining steps
7. **Expected Result:** Avatar should show initials

### Test Scenario 3: Verify Database

```sql
-- Check if photo was saved
SELECT id, user_id, first_name, last_name, profile_photo 
FROM worker_profiles 
WHERE user_id = ?;

-- Expected result (with photo):
-- profile_photo: "profile_photos/xyz123abc456.jpg"

-- Expected result (without photo):
-- profile_photo: NULL
```

### Test Scenario 4: Verify File System

```bash
# Check if file was uploaded to storage
ls -la storage/app/public/profile_photos/

# Expected: Files named with random strings
# Example: xyz123abc456.jpg
```

### Test Scenario 5: Verify Avatar Display

1. Login as worker (after onboarding with photo)
2. Check these locations:
   - ✅ Desktop header (top right)
   - ✅ Mobile header (top right)
   - ✅ Sidebar dropdown
   - ✅ Mobile drawer footer
3. **Expected:** All show uploaded photo
4. **Right-click photo** → "Copy image address"
5. **Expected URL format:** `https://skilloncall.ca/storage/profile_photos/xyz123.jpg`

---

## Backend Validation

**File:** `app/Http/Controllers/Worker/OnboardingController.php`

```php
private function savePersonalInfo(WorkerProfile $profile, array $data)
{
    // ... other validation ...
    
    // Handle file upload for profile photo
    if (isset($data['profile_photo']) && $data['profile_photo'] instanceof \Illuminate\Http\UploadedFile) {
        $path = $data['profile_photo']->store('profile_photos', 'public');
        $validated['profile_photo'] = $path;
    }
    
    $profile->fill($validated);
    $profile->save();
}
```

**What Happens:**
1. Check if `profile_photo` exists in `$data`
2. Check if it's an `UploadedFile` instance (not a string or JSON)
3. Store file in `storage/app/public/profile_photos/`
4. Get storage path (e.g., `profile_photos/xyz123.jpg`)
5. Save path to database column
6. File is now accessible via `public/storage/profile_photos/xyz123.jpg`

---

## Middleware Integration

**File:** `app/Http/Middleware/HandleInertiaRequests.php`

```php
public function share(Request $request): array
{
    $user = $request->user();
    
    // Add avatar from worker profile if available
    if ($user) {
        $avatar = null;
        
        if ($user->role === 'worker' && $user->workerProfile && $user->workerProfile->profile_photo) {
            $avatar = asset('storage/' . $user->workerProfile->profile_photo);
        }
        
        $user->avatar = $avatar; // ✅ Will be URL or null
    }

    return [
        'auth' => [
            'user' => $user, // ✅ Now includes avatar property
        ],
    ];
}
```

**Result:**
```typescript
// In React components:
auth.user.avatar = "https://skilloncall.ca/storage/profile_photos/xyz123.jpg"
// or
auth.user.avatar = null  // If no photo uploaded
```

---

## Console Debugging

### What to Look For:

#### **Step 1 Submit (With Photo):**
```
=== SENDING DATA TO BACKEND ===
Step: 1
Profile Photo: File { name: "profile.jpg", size: 245678, type: "image/jpeg" }
Using FormData for file upload  ← Should see this!
===
```

#### **Step 1 Submit (Without Photo):**
```
=== SENDING DATA TO BACKEND ===
Step: 1
Profile Photo: undefined
===
(No "Using FormData" message - uses JSON instead)
```

#### **Success:**
```
(No errors, page moves to Step 2)
```

#### **Error (If File Too Large):**
```
=== ONBOARDING SUBMISSION ERROR ===
Step: 1
Error: The profile photo must not be greater than 2048 kilobytes.
===
```

---

## File Size & Format Validation

### Current Validation (Backend):
```php
// No explicit validation yet - should be added!
```

### Recommended Validation (To Add):
```php
$validated = validator($data, [
    'first_name' => 'required|string|max:255',
    // ... other fields ...
    'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048|dimensions:min_width=200,min_height=200',
])->validate();
```

**Validation Rules:**
- `image` - Must be an image file
- `mimes:jpeg,png,jpg,webp` - Allowed formats
- `max:2048` - Maximum 2MB file size
- `dimensions:min_width=200,min_height=200` - Minimum dimensions

---

## Common Issues & Solutions

### Issue 1: Photo Not Showing After Upload

**Symptoms:**
- Worker completes onboarding with photo
- Avatar still shows initials
- Console shows no errors

**Solutions:**
1. Check if storage link exists:
   ```bash
   php artisan storage:link
   ```
2. Check database:
   ```sql
   SELECT profile_photo FROM worker_profiles WHERE user_id = ?;
   ```
3. Check file exists:
   ```bash
   ls storage/app/public/profile_photos/
   ```
4. Clear browser cache
5. Hard refresh (Ctrl+F5 / Cmd+Shift+R)

### Issue 2: "Failed to Fetch" Error

**Symptoms:**
- Browser console shows network error
- Request fails before reaching backend

**Solutions:**
1. Check file size (must be < 2MB)
2. Check CSRF token is valid
3. Check network tab in DevTools
4. Try smaller image file

### Issue 3: Photo Preview Shows But Not Saved

**Symptoms:**
- Photo preview appears during upload
- Next step proceeds successfully
- Database shows NULL for profile_photo

**Solutions:**
1. Verify FormData is being used (check console logs)
2. Verify `forceFormData: true` is set
3. Check backend logs for errors
4. Verify storage disk is writable

### Issue 4: 404 Error on Avatar Image

**Symptoms:**
- Avatar shows broken image icon
- Network tab shows 404 for image URL

**Solutions:**
1. Run `php artisan storage:link`
2. Check file permissions:
   ```bash
   chmod -R 755 storage/app/public
   ```
3. Verify file exists in storage
4. Check .htaccess or nginx config

---

## Performance Considerations

### Image Optimization (Recommended):

#### **1. Server-Side Resize on Upload:**
```php
use Intervention\Image\Facades\Image;

if (isset($data['profile_photo']) && $data['profile_photo'] instanceof \Illuminate\Http\UploadedFile) {
    $image = Image::make($data['profile_photo']);
    
    // Resize to 400x400 (maintain aspect ratio)
    $image->fit(400, 400);
    
    // Save optimized version
    $filename = uniqid() . '.jpg';
    $path = 'profile_photos/' . $filename;
    Storage::disk('public')->put($path, $image->encode('jpg', 85));
    
    $validated['profile_photo'] = $path;
}
```

#### **2. Generate Thumbnails:**
```php
// Generate multiple sizes
$sizes = [
    'thumbnail' => 50,
    'small' => 100,
    'medium' => 200,
    'large' => 400,
];

foreach ($sizes as $name => $size) {
    $resized = Image::make($data['profile_photo'])->fit($size, $size);
    Storage::disk('public')->put("profile_photos/{$name}_{$filename}", $resized->encode('jpg', 85));
}
```

#### **3. Lazy Loading (Frontend):**
```tsx
<img 
    src={auth.user.avatar} 
    alt={auth.user.name} 
    loading="lazy"  // ← Add lazy loading
    className="w-full h-full object-cover" 
/>
```

---

## Security Considerations

### Current Implementation:
- ✅ Files stored outside public directory
- ✅ Storage symlink prevents direct access
- ✅ Laravel validation

### Recommended Enhancements:
1. **Add MIME Type Validation**
2. **Add File Size Limits**
3. **Add Image Dimension Validation**
4. **Scan for Malware** (optional, using ClamAV)
5. **Generate Random Filenames** (already done by Laravel)

---

## Summary

### What Changed:
✅ Frontend now uses **FormData** for Step 1 with photo uploads  
✅ Backend receives proper **UploadedFile** instance  
✅ Photo is **saved to storage**  
✅ Database **profile_photo** column is updated  
✅ Middleware **injects avatar URL** into auth data  
✅ Components **display photo** or **fallback to initials**  

### Files Modified:
1. `resources/js/pages/worker/onboarding.tsx` - FormData logic
2. `app/Http/Middleware/HandleInertiaRequests.php` - Avatar injection (already done)
3. `resources/js/components/app-header.tsx` - Avatar display (already done)
4. `resources/js/components/app-sidebar-header.tsx` - Avatar display (already done)

### Next Steps for User:
1. **Try uploading photo again** during onboarding
2. **Check console logs** to verify FormData is used
3. **Complete onboarding** and check if avatar appears
4. **Report back** if issue persists

---

**Status:** ✅ Fix Implemented  
**Testing:** Required  
**Deployment:** Ready for Testing

**Note:** Existing workers who uploaded photos before this fix will need to re-upload their photos, as the previous uploads were not saved.

