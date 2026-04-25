---
name: AgroChain Farmer Portal
colors:
  surface: '#f0fdf4'
  surface-dim: '#d0ddd5'
  surface-bright: '#f0fdf4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eaf7ee'
  surface-container: '#e4f1e8'
  surface-container-high: '#deebe3'
  surface-container-highest: '#d9e6dd'
  on-surface: '#131e19'
  on-surface-variant: '#424942'
  inverse-surface: '#27332d'
  inverse-on-surface: '#e7f4eb'
  outline: '#727971'
  outline-variant: '#c1c8bf'
  surface-tint: '#40674a'
  primary: '#001707'
  on-primary: '#ffffff'
  primary-container: '#052e16'
  on-primary-container: '#6f9877'
  inverse-primary: '#a6d1ad'
  secondary: '#2e6a41'
  on-secondary: '#ffffff'
  secondary-container: '#b1f2be'
  on-secondary-container: '#347047'
  tertiary: '#1e0f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#3a2200'
  on-tertiary-container: '#c77e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1edc8'
  primary-fixed-dim: '#a6d1ad'
  on-primary-fixed: '#00210d'
  on-primary-fixed-variant: '#284f33'
  secondary-fixed: '#b1f2be'
  secondary-fixed-dim: '#96d5a3'
  on-secondary-fixed: '#00210d'
  on-secondary-fixed-variant: '#12512c'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f0fdf4'
  on-background: '#131e19'
  surface-variant: '#d9e6dd'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  button:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  split-ratio: 45/55
  gutter: 1.5rem
  container-padding: 2.5rem
  stack-gap: 1rem
---

## Brand & Style

The design system is engineered to evoke a sense of prestigious stewardship and technological empowerment for the modern agriculturalist. It balances the raw, organic beauty of the land with the precision of blockchain-backed data. The brand personality is grounded, prosperous, and visionary.

The aesthetic follows a **High-End Glassmorphism** movement integrated into a **Split-Screen Layout**. This juxtaposition pairs immersive, high-fidelity "Golden Hour" imagery—symbolizing the fruit of the farmer's labor—with a clean, clinical, yet warm interface for administrative tasks. The emotional response is one of calm reliability and "digital harvesting," where complex supply chain data feels as natural as the field itself.

## Colors

The palette is rooted in the "Deep Forest" spectrum to establish authority and growth. 
- **Primary & Secondary:** Deep forest greens (#052e16, #14532d) provide high-contrast legibility and a sense of premium stability.
- **Backgrounds:** The primary workspace utilizes a soft, minty-white (#f0fdf4) to reduce eye strain during long periods of data entry.
- **Accents:** Warm golden tones (derived from the wheat field imagery) are used sparingly for calls-to-action and critical status indicators, representing value and harvest.
- **Borders:** Muted sage (#d1fae5) serves as the structural framework, providing soft definition without creating visual noise.

## Typography

The typographic scale uses **Plus Jakarta Sans** for all heading levels to inject a friendly, contemporary, and optimistic personality into the portal. For dense information, such as ledger entries and form fields, **Inter** is utilized for its exceptional legibility and systematic utility. High-contrast weights are used in headings to maintain a clear hierarchy against the rich background imagery.

## Layout & Spacing

This design system employs a **Fixed Split Layout**. The left pane (45% width) is reserved for immersive, full-bleed environmental photography of golden wheat fields. The right pane (55% width) houses the functional portal, scrolling independently. 

A 12-column grid is applied to the functional pane to organize complex forms. Vertical rhythm is maintained through a base 8px (0.5rem) spacing unit, ensuring that all inputs, margins, and gutters feel cohesive and balanced.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and tonal layering rather than traditional heavy shadows.
- **Info Cards:** Use a background blur (backdrop-filter: blur(12px)) with a 60% translucent white fill. This allows the warmth of the background imagery or the softness of the form background to peek through.
- **Surface Tiers:** Primary surfaces are flat #f0fdf4. Secondary "floating" elements use a very soft, diffused ambient shadow (10% opacity, tinted with #052e16) to suggest a subtle lift.
- **Borders:** Thin 1px borders in #d1fae5 act as the primary separator, maintaining a "light-filled" and airy feel.

## Shapes

The shape language is disciplined and professional. A uniform **8px (rounded-lg)** corner radius is applied to all interactive elements, including buttons, input fields, and info cards. This "Soft" setting bridges the gap between technical precision and organic approachability. Larger containers like image panels or glass cards may occasionally use 12px (rounded-xl) to emphasize their container status.

## Components

- **Buttons:** Primary buttons use the #052e16 background with white text. Secondary buttons use a #d1fae5 border with a #14532d text color. Both feature the 8px corner radius.
- **Input Fields:** Form inputs are styled with a solid white background and a 1px #d1fae5 border. On focus, the border transitions to #14532d with a subtle glow.
- **Glass Cards:** High-end informational cards (e.g., "Yield Estimates") feature the glassmorphic effect with a subtle 1px white inner-stroke to simulate light hitting the edge of glass.
- **Chips/Badges:** Status badges for "Verified Harvest" or "Contract Active" use low-saturation sage backgrounds with deep green text.
- **Data Tables:** Tables use #f0fdf4 for alternate row striping to maintain the light, clean aesthetic. Headers are bolded in Plus Jakarta Sans.
- **Progress Indicators:** Stepper components for supply chain tracking use the golden accent (#f59e0b) to signify movement toward completion/value.