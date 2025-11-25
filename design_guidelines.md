# VeXa Design Guidelines

## Design Approach
**Reference-Based: Modern Social + Dating Apps**
Drawing inspiration from Tinder's card interactions, Discord's chat UX, and Stripe's clean payment flows, combined with the specified **neon + glassmorphism aesthetic**.

**Core Aesthetic: Cyberpunk Elegance**
- Dark base with vibrant neon accents (cyan, magenta, purple)
- Glassmorphic surfaces with backdrop blur and subtle borders
- Glowing elements and soft shadows for depth
- Modern, tech-forward feel balanced with approachability

## Typography
**Font Stack:**
- Primary: 'Inter' or 'Outfit' via Google Fonts (clean, modern)
- Arabic Support: 'Cairo' or 'Tajawal' for RTL content
- Display: Bold weights (700-800) for headings
- Body: Regular (400) and Medium (500) for content

**Hierarchy:**
- Hero Titles: text-5xl to text-6xl, font-bold, neon glow effect
- Section Headers: text-3xl to text-4xl, font-semibold
- Card Titles: text-xl, font-medium
- Body Text: text-base, balanced line-height
- Buttons/CTAs: text-sm uppercase tracking-wide OR text-base normal-case

## Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-20
- Card gaps: gap-4 to gap-6
- Form field spacing: space-y-4

**Container Strategy:**
- Max-width: max-w-7xl for main content
- Cards: max-w-md for forms, max-w-sm for match cards
- Chat interface: max-w-4xl

## Core Components

### Navigation
- Sticky horizontal nav with glassmorphic background
- Backdrop blur with subtle border-bottom neon glow
- Links with hover neon underline animation
- Mobile: Hamburger menu with slide-in panel

### Match Cards (MatchCard)
- Glassmorphic card with rounded-2xl corners
- Profile image with neon border gradient on hover
- Interest tags as small pills with semi-transparent backgrounds
- Subtle glow effect on card hover
- Score/compatibility displayed with glowing badge

### Chat Interface (ChatBox)
- Split layout: conversation list (left) + active chat (right)
- Message bubbles: own messages with neon gradient, others with glass effect
- Sticky input bar at bottom with glass background
- Socket.IO connection indicator with pulsing dot

### Forms (Login/Register/Profile)
- Centered cards with glassmorphic treatment
- Input fields: dark background, neon border on focus, transparent default
- Floating labels or placeholder with transition
- Primary buttons: neon gradient background with glow
- Validation messages: small text with neon accent colors

### Payment Form (PaymentForm)
- Secure-looking card with enhanced glass effect
- Amount selector with neon highlight
- Trust indicators (lock icon, secure badges)
- Checkout button: prominent neon gradient

## Page-Specific Layouts

### Home Page
**Hero Section:**
- Height: 70vh minimum
- Centered content with large VeXa title (neon glow effect)
- Arabic tagline beneath
- Primary CTA button with strong neon treatment
- Abstract background: gradient mesh or particle animation (subtle)
- No hero image - pure neon aesthetic

**Recommendations Grid:**
- 3-column grid on desktop (lg:grid-cols-3)
- 2-column on tablet (md:grid-cols-2)
- Single column mobile
- Match cards with glassmorphic styling

### Auth Pages (Login/Register)
- Single centered card (max-w-md)
- Minimal distraction
- Form fields stacked vertically
- Link to alternate auth page at bottom
- Subtle background glow effect

### Profile Page
- Two-column layout on desktop
- Left: Profile avatar and quick stats (glass card)
- Right: Editable fields (glass card)
- Interest chips: interactive, removable
- Save button: prominent neon styling

### Chat Page
- Two-panel split (30/70 ratio)
- Left sidebar: conversation list with glass cards
- Right: active chat with messages + input
- Payment section: collapsible glass card below chat

### Settings Page
- Single column of glass cards
- Each setting in its own card section
- Toggle switches with neon active state
- Language selector: prominent placement for Arabic/English

## RTL Support
- Implement `dir="rtl"` for Arabic content
- Mirror layouts appropriately (chat bubbles, navigation)
- Ensure proper text alignment (text-right for RTL)

## Visual Effects (Minimal Animation)
- Subtle glow pulse on primary CTAs
- Smooth transitions on hover (200-300ms)
- Card lift effect on hover (translate-y and shadow)
- Input focus: border glow transition
- NO complex scroll animations or parallax

## Color Strategy (To Be Defined)
Guidelines specify glassmorphic surfaces with neon accents. Exact color values will be determined in implementation phase, maintaining dark base with vibrant accent scheme.

## Images
**Usage:** Minimal - focus on neon aesthetic over imagery
- Profile avatars: circular with neon border
- Match cards: small profile images only
- No large hero images
- Icons: Use Heroicons (outline style for glass aesthetic)

**Placement:**
- Avatar images in profile section
- Small thumbnails in match cards
- User photos in chat conversation list

This design creates a distinctive, modern platform with strong visual identity through glassmorphism and neon treatments while maintaining excellent usability for matchmaking and chat functionality.