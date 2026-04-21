# Jay Portfolio — Design Spec
**Date:** 2026-04-21  
**Status:** Approved

---

## Brand Identity

| Token | Value |
|---|---|
| Name | JAY (English) / Munkhjavkhlan Enkhbaatar (Mongolian) |
| Primary Color | `#C84B0C` — Deep Ember Orange |
| Background | `#0A0A0A` — Near Black |
| Heading Font | Oxanium (700, 800) |
| Accent Font | Space Mono (400, 700) |
| Avatar | 2D pixel character (profile-avatar.png) — 3D version to be added later via Mixamo/VRoid |

---

## Goal

Freelance client acquisition + personal brand building. The site must convert visitors in under 30 seconds and make "JAY" memorable.

---

## Architecture

**Framework:** Next.js 15 App Router  
**Visual Engine:** Three.js + custom GLSL shaders via `@react-three/fiber` + `@react-three/drei`  
**Animation:** Framer Motion (scroll-driven)  
**Styling:** Tailwind CSS + shadcn/ui (fully rebranded to Ember & Ash tokens)  
**Fonts:** `next/font/google` — Oxanium + Space Mono  
**Deployment:** Vercel  

**Page structure — single `page.tsx`, three scroll sections:**
```
/
├── <HeroSection />
├── <WorkSection />
└── <ContactSection />
```

One persistent `<ShaderCanvas />` WebGL component rendered behind all sections as a fixed full-viewport background.

---

## WebGL Shader Background

- Custom GLSL fragment shader: deep orange volumetric noise + black shadow tendrils
- Animates continuously — slow, ethereal, like ember smoke
- Reacts to mouse position — ember glow follows cursor (parallax effect)
- Transitions between states per scroll position:
  - **Hero zone:** Full ember intensity, warm and active
  - **Work zone:** Cooled to near-black, faint orange pulses
  - **Contact zone:** Flares back to full ember intensity
- Configurable uniforms: `uNoiseIntensity`, `uColorTemp`, `uAnimationSpeed`

---

## Section 1 — Hero

**Layout:** Full viewport height, vertically and horizontally centered.

**Content stack:**
1. Pixel avatar — floating idle animation (subtle `translateY` loop, 2-3 frame pixel cycle)
2. `JAY` — Oxanium 800, massive, ember `text-shadow` glow
3. `// fullstack · mobile · ai · ecommerce` — Space Mono, dimmed
4. `Munkhjavkhlan Enkhbaatar` — Oxanium small, opacity 40%, adds identity
5. `Hire Me →` CTA button — Oxanium, ember border, glows on hover

**Interactions:**
- Mouse parallax shifts shader glow
- Scroll indicator fades out on scroll
- On scroll down: hero name scales down and fades, shader transitions to Work state

**3D Avatar (future):** When ready, replace 2D avatar with `.glb` model loaded via R3F, toon/pixel shader applied, Mixamo idle animation. Ember lighting from below.

---

## Section 2 — Work

**Layout:** Vertical stack of 3–4 full-width project cards.

**Section header:**
- `WORK` — Oxanium massive, semi-transparent, acts as watermark
- `// selected projects` — Space Mono, small, dimmed

**Each project card:**
- Background: `#0d0d0d`, `1px` ember border
- Project name — Oxanium large
- Result line — Space Mono: `// built for 10k+ users · Next.js · Stripe`
- Tech tags — small ember-colored pills
- `View Project →` link
- Optional: dark screenshot or looping video on the right

**Interactions:**
- Cards slide in from left on scroll enter (Framer Motion)
- On hover: card ember border intensifies, shader behind card brightens
- Shader stays near-black between cards

---

## Section 3 — Contact

**Layout:** Full viewport height, centered. Shader flares back to full ember.

**Content:**
1. Two-line Oxanium heading: `LET'S BUILD` / `SOMETHING.` — ember glow on the period
2. `// available for freelance · projects · collaborations` — Space Mono
3. Email link — large, ember-bordered button, copies to clipboard on click with pixel-style toast
4. GitHub + LinkedIn icon row — minimal, pixel-styled icons

**No contact form** — direct email only, reduces friction for freelance.

**Footer:**
- `© JAY 2026` — Space Mono, very small, very dim
- `Munkhjavkhlan Enkhbaatar` — even smaller, acts as a signature

**Final micro-interaction:**
- When user reaches bottom, pixel avatar reappears small in bottom-right corner
- Subtle wave/idle animation — like the character saying goodbye
- Fades in with a pixel dissolve effect

---

## Design Rules (Non-Negotiable)

- **No gradient borders** — ever. Borders are `1px solid` with a flat color or transparent.
- **No glow effects on UI elements** — buttons, cards, text are clean and sharp. Ember energy lives in the WebGL shader background only.
- **No rainbow or multi-color accents** — one accent color: `#C84B0C`. Used sparingly.
- **Professional restraint** — every element earns its place. If it doesn't serve the user, it's removed.
- **Hover states are subtle** — border opacity shift or background tint, not explosions of color.

---

## What's Intentionally Excluded

- No About page
- No Skills list (projects demonstrate skills)
- No Blog
- No contact form (email CTA only)
- No navbar (single page, scroll only)
- No gradient borders or decorative glows on UI components
- No animated text effects (typewriter, scramble, etc.) — too common

---

## Future Additions

- 3D avatar via Mixamo or VRoid Studio (free) — `.glb` loaded in R3F with toon shader
- Shader controls exposed as hidden Easter egg (keyboard shortcut reveals sliders)
- Cursor custom pixel cursor matching avatar style
