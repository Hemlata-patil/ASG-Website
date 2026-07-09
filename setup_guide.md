# APEX Hub — Setup & Configuration Guide

Welcome! This setup guide will help you get the APEX Hub project running locally on your machine and connect it to your Supabase instance.

---

## 📂 Project Architecture Overview

The repository is structured as a Next.js App Router application inside the `Website` directory:
- **`Website/`**: Contains the complete project (both public facing pages `/` and admin panel `/dashboard` routes).
- **`Admin/`** *(Redundant)*: A standalone mockup/Figma-export bundle used as a UI reference for the login screen. **You can safely delete this root-level `Admin` folder**, as the full admin panel, dashboard, and login flow have been integrated directly into the Next.js App (`Website/src/app/(admin)`).

---

## 🛠️ Step-by-Step Setup Guide

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (v18.x or higher recommended)
- **npm** (comes with Node.js) or **pnpm/yarn**

---

### 2. Project Installation

Navigate into the `Website` directory (where the active codebase lives) and install dependencies:

```bash
cd Website
npm install
```

---

### 3. Setup Supabase & Environment Variables

1. Copy the template environment file to create your local configurations:
   ```bash
   cp .env.example .env.local
   ```
2. Open the new `.env.local` file and replace the placeholder values with your actual credentials:
   - **Supabase Project URL & Keys:** Get these from your Supabase dashboard under **Project Settings > API**.
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Project URL.
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The API public anon key.
     - `SUPABASE_SERVICE_ROLE_KEY`: The private API service role key.
   - **Database Connection URL (Drizzle ORM):** Get this from your Supabase dashboard under **Project Settings > Database > Connection String > URI** (use the Transaction Pooler mode on port `6543`).
     - `DATABASE_URL`: Format is `postgresql://postgres.[YOUR-PROJECT-ID]:[YOUR-PASSWORD]@aws-1-[REGION].pooler.supabase.com:6543/postgres`

---

### 4. Setup the Database Schema (Drizzle ORM)

Since we use Drizzle ORM to manage database interactions, you need to sync the database schema to your Supabase Postgres instance:

- **Generate Schema Migrations:**
  ```bash
  npx drizzle-kit generate
  ```
- **Push Changes to Supabase Database:**
  ```bash
  npx drizzle-kit push
  ```

---

### 5. Running the Application Locally

Start the local development server:

```bash
npm run dev
```

The application will run at **[http://localhost:3000](http://localhost:3000)**.
- Public site: **[http://localhost:3000](http://localhost:3000)**
- Admin Panel: **[http://localhost:3000/login](http://localhost:3000/login)** or **[http://localhost:3000/dashboard](http://localhost:3000/dashboard)**
