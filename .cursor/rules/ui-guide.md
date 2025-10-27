## SkillOnCall.ca UI Guide

This guide documents the visual language and UX patterns used across SkillOnCall.ca. Use it as the single source of truth for typography, colors, spacing, motion, and component usage to ensure consistency on every page.

### Fonts and Typography
- **Primary typeface**: Instrument Sans (400, 500, 600). Loaded via Bunny and set as `--font-sans` in Tailwind theme.
- **Font stack**: `Instrument Sans, ui-sans-serif, system-ui, sans-serif`.
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold for headlines when needed).
- **Headings**
  - **Page Titles**: `text-2xl md:text-3xl` + `font-bold` + `leading-tight` + `color: #192341` (Dark Navy)
  - **H1**: `text-3xl md:text-4xl` + `font-bold` + `leading-tight`
  - **H2**: `text-3xl` + `font-bold` + `leading-tight`
  - **H3**: `text-lg` + `font-semibold`
  - Prefer concise titles; keep to 1–2 lines.
- **Body text**
  - **Base**: `text-base` with default leading
  - **Large**: `text-lg` + `leading-relaxed` for intros/section leads
  - **Small/Meta**: `text-sm` for labels, timestamps, helpers
  - **Caption**: `text-xs` for secondary meta
- **Lists and inline**: Use Tailwind defaults. Emphasize important inline content with `font-semibold`.

### Color System
Use semantic tokens where possible. The welcome page establishes a brand-forward palette:

- **Brand Primary (Cyan)**: `#10B3D6`
  - CTAs, key highlights, search actions, section accents, avatar fallbacks
  - On hover: slight opacity or `bg-[#10B3D6]/90`
- **Dark Base (Navy)**: `#192341`
  - Header background, dark on brand
- **Peach Surface (Tint)**: `#FCF2F0`
  - Section backgrounds, soft badges, cards that need warmth
- **Page Background (Off White Cyan)**: `#F6FBFD`
  - App background behind content sections
- **Hero Gradient**: `linear-gradient(135deg, #f8f4f0 0%, #f0ece8 50%, #ede6e0 100%)`
- **Text Colors**
  - **Primary/Default**: `#192341` (Dark Navy) - replaces black text
  - Secondary: `text-gray-600`
  - Muted: `text-gray-500`
  - On dark headers: `text-gray-300`, `hover:text-white`
  - Legacy: `text-gray-900` (use `#192341` instead for new components)

Semantic Tailwind tokens are defined in `resources/css/app.css` (OKLCH). Do not modify Tailwind defaults; use utility classes or inline styles like `bg-[#10B3D6]` where the brand look is required.

### Spacing, Layout, and Grid
- **Container width**: `max-w-7xl` centered with responsive paddings `px-4 sm:px-6 lg:px-8`.
- **Section vertical rhythm**: `py-16`, with headers typically `mb-8`–`mb-12`.
- **Gaps**: grids `gap-6`–`gap-8`; stacks `space-y-4` for lists.
- **Responsive grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3/4` as appropriate.

### Corners and Radii
- Base radius token: `--radius: 0.625rem` (10px). Derived tokens: `--radius-sm`, `--radius-md`, `--radius-lg`.
- Usage by component
  - **Buttons/Inputs**: `rounded-md` (search bar uses `rounded-full`)
  - **Cards**: `rounded-xl`
  - **Pills/Badges/Avatars**: `rounded-full`

### Elevation and Shadows
- Subtle elevation: `shadow-xs` (components default)
- Cards and interactive surfaces: `shadow-sm` → hover to `hover:shadow-md`
- Brand-tinted card shadow (categories): `shadow-[0_12px_28px_rgba(16,179,214,0.10)]` → hover `shadow-[0_22px_48px_rgba(16,179,214,0.18)]`
- Avoid heavy global shadows; increase elevation only on hover/active surfaces.

### Motion and Interaction
- **Keyframes** (welcome page):
  - `float` (6s, ease-in-out, subtle y-translate and slight rotate)
  - `bounce` (3s, ease-in-out, small y-translate scale)
- **Delays**: stagger child elements by `0.2s`–`0.5s` to create depth.
- **Focus**: Components ship with `focus-visible:ring-[3px]` using ring tokens; never remove focus styles.
- **Cursor**: Default cursor for static content; `cursor-pointer` on interactive elements (`a`, `button`, menus, chips).

### Iconography
- Library: `lucide-react`
- Sizes: inline icons default to `size-4` (16px). In feature circles use `h-7 w-7`.
- Color: inherit text color by default; align with semantic text color for contrast.

### Imagery and Avatars
- **Standard Avatars**: `30px × 30px`, circular `rounded-full`, `fontSize: '12px'` for initials
- **Brand Background**: `#10B3D6` with white text for initials/fallbacks
- **Hero Avatars**: Larger sizes with white border (`border-4 border-white`), subtle `shadow-2xl` for prominence
- **Decorative Elements**: Small brand-tinted circle (`bg-*-300`) positioned bottom-right; scale up slightly on hover

### Components
All components live under `resources/js/components/ui/`. Prefer these over ad‑hoc markup.

- **Button** (`Button`)
  - Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
  - Sizes: `sm`, `default`, `lg`, `icon`
  - **Standard Height**: `height: 2.7em` (use `style={{height: '2.7em'}}`)
  - Default uses `bg-primary`. For brand CTAs use `className="text-white"` and set background via brand (`style={{ backgroundColor: '#10B3D6' }}`).

- **Input** (`Input`)
  - Default: `h-9` rounded, subtle border, strong focus ring
  - Search pattern (hero): `h-12 md:h-14` + `rounded-full` + white background + brand-tinted shadow `box-shadow: 0 15px 40px rgba(16,179,214,0.15)`
  - Text color on light surfaces: use `text-gray-900` for input text and `placeholder:text-gray-500` for placeholders. Never render white input text on light backgrounds.

- **Card** (`Card`, `CardHeader`, `CardContent`, `CardFooter`)
  - Base: `rounded-xl`, subtle border, `shadow-sm`
  - Section cards use white backgrounds; stats cards keep minimal chrome and pull emphasis with brand content color.

- **Badge** (`Badge`)
  - Variants: `default`, `secondary`, `destructive`, `outline`
  - Mapping on welcome page:
    - Urgent: background `#FCF2F0`, text `#10B3D6`
    - Flexible: background `#10B3D6`, text `#FFFFFF`

- **Avatar** (`Avatar`, `AvatarImage`, `AvatarFallback`)
  - **Default Size**: `30px × 30px` (use `width: '30px', height: '30px'`)
  - **Font Size**: `12px` for initials/text inside avatars
  - **Hero/Special Cases**: Larger sizes with responsive classes as needed
  - Legacy: `size-8` (32px) - migrate to 30px standard

### Header and Navigation
- Background: `#192341`
- Nav links: `text-gray-300 hover:text-white`
- Action buttons: ghost for sign-in, brand-filled for primary action
- Spacing: height `h-16`; container `max-w-7xl` with responsive paddings
- **Menu Items Height**: `height: 2.7em` (use `style={{height: '2.7em'}}` for sidebar menu buttons)

### Sections (from Welcome)
- **Hero**: Centered headline, supportive paragraph, prominent rounded search; floating avatars and decorative shapes confined to lower 3/4 of section.
- **Categories**: 3-up grid on large, interactive lift on hover, brand top bar accent (`absolute inset-x-0 top-0 h-1.5 bg-[#10B3D6]` on hover).
- **Statistics**: 4-up grid with concise numbers; brand color used for deltas with inline icon.
- **Recent Posts**: List cards with subtle brand borders/backgrounds; title links use brand color and hover opacity.
- **Testimonial**: Centered, large avatar, brand-colored quote.
- **Footer**: Brand background `#10B3D6`, white/near-white text, simple newsletter input with contrasting subscribe button.

### Accessibility
- Maintain WCAG AA contrast for text on brand surfaces:
  - Brand `#10B3D6` on white → pass
  - White text on brand → pass
  - Gray text on peach and off-white surfaces → verify contrast if adjusted
- Always include visible `:focus-visible` rings (present by default in UI components).
- Hit targets: buttons/links minimum height 40px (use `h-10` for large CTAs when space allows).

### Responsive Behavior
- Breakpoints: Tailwind defaults (`sm`, `md`, `lg`, `xl`)
- Containers: `max-w-7xl` with `px-4 sm:px-6 lg:px-8`
- Typography scales up at `md` for display text; grids increase columns at `md`/`lg`.

### Theme and Appearance
- **Default Theme**: Light mode (overrides system preference)
- **Available Modes**: Light, Dark, System
- **Implementation**: Configured in `resources/js/hooks/use-appearance.tsx`

### Inertia Progress Indicator
- Color: `#4B5563` (slate-600)

### Do/Use Examples
- **Page Title** (Standard):
  ```tsx
  <h1 className="text-2xl md:text-3xl font-bold leading-tight" style={{color: '#192341'}}>
    Admin Dashboard
  </h1>
  ```
- **Default Text Color** (Primary Text):
  ```tsx
  <p className="text-default">Primary content text</p>
  <!-- OR with inline style -->
  <p style={{color: '#192341'}}>Primary content text</p>
  ```
- **Button** (Standard Height):
  ```tsx
  <Button className="text-white hover:opacity-90" style={{ backgroundColor: '#10B3D6', height: '2.7em' }}>
    Get Started
  </Button>
  ```
- **Sidebar Menu Item** (Standard Height):
  ```tsx
  <SidebarMenuButton style={{height: '2.7em'}}>
    Dashboard
  </SidebarMenuButton>
  ```
- **Avatar** (Standard Size):
  ```tsx
  <div className="rounded-full flex items-center justify-center text-white font-semibold" 
       style={{backgroundColor: '#10B3D6', width: '30px', height: '30px', fontSize: '12px'}}>
    SC
  </div>
  ```
- **Notification Bell** (Top Navbar):
  ```tsx
  <div className="relative">
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-9 w-9 cursor-pointer hover:scale-110 transition-transform duration-200"
      onClick={handleNotifications}
    >
      <Bell className="h-5 w-5" style={{color: '#192341'}} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  </div>
  ```
- **User Avatar Dropdown** (Top Navbar - Rightmost):
  ```tsx
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button 
        variant="ghost" 
        className="group h-10 px-3 py-2 text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent hover:bg-accent hover:text-accent-foreground rounded-md"
        style={{height: '2.7em'}}
      >
        <UserInfo user={auth.user} />
        <ChevronDown className="ml-2 size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56 min-w-56 rounded-lg" align="end">
      <UserMenuContent user={auth.user} />
    </DropdownMenuContent>
  </DropdownMenu>
  ```
- Headline with brand accent:
  ```tsx
  <h1 className="text-3xl md:text-4xl font-bold leading-tight">
    <span style={{ color: '#192341' }}>SkillOnCall</span> <span style={{ color: '#10B3D6' }}>— Where Skills Meet Opportunity</span>
  </h1>
  ```
- Section container:
  ```tsx
  <section className="py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">...</div>
  </section>
  ```

### Implementation Notes
- Theme tokens (`--primary`, `--background`, etc.) are defined in `resources/css/app.css` using OKLCH. Do not change Tailwind defaults for this project.
- Use explicit brand hex via utilities/inline styles for brand surfaces and CTAs, as shown on the welcome page.

### QA Checklist (per page)
- Headings follow scale and max line rules
- Brand color used for primary actions and accents
- **Primary text uses `#192341` (Dark Navy) instead of black**
- Button heights set to `2.7em`
- Menu item heights set to `2.7em`
- **Avatars use standard `30px × 30px` size with `12px` font**
- Section spacing matches rhythm (`py-16`, container paddings)
- Focus states visible on all interactive controls
- Accessible contrast for text and iconography
- Responsive grid/typography verified at `sm`, `md`, `lg`


