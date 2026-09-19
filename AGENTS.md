# GTLS Transport Software - AI & Agent Instructions

> **CRITICAL INSTRUCTION FOR ALL AI SESSIONS**:
> **DO NOT spend tokens/credits scanning all project files or searching the codebase blindly.**
> The entire architecture, file map, database schema, state keys, and business calculation engine are fully documented in [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md).
> Read this file and `PROJECT_ARCHITECTURE.md` before making any modifications.

---

## 1. Quick Technical Summary

- **Type**: Enterprise Transport & Logistics Management Application.
- **Frontend**: Multi-Page HTML + Vanilla JavaScript (`app.js`, ~7,100 lines) + Vanilla CSS (`styles.css`). No Webpack / Vite / React build step needed.
- **Backend / Database**: Supabase PostgreSQL with RLS, Auth, Storage Bucket (`gtls-private-documents`), and Edge Function (`manage-user`).
- **Configuration**: [`supabase-config.js`](file:///h:/Transport_Software-main/supabase-config.js) holds `window.GTLS_SUPABASE_CONFIG = { url, publishableKey }`.

---

## 2. Key Files & Line Index in `app.js`

| Module / Page | HTML File | `data-page` Attribute | Handler in `app.js` |
| :--- | :--- | :--- | :--- |
| **Sign In** | [`index.html`](file:///h:/Transport_Software-main/index.html) | `signin` | `softwareLoginPage()` (~Line 1721) |
| **Dashboard** | [`dashboard.html`](file:///h:/Transport_Software-main/dashboard.html) | `dashboard` | `dashboardPage()` (~Line 3030) |
| **Booking Form** | [`booking.html`](file:///h:/Transport_Software-main/booking.html) | `booking` | `bookingPage()` (~Line 3207) |
| **Booking Summary** | [`ledger.html`](file:///h:/Transport_Software-main/ledger.html) | `ledger` | `ledgerPage()` (~Line 4329) |
| **Trucker/Broker Summary** | [`broker-summary.html`](file:///h:/Transport_Software-main/broker-summary.html) | `broker-summary` | `brokerSummaryPage()` (~Line 4064) |
| **Truck Details** | [`truck.html`](file:///h:/Transport_Software-main/truck.html) | `truck` | `truckPage()` (~Line 4808) |
| **Pending Truck Summary** | [`truck-summary.html`](file:///h:/Transport_Software-main/truck-summary.html) | `truck-summary` | `truckSummaryPage()` (~Line 5065) |
| **Completed Truck Summary**| [`completed-truck-summary.html`](file:///h:/Transport_Software-main/completed-truck-summary.html) | `completed-truck-summary`| `truckSummaryPage()` (~Line 5065) |
| **Equipment Fleet** | [`equipment.html`](file:///h:/Transport_Software-main/equipment.html) | `equipment` | `equipmentPage()` (~Line 5353) |
| **Fleet Maintenance** | [`maintenance.html`](file:///h:/Transport_Software-main/maintenance.html) | `maintenance` | `maintenancePage()` (~Line 5637) |
| **Employees** | [`employees.html`](file:///h:/Transport_Software-main/employees.html) | `employee` | `employeePage()` (~Line 5964) |
| **Admin Login** | [`admin-login.html`](file:///h:/Transport_Software-main/admin-login.html) | `admin-login` | `adminLoginPage()` (~Line 6190) |
| **Admin Users** | [`admin.html`](file:///h:/Transport_Software-main/admin.html) | `admin` | `adminPage()` (~Line 6220) |
| **Activity Logs** | [`activity-logs.html`](file:///h:/Transport_Software-main/activity-logs.html) | `activity-logs` | `activityLogsPage()` (~Line 6468) |
| **Accounts Receivable** | [`khata.html`](file:///h:/Transport_Software-main/khata.html) | `khata` | `khataPage()` (~Line 6620) |
| **Accounts Payable** | [`accounts-payable.html`](file:///h:/Transport_Software-main/accounts-payable.html)| `accounts-payable`| `khataPage()` (~Line 6620) |

---

## 3. Core Engine Functions in `app.js`

- **Sequential IDs**: `getNextSequentialId(items, prefix, field)` (~Line 143) — produces `Job-1`, `EQP-1`, `MNT-1`, `EMP-1`, `ADM-1`, `KHT-1`, `PAYE-1`, `LOG-1`.
- **State Store**: `loadStore()` (~Line 153) & `saveStore(store, options)` (~Line 353).
- **Audit Logging**: `collectAuditChanges()` (~Line 311), `appendAuditLog()` (~Line 293), `pruneActivityLogs()` (~Line 236).
- **Supabase Session & RBAC**: `getSupabaseSessionUser()` (~Line 448), `signInWithSupabase()` (~Line 479), `enforceSoftwareAccess(page)` (~Line 1751).
- **Tax & Financial Math**: `calculateBookingTaxBreakdown(rate, detention, authority)` (~Line 2136), `calculateKhataSummary(account)` (~Line 2179).
- **Filtered Booking Summary PDF**: `buildBookingFilteredSummaryPdf()` (~Line 2644) exports the selected Customer/date ledger records.
- **Broker Payment Summary**: `brokerSummaryPage()` (~Line 4064) renders Payable/Paid broker rows, filters, totals, and per-row status updates.
- **PDF Generation**: `buildBookingInvoicePdf()` (~Line 2407), `buildSummaryRecordPdf()` (~Line 2570), `createRegisterPdf()` (~Line 2349).
- **Sync & Debounce**: `scheduleOperationalSync()` (~Line 817), `syncOperationalStore()` (~Line 1168), `hydrateOperationalStore()` (~Line 1189).
- **Storage Uploads**: `uploadPrivateDataUrl()` (~Line 867) & `getPrivateDocumentUrl()` (~Line 636) to bucket `gtls-private-documents`.

---

## 4. Coding & Change Guidelines

1. **Keep Code Synchronized**: If adding a field to an HTML form, always update the normalizer function and the corresponding Supabase mapper in [`app.js`](file:///h:/Transport_Software-main/app.js).
2. **Preserve ID Formats**: Always use `getNextSequentialId()` for generating readable IDs.
3. **No Build Step Required**: Never install bundlers (webpack, vite, rollup) unless explicitly asked. The app runs directly by opening any `.html` file or via a static web server.
4. **Refer to Documentation**: For comprehensive data structures and database schema, read [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md).
5. **Always Update Documentation on Code Changes**: Whenever you make any modifications (add a field, change calculation math, alter Supabase schema or RLS, add new pages, or update styles), you **MUST update [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md)** (and this file's line index if shifted) and log the change in the **Changelog** section.

## 5. Changelog

- **2026-09-19**: Added an Operations Summary navigation dropdown with separate Booking Summary and read-only Trucker/Broker Summary pages. Broker Summary defaults to Payable, supports Payable/All filters and paid/payable totals, includes filtered and per-row PDF downloads after Broker P&L, and keeps status changes in Booking Form. Operations Summary remains on one sidebar line.
- **2026-09-19**: Added a conditional Booking Ledger Download Summary button beside Date Order. It enables when Customer, Start Date, or End Date is selected and exports S.No, Date, NTN, Customer / Payer, Invoice, Road Haulage Charges, Sales Tax Authority, Total Amount, and Remarks.
- **2026-09-19**: Summary PDF totals now render only on the final page of multi-page downloads instead of repeating on every page. Booking Summary and Trucker/Broker Summary downloads also print the company letterhead.
- **2026-09-19**: Trucker/Broker Summary UI and PDF exports omit Broker Amount; PDF exports also omit Broker P&L while the UI keeps it with the per-row download action.
- **2026-09-19**: Booking Summary customer tables now show Date, Booking No, Invoice No, Road Haulage Charges, Sales Tax Authority, Total Amount, and Receivable Amount.
- **2026-09-19**: Booking Summary customer tables now also show the invoice-style Container summary (for example, `1x40` or combined container sizes).
- **2026-09-19**: Prevented empty background Supabase hydration responses from clearing newly saved Equipment and Fleet Maintenance records from the local register.
- **2026-09-19**: Added `supabase-operational-permissions.sql` to grant authenticated Equipment/Maintenance module users the required RLS access for operational record persistence.
- **2026-09-19**: Added repeatable broker rows, per-row Broker P&L, and separate job Net P&L immediately before Remarks in Booking Ledger. Complete broker rows persist in `bookings.broker_entries` with legacy fallback. Apply `supabase-booking-multi-brokers.sql` before deployment.
- **2026-09-19**: Booking Ledger base view was expanded to 42 aligned columns for withholding selection, per-container Quantity/Unit Price, and the original broker/payment fields. The later multi-broker update extends it to 44 columns; apply `supabase-booking-multi-brokers.sql` for that final layout. Apply `supabase-booking-sales-tax-withholding.sql` before deployment so the selected withholding ratio persists.
- **2026-09-19**: Added LCL/FCL booking categories, broker Paid/Payable status, and Net P&L before Remarks in Booking Ledger. Apply `supabase-booking-broker-status.sql` before deployment. Status does not change the Receivable minus Broker Amount calculation.
- **2026-09-18**: Corrected booking P&L direction per clarification: Receivable Amount minus Broker Amount. Positive indicates profit and negative indicates loss. No schema changes.

- **2026-09-18**: Invoice displays nonzero Detention below Unit Price and adds it once to invoice Road Haulage Charges/Total using the existing sales tax amount. Added finite numeric detention validation and decimal input support; no database change.
- **2026-09-18**: Added booking Trucker/Broker payment fields above Remarks with live P&L = Receivable Amount - Amount. Apply `supabase-booking-broker.sql` before deployment. Optional fields persist through save/load; P&L is derived. Updated responsive styling and search coverage.
- **2026-09-18**: Added General Filter before Customer in the Booking Ledger. Searches record details as the user types, combines with existing filters, and updates totals/counts. No database change.
- **2026-09-18**: Booking invoice now displays summed Quantity and summed Unit Price directly below Category. Container pricing is included in Supabase save/load mappings; apply `supabase-container-pricing.sql` before deployment. Historical missing prices show `-` until re-entered. Updated the function line index below the technical summary.

