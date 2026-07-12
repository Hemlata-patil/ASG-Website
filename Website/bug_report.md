# Project Bug Report & Security Audit Log

This document tracks all system bugs, security vulnerabilities, database mismatches, and layout alignment issues discovered and resolved during development.

---

## 1. Admin Login Redirect Loop
* **Issue:** Admin dashboard layout redirected users back to the homepage immediately after logging in, preventing access.
* **Root Cause:** A client-side `!isLoggedIn` session check in `dashboard/layout.tsx` was firing synchronously on mount before Supabase's asynchronous session initialization resolved.
* **Resolution:** Removed the redundant client-side router redirect and delegated path authorization exclusively to Next.js Middleware, which safely authenticates page routes on the server side.

---

## 2. Unsecured Admin API Routes (Security Vulnerability)
* **Issue:** Direct requests to `/api/v1/admin/*` (via browser, curl, or Postman) could read and delete candidate database entries without authentication.
* **Root Cause:** Next.js Middleware matcher bypassed all paths containing `/api`, leaving admin endpoints completely unprotected.
* **Resolution:** Integrated session auth guards inside the route handlers (`applications`, `community-applications`, `contact-queries`) using Supabase server clients (`createClient()`). Unauthenticated requests now correctly return `401 Unauthorized`.

---

## 3. Candidate Actions Memory Persistence Mismatch
* **Issue:** Rejecting or approving candidates in the admin panel did not update the database, causing rejected applicants to remain in the tables.
* **Root Cause:** Action buttons in AAL and Community admin views only mutated local state memory/localStorage without executing API queries.
* **Resolution:** Connected the action buttons to database-backed API endpoints. Approving/Rejecting candidates now triggers live database operations (e.g. inserting promoted interns to `interns` table and deleting pending entries).

---

## 4. Form Submission Duplication Constraints
* **Issue:** Users could submit multiple applications or contact queries using the same credentials (email, phone, LinkedIn, GitHub).
* **Root Cause:** Missing uniqueness validation checks in the POST route handlers.
* **Resolution:** Updated route handlers to query existing records before insertion and return `400 Bad Request` with field-specific errors if duplicates are found.

---

## 5. Missing Database Columns & Mismatched Schemas
* **Issue:** Application queries and community submissions failed to write details to database columns.
* **Root Cause:** Database columns like `phone` in `contact_queries` and `photo_url` in `community_member_applications` existed in PostgreSQL but were missing from the Drizzle ORM schemas.
* **Resolution:** Declared missing columns in the schemas, executed Drizzle migrations, and verified DB alignment.

---

## 6. Photo Cropper & File Size Limits
* **Issue:** Image cropping was broken on public pages, and users could upload large image files, causing load overhead.
* **Root Cause:** Missing cropping integration in the Community form and lack of file constraints on uploads.
* **Resolution:** Integrated the Vanilla-styled `<ImageUpload />` component across forms, enforcing a `<500 KB` file size limit and locked aspect ratios.

---

## 7. Missing LinkedIn Links in View Details Modal
* **Issue:** LinkedIn links were not visible in the View details overlay for AAL candidates.
* **Root Cause:** The database column was mapped to AAL items but excluded from the rendering JSX blocks.
* **Resolution:** Updated `aal/page.tsx` details overlay to display clickable LinkedIn links alongside GitHub profiles.

---

## 8. Dashboard Layout & Table Adjustments
* **Issue:** Table columns displayed metadata instead of critical contact identifiers.
* **Root Cause:** Columns were configured to display descriptions and motivations instead of colleges or phone numbers.
* **Resolution:**
  * Replaced `"Role/Description"` with `"Phone Number"` on the Interns list.
  * Replaced `"Background/College"` with `"College"` on the Applications list.
  * Removed `"Reason/Proposal"` from the Existing Interns table.

---

## 9. College Input Free-Text Constraint
* **Issue:** Users entered inconsistent college names on the public form, making data classification difficult.
* **Root Cause:** Free-text input field was used.
* **Resolution:** Replaced text box with a selection dropdown of colleges and a dynamic custom field fallback under the option `"Others"`.

---

## 10. Redundant Configuration File Cleanup
* **Issue:** Legacy example env configurations remained in the repository.
* **Root Cause:** `.env.example` was obsolete and duplicated active environmental documentation.
* **Resolution:** Deleted `.env.example` from the codebase.

---

## 11. Empty Problem Statements on Fresh Load
* **Issue:** First-time users or those with cleared local storage saw an empty list of problem statements in the AAL dashboard.
* **Root Cause:** The application only read problem statements from `localStorage` without a fallback array initialization.
* **Resolution:** Implemented a verification check in `aal/page.tsx` that loads default problem statements from the code memory if the local storage query returns empty.

---

## 12. Existing Interns Showing Under New Applications
* **Issue:** Existing intern applications were wrongly listed under the "New Intern Applications" section in the admin panel.
* **Root Cause:** The database schema `intern_applications` lacked an `is_existing_intern` flag, so the POST API could not save the classification, and the dashboard defaulted it to `false`.
* **Resolution:** Added `isExistingIntern` (boolean) column to the schema, executed migrations to update PostgreSQL, patched the POST endpoint to save the flag, and updated `aal/page.tsx` to read the value from the database.

---

## 13. Rejected Applications Displaying & Intern Deletion Persistence
* **Issue:** Rejected intern applications were still visible in the dashboard tables, and deleting active/completed interns did not remove them from the database.
* **Root Cause:**
  1. The lists `newApplications` and `existingApplications` only checked `status !== "Accepted"` instead of filtering out `status === "Rejected"`.
  2. The "Remove Intern" function only mutated local state memory without executing a backend DELETE API query.
* **Resolution:**
  1. Patched dashboard lists to explicitly filter out candidates with the status `"Rejected"`.
  2. Created a `DELETE` method handler inside `v1/admin/interns/route.ts` and updated the `remove` function in `aal/page.tsx` to call this API on delete confirmation.

---

## 14. Next.js 15 Route Parameters Type Error (500 Error)
* **Issue:** Admin and public dynamic routes failed to compile, causing a 500 compilation error during Next.js background builds.
* **Root Cause:** Next.js 15 handles dynamic route parameters context (like `[id]` or `[slug]`) as native Promises. The API endpoints were destructured synchronously (e.g. `const { id } = params`), which threw a compiler type-check exception.
* **Resolution:** Redefined the `params` type as `Promise<{ id: string }>` and resolved them asynchronously using `const { id } = await params`.

---

## 15. Rich Text Editor Cursor Position Jumping
* **Issue:** While typing in the contentEditable rich-text blog body editor, the cursor (caret selection) kept jumping back to the far left (index 0) after every keystroke.
* **Root Cause:** The react render state loop updated the raw `innerHTML` of the contentEditable element on every character typed, resetting the browser cursor focus selection.
* **Resolution:** Introduced a session load reference `isEditorInitialized` to initialize the editor's raw `innerHTML` exactly once on mount, preventing state update HMR loops from re-writing the HTML while typing.

---

## 16. Incomplete Draft Saving DB Constraint Error
* **Issue:** Admins could not save incomplete drafts of blog posts, triggering database integrity/constraint violations.
* **Root Cause:** All blog fields (`excerpt`, `coverImage`, `body`, `category`) were marked `.notNull()` in Drizzle, and the APIs/forms enforced strict validation on all fields for both published and draft status.
* **Resolution:** Relaxed validation for `Draft` status in both frontend and backend APIs, and implemented empty string fallbacks (`""`) for other fields during database operations to satisfy database integrity constraints.

---

## 17. Slug Column Duplicate Key Violations (Unique Constraint)
* **Issue:** Creating or editing blog posts with overlapping/duplicate titles resulted in a duplicate key unique constraint error.
* **Root Cause:** The `slug` column has a database-level `unique` constraint, throwing an exception on conflict.
* **Resolution:** Added a backend slug-uniqueness resolver that automatically checks if the generated slug is already taken and appends a numeric counter (e.g. `slug-1`, `slug-2`) until a unique slug is resolved.

---

## 18. Homepage Mock Blogs Persistence & Broken Cover Images
* **Issue:** Deleted posts still showed up on the homepage, and newly published posts displayed broken cover image cards.
* **Root Cause:**
  1. The homepage statically mapped mock data from `blogs.ts` instead of querying the backend API.
  2. The database stored relative paths (e.g. `2026/07/...webp`) for uploads, which failed to resolve on public pages without a base storage domain prefix.
* **Resolution:**
  1. Updated the homepage to dynamically fetch the published blogs list from the database.
  2. Implemented `getFullStorageUrl` helper inside the API handlers to prefix relative paths with the public Supabase storage base URL automatically.

---

## 19. Rich-Text Editor Selection Loss & Toolbar Failures
* **Issue:** Dropdown selects (font, format size) did not apply styles to highlighted editor text.
* **Root Cause:** Clicking selects shifted browser focus away from the editor, losing the active text selection range before formatting commands could run.
* **Resolution:** Integrated range selection listeners (`saveSelection`, `restoreSelection`) on editor mouseup, keyup, and blur events, restoring cursor selection immediately prior to running formatting commands.

---

## 20. Content Erased on Preview Mode Toggle
* **Issue:** Toggling the editor's preview mode and switching back to editor mode cleared all written content.
* **Root Cause:** Switching to preview unmounted the editor. The unmount triggered a blur event, which executed `handleEditorInput` on the unmounted empty element, overwriting the state with `""`.
* **Resolution:** Removed the redundant state update trigger from the `onBlur` callback, and configured the preview toggle to reset the initialization ref, safely restoring content on editor remount.

---

## 21. Storage Leakage on Blog Deletion
* **Issue:** Deleting a blog post left its associated cover image and inline body images in the Supabase media storage bucket, wasting space.
* **Root Cause:** The DELETE endpoint only deleted the database row, ignoring storage assets.
* **Resolution:** Added storage removal logic using `supabase.storage.remove()` inside the DELETE route handler to automatically clean up the cover image and parse/delete all inline images from the blog body.
