# GTLS Transport Software - AI & Agent Instructions

> **CRITICAL INSTRUCTION FOR ALL AI SESSIONS**:
> **DO NOT spend tokens/credits scanning all project files or searching the codebase blindly.**
> The entire architecture, file map, database schema, state keys, and business calculation engine are fully documented in [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md).
> Read this file and `PROJECT_ARCHITECTURE.md` before making any modifications.

---

## 1. Quick Technical Summary

- **Type**: Enterprise Transport & Logistics Management Application.
- **Frontend**: Multi-Page HTML + Vanilla JavaScript (`app.js`, ~5,800 lines) + Vanilla CSS (`styles.css`). No Webpack / Vite / React build step needed.
- **Backend / Database**: Supabase PostgreSQL with RLS, Auth, Storage Bucket (`gtls-private-documents`), and Edge Function (`manage-user`).
- **Configuration**: [`supabase-config.js`](file:///h:/Transport_Software-main/supabase-config.js) holds `window.GTLS_SUPABASE_CONFIG = { url, publishableKey }`.

---

## 2. Key Files & Line Index in `app.js`

| Module / Page | HTML File | `data-page` Attribute | Handler in `app.js` |
| :--- | :--- | :--- | :--- |
| **Sign In** | [`index.html`](file:///h:/Transport_Software-main/index.html) | `signin` | `softwareLoginPage()` (~Line 1977) |
| **Dashboard** | [`dashboard.html`](file:///h:/Transport_Software-main/dashboard.html) | `dashboard` | `dashboardPage()` (~Line 3039) |
| **Booking Form** | [`booking.html`](file:///h:/Transport_Software-main/booking.html) | `booking` | `bookingPage()` (~Line 3214) |
| **Booking Summary** | [`ledger.html`](file:///h:/Transport_Software-main/ledger.html) | `ledger` | `ledgerPage()` (~Line 3711) |
| **Truck Details** | [`truck.html`](file:///h:/Transport_Software-main/truck.html) | `truck` | `truckPage()` (~Line 4127) |
| **Pending Truck Summary** | [`truck-summary.html`](file:///h:/Transport_Software-main/truck-summary.html) | `truck-summary` | `truckSummaryPage()` (~Line 4381) |
| **Completed Truck Summary**| [`completed-truck-summary.html`](file:///h:/Transport_Software-main/completed-truck-summary.html) | `completed-truck-summary`| `truckSummaryPage()` (~Line 4381) |
| **Equipment Fleet** | [`equipment.html`](file:///h:/Transport_Software-main/equipment.html) | `equipment` | `equipmentPage()` (~Line 4669) |
| **Fleet Maintenance** | [`maintenance.html`](file:///h:/Transport_Software-main/maintenance.html) | `maintenance` | `maintenancePage()` (~Line 4960) |
| **Employees** | [`employees.html`](file:///h:/Transport_Software-main/employees.html) | `employee` | `employeePage()` (~Line 5295) |
| **Admin Login** | [`admin-login.html`](file:///h:/Transport_Software-main/admin-login.html) | `admin-login` | `adminLoginPage()` (~Line 5471) |
| **Admin Users** | [`admin.html`](file:///h:/Transport_Software-main/admin.html) | `admin` | `adminPage()` (~Line 5501) |
| **Activity Logs** | [`activity-logs.html`](file:///h:/Transport_Software-main/activity-logs.html) | `activity-logs` | `activityLogsPage()` (~Line 5742) |
| **Accounts Receivable** | [`khata.html`](file:///h:/Transport_Software-main/khata.html) | `khata` | `khataPage()` (~Line 5757) |
| **Accounts Payable** | [`accounts-payable.html`](file:///h:/Transport_Software-main/accounts-payable.html)| `accounts-payable`| `khataPage()` (~Line 5757) |

---

## 3. Core Engine Functions in `app.js`

- **Sequential IDs**: `getNextSequentialId(items, prefix, field)` (~Line 497) — produces `Job-1`, `EQP-1`, `MNT-1`, `EMP-1`, `ADM-1`, `KHT-1`, `PAYE-1`, `LOG-1`.
- **State Store**: `loadStore()` (~Line 507) & `saveStore(store, options)` (~Line 707).
- **Audit Logging**: `collectAuditChanges()` (~Line 665), `appendAuditLog()` (~Line 647), `pruneActivityLogs()` (~Line 590).
- **Supabase Session & RBAC**: `getSupabaseSessionUser()` (~Line 800), `signInWithSupabase()` (~Line 831), `enforceSoftwareAccess(page)` (~Line 1669).
- **Tax & Financial Math**: `calculateBookingTaxBreakdown(rate, detention, authority)` (~Line 1918), `calculateKhataSummary(account)` (~Line 1949).
- **PDF Generation**: `buildBookingInvoicePdf()` (~Line 2177), `buildSummaryRecordPdf()` (~Line 2326), `createRegisterPdf()` (~Line 2119).
- **Sync & Debounce**: `scheduleOperationalSync()` (~Line 1130), `syncOperationalStore()` (~Line 1412), `hydrateOperationalStore()` (~Line 1428).
- **Storage Uploads**: `uploadPrivateDataUrl()` (~Line 1155) & `getPrivateDocumentUrl()` (~Line 957) to bucket `gtls-private-documents`.

---

## 4. Coding & Change Guidelines

1. **Keep Code Synchronized**: If adding a field to an HTML form, always update the normalizer function and the corresponding Supabase mapper in [`app.js`](file:///h:/Transport_Software-main/app.js).
2. **Preserve ID Formats**: Always use `getNextSequentialId()` for generating readable IDs.
3. **No Build Step Required**: Never install bundlers (webpack, vite, rollup) unless explicitly asked. The app runs directly by opening any `.html` file or via a static web server.
4. **Refer to Documentation**: For comprehensive data structures and database schema, read [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md).
5. **Always Update Documentation on Code Changes**: Whenever you make any modifications (add a field, change calculation math, alter Supabase schema or RLS, add new pages, or update styles), you **MUST update [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md)** (and this file's line index if shifted) and log the change in the **Changelog** section.

