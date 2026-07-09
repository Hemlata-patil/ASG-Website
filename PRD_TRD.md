# ASG Website — PRD + TRD
## Product Requirements Document + Technical Requirements Document

**Project:** ASG Website  
**Organization:** Apex Startup Group  
**Version:** 1.0  
**Date:** July 2026  
**Status:** Approved — Ready for Development  
**Document Type:** Combined PRD + TRD (Single Source of Truth)

---

## Table of Contents

**PART A — PRODUCT REQUIREMENTS**

1. [Executive Summary](#1-executive-summary)
2. [Vision](#2-vision)
3. [Goals](#3-goals)
4. [Non-Goals](#4-non-goals)
5. [Scope](#5-scope)
6. [User Types](#6-user-types)
7. [User Journeys](#7-user-journeys)
8. [Functional Requirements](#8-functional-requirements)
9. [Non-Functional Requirements](#9-non-functional-requirements)

**PART B — TECHNICAL REQUIREMENTS**

10. [Technical Stack](#10-technical-stack)
11. [High-Level Architecture](#11-high-level-architecture)
12. [Application Flow](#12-application-flow)
13. [Authentication Flow](#13-authentication-flow)
14. [Authorization Flow](#14-authorization-flow)
15. [Database Design Principles](#15-database-design-principles)
16. [Storage Design Principles](#16-storage-design-principles)
17. [API Standards](#17-api-standards)
18. [Validation Strategy](#18-validation-strategy)
19. [Error Handling Strategy](#19-error-handling-strategy)
20. [Security Strategy](#20-security-strategy)
21. [Folder Structure](#21-folder-structure)
22. [Coding Principles](#22-coding-principles)
23. [Development Workflow](#23-development-workflow)

**PART C — SUPPLEMENTARY**

24. [Assumptions](#24-assumptions)
25. [Risks](#25-risks)
26. [Future Scalability](#26-future-scalability)
27. [Glossary](#27-glossary)

---

# PART A — PRODUCT REQUIREMENTS

---

## 1. Executive Summary

Apex Startup Group (ASG) is a community platform for founders, students, industry experts, and investors operating from Jalgaon, Maharashtra. The organization runs internship cohorts, community events, startup initiatives, and expert programs. Today, the organization has no unified web presence — content is managed manually and there is no structured digital channel for visitors to discover the program, apply to join, or contact the team.

The ASG Website is a production-ready, publicly accessible informational platform with an integrated, protected Admin Panel. It replaces ad-hoc communication with a centralized, database-backed system where a Super Admin can manage all website content through a dashboard, and visitors can discover the organization, explore its programs, view member listings, browse events and blogs, and submit applications or queries — all without creating an account.

---

## 2. Vision

Build a fast, well-designed, and fully content-managed web presence for Apex Startup Group that:

- Communicates the organization's work clearly to any visitor within the first 30 seconds.
- Enables the admin team to publish and update all content without touching source code.
- Creates a structured digital record of events, interns, community members, problem statements, partners, and initiatives.
- Positions ASG as a credible, organized startup community in the region.

---

## 3. Goals

| # | Goal | Measurable Outcome |
|---|---|---|
| G1 | Replace all static, hardcoded content with database-backed, admin-managed content | Zero content updates requiring a code change or redeployment |
| G2 | Publish a professional public website across all 12 content modules | All module pages live and publicly accessible at launch |
| G3 | Implement secure admin authentication | Admin Panel inaccessible without valid Supabase Auth session |
| G4 | Enable structured application and contact submission | Visitor-submitted records stored in the database and reviewable in the dashboard |
| G5 | Establish a media asset management system | All images and files stored in Supabase Storage, never as Base64 or hardcoded URLs |
| G6 | Build an admin dashboard with meaningful analytics | Dashboard showing 7 KPI metrics, a college-wise intern bar chart, and recent activity feeds |

---

## 4. Non-Goals

The following are explicitly excluded from this version of the ASG Website. They are documented here to prevent scope creep.

| Item | Reason |
|---|---|
| Visitor account creation or login | Visitors are read-only. No authentication system is needed for them. |
| Role-Based Access Control (RBAC) | Authorization is binary: authenticated admin or public visitor. |
| Automated email responses | No email sending from the application. The admin replies manually. |
| Payment or subscription features | No e-commerce or fee collection. |
| Real-time chat or notifications | Out of scope for V1. |
| Blog comment system | No public commenting on blog posts. |
| Multi-language / i18n | English only in V1. |
| Mobile native application | Web only. |
| External CMS integration | Supabase is the database; no headless CMS. |
| Microservices or separate backend server | All backend logic lives inside Next.js Route Handlers. |

---

## 5. Scope

### 5.1 In Scope

**Public Website Modules:**
Homepage, Intern Listings, Community Members, Problem Statements, Events, ASG Initiatives, Gallery, Blogs, Industry Partners, Industry Experts, Contact Form, Join ASG Application, Footer.

**Admin Panel Modules:**
Dashboard, Events Manager, Intern Manager, Community Member Manager, Problem Statement Manager, ASG Initiatives Manager, Gallery Manager, Blog Editor, Industry Partner Manager, Industry Expert Manager, Contact Queries Inbox, Join Applications Inbox, Website Settings, Admin Profile.

**Infrastructure:**
Supabase PostgreSQL, Supabase Auth, Supabase Storage, Next.js App Router, Vercel deployment.

### 5.2 Boundaries

- The public website is entirely read-only for visitors. Visitors cannot authenticate, edit, or delete anything.
- The Admin Panel is accessible only to authenticated admins. The first Super Admin is created via a server-side seed script or the Supabase dashboard. Subsequent admins are invited by the Super Admin through the admin panel UI.
- All media is stored in Supabase Storage. The database stores only the resulting public URL, never the binary file or Base64 string.

---

## 6. User Types

### 6.1 Public Visitor

A person who browses the website without any account. All 12 public modules are accessible. The visitor can submit two types of forms:

1. **Contact Form** — a query or message to the ASG team.
2. **Join ASG Application** — an application to join the ASG community.

The visitor cannot log in, cannot access any route under `/admin`, and cannot modify any data.

### 6.2 Super Admin (Authenticated Admin)

The Super Admin has full control over all website content. A single Super Admin exists at launch. The architecture supports adding additional admins in the future without introducing RBAC or per-resource permission checks.

**Capabilities:**
- Authenticate via Supabase Auth (email/password or Google OAuth).
- Create, read, update, and delete content in all 13 admin modules.
- Upload files to Supabase Storage.
- Review contact queries and join applications.
- Configure website-wide settings.
- Invite additional admins (future-ready, not blocking for V1).
- View dashboard analytics and activity feeds.

---

## 7. User Journeys

### 7.1 Visitor Discovers the Organization

```
Visitor opens apexstartupgroup.com
  → Sees hero section, stats, and program highlights on the Homepage
  → Navigates to Events page to see upcoming sessions
  → Browses the Gallery to view past event photos
  → Reads a Blog post about the community
  → Views Intern Listings to understand program outcomes
  → Clicks "Join ASG" → fills Application Form → submits
  → Sees success confirmation
```

### 7.2 Visitor Submits a Contact Query

```
Visitor clicks "Contact" in the navigation
  → Fills name, email, subject, message
  → Clicks Submit
  → Client-side validation passes
  → POST /api/v1/contact is called
  → Record is stored in the database
  → Visitor sees: "Your message has been received. We'll be in touch."
```

### 7.3 Admin Logs In and Publishes an Event

```
Admin navigates to admin.apexstartupgroup.com
  → Redirected to /login (no active session)
  → Enters email + password (or signs in with Google)
  → Supabase Auth validates credentials
  → Session cookie is set
  → Admin lands on /dashboard
  → Navigates to Events → New Event
  → Fills in Title, Date, Venue, Description, Tags, uploads Thumbnail
  → Sets Status to "Upcoming"
  → Clicks Publish
  → Event appears on the public Events page
```

### 7.4 Admin Reviews a Join Application

```
Admin opens /dashboard/applications
  → Sees a table of pending applications
  → Clicks a row to expand the applicant's details
  → Reviews name, email, background, and motivation
  → Uses their own email client to follow up
  → Returns to the panel and marks the application as Reviewed
```

### 7.5 Admin Updates the Gallery

```
Admin navigates to /dashboard/gallery
  → Creates a new Album titled "Cohort 3 Demo Day"
  → Uploads 12 images via drag-and-drop
  → Adds captions to individual photos
  → Reorders photos by dragging
  → Sets album to Published
  → Photos appear in the public Gallery page
```

---

## 8. Functional Requirements

### 8.1 Homepage

The Homepage is the primary landing page. All visible sections are content-managed from the admin panel under Website Settings or their respective modules.

| Section | Requirement |
|---|---|
| Hero / Banner | Editable headline, subheadline, and CTA button label/link. Background image managed via Storage. |
| Statistics Strip | Four editable stat chips with a label and value (e.g., "120+ Interns"). Values are set manually in Settings, not live-aggregated. |
| Gallery Preview | Shows the most recent 4–6 published gallery images. Pulled dynamically from the gallery module. |
| Upcoming Events | Shows the next 3 events with `status = upcoming`. Pulled from the Events module. |
| Testimonials | A manually managed list of testimonials (name, quote, avatar). Editable from Settings. |
| Contact Details | Organization address, phone, email, and map embed URL. Editable from Settings. |
| Footer | Social links, navigation links, copyright text. Editable from Settings. |

### 8.2 Events

Each event record contains:

| Field | Type | Required | Notes |
|---|---|---|---|
| Title | Text | Yes | Max 120 chars |
| Scheduled Date | Date/Time | Yes | Required for Upcoming and Past |
| Venue | Text | Yes | Max 200 chars |
| Status | Enum | Yes | Draft, Upcoming, Past |
| Tags | Array of strings | No | E.g., ["Meetup", "AI"] |
| Thumbnail Banner | Storage URL | No | Uploaded via Supabase Storage |
| Description | Richtext / Markdown | Yes | Full event description |
| Gallery Recap URL | URL | Only for Past | Optional link to photo gallery or recap |

**Public behavior:**
- Visitors see only `status = upcoming` and `status = past` events.
- Draft events are hidden from the public.
- Upcoming events are sorted ascending by date (soonest first).
- Past events are sorted descending by date (most recent first).

**Admin behavior:**
- Admin can create, edit, delete, and change the status of any event.
- Admin can bulk-update status (e.g., mark multiple events as Past).

### 8.3 Gallery

The gallery uses a normalized album → photo structure.

**Album:**

| Field | Type | Notes |
|---|---|---|
| Title | Text | Required |
| Cover Photo | Storage URL | Designated cover image for the album card |
| Description | Text | Optional |
| Status | Enum | Draft, Published |
| Date | Date | When the event/session occurred |

**Photo:**

| Field | Type | Notes |
|---|---|---|
| Album | Reference | Foreign key to the album |
| Image URL | Storage URL | Required |
| Caption | Text | Optional |
| Display Order | Integer | Controls ordering within the album |

**Requirements:**
- Multiple albums supported; each album contains multiple photos.
- Photos within an album can be reordered via drag-and-drop in the admin panel.
- Individual photos can be deleted without deleting the album.
- Caption per photo is optional.
- Future video support: the structure should accommodate a `media_type` field (image / video) without a schema redesign. A `video_url` field can be added in a future migration.
- Gallery is not stored using JSON arrays. Each photo is a separate database row.

**Public behavior:**
- Only albums with `status = published` are visible.
- Albums are sorted by date, descending.
- Clicking an album opens a lightbox or grid view of all photos.

### 8.4 Blogs

| Field | Type | Notes |
|---|---|---|
| Title | Text | Required, max 120 chars |
| Slug | Text | Auto-generated from title; unique; URL-safe |
| Author | Text | Admin's name |
| Category | Text | Optional free-text or enum |
| Excerpt | Text | Max 300 chars; used in cards and meta descriptions |
| Cover Image | Storage URL | Optional |
| Body | Markdown | Full post content |
| Status | Enum | Draft, Published |
| Published At | Timestamp | Set when status changes to Published |
| Read Time | Text | Auto-calculated at approximately 200 words/minute |

**Admin behavior:**
- Admin can save posts as Draft (auto-save every 30 seconds when unsaved changes exist).
- Admin explicitly publishes by changing status to Published.
- Admin can unpublish (revert to Draft) or archive a post.

**Public behavior:**
- Only `status = published` posts appear on the public `/blogs` page.
- Individual posts are accessible at `/blogs/[slug]`.
- Draft posts return 404 for public visitors.

### 8.5 Intern Listings

Each intern record:

| Field | Type | Notes |
|---|---|---|
| Name | Text | Required |
| Photo | Storage URL | Optional |
| College | Text | Required |
| Domain | Text | E.g., "AI/ML", "Web Dev" |
| Cohort Number | Integer | E.g., 3 |
| LinkedIn URL | URL | Optional |
| Status | Enum | Active, Completed |

**Public behavior:** Visitors browse a searchable, filterable grid of intern profiles. Filters: Cohort, Domain, College.

**Admin behavior:** Full CRUD.

### 8.6 Community Members

| Field | Type | Notes |
|---|---|---|
| Name | Text | Required |
| Photo | Storage URL | Optional |
| Role / Title | Text | E.g., "Co-Founder" |
| Company | Text | Optional |
| Type | Enum | Founder, Mentor, Investor, Member |
| LinkedIn URL | URL | Optional |
| Bio | Text | Max 400 chars |
| Show on Website | Boolean | Toggle visibility without deleting |

**Public behavior:** A filterable directory by Type.

**Admin behavior:** Full CRUD. Toggle visibility per record.

### 8.7 Problem Statements

Each problem statement:

| Field | Type | Notes |
|---|---|---|
| Title | Text | Required |
| Domain | Text | E.g., "AgriTech" |
| Description | Text | Required |
| Status | Enum | Open, Assigned, Closed |
| Assigned Intern | Reference (optional) | Links to an intern record |

**Public behavior:** Visitors browse a list of open problem statements. Assigned or Closed statements may optionally be shown.

**Admin behavior:** Full CRUD. Assign an intern to a problem statement.

### 8.8 ASG Initiatives

A simple, ordered list of initiatives shown on the public website.

| Field | Type | Notes |
|---|---|---|
| Emoji | Text | Single emoji character |
| Title | Text | Required, max 80 chars |
| Description | Text | Required, max 400 chars |
| Display Order | Integer | Controls ordering |

**Admin behavior:** Full CRUD with drag-to-reorder. There are no sub-pages per initiative.

### 8.9 Industry Partners

| Field | Type | Notes |
|---|---|---|
| Name | Text | Required |
| Logo | Storage URL | Required |
| Website URL | URL | Optional |
| Display Order | Integer | Controls marquee or grid order |
| Show on Website | Boolean | Toggle visibility |

**Public behavior:** Logos displayed in a marquee strip or grid on a Partners section.

**Admin behavior:** Full CRUD. Toggle visibility. Drag-to-reorder.

### 8.10 Industry Experts

| Field | Type | Notes |
|---|---|---|
| Name | Text | Required |
| Photo | Storage URL | Optional |
| Title / Role | Text | E.g., "VP of Engineering, Infosys" |
| Company | Text | Required |
| Domain / Expertise | Text | Optional |
| LinkedIn URL | URL | Optional |
| Bio | Text | Max 400 chars |
| Show on Website | Boolean | Toggle visibility |

**Public behavior:** A grid of expert profiles on a dedicated `/experts` page.

**Admin behavior:** Full CRUD. Toggle visibility.

### 8.11 Contact Form

| Field | Validation |
|---|---|
| Name | Required, 2–100 chars |
| Email | Required, valid email format |
| Subject | Required, max 150 chars |
| Message | Required, 20–2000 chars |

**Behavior:**
- Visitor submits the form.
- Server-side Zod validation on all fields.
- A honeypot field (`_trap`) is present but hidden. Non-empty `_trap` discards the submission silently (returns 201 to the visitor, does not store a record).
- Rate limit: 5 submissions per IP per 15 minutes.
- On success: the record is stored. The visitor sees a success message. No automated email is sent.
- Admin reviews submissions at `/dashboard/contact-queries`, with Pending/Reviewed status.

### 8.12 Join ASG Application

| Field | Validation |
|---|---|
| Full Name | Required |
| Email | Required, valid email |
| Phone Number | Optional |
| College / Organization | Required |
| Role Interest | Enum: Founder, Intern, Mentor, Investor, Partner |
| Background / Motivation | Required, 50–1000 chars |

**Behavior:**
- Visitor submits the form.
- Server-side validation on all fields.
- Honeypot protection and rate limiting (5 per IP per 15 minutes) apply.
- On success: the record is stored with `status = Pending`. The visitor sees a confirmation message.
- Admin reviews at `/dashboard/applications`.
- Admin can mark an application as Reviewed, Accepted, or Rejected.
- No automated emails are sent.

### 8.13 Footer

Content managed through Website Settings:
- Social links (LinkedIn, Instagram, Twitter/X, YouTube, WhatsApp)
- Navigation link groups
- Copyright text and year
- Contact email address

### 8.14 Admin Dashboard

The dashboard is the first screen after login. It provides an at-a-glance view of platform activity.

#### 8.14.1 KPI Cards

Seven metric cards fetched from `GET /api/v1/admin/stats`:

| Metric | Source |
|---|---|
| Total Events | Count of all events |
| Upcoming Events | Count of events with `status = upcoming` |
| Total Interns | Count of all intern records |
| Community Members | Count of all community member records |
| Blog Posts | Count of published blogs |
| Gallery Images | Count of all photo records across all albums |
| Problem Statements | Count of all problem statement records |

#### 8.14.2 College-Wise Intern Statistics

A bar chart showing intern count grouped by college name. Data sourced from the interns table, aggregated server-side in the stats endpoint.

#### 8.14.3 Recent Events

A compact list of the 5 most recently created or updated events.

#### 8.14.4 Recent Blogs

A compact list of the 5 most recently published or updated blog posts.

### 8.15 Website Settings

A single settings panel in the admin. Manages global, cross-cutting content:

| Section | Content |
|---|---|
| General | Site name, contact email, support email, tagline |
| Hero / Banner | Headline, subheadline, CTA text, CTA URL, background image |
| Statistics | Four label + value pairs for the homepage stats strip |
| Testimonials | Ordered list of testimonials (name, quote, avatar URL) |
| Contact Details | Address, phone, map embed URL |
| Social Links | LinkedIn, Instagram, Twitter/X, YouTube, WhatsApp |
| Footer | Navigation link groups, copyright text |

All settings are stored as structured key-value records in the database (one row per logical section, value stored as a typed JSON object). Each section is fetched and updated independently via its own API route.

---

## 9. Non-Functional Requirements

### 9.1 Performance

| Requirement | Target |
|---|---|
| Homepage Largest Contentful Paint (LCP) | < 2.5 seconds on 4G mobile |
| API response time for public GET requests | < 300ms median (p50) |
| Admin panel initial load | < 3 seconds |
| Image optimization | WebP format served via Next.js `<Image>` with lazy loading |
| Gallery photo loading | Lazy-load below-fold images using `loading="lazy"` |

### 9.2 Availability

| Requirement | Target |
|---|---|
| Production uptime | 99.9% monthly (enforced by Vercel SLA) |
| Supabase uptime | 99.9% monthly (Supabase SLA) |
| Planned downtime window | Off-peak hours; communicated in advance |

### 9.3 Scalability

- The system must support up to 50,000 monthly page views without architectural changes.
- The database design must support addition of new modules without restructuring existing tables.
- The admin panel must support up to 10 simultaneous admin users without performance degradation (future-ready; V1 has one admin).

### 9.4 Security

See Section 20 for the full security strategy.

| Requirement | Implementation |
|---|---|
| Admin Panel inaccessible without authentication | Next.js Middleware redirects all `/admin/*` to `/login` if no valid session exists |
| No credentials in source code | All secrets in environment variables; no hardcoded keys |
| Database unreachable from browser | No Supabase client keys in the public bundle |
| Input validation on all write endpoints | Zod on both client and server |
| File uploads restricted by type and size | MIME validation + size limit on the upload Route Handler |

### 9.5 Maintainability

- All content updates must be possible without modifying source code.
- The codebase must be TypeScript-strict with no `any` types in production paths.
- Every Route Handler must have consistent response shapes and error handling.
- The folder structure must enable a new developer to navigate the codebase within 30 minutes.

### 9.6 SEO

| Requirement | Implementation |
|---|---|
| Unique `<title>` per page | Via Next.js `metadata` export or `generateMetadata` |
| Unique meta description per page | Blog posts use `excerpt`; other pages use static descriptions |
| Open Graph tags | On all public pages; blog posts use cover image as `og:image` |
| Structured data (JSON-LD) | `Event` schema on event pages; `Article` schema on blog posts |
| `sitemap.xml` | Auto-generated at build time via `app/sitemap.ts` |
| `robots.txt` | Disallows `/admin/*` and `/api/*` |
| Canonical URLs | Set on all public pages |
| Core Web Vitals | CLS < 0.1; LCP < 2.5s; INP < 200ms |

### 9.7 Accessibility

- All images must have descriptive `alt` text attributes.
- Form fields must have associated `<label>` elements.
- Color contrast ratios must meet WCAG AA (4.5:1 for text).
- Keyboard navigation must be functional across all interactive elements.
- The lightbox gallery must support Escape-to-close and arrow-key navigation.

---

# PART B — TECHNICAL REQUIREMENTS

---

## 10. Technical Stack

### 10.1 Frontend

| Technology | Version | Role |
|---|---|---|
| Next.js App Router | 15 | Full-stack framework; routing, SSR, RSC |
| React | 19 | UI component model |
| TypeScript | 5+ | Type safety across the entire codebase |
| Tailwind CSS | 3 | Utility-first styling |
| Framer Motion | Latest | Page transitions and micro-animations |
| React Hook Form | 7 | Form state management and client-side validation |
| TanStack Query | 5 | Server state management, caching, and mutations in the admin panel |
| Native Fetch API | Browser native | HTTP calls from client components |

### 10.2 Backend

| Technology | Version | Role |
|---|---|---|
| Next.js Route Handlers | 15 | REST API layer; all backend logic |
| TypeScript | 5+ | Type-safe route handlers and business logic |
| Zod | 3 | Request body and query parameter validation |

### 10.3 Database & ORM

| Technology | Version | Role |
|---|---|---|
| Supabase PostgreSQL | Managed | Primary relational database |
| Drizzle ORM | Latest | Type-safe query builder; schema-first ORM |
| Drizzle Kit | Latest | Migration runner and schema introspection |

### 10.4 Authentication & Storage

| Technology | Role |
|---|---|
| Supabase Auth | Admin authentication; email/password and Google OAuth |
| Supabase Storage | File storage for all media assets |

### 10.5 Security & Infrastructure

| Technology | Role |
|---|---|
| Next.js Middleware | Route protection; session verification on `/admin/*` |
| Supabase Row Level Security | Database-level access control |
| Vercel | Deployment, CDN, edge functions |

### 10.6 Technology Selection Rationale

| Decision | Rationale |
|---|---|
| Next.js Route Handlers as backend | Eliminates a separate server project; co-located with the frontend in one deployment |
| Drizzle ORM | Lightweight, type-safe, and aligns well with PostgreSQL; migration-first workflow |
| Supabase | Managed PostgreSQL + Auth + Storage removes infrastructure management overhead |
| TanStack Query (admin only) | The public website uses server-side rendering; TanStack Query is used only in the admin panel for complex cache/mutation patterns |
| Zod for validation | One schema validates both the client-side form and the server-side request body, ensuring parity |

---

## 11. High-Level Architecture

### 11.1 System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                          BROWSER                                │
│                                                                 │
│   Public Website (SSR/SSG)      Admin Panel (CSR)               │
│   apexstartupgroup.com          admin.apexstartupgroup.com       │
└───────────────────┬─────────────────────────┬───────────────────┘
                    │ HTTPS                   │ HTTPS + Bearer Token
                    ▼                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS APPLICATION                         │
│                     (Single Vercel Deployment)                  │
│                                                                 │
│  App Router Pages         Route Handlers                        │
│  /app/(public)/           /app/api/v1/                          │
│  /app/(admin)/            ├── events/                           │
│                           ├── gallery/                          │
│  Middleware               ├── blogs/                            │
│  middleware.ts            ├── interns/                          │
│  (protects /admin/*)      ├── community/                        │
│                           ├── partners/                         │
│                           ├── experts/                          │
│                           ├── initiatives/                      │
│                           ├── problem-statements/               │
│                           ├── contact/                          │
│                           ├── applications/                     │
│                           ├── settings/                         │
│                           ├── upload/                           │
│                           └── admin/                            │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Drizzle ORM + supabase-js
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SUPABASE CLOUD                          │
│                                                                 │
│   PostgreSQL Database         Supabase Auth         Storage     │
│   (12 tables)                 (GoTrue)              Buckets:    │
│   RLS enabled on all          Email/Password        - media     │
│   tables                      Google OAuth          - avatars   │
│                               Session management    - logos     │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 Two-App Deployment Strategy

The project is one Next.js codebase deployed to Vercel. The public website and the admin panel are two route groups within the same application:

- `apexstartupgroup.com` → serves `/app/(public)/*` routes
- `admin.apexstartupgroup.com` → serves `/app/(admin)/*` routes (same Vercel project, custom domain pointing to the same deployment)

This avoids two separate projects while cleanly separating public and admin concerns in code.

---

## 12. Application Flow

### 12.1 Public Page Request Flow (Server-Side Rendered)

```
1. Browser requests /events
2. Next.js App Router matches the route to app/(public)/events/page.tsx
3. The page component is a React Server Component
4. It calls the Route Handler internally (or directly queries the DB via Drizzle in a server action)
5. Drizzle queries Supabase PostgreSQL: SELECT * FROM events WHERE status != 'draft'
6. Data is serialized and rendered to HTML on the server
7. HTML is sent to the browser (fast first paint, SEO-friendly)
8. React hydrates for interactivity (filtering, lightbox, etc.)
```

### 12.2 Admin Panel Request Flow (Client-Side)

```
1. Admin navigates to /dashboard/events
2. Middleware verifies session cookie → valid → request proceeds
3. The page component is a Client Component
4. TanStack Query fires: GET /api/v1/admin/events
5. Route Handler verifies the Authorization header (session token)
6. Drizzle queries Supabase: SELECT * FROM events ORDER BY created_at DESC
7. JSON response returned to the browser
8. TanStack Query caches the result and populates the table
```

### 12.3 Form Submission Flow (Visitor)

```
1. Visitor fills the Contact Form
2. React Hook Form validates fields client-side using Zod
3. On valid submit: POST /api/v1/contact
4. Route Handler:
   a. Validates request body with Zod (server-side)
   b. Checks honeypot field
   c. Applies rate limiting
   d. Inserts record into contact_queries table via Drizzle
   e. Returns 201
5. Browser shows success state
```

---

## 13. Authentication Flow

Supabase Auth handles all credential management. The application wraps Supabase Auth calls behind Route Handlers so neither the admin panel nor the public website communicates with Supabase Auth directly.

### 13.1 Login Flow

```
Admin Panel                     Route Handler                   Supabase Auth
     │                               │                               │
     │  POST /api/v1/auth/login      │                               │
     │  { email, password }          │                               │
     │ ─────────────────────────────▶│                               │
     │                               │ signInWithPassword()          │
     │                               │ ─────────────────────────────▶│
     │                               │◀──────────────────────────────│
     │                               │  { session, user }            │
     │                               │                               │
     │                               │ Verify admin record exists    │
     │                               │ in admin_users table          │
     │                               │                               │
     │◀──────────────────────────────│                               │
     │  Set-Cookie: sb-auth-token    │                               │
     │  (HttpOnly, Secure)           │                               │
     │  Body: { user profile }       │                               │
     │                               │                               │
     │  Redirect to /dashboard       │                               │
```

### 13.2 Google OAuth Flow

```
Admin clicks "Sign in with Google"
  → Route Handler calls supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: '/auth/callback' })
  → Browser is redirected to Google consent screen
  → Google redirects to /auth/callback with an auth code
  → /auth/callback Route Handler exchanges the code for a session
  → Set-Cookie: sb-auth-token (HttpOnly, Secure)
  → Redirect to /dashboard
```

### 13.3 Session Management

- Supabase Auth issues a JWT access token (short-lived, default 1 hour) and a refresh token (long-lived, 7 days).
- The access token and refresh token are stored in a Supabase-managed `HttpOnly` cookie. They are never accessible to JavaScript.
- On each request to a protected route, Next.js Middleware reads the session cookie and calls `supabase.auth.getSession()` to verify validity.
- If the access token has expired but the refresh token is valid, Supabase silently rotates the session and updates the cookie.
- If both tokens are expired or invalid, the middleware redirects to `/login`.

### 13.4 Logout Flow

```
Admin clicks "Sign Out"
  → POST /api/v1/auth/logout
  → Route Handler calls supabase.auth.signOut()
  → Supabase invalidates the refresh token
  → Set-Cookie: sb-auth-token=; Max-Age=0 (clears the cookie)
  → Redirect to /login
```

### 13.5 Forgot Password Flow

```
Admin clicks "Forgot Password"
  → Enters email on /forgot-password page
  → POST /api/v1/auth/forgot-password { email }
  → Route Handler calls supabase.auth.resetPasswordForEmail(email, { redirectTo: '/reset-password' })
  → Supabase sends a recovery email with a one-time token link
  → Admin clicks the link → lands on /reset-password
  → Admin enters new password
  → Route Handler calls supabase.auth.updateUser({ password: newPassword })
  → Session is updated; admin redirected to /dashboard
```

---

## 14. Authorization Flow

### 14.1 Current Authorization Model

Authorization in V1 is binary:

- **Authenticated** → can access and mutate all admin resources.
- **Unauthenticated** → can only access public pages and submit forms.

There is no per-resource permission check. Any authenticated user is treated as a full admin.

### 14.2 Middleware Route Protection

```typescript
// middleware.ts (simplified logic)
// Runs on every request matching /admin/* or /api/v1/admin/*

1. Read the Supabase session cookie
2. Call supabase.auth.getSession()
3. If no valid session → redirect to /login (for /admin/* routes)
   or return 401 JSON (for /api/v1/admin/* routes)
4. If valid session → check that admin_users record exists and is active
5. Attach admin profile to request context
6. Allow request to proceed
```

### 14.3 Future-Readiness for Multi-Admin

The `admin_users` table includes a `role` column (`TEXT`, default `super_admin`) that is set but not evaluated in V1 logic. When additional admins are invited in the future, their role can be stored here. Adding role-based checks in V2 requires only modifying the `withAuth` middleware — no structural changes.

### 14.4 Row Level Security Strategy

Supabase RLS is enabled on all tables. The strategy is:

| Table Group | Public Read? | Auth Write? | Notes |
|---|---|---|---|
| Events, Gallery, Blogs, Interns, etc. | Read-only for `anon` role (public tables) | Full access for `service_role` | The Route Handler uses the `service_role` key, which bypasses RLS entirely |
| Contact queries, Applications | No public access | Service role only | These tables contain PII; no public read |
| Admin users | No public access | Service role only | Admin identity data |
| Settings | Read access for `anon` | Service role only | Settings are publicly needed for homepage rendering |

**The application never uses the `anon` key on the server.** All Route Handlers use the `service_role` key, which has unrestricted database access. The RLS policies are a defense-in-depth layer protecting against direct Supabase client access attempts.

---

## 15. Database Design Principles

### 15.1 Core Principles

1. **Normalized structure.** Every entity has its own table. No JSON arrays for relational data (the gallery album/photo relationship uses two tables, not a `photos: []` column).
2. **Avoid generic blobs.** JSON columns are used only for structured configuration data (website settings), not for entity attributes that may need to be queried or indexed.
3. **Soft delete over hard delete.** Records are not permanently deleted by default. A `deleted_at TIMESTAMPTZ` column is added to tables where data recovery might be needed.
4. **UUID primary keys.** All tables use UUID as the primary key to avoid sequential ID exposure and to support distributed operations.
5. **Timestamps on every table.** Every table has `created_at` and `updated_at` columns, both set by the database (not the application).
6. **Storage URLs, not binaries.** Image and file references are stored as `TEXT` URLs pointing to Supabase Storage. Never Base64, never file paths.
7. **Enum constraints.** Status fields use `CHECK` constraints or Drizzle enum types to ensure only valid values are stored.

### 15.2 Table Inventory

| Table | Purpose |
|---|---|
| `admin_users` | Admin profiles linked to Supabase Auth users |
| `events` | All event records |
| `gallery_albums` | Gallery album metadata |
| `gallery_photos` | Individual photos belonging to albums |
| `blogs` | Blog posts with draft/published lifecycle |
| `interns` | Intern profiles |
| `community_members` | ASG community member profiles |
| `problem_statements` | Project problem statements |
| `initiatives` | ASG initiative cards |
| `industry_partners` | Partner organization logos and links |
| `industry_experts` | Expert profiles |
| `contact_queries` | Contact form submissions |
| `applications` | Join ASG application submissions |
| `site_settings` | Key-value configuration store for website settings |

### 15.3 Relationships

```
gallery_albums ──< gallery_photos       (one album has many photos)
interns         ──> problem_statements  (optional: an intern is assigned to one PS)
admin_users     ──> events              (created_by foreign key)
admin_users     ──> blogs               (author foreign key)
```

### 15.4 Settings Table Structure

Website settings are stored as structured key-value rows, not a single mega-JSON blob:

```
site_settings
  key     (TEXT, PRIMARY KEY)   e.g., "general", "hero", "statistics", "footer"
  value   (JSONB)               structured object for that section
  updated_at (TIMESTAMPTZ)
```

This allows each settings section to be fetched and updated independently, and enables targeted invalidation.

---

## 16. Storage Design Principles

### 16.1 Buckets

| Bucket | Access | Contents |
|---|---|---|
| `media` | Public | Event banners, blog cover images, gallery photos, initiative images |
| `avatars` | Public | Intern photos, community member photos, expert photos, admin profile photos |
| `logos` | Public | Industry partner logos |

All three buckets are configured as public read, enabling direct URL access by the browser.

### 16.2 File Naming Convention

```
{bucket}/{year}/{month}/{uuid}.{ext}
e.g., media/2026/07/a1b2c3d4-e5f6-7890-abcd-ef1234567890.webp
```

This structure:
- Avoids filename collisions via UUID.
- Organizes files by date for easier management.
- Uses a flat enough structure to not confuse storage tooling.

### 16.3 Upload Flow

```
Admin selects file in the admin panel
  → Client validates: MIME type ∈ {image/jpeg, image/png, image/webp, image/svg+xml}, size ≤ 5MB
  → POST /api/v1/upload (multipart/form-data)
    Fields: file (binary), bucket, context
  → Route Handler:
      1. Re-validates MIME type from buffer magic bytes (not just filename extension)
      2. Re-validates file size
      3. Generates a UUID filename
      4. Uploads to Supabase Storage via supabase.storage.from(bucket).upload(path, buffer)
      5. Gets the public URL via supabase.storage.from(bucket).getPublicUrl(path)
      6. Returns { url, path, filename }
  → Admin panel stores the returned URL in the form field
  → On form save, the URL is stored in the relevant database column
```

### 16.4 What Is Never Stored

- No Base64 strings in the database.
- No file binaries in the database.
- No local filesystem paths.
- No presigned URLs in the database (presigned URLs are ephemeral and should never be persisted).

### 16.5 File Deletion

When an admin deletes an image-bearing record (e.g., an event with a thumbnail), the Route Handler:

1. Reads the `thumbnail_url` from the database.
2. Extracts the storage path from the URL.
3. Calls `supabase.storage.from(bucket).remove([path])`.
4. Deletes the database row.

If storage deletion fails, the record deletion is still committed (orphaned files are acceptable; broken references are not).

---

## 17. API Standards

### 17.1 Base URL and Versioning

```
https://apexstartupgroup.com/api/v1/
```

All Route Handlers are versioned under `/api/v1/`. A future `/api/v2/` can be introduced alongside without breaking existing clients.

### 17.2 Naming Conventions

- **Resources:** lowercase, hyphenated plurals. e.g., `/api/v1/gallery-albums`, `/api/v1/problem-statements`
- **Identifiers:** UUID passed as path segment. e.g., `/api/v1/events/[id]`
- **Filters:** query parameters, lowercase, snake_case. e.g., `?status=upcoming&domain=ai-ml`
- **Actions that are not standard CRUD:** use a verb suffix. e.g., `PATCH /api/v1/applications/[id]/status`

### 17.3 HTTP Method Conventions

| Method | Usage |
|---|---|
| `GET` | Read a resource or list of resources |
| `POST` | Create a new resource |
| `PATCH` | Partially update an existing resource |
| `DELETE` | Delete a resource (sets `deleted_at` if soft-delete) |
| `PUT` | Not used (PATCH is preferred for partial updates) |

### 17.4 Standard Response Shapes

**List response:**
```json
{
  "data": [ ... ],
  "meta": {
    "total": 42,
    "limit": 20,
    "offset": 0
  }
}
```

**Single resource response:**
```json
{
  "id": "uuid",
  "title": "...",
  "createdAt": "2026-07-01T00:00:00Z"
}
```
(No `data` wrapper for single resources.)

**Error response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "title is required",
    "fields": {
      "title": "Required field is missing"
    }
  }
}
```

### 17.5 HTTP Status Codes

| Code | When Used |
|---|---|
| 200 | Successful GET or PATCH |
| 201 | Successful POST (resource created) |
| 204 | Successful DELETE (no body) |
| 400 | Validation error |
| 401 | No valid session |
| 403 | Session valid but insufficient authorization |
| 404 | Resource not found |
| 409 | Conflict (e.g., duplicate slug) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

### 17.6 Pagination

All list endpoints accept:
- `?limit=` (integer, default 20, max 100)
- `?offset=` (integer, default 0)

The `meta.total` field in the response always reflects the count before pagination so clients can compute total pages.

### 17.7 Endpoint Inventory

#### Public Endpoints (no auth required)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/events` | List events. Query: `?status=upcoming\|past` |
| GET | `/api/v1/events/[id]` | Single event |
| GET | `/api/v1/gallery-albums` | List published albums |
| GET | `/api/v1/gallery-albums/[id]` | Album with all photos |
| GET | `/api/v1/blogs` | List published blogs |
| GET | `/api/v1/blogs/[slug]` | Single published blog post |
| GET | `/api/v1/interns` | List intern profiles |
| GET | `/api/v1/community-members` | List. Query: `?type=Founder\|Mentor\|Investor\|Member` |
| GET | `/api/v1/problem-statements` | List. Query: `?status=Open\|Assigned\|Closed` |
| GET | `/api/v1/initiatives` | List initiatives |
| GET | `/api/v1/industry-partners` | List partners |
| GET | `/api/v1/industry-experts` | List experts |
| GET | `/api/v1/settings/[key]` | Get a specific settings section |
| POST | `/api/v1/contact` | Submit a contact query |
| POST | `/api/v1/applications` | Submit a join application |
| POST | `/api/v1/upload` | Upload a file (public for admin use; protected by session check) |

#### Admin Endpoints (authenticated)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/admin/stats` | Dashboard KPIs + college breakdown |
| POST/PATCH/DELETE | `/api/v1/admin/events/[id]` | Event CRUD |
| POST/PATCH/DELETE | `/api/v1/admin/gallery-albums/[id]` | Album CRUD |
| POST/PATCH/DELETE | `/api/v1/admin/gallery-photos/[id]` | Photo CRUD + reorder |
| POST/PATCH/DELETE | `/api/v1/admin/blogs/[id]` | Blog CRUD |
| PATCH | `/api/v1/admin/blogs/[id]/publish` | Publish a blog |
| POST/PATCH/DELETE | `/api/v1/admin/interns/[id]` | Intern CRUD |
| POST/PATCH/DELETE | `/api/v1/admin/community-members/[id]` | Community member CRUD |
| POST/PATCH/DELETE | `/api/v1/admin/problem-statements/[id]` | Problem statement CRUD |
| POST/PATCH/DELETE | `/api/v1/admin/initiatives/[id]` | Initiative CRUD |
| PATCH | `/api/v1/admin/initiatives/reorder` | Reorder initiatives |
| POST/PATCH/DELETE | `/api/v1/admin/industry-partners/[id]` | Partner CRUD |
| POST/PATCH/DELETE | `/api/v1/admin/industry-experts/[id]` | Expert CRUD |
| GET | `/api/v1/admin/contact-queries` | List all queries |
| PATCH | `/api/v1/admin/contact-queries/[id]/status` | Update query status |
| DELETE | `/api/v1/admin/contact-queries/[id]` | Delete query |
| GET | `/api/v1/admin/applications` | List all applications |
| PATCH | `/api/v1/admin/applications/[id]/status` | Accept/Reject/Review |
| DELETE | `/api/v1/admin/applications/[id]` | Delete application |
| GET/PATCH | `/api/v1/admin/settings/[key]` | Get/update a settings section |
| POST | `/api/v1/auth/login` | Admin login |
| POST | `/api/v1/auth/logout` | Admin logout |
| POST | `/api/v1/auth/forgot-password` | Trigger recovery email |
| POST | `/api/v1/auth/reset-password` | Set new password |
| GET/PATCH | `/api/v1/auth/me` | Current admin profile |

---

## 18. Validation Strategy

Validation is applied at two layers. Both layers use the same Zod schemas, defined once and imported by both the client and server.

### 18.1 Client-Side Validation (React Hook Form + Zod)

- Zod resolver integrated into React Hook Form.
- Validation runs on field blur and on form submit.
- Field-level error messages appear inline below the relevant input.
- A form with validation errors cannot be submitted.
- This prevents unnecessary network requests for clearly invalid inputs.

### 18.2 Server-Side Validation (Route Handlers + Zod)

- Every Route Handler that accepts a request body or query parameters runs Zod validation before any business logic or database query.
- If Zod fails, the Route Handler returns HTTP 400 with the error response shape from Section 17.4.
- Server-side validation is the authoritative check. Client-side is a UX convenience and cannot be bypassed.

### 18.3 Shared Schema Location

All Zod schemas are defined in `src/lib/validators/`. Both the client-side form and the Route Handler import from the same schema file. This ensures that what the client considers valid always matches what the server considers valid.

### 18.4 Validation Rules by Input Type

| Input Type | Rule |
|---|---|
| Text fields | `z.string().min(N).max(N)` with explicit limits |
| Email | `z.string().email()` |
| URL | `z.string().url()` for optional URL fields; `z.string().url().optional()` |
| Enum fields | `z.enum([...])` with the exact allowed values |
| Optional fields | `.optional()` or `.nullable()` as appropriate; never `.any()` |
| Arrays | `z.array(z.string())` with `.max(N)` to prevent abuse |

---

## 19. Error Handling Strategy

### 19.1 Route Handler Error Handling

Every Route Handler is wrapped in a try/catch. Errors are classified and returned with the standard error shape:

```
try {
  // business logic
} catch (error) {
  if (error is ZodError) → return 400 VALIDATION_ERROR
  if (error is AuthError) → return 401 UNAUTHORIZED
  if (error is NotFoundError) → return 404 NOT_FOUND
  else → log the error to Pino; return 500 INTERNAL_ERROR
}
```

Sensitive error details (stack traces, database error messages) are never returned to the client. The server logs the full error; the client receives only the error code and a human-readable message.

### 19.2 Client-Side Error Handling (Admin Panel)

TanStack Query's `onError` callback handles all mutation failures:
- Display a toast notification with the server's `error.message`.
- The failed form remains editable so the admin can correct and retry.
- Network failures (no response) show: "Unable to reach the server. Please check your connection."

### 19.3 Public Form Error Handling

For Contact and Application forms:
- Validation errors: inline field errors.
- Rate limit (429): "Too many submissions. Please wait a few minutes before trying again."
- Server error (500): "Something went wrong. Please try again shortly."
- Success: form is replaced with a success message. No redirect.

### 19.4 404 and Error Pages

- `app/not-found.tsx`: shown for any unknown public route.
- `app/error.tsx`: shown when a React Server Component throws an unhandled error.
- Both pages include navigation back to the homepage.

### 19.5 Logging

Pino is used for structured JSON logging in all Route Handlers. Every log entry includes: timestamp, log level, route path, HTTP method, response status, duration, and — for errors — the full error object. Logs are viewable in the Vercel function logs dashboard.

---

## 20. Security Strategy

### 20.1 Authentication Security

- Credentials are never stored by the application. Supabase Auth stores password hashes using bcrypt. The application only stores the admin's name and role in `admin_users`.
- The JWT access token and refresh token are stored in `HttpOnly; Secure; SameSite=Lax` cookies managed by the Supabase JS client. They are never accessible to JavaScript (`document.cookie` cannot read them).
- Session expiry is enforced by Supabase (default: 1-hour access token, 7-day refresh token). Inactive sessions expire automatically.
- Self-registration is disabled in the Supabase Auth dashboard. Admins can only be created by an existing authenticated admin.

### 20.2 Authorization Security

- Next.js `middleware.ts` runs on every request. For any request matching `/admin/*` or `/api/v1/admin/*`, it verifies the session cookie before the Route Handler runs.
- The middleware does not expose which admin routes exist — all unauthenticated requests to `/admin/*` redirect to `/login`; all unauthenticated requests to `/api/v1/admin/*` return `401`.
- The `SUPABASE_SERVICE_ROLE_KEY` is never prefixed with `NEXT_PUBLIC_`. It is exclusively available in the server runtime. No admin-side API key ever appears in the browser bundle.

### 20.3 Input Validation and Injection Prevention

- Drizzle ORM uses parameterized queries exclusively. No raw string SQL interpolation is permitted.
- Every request body is validated with Zod before it reaches the database layer.
- Rich text / Markdown input is sanitized before rendering on the public website to prevent XSS (using `DOMPurify` or equivalent on the client, and a server-side sanitizer before storage).

### 20.4 File Upload Security

- MIME type is validated from the file buffer's magic bytes, not just the filename extension. This prevents a renamed `.exe` from passing as `.jpg`.
- File size is limited to 5MB per upload.
- Only image MIME types are accepted: `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`.
- Uploaded files are stored in Supabase Storage with UUID-based filenames, preventing path traversal or filename collision attacks.

### 20.5 API Security

- **Rate limiting:** applied on `/api/v1/contact` and `/api/v1/applications` (5 per IP per 15 minutes) and on `/api/v1/auth/login` (30 per IP per 15 minutes). Implemented using Upstash Redis via `@upstash/ratelimit`.
- **Honeypot fields:** contact and application forms include a hidden `_trap` field. Non-empty submissions are silently discarded.
- **CORS:** the API accepts requests only from the known frontend origin (`apexstartupgroup.com`). All other origins receive a CORS rejection.
- **HTTPS only:** Vercel enforces HTTPS on all traffic. HTTP requests are automatically redirected.
- **Security headers:** set via `next.config.ts` headers configuration: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.

### 20.6 Secrets Management

| Secret | Where Stored | Who Has Access |
|---|---|---|
| `SUPABASE_URL` | Vercel Environment Variables | Server runtime only |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel Environment Variables | Server runtime only |
| `SUPABASE_ANON_KEY` | Not used | N/A |
| `UPSTASH_REDIS_URL` | Vercel Environment Variables | Server runtime only |
| `UPSTASH_REDIS_TOKEN` | Vercel Environment Variables | Server runtime only |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel (public) | Client-side (non-sensitive URL) |

No secrets are stored in `.env` files committed to the repository. All secrets are managed through Vercel's environment variable interface and are injected at build time.

### 20.7 Row Level Security

RLS is enabled on all 14 tables. The service role key bypasses RLS (by design — all server-side access uses the service role). RLS policies exist as a defense layer protecting against:

- Direct Supabase client calls from a browser with the anon key.
- Any future misconfiguration that inadvertently exposes a client-side Supabase connection.

For tables containing PII (`contact_queries`, `applications`, `admin_users`), RLS denies all access to the `anon` role.

---

## 21. Folder Structure

```
asg-website/
├── app/
│   ├── (public)/                    # Public website route group
│   │   ├── page.tsx                 # Homepage
│   │   ├── events/
│   │   │   ├── page.tsx             # Events listing
│   │   │   └── [id]/page.tsx        # Single event
│   │   ├── gallery/
│   │   │   ├── page.tsx
│   │   │   └── [albumId]/page.tsx
│   │   ├── blogs/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── interns/page.tsx
│   │   ├── community/page.tsx
│   │   ├── problem-statements/page.tsx
│   │   ├── experts/page.tsx
│   │   ├── partners/page.tsx
│   │   ├── initiatives/page.tsx
│   │   ├── contact/page.tsx
│   │   └── join/page.tsx
│   │
│   ├── (admin)/                     # Admin panel route group
│   │   ├── login/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   ├── auth/callback/route.ts   # OAuth callback handler
│   │   └── dashboard/
│   │       ├── page.tsx             # Dashboard home
│   │       ├── events/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── gallery/
│   │       ├── blogs/
│   │       ├── interns/
│   │       ├── community/
│   │       ├── problem-statements/
│   │       ├── experts/
│   │       ├── partners/
│   │       ├── initiatives/
│   │       ├── contact-queries/
│   │       ├── applications/
│   │       ├── settings/
│   │       └── profile/
│   │
│   ├── api/
│   │   └── v1/                      # All Route Handlers
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   ├── logout/route.ts
│   │       │   ├── forgot-password/route.ts
│   │       │   ├── reset-password/route.ts
│   │       │   └── me/route.ts
│   │       ├── events/
│   │       │   ├── route.ts         # GET (public), POST (admin)
│   │       │   └── [id]/route.ts    # GET (public), PATCH/DELETE (admin)
│   │       ├── gallery-albums/
│   │       ├── gallery-photos/
│   │       ├── blogs/
│   │       ├── interns/
│   │       ├── community-members/
│   │       ├── problem-statements/
│   │       ├── initiatives/
│   │       ├── industry-partners/
│   │       ├── industry-experts/
│   │       ├── contact/route.ts
│   │       ├── applications/route.ts
│   │       ├── settings/[key]/route.ts
│   │       ├── upload/route.ts
│   │       └── admin/
│   │           ├── stats/route.ts
│   │           └── ...              # Admin-only variants
│   │
│   ├── layout.tsx                   # Root layout
│   ├── not-found.tsx
│   ├── error.tsx
│   └── sitemap.ts
│
├── components/
│   ├── public/                      # Components used only on public pages
│   │   ├── EventCard.tsx
│   │   ├── GalleryLightbox.tsx
│   │   ├── BlogCard.tsx
│   │   └── ...
│   ├── admin/                       # Components used only in the admin panel
│   │   ├── DataTable.tsx
│   │   ├── MediaPicker.tsx
│   │   ├── MarkdownEditor.tsx
│   │   ├── StatusBadge.tsx
│   │   └── ...
│   └── shared/                      # Components used in both
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── ...
│
├── lib/
│   ├── db/
│   │   ├── index.ts                 # Drizzle client instance
│   │   └── schema/                  # One file per table
│   │       ├── events.ts
│   │       ├── gallery.ts
│   │       ├── blogs.ts
│   │       └── ...
│   ├── supabase/
│   │   ├── server.ts                # Server-side Supabase client (service role)
│   │   └── client.ts                # Client-side Supabase client (for Auth only)
│   ├── validators/                  # Shared Zod schemas
│   │   ├── events.ts
│   │   ├── contact.ts
│   │   └── ...
│   ├── middleware/
│   │   ├── withAuth.ts              # Token verification helper
│   │   └── rateLimit.ts             # Upstash rate limiter
│   ├── http.ts                      # ok(), created(), fail() helpers
│   ├── pagination.ts                # parseListParams()
│   └── logger.ts                    # Pino logger instance
│
├── middleware.ts                    # Next.js Edge Middleware
├── drizzle.config.ts                # Drizzle Kit configuration
├── next.config.ts                   # Next.js configuration + security headers
├── tailwind.config.ts
├── tsconfig.json
├── .env.local                       # Local dev only; never committed
└── package.json
```

---

## 22. Coding Principles

### 22.1 TypeScript

- Strict mode enabled in `tsconfig.json` (`"strict": true`).
- No `any` types in production code. Use `unknown` and narrow explicitly.
- All API response types are defined in `lib/types/` and shared between Route Handlers and client components.
- Drizzle's generated types (via `typeof schema.events.$inferSelect`) are used for database entity types throughout the codebase.

### 22.2 Component Architecture

- Public website pages are React Server Components by default. Use `"use client"` only when interactivity requires it.
- Admin panel pages use Client Components because they require TanStack Query and React Hook Form.
- Components are co-located with their page when they are used only in one place. Shared components live in `components/shared/`.
- Props are typed explicitly. No implicit `any` from destructuring.

### 22.3 API Design

- Every Route Handler exports exactly one function per HTTP method: `export async function GET(req: Request) {}`, etc.
- Route Handlers do not contain business logic. Logic is extracted to service functions in `lib/services/`.
- No direct database queries in page components. Pages fetch data via Route Handlers (or Drizzle server-side for RSC — both patterns are acceptable; consistency within a module is required).

### 22.4 Forms

- All forms use React Hook Form with Zod resolver.
- The Zod schema for a form is imported from `lib/validators/` — never defined inline in the component.
- Submit handlers are `async` functions. The submit button is disabled during submission.
- On success, the form state is reset. On error, the form remains editable.

### 22.5 Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Files (components) | PascalCase | `EventCard.tsx` |
| Files (utilities) | camelCase | `http.ts` |
| Files (route handlers) | lowercase | `route.ts` |
| Variables and functions | camelCase | `getEvents()` |
| Types and interfaces | PascalCase | `type Event = ...` |
| Zod schemas | camelCase with `Schema` suffix | `eventCreateSchema` |
| Database column names | snake_case | `created_at` |
| TypeScript model fields | camelCase | `createdAt` |
| Environment variables | SCREAMING_SNAKE_CASE | `SUPABASE_URL` |

### 22.6 Import Organization

Imports in every file are ordered:
1. React and Next.js imports
2. Third-party library imports
3. Internal absolute imports (`@/lib/...`, `@/components/...`)
4. Relative imports

---

## 23. Development Workflow

### 23.1 Git Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production branch. All merges to `main` trigger a Vercel production deployment. |
| `dev` | Integration branch. Feature branches are merged here first for testing. |
| `feat/[feature-name]` | Feature development. Branched from `dev`. |
| `fix/[bug-name]` | Bug fixes. Branched from `dev` for non-critical fixes; from `main` for hotfixes. |

### 23.2 Commit Message Convention

Format: `type(scope): description`

| Type | Usage |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Build, tooling, or config change |
| `docs` | Documentation only |
| `refactor` | Code change with no behavior change |
| `style` | Formatting or lint fixes |

Example: `feat(events): add bulk status change endpoint`

### 23.3 Pull Request Policy

- Every PR requires at least one review before merging to `dev`.
- PRs to `main` require approval from the technical lead.
- PR description must include: what was changed, why, and how to test.
- TypeScript (`npm run type-check`) and ESLint (`npm run lint`) must pass before merge.

### 23.4 Environment Setup

| Environment | Branch | Vercel Deployment |
|---|---|---|
| Development | Local | `npm run dev` on `localhost:3000` |
| Preview | `dev` / feature branches | Vercel preview URL (auto-created per PR) |
| Production | `main` | `apexstartupgroup.com` |

### 23.5 Database Migration Workflow

```
1. Modify the Drizzle schema file in lib/db/schema/
2. Run: npx drizzle-kit generate → generates a new SQL migration file
3. Review the generated SQL migration for correctness
4. Run: npx drizzle-kit migrate → applies the migration to the local DB
5. Commit both the schema change and the migration file
6. On Vercel deployment, migrations are applied via a post-deploy script
```

### 23.6 Key Development Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run type-check` | Run TypeScript compiler checks |
| `npm run lint` | Run ESLint |
| `npx drizzle-kit generate` | Generate migration from schema changes |
| `npx drizzle-kit migrate` | Apply pending migrations |
| `npx drizzle-kit studio` | Open Drizzle Studio (visual DB browser) |

---

# PART C — SUPPLEMENTARY

---

## 24. Assumptions

| # | Assumption |
|---|---|
| A1 | A Supabase project is provisioned and accessible before development begins. |
| A2 | A Vercel account is available for deployment with the ability to configure two custom domains pointing to one project. |
| A3 | The organization has or will register `apexstartupgroup.com` and has DNS control to configure subdomains. |
| A4 | The initial Super Admin account is seeded via the Supabase Auth dashboard or a seed script before the admin panel is handed over. |
| A5 | All existing content (intern names, event descriptions, team bios) will be provided by the organization team in a structured format (spreadsheet or similar) for data migration. |
| A6 | The organization does not require automated email sending in V1. All follow-up communication is manual. |
| A7 | The estimated content volume is: < 100 events, < 200 gallery photos, < 50 blog posts, < 200 community members, < 100 interns. |
| A8 | Upstash Redis is provisioned for rate limiting (free tier is sufficient for expected traffic). |
| A9 | Google OAuth is configured in the Supabase Auth dashboard before the admin panel is handed over. |

---

## 25. Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Supabase service outage | Low | High | The website will be read-only during a Supabase outage if using SSR with live DB queries. Mitigation: implement ISR (stale-while-revalidate) for high-traffic public pages so cached responses are served during brief outages. |
| R2 | Admin panel accessed by an unauthorized person | Low | Critical | Mitigated by proper Middleware route protection, HttpOnly cookies, and Supabase Auth session validation on every request. |
| R3 | File upload abuse (storage cost explosion) | Low | Medium | Mitigated by per-upload 5MB file size limits, admin-only upload access, and MIME type restrictions. |
| R4 | Scope creep during development | Medium | High | Non-Goals are explicitly documented. Any new feature requests require a formal scope change and a new development estimate. |
| R5 | Data loss from accidental deletion | Medium | Medium | Soft delete pattern (`deleted_at` column) on key content tables prevents permanent loss from UI mistakes. |
| R6 | Contact form abuse / spam | Medium | Low | Honeypot field and rate limiting (5/IP/15min) are in place. |
| R7 | Slow page loads impacting SEO | Low | Medium | Public pages use SSR/ISR. Images served via Next.js `<Image>` with WebP. Performance monitored via Vercel Analytics. |

---

## 26. Future Scalability

The following enhancements are deliberately deferred but the architecture is designed to accommodate them:

| Enhancement | How the Architecture Supports It |
|---|---|
| **Multi-admin with RBAC** | `admin_users.role` column exists. Adding role checks requires modifying `withAuth` middleware only — no structural DB changes. |
| **Automated email notifications** | Adding Resend.com or similar requires only adding environment variables and calling the email API from Route Handlers. No architectural change needed. |
| **Full-text search** | PostgreSQL's `tsvector` columns and `GIN` indexes can be added to `events`, `blogs`, and `interns` tables in a future migration without changing the application structure. |
| **Video gallery support** | The `gallery_photos` table includes a `media_type` column stub. Adding `video_url` is a single migration. |
| **Blog comments** | Requires one new table (`blog_comments`) with a foreign key to `blogs`. The existing API versioning pattern allows adding `/api/v1/blogs/[slug]/comments` without touching existing routes. |
| **Intern self-service portal** | Visitor authentication can be added as a separate Supabase Auth flow. The existing `admin_users` / `interns` separation means intern accounts would be a new user type, not mixed with admin accounts. |
| **API v2** | New Route Handlers at `/api/v2/` can be introduced alongside v1. Clients migrate independently. |
| **CDN for large media** | Supabase Storage can be fronted with Cloudflare R2 by changing the storage client configuration — no application code changes needed. |

---

## 27. Glossary

| Term | Definition |
|---|---|
| **ASG** | Apex Startup Group — the organization this platform is built for. |
| **Admin Panel** | The protected section of the website at `/dashboard/*`, accessible only to authenticated admins. |
| **Route Handler** | A Next.js API file that exports HTTP method functions (GET, POST, PATCH, DELETE) and acts as the backend endpoint. Lives in `app/api/`. |
| **RSC** | React Server Component — a React component that renders on the server and returns HTML. Used for public pages for performance and SEO. |
| **RLS** | Row Level Security — a PostgreSQL feature that applies access control rules at the database row level. |
| **Drizzle ORM** | A TypeScript-native SQL query builder and ORM used to interact with PostgreSQL in a type-safe way. |
| **Supabase Auth** | Supabase's authentication service, built on GoTrue. Handles email/password and OAuth credential management, JWT issuance, and session management. |
| **Supabase Storage** | Supabase's S3-compatible file storage service. Organized into buckets with public or private access. |
| **TanStack Query** | A React library for managing server state (fetching, caching, and mutating remote data). Used in the admin panel client components. |
| **Zod** | A TypeScript-first schema validation library. Used to validate both client-side form inputs and server-side request bodies. |
| **ISR** | Incremental Static Regeneration — a Next.js feature that serves cached HTML for a page and regenerates it in the background after a configured time window. |
| **JWT** | JSON Web Token — the session token issued by Supabase Auth after a successful login. Short-lived; rotated via a refresh token. |
| **Honeypot** | A hidden form field not visible to human users. If populated (by a bot), the submission is identified as automated and discarded. |
| **Service Role Key** | A Supabase secret key that bypasses all RLS policies. Used only in server-side Route Handlers. Never exposed to the client. |
| **Soft Delete** | Marking a record as deleted via a `deleted_at` timestamp rather than removing it from the database. Allows recovery of accidentally deleted data. |
| **KPI** | Key Performance Indicator — the dashboard metrics (total events, active interns, etc.) displayed on the admin dashboard home page. |

---

*This document is the single source of truth for the ASG Website project. All product and engineering decisions should be traceable to a requirement or design principle defined here. Scope changes require a document revision and stakeholder sign-off.*

*Document Owner: Garry — Apex Startup Group Engineering*  
*Last Updated: July 2026*
