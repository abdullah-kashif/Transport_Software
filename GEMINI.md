# GTLS Transport Software - Gemini & AI Workspace Instructions

See [`AGENTS.md`](file:///h:/Transport_Software-main/AGENTS.md) and [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md) for the complete architecture, schema, state machine, and file index.

### Key Rules to Save Credits & Avoid Unnecessary Scans:
1. **Do NOT run full codebase text searches or scan all HTML/JS files**.
2. All module line numbers in [`app.js`](file:///h:/Transport_Software-main/app.js) are indexed in [`AGENTS.md`](file:///h:/Transport_Software-main/AGENTS.md#2-key-files--line-index-in-appjs).
3. The database schema, tax calculation equations, RLS rules, and storage paths are detailed in [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md).
4. Direct all modifications to the specific target HTML file and the corresponding section of [`app.js`](file:///h:/Transport_Software-main/app.js).
5. **Always update [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md) and [`AGENTS.md`](file:///h:/Transport_Software-main/AGENTS.md) whenever you make changes to the code or schema**.

---

## What We Were Working On Last Time (In-Progress Uncommitted Changes)

When starting a new session, do not re-scan the codebase to find active work. The current uncommitted working tree changes consist of the following features:

1. **Background Hydration & Non-Blocking Rendering**:
   - Asynchronous store hydration in [`app.js`](file:///h:/Transport_Software-main/app.js) via [`hydrateBookingsFromSupabase`](file:///h:/Transport_Software-main/app.js#L308) and [`hydrateOperationalStore`](file:///h:/Transport_Software-main/app.js#L654).
   - Re-rendering using `window.activePageRender()` after background store hydration finishes.
   - Caching signed URLs in `sessionStorage` (`gtls-signed-url-cache`) via `getCachedSignedUrl` and `cacheSignedUrl` to speed up asset loading.

2. **Lazy-Loading Table Inline Images**:
   - Lazily loading attachments (Bilty, Fleet documents, Maintenance images, Khata images) in all tables via `getPrivateDocumentUrl`. Displays `...` loading state until loaded.

3. **Fleet Equipment Preview Modal & Thumbnail**:
   - Replaced "View File" text button with an inline image thumbnail preview in the Equipment table in [`equipment.html`](file:///h:/Transport_Software-main/equipment.html).
   - Added an inline modal preview dialog (`data-equipment-document-modal` and its CSS classes) to display documents directly on-page.

4. **Truck Trip Ledger Image Support**:
   - Added `Image` column with lazy-loaded thumbnails to the trip register table in [`truck.html`](file:///h:/Transport_Software-main/truck.html).
   - Added an inline preview modal (`data-truck-image-modal`) for full-size trip attachments.

5. **Automatic Storage Cleanups**:
   - Cleanups in `gtls-private-documents` bucket for replaced/deleted records (Bilty, Truck trip images, Maintenance images, and Khata attachments) via `removeStaleBookingBiltyFiles` and updated `uploadPrivateDataUrl`.

6. **Manage-User Edge Function Update**:
   - Refactored [`supabase/functions/manage-user/index.ts`](file:///h:/Transport_Software-main/supabase/functions/manage-user/index.ts) to verify Super Admin access directly from the `profiles` table using the `admin` client (removing the `is_super_admin` RPC dependency).


