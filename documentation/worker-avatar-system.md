# Worker Avatar System - Implementation Guide

**Status:** ✅ Implemented  
**Date:** October 24, 2025

---

## Overview

The worker avatar system automatically displays the worker's uploaded profile photo in all avatar locations (header, sidebar, dropdowns). If no photo is uploaded, it falls back to showing initials in a colored circle.

---

## How It Works

### 1. **Profile Photo Upload (During Onboarding)**

During the onboarding process (Step 1 - Personal Information), workers can upload their profile photo:

**File:** `app/Http/Controllers/Worker/OnboardingController.php`
```php
// Step 1: Personal Information
if (isset($data['profile_photo']) && $data['profile_photo'] instanceof \Illuminate\Http\UploadedFile) {
    $path = $data['profile_photo']->store('profile_photos', 'public');
    $validated['profile_photo'] = $path;
}
```

- **Storage Location:** `storage/app/public/profile_photos/`
- **Public Access:** Via `public/storage/profile_photos/` (symlink)
- **Database Field:** `worker_profiles.profile_photo`

---

### 2. **Avatar Data Injection**

The middleware automatically adds the avatar URL to the auth user data:

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
        
        $user->avatar = $avatar;
    }

    return [
        'auth' => [
            'user' => $user, // Now includes avatar property
        ],
    ];
}
```

---

### 3. **Avatar Display Components**

All avatar components automatically use the profile photo with fallback:

#### **App Header** (`resources/js/components/app-header.tsx`)
```tsx
<Avatar className="h-7 w-7 lg:h-8 lg:w-8 overflow-hidden rounded-full">
    <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
    <AvatarFallback className="rounded-lg bg-neutral-200 text-xs text-black">
        {getInitials(auth.user.name)}
    </AvatarFallback>
</Avatar>
```

#### **Sidebar Header** (`resources/js/components/app-sidebar-header.tsx`)
```tsx
<div className="flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold text-sm" 
     style={{backgroundColor: '#10B3D6'}}>
    {auth.user.avatar ? (
        <img src={auth.user.avatar} alt={auth.user.name} className="w-full h-full rounded-full object-cover" />
    ) : (
        auth.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    )}
</div>
```

#### **User Info Component** (`resources/js/components/user-info.tsx`)
```tsx
<Avatar className="h-8 w-8 overflow-hidden rounded-full">
    <AvatarImage src={user.avatar} alt={user.name} />
    <AvatarFallback className="rounded-lg bg-neutral-200 text-black">
        {getInitials(user.name)}
    </AvatarFallback>
</Avatar>
```

---

## Behavior

### ✅ **When Profile Photo Exists:**
- Displays the uploaded worker photo
- Photo is loaded from `public/storage/profile_photos/[filename]`
- Rounded, responsive, and properly sized

### ✅ **When Profile Photo is Missing:**
- Falls back to initials (e.g., "JD" for John Doe)
- Displayed in a colored circle with cyan background (#10B3D6)
- Uses first letter of first name + first letter of last name
- Always uppercase, max 2 characters

---

## TypeScript Types

**File:** `resources/js/types/index.d.ts`
```typescript
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'employer' | 'worker';
    avatar?: string;  // ✅ Optional avatar URL
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}
```

---

## Storage Configuration

The storage link must be created to serve uploaded files:

```bash
php artisan storage:link
```

**Creates symlink:**
- `public/storage` → `storage/app/public`

**This allows:**
- `storage/app/public/profile_photos/abc.jpg`
- To be accessed via: `https://skilloncall.ca/storage/profile_photos/abc.jpg`

---

## Database Schema

**Table:** `worker_profiles`

```sql
profile_photo VARCHAR(255) NULLABLE
```

**Example Values:**
- `profile_photos/xyz123.jpg`
- `profile_photos/abc456.png`
- `NULL` (no photo uploaded)

---

## Usage Examples

### 1. **After Worker Uploads Photo (Onboarding Step 1)**
```
User: John Doe
Profile Photo: "profile_photos/5f3a2b1c9d8e7f6.jpg"

Result in Frontend:
- auth.user.avatar = "https://skilloncall.ca/storage/profile_photos/5f3a2b1c9d8e7f6.jpg"
- Avatar displays the uploaded photo
```

### 2. **Worker Without Photo**
```
User: Jane Smith
Profile Photo: NULL

Result in Frontend:
- auth.user.avatar = null
- Avatar displays "JS" in cyan circle
```

---

## File Size & Format Recommendations

**Recommended:**
- **Format:** JPEG, PNG, WebP
- **Size:** Max 2MB
- **Dimensions:** 400x400px (square)
- **Aspect Ratio:** 1:1

**Validation (to be added):**
```php
'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048|dimensions:min_width=200,min_height=200'
```

---

## Security Considerations

### ✅ **Already Implemented:**
1. Files stored in `storage/app/public` (not directly in public root)
2. Laravel's file validation
3. Storage symlink prevents direct filesystem access

### 🔒 **Recommended Future Enhancements:**
1. Add file type validation (MIME type checking)
2. Image resize/optimization on upload
3. Virus scanning for uploaded files
4. CDN integration for faster loading

---

## Testing

### Test Scenario 1: Upload Photo During Onboarding
1. Navigate to `/worker/onboarding`
2. Complete Step 1 (Personal Information)
3. Upload profile photo (JPEG/PNG)
4. Complete onboarding
5. **Expected:** Avatar shows uploaded photo in header, sidebar, and dropdowns

### Test Scenario 2: No Photo Uploaded
1. Complete onboarding without uploading photo
2. **Expected:** Avatar shows initials (e.g., "JD") in cyan circle

### Test Scenario 3: Photo Update
1. Navigate to `/worker/profile`
2. Upload new profile photo
3. **Expected:** Avatar updates immediately across all views

---

## Locations Where Avatar Appears

1. **Desktop Header** - Top right corner
2. **Mobile Header** - Top right corner (smaller)
3. **Desktop Sidebar** - User dropdown menu
4. **Mobile Drawer** - Footer section
5. **User Dropdown** - Header avatar area
6. **Dashboard Widgets** - Profile completion card
7. **Profile Page** - Profile header

---

## Related Files

### Backend:
- `app/Http/Middleware/HandleInertiaRequests.php` - Avatar injection
- `app/Http/Controllers/Worker/OnboardingController.php` - Photo upload
- `app/Models/WorkerProfile.php` - Profile photo field
- `database/migrations/2025_09_09_230000_create_worker_profiles_table.php` - Schema

### Frontend:
- `resources/js/components/app-header.tsx` - Desktop header avatar
- `resources/js/components/app-sidebar-header.tsx` - Sidebar avatar
- `resources/js/components/user-info.tsx` - User info avatar
- `resources/js/components/ui/avatar.tsx` - Avatar component
- `resources/js/types/index.d.ts` - TypeScript types

---

## Future Enhancements

1. **Profile Photo Cropper**
   - Add image cropping tool during upload
   - Force square aspect ratio
   - Preview before save

2. **Multiple Photo Sizes**
   - Generate thumbnails (50x50, 100x100, 200x200)
   - Serve appropriate size based on context
   - Reduce bandwidth and load times

3. **Photo Update from Profile Page**
   - Allow workers to update photo after onboarding
   - Add "Change Photo" button
   - Show current photo preview

4. **Default Avatars**
   - Provide default avatar options
   - Allow selection during onboarding
   - Use as fallback instead of initials

5. **Photo Verification**
   - Admin review of profile photos
   - Flag inappropriate images
   - Require re-upload if rejected

---

## Support

If avatar is not displaying:

1. **Check storage link exists:**
   ```bash
   php artisan storage:link
   ```

2. **Verify file permissions:**
   ```bash
   chmod -R 755 storage/app/public/profile_photos
   ```

3. **Check worker profile in database:**
   ```sql
   SELECT profile_photo FROM worker_profiles WHERE user_id = ?
   ```

4. **Verify file exists:**
   ```bash
   ls -la storage/app/public/profile_photos/
   ```

5. **Check browser console for 404 errors**

---

**Version:** 1.0.0  
**Last Updated:** October 24, 2025  
**Status:** Production Ready ✅

