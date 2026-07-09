# Prompt: Generate a Combined PRD + TRD for the ASG Website

You are an experienced Senior Solution Architect, Technical Architect, Product Manager, Database Architect, and Technical Writer with 15+ years of experience designing scalable SaaS products, CMS platforms, and enterprise web applications.
Your task is to generate a single comprehensive **PRD + TRD (Product Requirements Document + Technical Requirements Document)** for a production-ready web application.

Do not generate source code.
Do not generate implementation steps.
Do not generate database schema SQL.
Instead, create a professional software specification document that will act as the single source of truth before development begins.
The document should be written in Markdown.
The document should be comprehensive, logically structured, technically accurate, and follow software industry standards.

---

# Project Information

Project Name:
ASG Website

Organization:
Apex Startup Group

---

# Project Overview

The ASG Website is a completely public informational website for Apex Startup Group.

Its primary purpose is to showcase:

- Organization information
- Problem Statements
- Interns
- Community Members
- Industry Experts
- Industry Partners
- Events
- ASG Initiatives
- Gallery
- Blogs

The website also allows visitors to:
- Apply to join Apex Startup Group
- Submit contact queries
Visitors do not create accounts.
The website is completely read-only for visitors.
There is only one protected area:

Admin Panel
The Admin Panel is used to manage all website content.
---

# User Types

Only two user types exist.

## Public Visitor

Can:
- Browse website
- View all public content
- Submit application
- Submit contact query

Cannot:
- Login
- Edit content
- Access admin panel
---

## Super Admin

Has full control over the website.

Can:
- Login
- Manage every website module
- Manage content
- Upload files
- Manage settings
- View applications
- View contact queries

The system currently has only one Super Admin.
However, the architecture should support allowing the Super Admin to create additional admins in the future.
Do not implement RBAC.
Do not introduce multiple roles.
Simply make the architecture future-ready.

---

# Website Modules

The document should include functional requirements for:

- Homepage
- Intern Listings
- Community Members
- Problem Statements
- Events
- ASG Initiatives
- Gallery
- Blogs
- Industry Partners
- Industry Experts
- Contact Form
- Join ASG Application
- Footer
- Website Settings

---

# Homepage

Homepage contains editable sections including:

- Statistics
- Gallery Preview
- Upcoming Events
- Testimonials
- Footer
- Contact Details

---

# Events Module

Each event contains:

- Title
- Scheduled Date
- Venue
- Status
    - Draft
    - Upcoming
    - Past
- Tags
- Thumbnail Banner
- Description
- Gallery Recap URL (only for past events)

---

# ASG Initiatives

Each initiative contains:
- Emoji
- Title
- Description

---

# Gallery

Support:

- Multiple albums
- Multiple images
- Captions
- Reordering
- Image deletion
- Future video support

Do not design the gallery using JSON arrays.
Use a normalized relational approach.

---

# Blogs

Support:

- Draft
- Published

---

# Contact Form

Visitor submits query.
The query is stored in the database.
The admin views the query inside the dashboard.
The admin manually replies using their own email client.
No automated email system is required.

---

# Join ASG Application

Visitors can submit applications.
Applications are stored in the database.
The admin reviews them inside the dashboard.

---

# Dashboard

Dashboard should display:

- Total Events
- Upcoming Events
- Total Interns
- Community Members
- Blog Posts
- Gallery Images
- Problem Statements

Include:

- College-wise intern statistics (Bar Chart)
- Recent Events
- Recent Blogs

---

# Authentication

Use:

Supabase Auth

Support:

- Email & Password
- Google Login
- Email Verification
- Forgot Password
- Session Management

Do not hardcode credentials.
Credentials must be securely managed by Supabase Auth.
Passwords must never be stored by the application.
The architecture must ensure the Admin Panel cannot be accessed without proper authentication and authorization.

---

# Authorization

Currently:
Only one authenticated Super Admin exists.
The architecture should support adding more admins later.
Do not implement RBAC.
Do not introduce permissions.
Keep authorization simple.

---

# Technical Stack

Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form
- TanStack Query
- Native Fetch API

Backend

- Next.js Route Handlers
- REST API
- TypeScript

Database

- Supabase PostgreSQL

ORM

- Drizzle ORM
- Drizzle Kit

Authentication

- Supabase Auth

Storage

- Supabase Storage

Validation

- Zod

Security

- Next.js Middleware
- Supabase Row Level Security (RLS)

---

# Backend Architecture

Use this architecture.

Browser

↓

Next.js Application

↓

Route Handlers

↓

Validation

↓

Authentication

↓

Business Logic

↓

Drizzle ORM

↓

Supabase PostgreSQL

↓

Supabase Storage

The frontend must never directly communicate with the database.
Every request should go through the backend.

---

# Storage

Public storage should include:

- Gallery Images
- Event Banners
- Intern Photos
- Community Member Photos
- Industry Partner Logos
- Industry Expert Photos

Store only URLs in the database.

Never store Base64 images.

---

# Database

Recommend a simple but normalized PostgreSQL schema.
Do not over-engineer.
Avoid unnecessary tables.
Avoid generic JSON blobs.
The schema should remain scalable.

---

# Security

The document must explain:

- Authentication Flow
- Authorization Flow
- Session Management
- Middleware Responsibilities
- Row Level Security Strategy
- Secure API Design
- File Upload Security
- API Validation
- Secrets Management

---

# API Design

Recommend REST APIs.
Include endpoint planning.
Include naming conventions.
Include response format.
Do not write implementation code.

---

# Folder Structure

Recommend a scalable folder structure for the project.
Do not over-engineer.
Avoid unnecessary folders.

---

# Documentation Expectations

The generated document should include at minimum:

- Executive Summary
- Vision
- Goals
- Non Goals
- Scope
- Functional Requirements
- Non Functional Requirements
- User Types
- User Journeys
- Features
- Technical Stack
- High Level Architecture
- Application Flow
- Authentication Flow
- Authorization Flow
- Database Design Principles
- Storage Design Principles
- API Standards
- Validation Strategy
- Error Handling Strategy
- Security Strategy
- Folder Structure
- Coding Principles
- Development Workflow
- Assumptions
- Risks
- Future Scalability
- Glossary

---

# Writing Style

- Professional
- Enterprise-level
- Concise but comprehensive
- No fluff
- No repeated information
- No contradictory statements
- Use proper Markdown headings
- Use tables where appropriate
- Use diagrams using Markdown code blocks
- Clearly separate PRD and TRD sections
- Make the document suitable for both developers and stakeholders

The final output should be a single, production-quality `PRD_TRD.md` document that can serve as the foundation for the entire project lifecycle.