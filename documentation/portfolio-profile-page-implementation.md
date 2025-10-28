# Portfolio & Social Media Feature - Worker Profile Page Implementation

## Overview
This document details the **exact implementation requirements** for adding Portfolio Photos and Social Media Links functionality to the Worker Profile Page. This feature was originally Step 6 of the onboarding process but has been moved to the profile page for better user experience.

---

## 🎯 Feature Purpose
Allow workers to:
1. Upload up to 6 portfolio photos showcasing their work
2. Add descriptions to each photo (max 150 characters)
3. Link to their professional social media profiles (Instagram, Facebook, Website)
4. Manage these assets after initial registration

---

## 📋 Complete Feature Specification

### 1. Portfolio Photos Section

#### **Visual Design**
- **Card Component** with brand border (#10B3D6, 0.05px width)
- **Header:**
  - Icon: `Camera` (from react-feather) in brand color (#10B3D6)
  - Title: "Work Portfolio (Optional)"
  - Badge: Shows "X/6 photos" count
  - Subtitle: "Show examples of your work to help employers understand your quality and style."

#### **Upload Area**
```tsx
// Dashed border upload zone
- Border: 2px dashed gray (#D1D5DB)
- Rounded: lg (8px)
- Padding: 6 (24px)
- Center aligned content:
  - Camera icon (h-8 w-8, gray-400)
  - Title: "Add Work Photos" (font-medium, gray-700)
  - Description: "Upload photos of your completed work, clean workspaces, or professional results" (text-sm, gray-500)
  - Upload Button:
    - Background: #10B3D6
    - Text: white
    - Icon: Upload (react-feather)
    - Text: "Choose Photos"
    - Disabled when 6 photos reached
    - Shows "Maximum 6 photos reached" message when disabled
```

#### **Photo Grid**
```tsx
// Grid layout for uploaded photos
- Grid: 1 column mobile, 2 columns desktop (sm:grid-cols-2)
- Gap: 4 (16px)
- Each Photo Card:
  - Border: 1px gray-200
  - Rounded: lg
  - Structure:
    1. Image Preview:
       - Height: 48 (192px)
       - Object-fit: cover
       - Full width
       - Relative positioning for delete button
       - Delete Button (top-right):
         - Icon: X (h-4 w-4)
         - Background: black with 50% opacity
         - Hover: 70% opacity
         - Text: white
    
    2. Description Area:
       - Padding: 3 (12px)
       - Textarea:
         - Height: 16 (64px)
         - Font: text-sm
         - Placeholder: "Describe this work example..."
         - Max length: 150 characters
       - Character counter: "X/150" (text-xs, gray-400)
```

#### **Portfolio Tips Section**
```tsx
// Blue info box with tips
- Background: blue-50
- Border: blue-200
- Padding: 4 (16px)
- Icon: Star (h-5 w-5, blue-600)
- Content:
  - Title: "Great Portfolio Photos Include:" (font-medium, blue-800)
  - List (text-xs, blue-700):
    • Before/after shots of your work
    • Clean, well-lit photos
    • Your workspace or tools
    • Completed projects you're proud of
    • Professional-looking results
```

---

### 2. Social Media Links Section

#### **Visual Design**
- **Card Component** with brand border (#10B3D6, 0.05px width)
- **Header:**
  - Title: "Social Media & Professional Links (Optional)"
  - Subtitle: "Share links to your professional social media or portfolio websites."

#### **Add Platform Buttons**
```tsx
// Show only if less than 3 links added
// Show only platforms not yet added
- Button for Instagram:
  - Variant: outline
  - Icon: Instagram (h-4 w-4)
  - Text: "Instagram"
  - Icon color: pink-600 when added
  
- Button for Facebook:
  - Variant: outline
  - Icon: Facebook (h-4 w-4)
  - Text: "Facebook"
  - Icon color: blue-600 when added
  
- Button for Website:
  - Variant: outline
  - Icon: Camera (h-4 w-4)
  - Text: "Website"
  - Icon color: #10B3D6 when added
```

#### **Link Input Cards**
```tsx
// Each added link shows as a card
- Padding: 3 (12px)
- Border: gray-200
- Rounded: lg
- Layout: Flex row with gap-3
- Structure:
  1. Platform Icon (h-5 w-5):
     - Instagram: pink-600
     - Facebook: blue-600
     - Website: #10B3D6
  
  2. Input Section (flex-1):
     - Label: Capitalize platform name (text-sm, font-medium)
     - Input field:
       - Placeholder: "Your {platform} URL"
       - Full width
       - Margin-top: 1
  
  3. Remove Button:
     - Variant: ghost
     - Size: sm
     - Icon: X (h-4 w-4)
     - Color: gray-400
     - Hover: red-500
     - Flex-shrink-0
```

#### **Empty State**
```tsx
// Show when no links added
- Center aligned
- Padding-y: 6
- Text: gray-500
- Icon: Camera (h-8 w-8, gray-300)
- Text: "No social media links added yet" (text-sm)
```

---

### 3. Data Structure

#### **PortfolioPhoto Interface**
```typescript
interface PortfolioPhoto {
    id: string;              // Unique ID: `${Date.now()}-${index}`
    file: File | null;       // File object for upload
    preview: string;         // Base64 preview URL
    description: string;     // Max 150 characters
}
```

#### **SocialMediaLink Interface**
```typescript
interface SocialMediaLink {
    platform: string;        // 'instagram' | 'facebook' | 'website'
    url: string;            // Full URL
    is_public: boolean;     // Default: true
}
```

---

### 4. State Management

#### **Portfolio Photos State**
```typescript
const [portfolioPhotos, setPortfolioPhotos] = useState<PortfolioPhoto[]>(
    // Load from user profile data
    profileData.portfolio_photos || []
);

// Save to profile data on changes
updateProfileData({ portfolio_photos: updatedPhotos });
```

#### **Social Media Links State**
```typescript
const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>(
    // Load from user profile data
    profileData.social_media_links || []
);

// Save to profile data on changes
updateProfileData({ social_media_links: updatedLinks });
```

---

### 5. Functionality Implementation

#### **Photo Upload Handler**
```typescript
const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPhotos: PortfolioPhoto[] = [];
    
    // Limit to 6 total photos
    for (let i = 0; i < files.length && portfolioPhotos.length + newPhotos.length < 6; i++) {
        const file = files[i];
        const photoId = `${Date.now()}-${i}`;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const newPhoto: PortfolioPhoto = {
                id: photoId,
                file: file,
                preview: e.target?.result as string,
                description: ''
            };
            
            setPortfolioPhotos(prev => {
                const updated = [...prev, newPhoto];
                updateProfileData({ portfolio_photos: updated });
                return updated;
            });
        };
        reader.readAsDataURL(file);
    }
};
```

#### **Photo Remove Handler**
```typescript
const removePhoto = (photoId: string) => {
    const updated = portfolioPhotos.filter(photo => photo.id !== photoId);
    setPortfolioPhotos(updated);
    updateProfileData({ portfolio_photos: updated });
};
```

#### **Photo Description Update Handler**
```typescript
const updatePhotoDescription = (photoId: string, description: string) => {
    const updated = portfolioPhotos.map(photo =>
        photo.id === photoId ? { ...photo, description } : photo
    );
    setPortfolioPhotos(updated);
    updateProfileData({ portfolio_photos: updated });
};
```

#### **Add Social Media Link**
```typescript
const addSocialMediaLink = (platform: string) => {
    const newLink: SocialMediaLink = {
        platform,
        url: '',
        is_public: true
    };
    const updated = [...socialMediaLinks, newLink];
    setSocialMediaLinks(updated);
    updateProfileData({ social_media_links: updated });
};
```

#### **Update Social Media Link**
```typescript
const updateSocialMediaLink = (index: number, field: string, value: any) => {
    const updated = socialMediaLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
    );
    setSocialMediaLinks(updated);
    updateProfileData({ social_media_links: updated });
};
```

#### **Remove Social Media Link**
```typescript
const removeSocialMediaLink = (index: number) => {
    const updated = socialMediaLinks.filter((_, i) => i !== index);
    setSocialMediaLinks(updated);
    updateProfileData({ social_media_links: updated });
};
```

---

### 6. Backend Integration

#### **Database Schema**
The worker_profiles table already has these JSON columns:
```sql
portfolio_photos    JSON    nullable
social_media_links  JSON    nullable
```

#### **Validation Rules**
```php
// In ProfileController or similar
'portfolio_photos' => 'nullable|array|max:6',
'portfolio_photos.*.file' => 'required|image|max:5120', // 5MB max
'portfolio_photos.*.description' => 'nullable|string|max:150',

'social_media_links' => 'nullable|array|max:3',
'social_media_links.*.platform' => 'required|string|in:instagram,facebook,website',
'social_media_links.*.url' => 'required|url|max:255',
'social_media_links.*.is_public' => 'boolean',
```

#### **File Storage**
```php
// Store portfolio photos
if (!empty($validated['portfolio_photos'])) {
    $portfolioPhotos = [];
    foreach ($validated['portfolio_photos'] as $photo) {
        if (isset($photo['file']) && $photo['file'] instanceof \Illuminate\Http\UploadedFile) {
            $path = $photo['file']->store('portfolio_photos', 'public');
            $portfolioPhotos[] = [
                'path' => $path,
                'description' => $photo['description'] ?? '',
            ];
        }
    }
}

$profile->update([
    'portfolio_photos' => $portfolioPhotos,
    'social_media_links' => $validated['social_media_links'] ?? [],
]);
```

---

### 7. Component File Structure

#### **Create New Component**
```
resources/js/components/profile/
├── PortfolioSection.tsx          // Main portfolio photos component
├── SocialMediaSection.tsx        // Social media links component
└── PortfolioManagement.tsx       // Combined component (optional)
```

#### **Or Add to Existing Profile Page**
```
resources/js/pages/worker/
└── profile.tsx                   // Add sections to existing profile page
```

---

### 8. Required Imports

```typescript
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
    Camera, 
    Upload, 
    X, 
    Star,
    Instagram,
    Facebook
} from 'react-feather';
```

---

### 9. Responsive Design Considerations

#### **Mobile (< 640px)**
- Single column grid for photos
- Stack upload button and counter
- Full-width social media inputs
- Adequate touch targets (min 44x44px)

#### **Desktop (≥ 640px)**
- 2-column grid for photos
- Side-by-side layout for buttons
- Better spacing and padding

---

### 10. User Experience Features

#### **Feedback Messages**
1. **Upload Success**: "Photo added successfully"
2. **Upload Error**: "Failed to upload photo. Please try again."
3. **File Too Large**: "Photo must be less than 5MB"
4. **Invalid Format**: "Please upload an image file (JPG, PNG, etc.)"
5. **Link Saved**: "Social media link saved"
6. **Link Removed**: "Link removed"

#### **Loading States**
- Show spinner during photo upload
- Disable buttons during save operations
- Show "Saving..." text on submit button

#### **Validation**
- Real-time character counter for descriptions
- URL format validation for social media links
- Image file type and size validation
- Maximum limits enforced (6 photos, 3 links)

---

### 11. Accessibility (A11Y)

```tsx
// Image upload input
<input
    type="file"
    id="portfolio-upload"
    accept="image/*"
    multiple
    onChange={handlePhotoUpload}
    aria-label="Upload portfolio photos"
    disabled={portfolioPhotos.length >= 6}
/>

// Remove button
<Button
    aria-label={`Remove ${link.platform} link`}
    onClick={() => removeSocialMediaLink(index)}
>
    <X className="h-4 w-4" />
</Button>

// Photo description
<Textarea
    aria-label="Photo description"
    placeholder="Describe this work example..."
    maxLength={150}
/>
```

---

### 12. Testing Checklist

#### **Portfolio Photos**
- [ ] Can upload single photo
- [ ] Can upload multiple photos at once
- [ ] Upload stops at 6 photos maximum
- [ ] Can remove individual photos
- [ ] Can add/edit photo descriptions
- [ ] Character counter updates correctly
- [ ] Preview displays correctly
- [ ] Files are validated (type, size)

#### **Social Media Links**
- [ ] Can add Instagram link
- [ ] Can add Facebook link
- [ ] Can add Website link
- [ ] Maximum 3 links enforced
- [ ] URL validation works
- [ ] Can remove links
- [ ] Empty state shows correctly
- [ ] Icons display correctly

#### **Data Persistence**
- [ ] Photos save to database
- [ ] Links save to database
- [ ] Data loads on page refresh
- [ ] Updates save correctly
- [ ] Deletions persist

---

### 13. Implementation Priority

#### **Phase 1: Core Functionality**
1. Portfolio photo upload
2. Photo removal
3. Photo preview display
4. Save to database

#### **Phase 2: Enhanced Features**
5. Photo descriptions
6. Social media links
7. Empty states
8. Tips and help text

#### **Phase 3: Polish**
9. Loading states
10. Success/error messages
11. Accessibility improvements
12. Responsive design refinements

---

### 14. Future Enhancements (Optional)

1. **Photo Reordering**: Drag-and-drop to reorder portfolio photos
2. **Photo Cropping**: Built-in crop tool before upload
3. **Cover Photo**: Mark one photo as primary/cover
4. **Photo Categories**: Tag photos by project type
5. **LinkedIn Integration**: Add LinkedIn profile link
6. **Photo Gallery**: Modal view for full-size images
7. **Bulk Upload**: Upload entire folder at once
8. **Video Support**: Allow short video clips (30 seconds max)

---

### 15. Brand Colors Reference

```css
/* Primary Brand Color */
--brand-primary: #10B3D6;

/* Accent Color */
--accent-light: #FCF2F0;

/* Text Colors */
--text-primary: #192341;
--text-secondary: #6B7280;

/* Border Color */
--border-brand: #10B3D6;
```

---

### 16. Code Location Reference

**Original Implementation:**
- File: `resources/js/components/onboarding/PortfolioCompletionStep.tsx`
- Lines: 1-501 (entire component)

**Migration Target:**
- New Location: Worker Profile Page
- Suggested Path: `resources/js/pages/worker/profile.tsx`
- Or: Create separate component `resources/js/components/profile/PortfolioSection.tsx`

---

### 17. API Endpoints Needed

```typescript
// Update portfolio photos
POST /api/worker/profile/portfolio
{
    portfolio_photos: PortfolioPhoto[],
    social_media_links: SocialMediaLink[]
}

// Delete portfolio photo
DELETE /api/worker/profile/portfolio/{photoId}

// Get portfolio data
GET /api/worker/profile/portfolio
```

---

## 📝 Implementation Notes

1. **Keep it Optional**: Users can skip this section entirely
2. **Mobile-First**: Ensure excellent mobile UX
3. **Performance**: Optimize image uploads (compress, resize)
4. **Security**: Validate all uploads, sanitize URLs
5. **Privacy**: Respect user's privacy preferences
6. **Consistency**: Match existing profile page design

---

## ✅ Success Criteria

- [ ] Users can manage portfolio photos from profile page
- [ ] Users can manage social media links from profile page
- [ ] All functionality from Step 6 is preserved
- [ ] UI matches brand guidelines
- [ ] Mobile responsive
- [ ] Data persists correctly
- [ ] No console errors
- [ ] Passes accessibility audit

---

**Document Version**: 1.0  
**Created**: October 28, 2025  
**Status**: Ready for Implementation  
**Estimated Effort**: 4-6 hours

