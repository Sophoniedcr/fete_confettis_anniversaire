---
name: Nocturne & Ecru
colors:
  surface: '#0f141b'
  surface-dim: '#0f141b'
  surface-bright: '#353941'
  surface-container-lowest: '#090e15'
  surface-container-low: '#171c23'
  surface-container: '#1b2027'
  surface-container-high: '#252a32'
  surface-container-highest: '#30353d'
  on-surface: '#dee2ed'
  on-surface-variant: '#d5c3b7'
  inverse-surface: '#dee2ed'
  inverse-on-surface: '#2c3139'
  outline: '#9e8e83'
  outline-variant: '#51443c'
  surface-tint: '#f7ba8c'
  primary: '#f7ba8c'
  on-primary: '#4c2705'
  primary-container: '#c48d62'
  on-primary-container: '#4c2805'
  inverse-primary: '#82542e'
  secondary: '#c9c6c1'
  on-secondary: '#31312d'
  secondary-container: '#474743'
  on-secondary-container: '#b7b5af'
  tertiary: '#f8ba8a'
  on-tertiary: '#4c2703'
  tertiary-container: '#c58d61'
  on-tertiary-container: '#4d2704'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#f7ba8c'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#663d19'
  secondary-fixed: '#e5e2dc'
  secondary-fixed-dim: '#c9c6c1'
  on-secondary-fixed: '#1c1c18'
  on-secondary-fixed-variant: '#474743'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#f8ba8a'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#673d17'
  background: '#0f141b'
  on-background: '#dee2ed'
  surface-variant: '#30353d'
typography:
  display:
    fontFamily: Bodoni Moda
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Bodoni Moda
    fontSize: 38px
    fontWeight: '400'
    lineHeight: 46px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Bodoni Moda
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0em
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Bodoni Moda
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: 0.01em
  title-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: 0.08em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '300'
    lineHeight: 28px
    letterSpacing: 0.02em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '300'
    lineHeight: 24px
    letterSpacing: 0.015em
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-lg:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.22em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 9px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.26em
spacing:
  gutter: 1.5rem
  margin: 2.5rem
  gutter-desktop: 3rem
  margin-desktop: 6rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.5rem
  space-lg: 2.5rem
  space-xl: 4rem
---

## Brand & Style

The design system embodies the intimacy, weight, and quiet grandeur of a private gala held at a historic Parisian palace hotel after midnight. Designed for an ultra-exclusive circle of patrons and distinguished guests, the experience must evoke the tactile gravity of heavy archival stationery, bespoke hot-foil blind embossing, and the warm, shadowed ambiance of candlelit salons.

The design movement is **Tactile Editorial Luxury**:
- An uncompromising reverence for white space, proportion, and micro-typographic precision.
- Textural references borrowed from bespoke London letterpress studios: heavy 600gsm cotton rag stock, subtly deckled edges, hairline metallic copper rules, and deep, matte midnight pigments.
- Avoid all hyper-modern glassmorphism, aggressive neons, saturated digital purples, and artificial UI tropes. The interface behaves like an exquisite, digital invitation suite—unhurried, deliberate, and deeply private.

## Colors

The palette is rooted in atmospheric dark chiaroscuro, accented by tactile stationery light tones and delicate warm metals.

- **Midnight Base (`neutral_color_hex: #0B1017` / Canvas Depth `#070A0E`):** Represents dense, pigment-rich midnight ink. Deep, absorbent, and quiet. Used as the dominant backdrop to allow warmth and typography to emerge.
- **Warm Textured Ecru (`secondary_color_hex: #F7F4EE` / Muted Ecru `#EFECE4`):** The primary typographic and textural foreground tone. It emulates unbleached French archival cotton paper under warm incandescence, providing high legibility without the harshness of pure digital white.
- **Brushed Metallic Copper & Bronze (`primary_color_hex: #C48D62` / Deep Bronze `#B37D52`):** Used strictly for fine-gauge borders, roman numerals, active states, delicate monograms, and focused calls to action. It must feel like understated metallic foil stamping rather than glossy chrome or bright gold.
- **Architectural Slate & Warm Charcoal (`#2A2E35`, `#7D7971`):** Structural division, secondary metadata, hairline separation grids, and understated body passages.

Color rules:
- Strictly forbid synthetic electric blues, saturated tech purples, or pure stark white (`#FFFFFF`).
- Borders are rendered in hairline strokes using `#C48D62` constrained to 20%–30% opacity.

## Typography

The typographic tension pairs the editorial majesty of **Bodoni Moda** with the crisp, quiet precision of **Hanken Grotesk**.

- **Display & Headlines:** Bodoni Moda is set with generous line heights and subtle negative tracking on large scales to showcase its extreme hairline serifs and high-contrast verticals. It must never appear artificially bolded or cramped.
- **Labels & Micro-copy:** Hanken Grotesk is set predominantly in uppercase with generous tracking (`0.18em` to `0.26em`) to echo traditional letterpress setting and museum plaque typography.
- **Body & Prose:** Main body content relies on the lighter weights of Hanken Grotesk (300) with wide leading (`1.7`–`1.8x`) to ensure effortless reading against the dark canvas, preserving an airy, unhurried rhythm.

## Layout & Spacing

The layout philosophy mirrors a bespoke editorial folio: structured, highly composed, and deliberately spacious. 

- **Grid Architecture:** A symmetrical 12-column grid on desktop with a maximum reading container width of 1140px, transitioning to an 8-column layout on tablet and a 4-column layout on mobile.
- **Negative Space as Luxury:** White space (or midnight space) is treated as a structural material. Components and content blocks must breathe with generous vertical margins (`space-xl` to `5rem`), ensuring each announcement, itinerary section, or response module reads as a distinct stationery plate.
- **Adaptability:**
  - *Desktop (1024px+):* Wide margins (`margin-desktop: 6rem`), dual-column card arrangements, and expansive typographic showcases.
  - *Tablet (768px - 1023px):* Balanced margins (`margin: 2.5rem`), single- to dual-column flow.
  - *Mobile (320px - 767px):* Tightened gutters (`1rem`), margins (`1.5rem`), with typography dropping gracefully via dedicated mobile scale tokens.

## Elevation & Depth

Depth is achieved through **tonal paper layering** and **low-contrast metallic framing**, entirely eschewing drop shadows and saturated multi-colored glows.

- **Surface Tiers:**
  - *Base Layer (`#070A0E`):* The infinite midnight room.
  - *Card & Stationery Plaquettes (`#0B1017` / `#11161F`):* Elevated through soft value shifts rather than harsh light.
  - *Overlay Sheets & Modals (`#161B23`):* Tinted charcoal with fine noise to mimic textured pulp.
- **Candlelit Ambient Glow:** If hovering or focusing, surfaces utilize an ultra-diffused, barely perceptible warm radiance: `box-shadow: 0 12px 40px -10px rgba(196, 141, 98, 0.08)`.
- **Delicate Hairline Borders:** Structural edges are defined by 1px rules colored with `#C48D62` at 20% to 30% opacity, evoking fine copper wire inlays or metallic die cuts.

## Shapes

The shape system is strictly **Sharp (`roundedness: 0`)**, celebrating the clean, razor-cut edges of hand-trimmed cardstock, architectural stone portals, and formal stationery envelopes.

- All buttons, modals, input containers, cards, and interactive chips maintain crisp `0px` border radiuses.
- Optional decorative treatments include classical clipped corners (45-degree chamfers of 4px to 8px) or nested inner hairline margins (e.g., an inset border positioned 6px inside the container's outer edge) to mimic framed invitation bevels.

## Components

### Buttons & CTAs
- **Primary RSVP / Action:** Sharp rectangular container with an opaque ecru fill (`#F7F4EE`) and dark midnight typography (`#0B1017`), or deep midnight surface with a hairline brushed copper border (`#C48D62` at 100%) and copper text. Label is tracked uppercase Hanken Grotesk.
- **Secondary Action:** Transparent background with a delicate 1px hairline border (`#C48D62` at 30%), shifting to 80% opacity on hover with a smooth 400ms transition.
- **No aggressive micro-bounces:** Transitions rely on subtle opacity shifts and border tone illumination.

### Text Inputs & Form Fields
- Minimalist open or bottom-line bordered fields. Bottom hairline rendered in slate grey (`#2A2E35`), turning to warm copper (`#C48D62`) upon focus.
- Floating or top-aligned labels in `label-sm` with letter spacing (`0.26em`) in muted ecru (`#7D7971`).
- Dark background (`#0B1017`) with warm ecru text input.

### Selection Controls (Checkboxes & Radios)
- Custom architectural geometry. Radios are sharp diamond lozenges or fine square borders with an inner solid copper diamond marker when selected.
- Hairline stroke in `#C48D62` (40% default, 100% checked).

### Stationery Cards & Plaquettes
- Built with a `#0E141D` background framed by a nested double hairline: an outer border in `#2A2E35` and an inset border (6px padding) in `#C48D62` at 25% opacity.
- Generous internal padding (`space-lg` to `space-xl`).

### Dietary & RSVP Filter Chips
- Unselected: Sharp outline with 1px border (`#2A2E35`), text in ecru-slate (`#7D7971`).
- Selected: Background in `#161B23`, border in `#C48D62`, text in ecru (`#F7F4EE`), accompanied by a subtle copper dot indicator.

### Bespoke Folio Elements
- **Monogram Seal:** Circular or diamond blind-embossed badge with `#C48D62` hairline framing.
- **Itinerary Timeline:** Slender vertical copper rule (`#C48D62` at 25%) with delicate copper lozenge markers indicating gala milestones (e.g., Midnight Supper, Salon Ball, Dawn Vows).