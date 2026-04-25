---
name: AgroTrade Premium
colors:
  surface: '#fcf9f2'
  surface-dim: '#dcdad3'
  surface-bright: '#fcf9f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ec'
  surface-container: '#f0eee7'
  surface-container-high: '#ebe8e1'
  surface-container-highest: '#e5e2db'
  on-surface: '#1c1c18'
  on-surface-variant: '#414942'
  inverse-surface: '#31312c'
  inverse-on-surface: '#f3f0e9'
  outline: '#717971'
  outline-variant: '#c1c9bf'
  surface-tint: '#366847'
  primary: '#00361a'
  on-primary: '#ffffff'
  primary-container: '#1a4d2e'
  on-primary-container: '#88bd95'
  inverse-primary: '#9dd3aa'
  secondary: '#006e1c'
  on-secondary: '#ffffff'
  secondary-container: '#91f78e'
  on-secondary-container: '#00731e'
  tertiary: '#3e2a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#5a3f00'
  on-tertiary-container: '#d6aa55'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b8f0c5'
  primary-fixed-dim: '#9dd3aa'
  on-primary-fixed: '#00210e'
  on-primary-fixed-variant: '#1d5031'
  secondary-fixed: '#94f990'
  secondary-fixed-dim: '#78dc77'
  on-secondary-fixed: '#002204'
  on-secondary-fixed-variant: '#005313'
  tertiary-fixed: '#ffdea6'
  tertiary-fixed-dim: '#eec068'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5d4200'
  background: '#fcf9f2'
  on-background: '#1c1c18'
  surface-variant: '#e5e2db'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-hindi:
    fontFamily: Noto Sans Devanagari
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
  button:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1280px
---

## Brand & Style

This design system establishes a high-end, trustworthy atmosphere for the agricultural sector, moving away from utility-only interfaces toward a "Premium Agrarian" aesthetic. The brand personality is rooted in stability and growth, balancing the traditional warmth of the harvest with modern technological sophistication.

The visual style utilizes **Glassmorphism** and **Tactile Minimalism**. It relies on translucent layers to create a sense of environmental depth, suggesting clarity and transparency in trade. The emotional response is one of confidence and prestige, positioning the marketplace as an elite venue for high-value agricultural exchange.

## Colors

The palette is anchored by **Deep Forest Green**, which provides a solid, authoritative foundation. **Accent Green** is used sparingly for primary actions and success states, representing vitality. **Harvest Gold** acts as a premium highlight color, used to denote high-value items, certifications, or verified statuses.

The background uses **Cream** instead of pure white to maintain visual warmth and reduce eye strain. The **Glass Panel** variable is central to the interface, used to create floating containers that sit above the background, maintaining a soft connection to the content beneath through a 16px Gaussian blur.

## Typography

The typographic hierarchy is led by **Plus Jakarta Sans**, chosen for its friendly yet professional geometric forms. Headlines are oversized and bold to project confidence. 

**Inter** handles all functional body copy and data-heavy interfaces, ensuring maximum legibility across screen sizes. For localized content, **Noto Sans Devanagari** is implemented for Hindi labels, maintaining a clean, modern stroke that aligns with the Latin weights. Use H1 sparingly for hero sections to maintain its dramatic impact.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop to ensure a premium, editorial feel with controlled whitespace. A 12-column grid is used with generous 24px gutters to allow elements "room to breathe."

Spacing follows a 4px baseline rhythm. For card interiors, use 32px padding to reinforce the premium nature of the marketplace. Larger vertical gaps (80px-120px) should be used between major landing sections to emphasize the "High-Contrast" layout philosophy.

## Elevation & Depth

Depth is achieved through a combination of translucency and extreme shadow diffusion. 

1.  **Level 1 (Base):** The Cream background.
2.  **Level 2 (Glass Containers):** Semi-transparent panels with a 1px white border at 20% opacity. These utilize a 16px background blur.
3.  **Level 3 (Floating Cards):** These are the primary interactive units. They use "Deep Shadows"—a 24px vertical offset with a 60px blur radius, using a desaturated version of the Primary Green (e.g., `rgba(26, 77, 46, 0.08)`).
4.  **Level 4 (Modals/Popovers):** Highest elevation, adding a darker backdrop overlay behind the glass panel.

## Shapes

The shape language is "Soft-Organic." The 20px radius for cards creates a friendly, modern container that feels less rigid than traditional corporate grids. 

Buttons and input fields use a slightly tighter 12px radius to signify their functional, interactive nature. Avoid sharp 90-degree corners entirely to maintain the visual warmth required by the brand narrative.

## Components

### Buttons
Primary buttons use the Deep Green (#1A4D2E) background with white text. They must feature a "Soft Glow Ring"—a subtle box-shadow using the Accent Green at 40% opacity that appears to emanate from beneath the button.

### Cards
Cards are the primary vehicle for trade listings. They utilize the 20px corner radius and the Deep Shadow. Headers within cards should use the glass panel effect to separate product imagery from metadata.

### Input Fields
Inputs are styled with the Cream background and a 1px border of #D4A853 when focused. Labels should always be visible, using the Inter font at 14px.

### Chips & Badges
Used for crop categories or stock status. These should use Harvest Gold for "Premium" items and Accent Green for "In Stock" items, always with a subtle 10% opacity background fill of the same color.

### Marketplace Specifics
- **Price Tags:** Use Plus Jakarta Sans Bold in Primary Green.
- **Verification Badges:** Small, circular Harvest Gold icons with a soft glow to denote trusted sellers.