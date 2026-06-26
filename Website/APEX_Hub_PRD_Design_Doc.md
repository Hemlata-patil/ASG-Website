# APEX Hub — Product Requirements Document & Frontend Design Guide
**Version:** 1.0  
**Project:** APEX Website Redesign  
**Original Site:** apexstartupgroup.com  
**Stack:** React · HTML · CSS · JavaScript  
**Date:** June 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Audience & User Personas](#3-audience--user-personas)
4. [Information Architecture](#4-information-architecture)
5. [Page-by-Page Feature Specifications](#5-page-by-page-feature-specifications)
6. [Design System](#6-design-system)
7. [Component Library](#7-component-library)
8. [Technical Architecture](#8-technical-architecture)
9. [Responsive & Accessibility Requirements](#9-responsive--accessibility-requirements)
10. [Content Strategy](#10-content-strategy)
11. [Out of Scope](#11-out-of-scope)
12. [Appendix — File & Folder Structure](#12-appendix--file--folder-structure)

---

## 1. Project Overview

### 1.1 Background

APEX Startup Group (ASG) is a Jalgaon-based community of founders, innovators, and AI enthusiasts running meetups, AI launchpads, and expert sessions. The current website is a single-page marketing site with limited structure. The redesign introduces APEX Hub — a professional, minimal community platform that unifies two flagship programs:

- **ASG (APEX Startup Group)** — The startup ecosystem community: founders, mentors, investors, service providers.
- **AAL (APEX AI Launchpad)** — The internship/student program: domains, mentors, intern community.

### 1.2 Redesign Philosophy

> Minimal. Professional. Community-first.

The redesign is NOT a dashboard, LMS, or social network. It is a **public-facing community platform** — like a high-quality landing site for an ecosystem. Think Linear.app meets Y Combinator's community page: clean, confident, and purposeful.

### 1.3 Core User Journeys

Two primary conversions drive every design decision:

| Journey | CTA | Target User |
|---|---|---|
| **Apply for Internship** | "Apply Now" → External AAL Portal | Students, freshers, early-career |
| **Join Community** | "Join ASG" → Registration Form | Founders, investors, mentors, service providers |

---

## 2. Goals & Success Metrics

### 2.1 Product Goals

- Rebuild website with a clear, professional structure that reflects the dual ASG/AAL identity.
- Increase clarity for first-time visitors about what APEX Hub offers.
- Drive conversions to both the internship portal and the ASG community.
- Present events, gallery, and community stories in a polished, timeline-driven format.

### 2.2 Design Goals

- Implement the ASG Color Scheme (warm orange-red gradient + deep neutrals).
- All sections must be redesigned from scratch — no template reuse.
- Hero section must be visually striking and instantly communicates value.
- Every section must feel cohesive in a single-page scroll experience.

### 2.3 Success Metrics (Post-launch)

- Time on page > 2 minutes average
- Bounce rate < 55%
- CTA click-through rate (Apply / Join) > 8%
- Mobile usability score > 90 (Lighthouse)

---

## 3. Audience & User Personas

### Persona 1 — The Student (AAL)
- **Who:** Engineering/BBA/MBA student, 18–25, Tier 2/3 city
- **Goal:** Find a structured internship with real startup exposure
- **Pain point:** Generic job portals, no mentorship
- **Key CTA:** Apply for AAL Internship

### Persona 2 — The Founder (ASG)
- **Who:** Early-stage startup founder, 24–38, building in Jalgaon or remote
- **Goal:** Connect with mentors, co-founders, investors
- **Pain point:** Isolated ecosystem, no structured community
- **Key CTA:** Join ASG Community

### Persona 3 — The Mentor / Investor
- **Who:** Experienced professional, 30–55
- **Goal:** Give back, discover dealflow, build reputation
- **Pain point:** No curated local community platform
- **Key CTA:** Join ASG Community

### Persona 4 — The Visitor (Discovery)
- **Who:** Anyone curious about APEX
- **Goal:** Understand what APEX does and whether it's worth engaging
- **Pain point:** Confusing or cluttered first impressions
- **Key CTA:** Scroll, explore, then convert

---

## 4. Information Architecture

### 4.1 Navigation Structure

```
APEX Hub
├── Home (/)
├── AAL — APEX AI Launchpad (/aal)
│   ├── About AAL
│   ├── Domains
│   ├── Mentors
│   ├── Intern Community
│   └── Apply → [External Portal]
├── ASG — Startup Community (/asg)
│   ├── About ASG
│   ├── Founders
│   ├── Investors
│   ├── Mentors
│   ├── Service Providers
│   └── Join Community
├── Events (/events)
│   ├── Upcoming
│   ├── Past
│   └── Recurrent
├── Gallery (/gallery) — Timeline View
├── About (/about)
└── Contact (/contact)
```

### 4.2 Single-Page Scroll Sections (Home)

The homepage is a long-scroll experience. Sections in order:

1. Navbar
2. Hero
3. Stats Bar (social proof numbers)
4. What is APEX Hub (split: AAL + ASG)
5. AAL Highlights (domains, mentors, journey)
6. ASG Highlights (community pillars)
7. Events Preview (upcoming + recurrent)
8. Gallery Preview (3 most recent timeline entries)
9. Testimonials / Community Voices
10. About Snapshot
11. Contact / CTA Banner
12. Footer

---

## 5. Page-by-Page Feature Specifications

---

### 5.1 Navbar

**Behavior:**
- Sticky on scroll; background transitions from transparent → solid `#0D0D0D` after 80px scroll.
- Logo on the left: APEX Hub wordmark with a small flame/apex icon in `#FF5A14`.
- Nav links: Home · AAL · ASG · Events · Gallery · About · Contact
- Two CTAs on the right: `Apply Now` (ghost button, orange border) · `Join Community` (filled, orange gradient)
- Hamburger menu on mobile with a full-screen overlay.

**Active State:** Underline animation using the orange gradient on active nav item.

---

### 5.2 Hero Section

**Layout:** Full-viewport height (100vh). Two-column grid on desktop. Center-stacked on mobile.

**Left Column — Copy:**
- Overline tag: `APEX HUB — JALGAON'S STARTUP ECOSYSTEM` (small caps, orange, letter-spaced)
- H1: `Where Startups Meet Talent, Mentors, and Community.`
  - "Startups", "Talent", "Mentors" animate in with a staggered fade-up
  - One word should cycle via typewriter/swap animation (e.g., "Community" cycles through: Community · Innovation · Growth)
- Subtext paragraph (2–3 lines): brief mission statement pulled from original site
- Two CTA buttons stacked or inline:
  - `Apply for AAL Internship` → filled orange gradient
  - `Join ASG Community` → ghost, dark border, white text
- Trust indicators row below buttons: `120+ Interns · 40+ Mentors · 15+ Events · 3 Cohorts`

**Right Column — Visual:**
- Abstract graphic: an SVG/CSS composition of interlocking hexagons or orbit rings with subtle animation (slow rotation, pulsing nodes)
- Alternatively: a masked image grid of 4 community photos (2x2 bento grid) with slight parallax on scroll
- Orange gradient accent glow in the background (radial, top-right)

**Background:**
- Deep dark: `#0D0D0D` with a subtle grain texture overlay (5% opacity CSS noise)
- Floating orange dot particles (CSS, very subtle, 3–4 orbs)

---

### 5.3 Stats / Social Proof Bar

**Layout:** Full-width strip, dark gray `#1A1A1A`, horizontal flex row.

**Content (4 stats):**
- `3 Cohorts Completed`
- `120+ Interns Trained`
- `40+ Mentors & Experts`
- `15+ Events Hosted`

**Style:** Large number in orange (`#FF5A14`), label below in gray `#9A9A9A`. Divider lines between each stat. CountUp animation on scroll-enter.

---

### 5.4 What is APEX Hub (Dual Split Section)

**Layout:** Two-panel split card. Full-width, equal halves. Slight gap between.

**Left Panel — AAL:**
- Background: `#1A1A1A`
- Accent chip: `AAL` in orange
- H3: `APEX AI Launchpad`
- Body: 2–3 sentences about the internship program
- Feature list (icons + text): Domains · Mentors · Real Projects · Cohort Experience
- CTA: `Explore AAL →`

**Right Panel — ASG:**
- Background: orange gradient (`#FF5A14` → `#FF3D00`)
- Text: white
- Accent chip: `ASG` in white/translucent
- H3: `APEX Startup Group`
- Body: 2–3 sentences about the startup community
- Feature list: Founders · Investors · Networking · Expert Sessions
- CTA: `Explore ASG →` (dark button on orange bg)

---

### 5.5 AAL Section (Internship Highlights)

**Layout:** Section with a light heading, then 3 sub-sections in alternating layout (left-text/right-visual, then reverse).

**Sub-sections:**

**A. Domains**
- Heading: `Explore Domains`
- Domain cards in a 3-column grid (or 2x3): AI/ML · Web Dev · Product · Design · Data · Marketing
- Each card: icon, domain name, 1-line description, subtle orange-left border on hover

**B. Mentors Preview**
- Heading: `Learn from Experts`
- Horizontal scroll of 4–5 mentor cards (avatar circle, name, role/company)
- "View All Mentors →" link

**C. Internship Journey**
- Heading: `Your AAL Journey`
- Vertical timeline (alternating left/right on desktop, single column on mobile):
  - Stage 1: Apply & Get Selected
  - Stage 2: Onboarding & Team Formation
  - Stage 3: Domain Deep-Dive (Weeks 1–2)
  - Stage 4: Live Project Execution (Weeks 3–6)
  - Stage 5: Demo Day & Certification
- Each stage: number badge (orange), title, 1–2 lines description
- Final CTA card: `Ready to start your journey? Apply Now →`

---

### 5.6 ASG Section (Community Highlights)

**Layout:** Dark section (`#0D0D0D`) with orange accent elements.

**Community Pillars — 4 cards in 2x2 grid:**

| Pillar | Icon | Description |
|---|---|---|
| Founders | 🚀 | Early-stage builders and visionaries |
| Mentors | 🧭 | Domain experts and startup advisors |
| Investors | 💼 | Angel investors and micro-VCs |
| Service Providers | 🛠 | Legal, tech, finance, and design partners |

Each card: dark surface, icon top, heading, 1-line description, hover lifts with orange border glow.

**Activities Row (below cards):**
- Horizontal list of recurring programs: Meetups · Expert Sessions · AI Launchpad · Workshops · Demo Days
- Each as a tag chip in orange-on-dark style.

**CTA Banner:** `Become part of Jalgaon's most active startup ecosystem.` with `Join ASG →` button.

---

### 5.7 Events Page / Section

**Three Tabs:**

**Tab 1 — Upcoming Events**
- Event card: date badge (orange), event title, type (Workshop/Meetup/etc.), venue/online indicator, brief description, `RSVP →` or `Register →` link

**Tab 2 — Past Events**
- Same card layout, but desaturated/grayed, with `Watch Recap →` or `View Photos →` links

**Tab 3 — Recurrent Programs**
- Programs that run regularly: Monthly Meetup · Weekly Sessions · etc.
- Card shows frequency badge (`Monthly`, `Weekly`) + description + `Learn More →`

**Filter Bar (above tabs):** Dropdown for Category (Workshop / Meetup / Expert Session / Demo Day)

---

### 5.8 Gallery — Timeline Layout

**This is a new feature. It replaces a flat photo grid with a chronological timeline.**

**Layout:** Centered vertical timeline line. Entries alternate left and right on desktop. Single column on mobile.

**Each Timeline Entry:**
- Date marker on the line (month + year pill)
- Card with:
  - Event/moment title
  - 1–3 photos in a small grid (click to lightbox)
  - 2-line caption / description
  - Tags: `#AAL` or `#ASG` or `#Event` etc.

**Interactions:**
- Lightbox on image click (full-screen overlay with prev/next)
- Filter by year (pills above timeline): All · 2024 · 2025 · 2026
- Filter by tag: All · AAL · ASG · Events

**Visual Style:**
- Timeline line: `#FF5A14` gradient from top to bottom
- Node dots: filled orange circles
- Cards: `#1A1A1A` background, subtle border, image previews with `border-radius: 8px`

---

### 5.9 Testimonials / Community Voices

**Layout:** Dark section. Heading: `Voices from the Community`.

**Content:** 3–4 quote cards in a horizontal row (or carousel on mobile)
- Quote text (italic)
- Avatar (circle photo or initials fallback)
- Name, role, batch/program (e.g., "AAL Cohort 2" or "ASG Founder Member")

**Style:** Cards on `#1A1A1A`, orange left-border accent, soft quote icon in background.

---

### 5.10 About Page / Snapshot Section

**Sections:**

**A. Origin Story**
- Heading: `How APEX Began`
- 2-column: left = copy, right = a founding team photo or abstract illustration
- Content: Based on original site's About section

**B. Mission & Vision**
- Two side-by-side cards: Mission (what we do) · Vision (where we're going)
- Clean, large-type, minimal styling

**C. Team / Core Crew**
- Grid of 4–8 team member cards: photo, name, role
- Clean, uniform sizing

**D. Partners & Collaborators**
- Logo strip of partner organizations (grayscale, hover to full color)

---

### 5.11 Contact Section

**Layout:** Two columns.

**Left:** Contact details
- Email, Instagram, LinkedIn, WhatsApp Community link
- Location: Jalgaon, Maharashtra

**Right:** Contact form
- Fields: Name · Email · Message · Role (dropdown: Student / Founder / Mentor / Investor / Other)
- Submit button: orange gradient
- No backend required for MVP — use Formspree or Netlify Forms

---

### 5.12 Footer

**Layout:** 4-column grid on desktop, stacked on mobile.

**Columns:**
1. Logo + tagline + social icons
2. Quick Links (Home, AAL, ASG, Events, Gallery, About)
3. Programs (AAL Internship, ASG Community, Expert Sessions, Demo Days)
4. Connect (Email, Instagram, LinkedIn, WhatsApp)

**Bottom bar:** `© 2026 APEX Startup Group · Built in Jalgaon ·` Privacy Policy · Terms

---

## 6. Design System

### 6.1 Color Palette

#### Primary — Orange Spectrum
| Token | Hex | Usage |
|---|---|---|
| `--apex-primary` | `#FF5A14` | Primary buttons, highlights, timeline nodes |
| `--apex-primary-dark` | `#E24200` | Hover states, pressed buttons |
| `--apex-primary-warm` | `#FF7A2B` | Secondary accents, card borders on hover |
| `--apex-primary-light` | `#FF8A00` | Gradient start, glow effects |
| `--apex-primary-hot` | `#FF3D00` | Gradient end, high-emphasis elements |
| `--apex-primary-tint` | `#FFF0E5` | Light backgrounds, tag chips (light mode if any) |

#### Neutrals — Dark & Grays
| Token | Hex | Usage |
|---|---|---|
| `--apex-bg-base` | `#0D0D0D` | Page background (dark sections) |
| `--apex-bg-surface` | `#1A1A1A` | Cards, nav background on scroll |
| `--apex-bg-light` | `#F7F7F7` | Light section backgrounds |
| `--apex-bg-muted` | `#EDEDED` | Dividers, input backgrounds |
| `--apex-border` | `#D4D4D4` | Borders on light backgrounds |
| `--apex-text-muted` | `#9A9A9A` | Secondary text, captions |
| `--apex-text-white` | `#FFFFFF` | Primary text on dark backgrounds |

#### Semantic
| Token | Hex | Usage |
|---|---|---|
| `--apex-success-bg` | `#E8F5E9` | Success states |
| `--apex-success` | `#2E7D32` | Success text/icons |

---

### 6.2 Typography

#### Font Stack
- **Display / Headings:** `Inter` or `Plus Jakarta Sans` (Google Fonts) — weights 600, 700, 800
- **Body:** `Inter` — weights 400, 500
- **Monospace (tags, code):** `JetBrains Mono` or `Fira Code`

#### Type Scale
| Style | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `display-xl` | 64px / 4rem | 800 | 1.1 | Hero H1 |
| `display-lg` | 48px / 3rem | 700 | 1.15 | Section headings |
| `heading-md` | 32px / 2rem | 700 | 1.2 | Sub-section headings |
| `heading-sm` | 24px / 1.5rem | 600 | 1.3 | Card headings |
| `body-lg` | 18px / 1.125rem | 400 | 1.6 | Lead paragraphs |
| `body-md` | 16px / 1rem | 400 | 1.6 | Body text |
| `body-sm` | 14px / 0.875rem | 400 | 1.5 | Captions, labels |
| `label` | 12px / 0.75rem | 600 | 1.4 | Overlines, tags |

#### Typography Rules
- H1 on hero: `display-xl`, white, tight tracking (`letter-spacing: -0.02em`)
- Section headings: `display-lg`, centered, with an orange gradient underline or accent bar
- Body on dark: `#FFFFFF` or `#D4D4D4`
- Body on light: `#1A1A1A` or `#0D0D0D`

---

### 6.3 Spacing System

Uses an 8px base grid.

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Micro spacing |
| `--space-2` | 8px | Tight spacing |
| `--space-3` | 16px | Component padding |
| `--space-4` | 24px | Card padding |
| `--space-5` | 32px | Section inner spacing |
| `--space-6` | 48px | Section gap |
| `--space-7` | 64px | Section vertical padding |
| `--space-8` | 96px | Large section breathing room |
| `--space-9` | 128px | Hero / banner padding |

---

### 6.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Tags, chips |
| `--radius-md` | 8px | Cards |
| `--radius-lg` | 12px | Large cards, panels |
| `--radius-xl` | 20px | Feature banners |
| `--radius-full` | 9999px | Pills, avatar circles, buttons |

---

### 6.5 Shadow System

All shadows on dark surfaces are very subtle and use orange-tinted glow for emphasis.

```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
--shadow-md: 0 4px 16px rgba(0,0,0,0.5);
--shadow-lg: 0 8px 32px rgba(0,0,0,0.6);
--shadow-glow-orange: 0 0 24px rgba(255,90,20,0.3);
--shadow-glow-orange-lg: 0 0 48px rgba(255,90,20,0.2);
```

---

### 6.6 Gradients

```css
/* Primary CTA Gradient */
--gradient-primary: linear-gradient(135deg, #FF8A00 0%, #FF5A14 50%, #FF3D00 100%);

/* Hero background accent */
--gradient-hero-glow: radial-gradient(ellipse at 75% 20%, rgba(255,90,20,0.15) 0%, transparent 60%);

/* Dark section gradient */
--gradient-dark: linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%);

/* Timeline line */
--gradient-timeline: linear-gradient(180deg, #FF8A00 0%, #FF3D00 100%);

/* Text gradient (for highlighted words) */
--gradient-text: linear-gradient(90deg, #FF8A00, #FF3D00);
```

---

### 6.7 Animation & Motion

#### Principles
- Functional animations only — no decorative complexity
- Prefer `transform` and `opacity` for GPU acceleration
- Default easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo feel)
- Respect `prefers-reduced-motion`

#### Standard Transitions
```css
--transition-fast: 150ms ease;
--transition-base: 250ms cubic-bezier(0.16, 1, 0.3, 1);
--transition-slow: 400ms cubic-bezier(0.16, 1, 0.3, 1);
```

#### Scroll Animations (Intersection Observer)
- Fade-up on enter: `opacity: 0; transform: translateY(24px)` → `opacity: 1; transform: translateY(0)`
- Stagger delay for grids: 50ms per child
- Stats CountUp: triggers on first scroll-enter

#### Hero Specific
- H1 words: staggered fade-up, 100ms delay each
- Rotating word: CSS clip-path swap or JS typewriter, 2.5s interval
- Background orbs: slow `keyframes` float, 8–12s loop

---

## 7. Component Library

### 7.1 Button

```
Variants: primary | ghost | outline | text
Sizes: sm | md | lg
States: default | hover | active | disabled | loading
```

**Primary Button:**
- Background: `var(--gradient-primary)`
- Text: white
- Padding: `12px 24px` (md), `16px 32px` (lg)
- Border-radius: `--radius-full`
- Hover: scale(1.02) + shadow-glow-orange

**Ghost Button:**
- Background: transparent
- Border: 1.5px solid `#FF5A14`
- Text: `#FF5A14`
- Hover: background `rgba(255,90,20,0.08)`

---

### 7.2 Card

```
Variants: default | elevated | bordered | gradient
```

**Default Card:**
- Background: `#1A1A1A`
- Border: 1px solid `rgba(255,255,255,0.06)`
- Border-radius: `--radius-md`
- Padding: `--space-4`
- Hover: border-color `rgba(255,90,20,0.4)`, translateY(-2px)

---

### 7.3 Tag / Chip

- Background: `rgba(255,90,20,0.12)`
- Text: `#FF7A2B`
- Border-radius: `--radius-full`
- Padding: `4px 12px`
- Font: `--label` style

---

### 7.4 Section Heading

```jsx
<SectionHeading
  overline="AAL PROGRAM"
  title="Learn. Build. Launch."
  subtitle="A structured 6-week internship with real startup exposure."
  align="center | left"
/>
```

- Overline: small caps, orange, letter-spaced
- Title: `display-lg`, dark or white depending on section bg
- Underline accent: 3px orange gradient bar, centered, 60px wide

---

### 7.5 Mentor / Person Card

- Square-ish card (portrait ratio)
- Top: circular avatar (80px diameter)
- Name: `heading-sm`
- Role: `body-sm`, muted color
- Company/org: tag chip
- Optional: LinkedIn icon link

---

### 7.6 Domain Card

- Icon (emoji or SVG, 32px)
- Domain name (`heading-sm`)
- 1-line description (`body-sm`)
- Left orange border (3px) on hover
- Background: `#1A1A1A`

---

### 7.7 Event Card

- Top: date badge (orange pill, `DD MMM YYYY`)
- Title: `heading-sm`
- Type tag: chip
- Venue line: small, muted
- Description: 2 lines clamped
- CTA link at bottom

---

### 7.8 Timeline Entry (Gallery)

```
Structure:
  [date marker on line]
  [card: left or right alternating]
    ├── Title
    ├── Photo grid (1–3 images, click to lightbox)
    ├── Caption text
    └── Tags
```

- Line: 2px, `var(--gradient-timeline)`
- Node: 12px circle, `#FF5A14`, white inner dot
- Card: default card styling
- Hover: gentle scale on images

---

### 7.9 Stat Block

```
[large number in orange]
[label in muted gray]
```

- Number: `display-lg`, `#FF5A14`, with CountUp animation
- Label: `body-sm`, `#9A9A9A`
- Optional: small icon above number

---

### 7.10 Navbar Component

```
[Logo]  [Nav Links]  [Apply Now]  [Join Community]
```

- Default: `background: transparent`
- Scrolled (>80px): `background: rgba(13,13,13,0.96)`, `backdrop-filter: blur(12px)`
- Transition: `--transition-base`
- Active link: orange underline (2px, animated width 0→100%)

---

## 8. Technical Architecture

### 8.1 Project Setup

```
npx create-react-app apex-hub
# OR
npm create vite@latest apex-hub -- --template react
```

Recommended: **Vite + React** for faster builds.

### 8.2 Dependencies

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x",
  "react-intersection-observer": "^9.x",
  "react-countup": "^6.x",
  "react-type-animation": "^3.x",
  "react-photo-view": "^1.x",
  "framer-motion": "^11.x",
  "lucide-react": "^0.x"
}
```

Optional but useful:
- `swiper` for mobile carousels
- `date-fns` for date formatting in events/gallery

### 8.3 CSS Architecture

Use CSS Modules (default with Vite) or a global design token file.

**File structure:**
```
src/
  styles/
    tokens.css       ← All CSS custom properties (colors, spacing, radius, etc.)
    reset.css        ← Modern CSS reset
    typography.css   ← Font imports and type scale classes
    animations.css   ← Keyframes and animation utility classes
    global.css       ← Global utility classes
```

**tokens.css pattern:**
```css
:root {
  /* Colors */
  --apex-primary: #FF5A14;
  --apex-bg-base: #0D0D0D;
  /* ... all tokens from Section 6 */

  /* Spacing */
  --space-4: 24px;
  /* ... */
}
```

### 8.4 Folder Structure

```
apex-hub/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── SectionHeading/
│   │   │   ├── Tag/
│   │   │   ├── StatBlock/
│   │   │   └── Navbar/
│   │   ├── sections/
│   │   │   ├── Hero/
│   │   │   ├── StatsBar/
│   │   │   ├── DualSplit/
│   │   │   ├── AALSection/
│   │   │   ├── ASGSection/
│   │   │   ├── EventsPreview/
│   │   │   ├── GalleryPreview/
│   │   │   ├── Testimonials/
│   │   │   ├── AboutSnap/
│   │   │   └── ContactBanner/
│   │   └── layout/
│   │       ├── Footer/
│   │       └── PageWrapper/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── AAL.jsx
│   │   ├── ASG.jsx
│   │   ├── Events.jsx
│   │   ├── Gallery.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── data/
│   │   ├── mentors.js
│   │   ├── events.js
│   │   ├── gallery.js
│   │   ├── domains.js
│   │   └── team.js
│   ├── hooks/
│   │   ├── useScrollAnimation.js
│   │   └── useCountUp.js
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── reset.css
│   │   ├── typography.css
│   │   ├── animations.css
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

### 8.5 Routing

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/aal" element={<AAL />} />
  <Route path="/asg" element={<ASG />} />
  <Route path="/events" element={<Events />} />
  <Route path="/gallery" element={<Gallery />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
</Routes>
```

Smooth scroll to section on same-page anchor links (e.g., Home → #aal-section).

### 8.6 Data Layer

All content lives in `/src/data/*.js` as static JS arrays/objects. This makes it trivial to later swap for a CMS API.

**Example: events.js**
```js
export const events = [
  {
    id: 1,
    title: "ASG Monthly Meetup #12",
    type: "meetup",
    status: "upcoming",        // upcoming | past | recurrent
    date: "2026-07-15",
    venue: "Jalgaon, Maharashtra",
    description: "...",
    tags: ["#ASG", "#Meetup"],
    recurrence: null,          // or "monthly"
    registrationUrl: "https://...",
    recapUrl: null,
    photos: []
  }
];
```

**Example: gallery.js**
```js
export const galleryEntries = [
  {
    id: 1,
    date: "2026-03-10",
    title: "AAL Cohort 3 Demo Day",
    description: "12 teams presented their projects to mentors and investors.",
    photos: ["demo-day-1.jpg", "demo-day-2.jpg", "demo-day-3.jpg"],
    tags: ["AAL", "Demo Day"]
  }
];
```

### 8.7 Scroll Animation Pattern

```jsx
// useScrollAnimation.js
import { useInView } from 'react-intersection-observer';

export const useScrollAnimation = (threshold = 0.1) => {
  const { ref, inView } = useInView({ threshold, triggerOnce: true });
  return {
    ref,
    style: {
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(24px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease'
    }
  };
};
```

---

## 9. Responsive & Accessibility Requirements

### 9.1 Breakpoints

```css
--bp-sm: 480px;   /* Large phone */
--bp-md: 768px;   /* Tablet */
--bp-lg: 1024px;  /* Small desktop */
--bp-xl: 1280px;  /* Standard desktop */
--bp-2xl: 1536px; /* Large desktop */
```

### 9.2 Responsive Behaviors

| Section | Desktop | Tablet | Mobile |
|---|---|---|---|
| Hero | 2-col grid | 2-col (shrunk) | 1-col, visual below copy |
| Stats Bar | 4-col flex | 4-col | 2x2 grid |
| Dual Split | 2 equal halves | 2 halves (stacked text) | Full-width stacked |
| Domain Cards | 3-col grid | 2-col grid | 1-col or 2-col |
| AAL Journey | Alternating LR | Single column | Single column |
| ASG Pillars | 2x2 grid | 2x2 grid | 1-col |
| Gallery Timeline | Alt left/right | Single column | Single column |
| Testimonials | 3-col | 2-col carousel | 1-col carousel |
| Footer | 4-col | 2-col | 1-col stacked |

### 9.3 Accessibility

- All images: meaningful `alt` attributes (or `alt=""` for decorative)
- Color contrast: all text must meet WCAG AA (4.5:1 ratio minimum)
  - Note: `#9A9A9A` on `#0D0D0D` barely passes; use `#AAAAAA` for safety on dark backgrounds
- Keyboard navigation: all interactive elements reachable via Tab
- Focus rings: custom orange focus ring (`outline: 2px solid #FF5A14; outline-offset: 3px`)
- `prefers-reduced-motion`: all animations wrapped in media query check
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` used correctly
- Skip-to-content link at top of page (visually hidden, shown on focus)
- Lightbox: traps focus, closeable via Escape key

---

## 10. Content Strategy

### 10.1 Tone of Voice

- **Confident but not corporate.** This is a grassroots community, not a VC firm.
- **Specific over vague.** Say "120 interns across 3 cohorts" not "hundreds of participants".
- **Active voice.** "Join the community" not "Community membership is available".
- **Warm and local.** Jalgaon is a feature, not a limitation. Celebrate it.

### 10.2 Copy Sources

All body copy should be extracted and rewritten from:
- `apexstartupgroup.com` (original About, program descriptions)
- Any existing Instagram/LinkedIn bios for APEX Startup Group

### 10.3 Placeholder Content Needed

Before launch, the following content must be supplied:

- [ ] Hero: Final H1 tagline (approved by team)
- [ ] Stats: Accurate numbers (interns, mentors, events, cohorts)
- [ ] Mentor profiles: Photos, names, roles (minimum 4)
- [ ] Team profiles: Photos, names, roles (minimum 4)
- [ ] Domain descriptions: 1-line descriptions for each domain
- [ ] Gallery: Minimum 6 timeline entries with photos
- [ ] Events: Minimum 2 upcoming, 3 past, 2 recurrent
- [ ] Testimonials: 3–4 real quotes with attribution
- [ ] Partner logos: High-resolution

---

## 11. Out of Scope (v1.0)

The following are **explicitly excluded** from this frontend build:

- Backend / database / API development
- User authentication / login system
- AAL Registration Portal (separate external tool)
- Admin CMS or content management interface
- Real-time features (chat, notifications)
- Payment or e-commerce
- Mobile app

The contact form should use a third-party form service (Formspree, Netlify Forms, or EmailJS). No custom backend is required.

---

## 12. Appendix — File & Folder Structure

```
apex-hub/
├── public/
│   ├── index.html
│   ├── favicon.ico          ← APEX Hub logomark (orange flame on dark)
│   └── og-image.png         ← 1200×630 social preview image
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── hero-bento/  ← 4 community photos for hero grid
│   │   │   ├── mentors/     ← mentor profile photos
│   │   │   ├── team/        ← team profile photos
│   │   │   ├── gallery/     ← timeline event photos
│   │   │   └── partners/    ← partner logos
│   │   └── icons/           ← custom SVG icons if any
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.module.css
│   │   │   ├── Card/
│   │   │   ├── SectionHeading/
│   │   │   ├── Tag/
│   │   │   ├── StatBlock/
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navbar.module.css
│   │   │   └── Lightbox/
│   │   ├── sections/
│   │   │   ├── Hero/
│   │   │   ├── StatsBar/
│   │   │   ├── DualSplit/
│   │   │   ├── AALSection/
│   │   │   │   ├── Domains.jsx
│   │   │   │   ├── MentorsPreview.jsx
│   │   │   │   └── JourneyTimeline.jsx
│   │   │   ├── ASGSection/
│   │   │   │   ├── Pillars.jsx
│   │   │   │   └── ActivitiesRow.jsx
│   │   │   ├── EventsPreview/
│   │   │   ├── GalleryPreview/
│   │   │   ├── Testimonials/
│   │   │   ├── AboutSnap/
│   │   │   └── ContactBanner/
│   │   └── layout/
│   │       ├── Footer/
│   │       └── PageWrapper/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── AAL.jsx
│   │   ├── ASG.jsx
│   │   ├── Events.jsx
│   │   ├── Gallery.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── data/
│   │   ├── mentors.js
│   │   ├── events.js
│   │   ├── gallery.js
│   │   ├── domains.js
│   │   └── team.js
│   ├── hooks/
│   │   ├── useScrollAnimation.js
│   │   └── useCountUp.js
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── reset.css
│   │   ├── typography.css
│   │   ├── animations.css
│   │   └── global.css
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .gitignore
├── vite.config.js
├── package.json
└── README.md
```

---

*End of Document*

**APEX Hub PRD v1.0 · June 2026 · Prepared for Frontend Development**
