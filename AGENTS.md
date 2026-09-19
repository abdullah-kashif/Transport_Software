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
| **Sign In** | [`index.html`](file:///h:/Transport_Software-main/index.html) | `signin` | `softwareLoginPage()` (~Line 1702) |
| **Dashboard** | [`dashboard.html`](file:///h:/Transport_Software-main/dashboard.html) | `dashboard` | `dashboardPage()` (~Line 2876) |
| **Booking Form** | [`booking.html`](file:///h:/Transport_Software-main/booking.html) | `booking` | `bookingPage()` (~Line 3053) |
| **Booking Summary** | [`ledger.html`](file:///h:/Transport_Software-main/ledger.html) | `ledger` | `ledgerPage()` (~Line 3817) |
| **Truck Details** | [`truck.html`](file:///h:/Transport_Software-main/truck.html) | `truck` | `truckPage()` (~Line 4296) |
| **Pending Truck Summary** | [`truck-summary.html`](file:///h:/Transport_Software-main/truck-summary.html) | `truck-summary` | `truckSummaryPage()` (~Line 4553) |
| **Completed Truck Summary**| [`completed-truck-summary.html`](file:///h:/Transport_Software-main/completed-truck-summary.html) | `completed-truck-summary`| `truckSummaryPage()` (~Line 4553) |
| **Equipment Fleet** | [`equipment.html`](file:///h:/Transport_Software-main/equipment.html) | `equipment` | `equipmentPage()` (~Line 4841) |
| **Fleet Maintenance** | [`maintenance.html`](file:///h:/Transport_Software-main/maintenance.html) | `maintenance` | `maintenancePage()` (~Line 5125) |
| **Employees** | [`employees.html`](file:///h:/Transport_Software-main/employees.html) | `employee` | `employeePage()` (~Line 5452) |
| **Admin Login** | [`admin-login.html`](file:///h:/Transport_Software-main/admin-login.html) | `admin-login` | `adminLoginPage()` (~Line 5678) |
| **Admin Users** | [`admin.html`](file:///h:/Transport_Software-main/admin.html) | `admin` | `adminPage()` (~Line 5708) |
| **Activity Logs** | [`activity-logs.html`](file:///h:/Transport_Software-main/activity-logs.html) | `activity-logs` | `activityLogsPage()` (~Line 5956) |
| **Accounts Receivable** | [`khata.html`](file:///h:/Transport_Software-main/khata.html) | `khata` | `khataPage()` (~Line 6108) |
| **Accounts Payable** | [`accounts-payable.html`](file:///h:/Transport_Software-main/accounts-payable.html)| `accounts-payable`| `khataPage()` (~Line 6108) |

---

## 3. Core Engine Functions in `app.js`

- **Sequential IDs**: `getNextSequentialId(items, prefix, field)` (~Line 143) — produces `Job-1`, `EQP-1`, `MNT-1`, `EMP-1`, `ADM-1`, `KHT-1`, `PAYE-1`, `LOG-1`.
- **State Store**: `loadStore()` (~Line 153) & `saveStore(store, options)` (~Line 353).
- **Audit Logging**: `collectAuditChanges()` (~Line 311), `appendAuditLog()` (~Line 293), `pruneActivityLogs()` (~Line 236).
- **Supabase Session & RBAC**: `getSupabaseSessionUser()` (~Line 447), `signInWithSupabase()` (~Line 478), `enforceSoftwareAccess(page)` (~Line 1731).
- **Tax & Financial Math**: `calculateBookingTaxBreakdown(rate, detention, authority)` (~Line 2060), `calculateKhataSummary(account)` (~Line 2103).
- **PDF Generation**: `buildBookingInvoicePdf()` (~Line 2331), `buildSummaryRecordPdf()` (~Line 2494), `createRegisterPdf()` (~Line 2273).
- **Sync & Debounce**: `scheduleOperationalSync()` (~Line 797), `syncOperationalStore()` (~Line 1148), `hydrateOperationalStore()` (~Line 1169).
- **Storage Uploads**: `uploadPrivateDataUrl()` (~Line 847) & `getPrivateDocumentUrl()` (~Line 616) to bucket `gtls-private-documents`.

---

## 4. Coding & Change Guidelines

1. **Keep Code Synchronized**: If adding a field to an HTML form, always update the normalizer function and the corresponding Supabase mapper in [`app.js`](file:///h:/Transport_Software-main/app.js).
2. **Preserve ID Formats**: Always use `getNextSequentialId()` for generating readable IDs.
3. **No Build Step Required**: Never install bundlers (webpack, vite, rollup) unless explicitly asked. The app runs directly by opening any `.html` file or via a static web server.
4. **Refer to Documentation**: For comprehensive data structures and database schema, read [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md).
5. **Always Update Documentation on Code Changes**: Whenever you make any modifications (add a field, change calculation math, alter Supabase schema or RLS, add new pages, or update styles), you **MUST update [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md)** (and this file's line index if shifted) and log the change in the **Changelog** section.

## 5. Changelog

- **2026-09-19**: Implemented per-container P&L tracking linked via a dynamic `Container Ref` dropdown in each broker row (`booking.html` / `app.js`). Each broker row now includes a dropdown with options "All Containers" (default booking-level cost) or specific containers ("Container X – ContainerNo"), dynamically synchronized with container row additions, removals, and container number edits. When a broker is linked to a container, row-level P&L calculates $(\text{Container Qty} \times \text{Container Unit Price}) - \text{Broker Amount}$; unlinked brokers use $\text{Receivable Amount} - \text{Broker Amount}$. In the Booking Ledger table (expanded to 44 columns), each container row displays its dedicated `Container P&L` (container revenue minus all linked broker expenses), and each broker row displays its `Broker Container Ref` label. Desktop broker grid expanded to 7 columns and ledger min-width increased to 4100px. Added `container_ref text default 'all'` to `booking_brokers` table with migration script `supabase-container-ref.sql`.

- **2026-09-18**: Renamed `Container Qty` column header to `Quantity` in the Booking Ledger table (`booking.html`). Enforced strict mandatory validation across all Booking Form fields: Bilty attachment, all container line fields (`containerNo`, `truckNo`, `quantity`, `unitPrice`), and all broker line fields (`truckerBroker`, `brokerAmount`, `brokerPaymentDetails`, `brokerPaymentDate`), in addition to all standard form fields and Credit payment details. Submitting with any empty field triggers visual red error outlines (`.input-error`), an explicit notice of missing fields, and automatic scrolling to the first invalid field.

- **2026-09-18**: Expanded the Booking Ledger table in `booking.html` to display all 42 fields present in the Booking Form: added Sales Tax Withholding, Container Quantity, Container Unit Price, Trucker / Broker, Broker Amount, Payment / Cheque / IBFT, Broker Payment Date, and Broker P&L columns using `.stacked-cell` rendering for multi-row lines. Updated table min-width to 3800px in `styles.css` for clean horizontal viewing and integrated all container and broker fields into the General Filter search in `app.js`.

- **2026-09-18**: Transformed the Trucker/Broker section in `booking.html` into a dynamic multi-row matrix (`.broker-block`) with "Add Broker Row" and "Remove" buttons, mirroring container rows. Live summary bar aggregates Total Broker Amount and overall Net P&L ($\text{Receivable} - \sum \text{Broker Amounts}$). Added dedicated relational table `booking_brokers` in `supabase-booking-brokers-table.sql` with foreign key cascade, indexes, and module RLS for clean VPS/PostgreSQL deployment. In `app.js`, added relational join and upsert logic with automatic defensive fallbacks for `broker_lines` JSON and legacy flat columns so offline, testing, and existing client data remain 100% intact without breaking. Fully restored on Edit and indexed in General Filter.

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

