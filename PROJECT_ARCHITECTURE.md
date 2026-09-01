# GTLS Transport Software - Project Architecture & Developer Guide

> **Purpose of this document**: This is the single source of truth for the entire **GTLS Transport Software** codebase. It provides full technical, architectural, schema, and workflow specifications so that developers and AI assistants can immediately understand the project, make changes accurately, and avoid scanning hundreds of files or wasting tokens/credits.

---

## 1. High-Level Architecture

GTLS Transport Software is a high-performance, modular enterprise web application built for transport and logistics operations.

```
+-------------------------------------------------------------------------------+
|                                  BROWSER CLIENT                                |
|  +-------------------------------------------------------------------------+  |
|  | Multi-Page HTML Views (dashboard, booking, ledger, truck, equipment...)  |  |
|  +-------------------------------------------------------------------------+  |
|  | CSS Design System (styles.css: Glassmorphism, Theme Variables, Print)   |  |
|  +-------------------------------------------------------------------------+  |
|  | Application Engine (app.js: Router, Reactive Store, UI Controllers)     |  |
|  +-------------------------------------------------------------------------+  |
|  | Client State Storage: sessionStorage (active session data & cache)      |  |
|  +-------------------------------------------------------------------------+  |
+---------------------------------------+---------------------------------------+
                                        |
               REST / Auth / Storage    |    Edge Function Invocation
                                        v
+-------------------------------------------------------------------------------+
|                               SUPABASE BACKEND                                 |
|  +-------------------------------------------------------------------------+  |
|  | Auth Service: JWT Auth (email/password), Session verification           |  |
|  +-------------------------------------------------------------------------+  |
|  | Postgres Database: Relational schema, RLS Policies, Audit trigger       |  |
|  +-------------------------------------------------------------------------+  |
|  | Storage: 'gtls-private-documents' Bucket (Bilty, Docs, Maintenance)     |  |
|  +-------------------------------------------------------------------------+  |
|  | Edge Functions: 'manage-user' (Super Admin CRUD for users/passwords)    |  |
|  +-------------------------------------------------------------------------+  |
+-------------------------------------------------------------------------------+
```

### Core Tech Stack
1. **Frontend**: Multi-Page Application (HTML5, Vanilla JavaScript ES6+, Vanilla CSS with CSS Custom Properties).
2. **Backend / BaaS**: Supabase (PostgreSQL with Row Level Security, Supabase Auth, Supabase Storage, Deno Edge Functions).
3. **Libraries (CDN)**:
   - `@supabase/supabase-js@2` (Database and Storage Client)
   - `jspdf@2.5.1` & `jspdf-autotable@3.8.2` (PDF Invoice & Report Generation)
4. **Offline / Resilience**: `sessionStorage` fallback & optimistic UI caching.

---

## 2. File & Directory Map

| File / Folder | Purpose & Role | Key Data Page / Element |
| :--- | :--- | :--- |
| [`index.html`](file:///h:/Transport_Software-main/index.html) | Main login page for all users & super admins | `data-page="signin"` |
| [`admin-login.html`](file:///h:/Transport_Software-main/admin-login.html) | Legacy / alternative direct admin login | `data-page="admin-login"` |
| [`dashboard.html`](file:///h:/Transport_Software-main/dashboard.html) | Executive dashboard: KPIs, active jobs, alerts, fleet overview | `data-page="dashboard"` |
| [`booking.html`](file:///h:/Transport_Software-main/booking.html) | Booking entry/edit form, multi-container rows, automated taxes, Bilty upload | `data-page="booking"` |
| [`ledger.html`](file:///h:/Transport_Software-main/ledger.html) | Booking Summary (table view, filters, search, container sizes, print summary) | `data-page="ledger"` |
| [`truck.html`](file:///h:/Transport_Software-main/truck.html) | Truck Details trip management (Import & Export trips, freight, expenses, P&L) | `data-page="truck"` |
| [`truck-summary.html`](file:///h:/Transport_Software-main/truck-summary.html) | Pending Truck Summary: In-progress truck jobs list, filtering & register export | `data-page="truck-summary"` |
| [`completed-truck-summary.html`](file:///h:/Transport_Software-main/completed-truck-summary.html) | Completed Truck Summary: Completed trips, financial breakdown & net profit/loss | `data-page="completed-truck-summary"` |
| [`equipment.html`](file:///h:/Transport_Software-main/equipment.html) | Fleet Equipment Management (registration, chassis, engine, provincial permits) | `data-page="equipment"` |
| [`maintenance.html`](file:///h:/Transport_Software-main/maintenance.html) | Fleet Maintenance & Repair logs (parts, old/new serials, warranty, cost) | `data-page="maintenance"` |
| [`employees.html`](file:///h:/Transport_Software-main/employees.html) | Employee Directory (salaries, joining date, status, department, picture) | `data-page="employee"` |
| [`khata.html`](file:///h:/Transport_Software-main/khata.html) | Accounts Receivable Khata (customer statements, debit/credit entries, WhatsApp share) | `data-page="khata"` |
| [`accounts-payable.html`](file:///h:/Transport_Software-main/accounts-payable.html) | Accounts Payable Khata (vendor/carrier accounts, debit/credit tracking) | `data-page="accounts-payable"` |
| [`admin.html`](file:///h:/Transport_Software-main/admin.html) | User Management (Super Admin only: create/edit users, assign module permissions) | `data-page="admin"` |
| [`activity-logs.html`](file:///h:/Transport_Software-main/activity-logs.html) | Comprehensive audit trail of all CREATE, UPDATE, DELETE, LOGIN events | `data-page="activity-logs"` |
| [`app.js`](file:///h:/Transport_Software-main/app.js) | Central JavaScript engine (state, Supabase sync, routers, calculations, UI) | Core App Engine (5,800+ lines) |
| [`styles.css`](file:///h:/Transport_Software-main/styles.css) | Complete responsive styling, dark theme tokens, print stylesheets, modal styles | Core Stylesheet |
| [`supabase-config.js`](file:///h:/Transport_Software-main/supabase-config.js) | Supabase project URL and publishable key configuration | `window.GTLS_SUPABASE_CONFIG` |
| [`supabase-testing-release.sql`](file:///h:/Transport_Software-main/supabase-testing-release.sql) | SQL schema patch: columns, 3-month retention trigger, storage RLS policies | PostgreSQL DDL & RLS |
| [`supabase-permissions-fix.sql`](file:///h:/Transport_Software-main/supabase-permissions-fix.sql) | SQL permissions fix for service_role, public schema, profiles & bookings | PostgreSQL Grants & RLS |
| [`supabase/functions/manage-user/`](file:///h:/Transport_Software-main/supabase/functions/manage-user/index.ts) | Supabase Edge Function to create/update/delete auth users via Admin API | Deno TypeScript Serverless |
| `assets/` | Static media assets: `Invoice.jpg`, `gtls-letterhead.jpeg`, `Sign-in-Background-Image.webp` | Letterheads & Backgrounds |

---

## 3. Storage Keys & Session Management

| Storage Key | Storage Type | Purpose |
| :--- | :--- | :--- |
| `gtls-transport-demo-data-v1` | `sessionStorage` | In-memory store snapshot (bookings, trucks, fleet, khata, employees, logs). |
| `gtls-admin-auth-v1` | `sessionStorage` | Current authenticated session user (`{ id, name, email, role, access }`). |
| `gtls-sidebar-collapsed-v1` | `localStorage` | Boolean flag (`"true"` / `"false"`) for desktop sidebar collapsed state. |
| `gtls-payment-alert-read-v1` | `sessionStorage` | Set of read payment notification alert keys to avoid badge noise. |
| `gtls-supabase-synced-log-ids` | `localStorage` | Set of activity log IDs already synced to Supabase. |
| `gtls-supabase-operational-migrated` | `localStorage` | Flag (`"1"`) indicating initial offline-to-cloud seed migration completed. |

---

## 4. Sequential Readable ID Conventions

The application uses human-readable sequential IDs generated by `getNextSequentialId(items, prefix, field)`:

- **Bookings**: `Job-1`, `Job-2`, `Job-3`...
- **Equipment Fleet**: `EQP-1`, `EQP-2`, `EQP-3`...
- **Maintenance Jobs**: `MNT-1`, `MNT-2`, `MNT-3`...
- **Employees**: `EMP-1`, `EMP-2`, `EMP-3`...
- **Admin Users**: `ADM-1`, `ADM-2`...
- **Ledger Entries**: `LED-1`, `LED-2`...
- **Customer Khata (Receivable)**: `CUS-1`, `CUS-2`... (Entries: `KHT-1`, `KHT-2`...)
- **Vendor Khata (Payable)**: `PAY-1`, `PAY-2`... (Entries: `PAYE-1`, `PAYE-2`...)
- **Truck Expenses / Trips**: `TRIP-1`, `TRIP-2`...
- **Activity Logs**: `LOG-1`, `LOG-2`...

---

## 5. Security, Roles & Access Control

### Roles
1. **Super Admin**: Has unrestricted access to all modules, can create/update/delete Admin accounts and edit module permissions.
2. **Admin**: Restricted to specific modules assigned by Super Admin in the `access_modules` array.

### Available Module Keys
- `dashboard` (Dashboard)
- `booking` (Booking Form)
- `ledger` (Booking Summary)
- `truck` (Truck Details)
- `truck-summary` (Pending Truck Summary)
- `completed-truck-summary` (Completed Truck Summary)
- `equipment` (Equipment & Handling Fleet)
- `maintenance` (Fleet Maintenance)
- `employee` (Employees)
- `khata` (Accounts Receivable)
- `accounts-payable` (Accounts Payable)
- `admin` (Admin Users Management)
- `activity-logs` (Activity Logs)

### Access Enforcement (`enforceSoftwareAccess(page)`)
- Invoked on `DOMContentLoaded` for every page.
- If no active Supabase session exists -> Redirects to `index.html`.
- If user is logged in but on `signin` page -> Redirects to first allowed module.
- If user is non-super-admin and accesses an unauthorized page -> Redirects to their first authorized page.
- In the sidebar, `applySessionAccess()` hides unauthorized navigation links.

---

## 6. Supabase Database Schema & Sync Engine

### Core Tables & Mappings

```
                    +-----------------------+
                    |       profiles        |
                    | id (UUID / PK)        |
                    | name, email, role     |
                    | status, access_modules|
                    +-----------------------+
                                |
    +---------------------------+---------------------------+
    |                           |                           |
    v                           v                           v
+-------------------+   +-------------------+   +--------------------+
|     bookings      |   |    truck_jobs     |   |  equipment_fleet   |
| job_no (PK)       |   | job_no (PK)       |   | truck_no (PK)      |
| booking_no, ntn   |   | import_truck_no   |   | chassis_no         |
| customer, route   |   | mty_box_freight   |   | engine_no          |
| road_haulage_chg  |   | import_freight    |   | fitness_expiry     |
| sales_tax_amount  |   | export_freight    |   | permits (4 provs)  |
| receivable_amount |   | profit_loss       |   | original_docs_path |
| bilty_path        |   | image_path        |   +--------------------+
+-------------------+   +-------------------+
    |
    v (1-to-many)
+-----------------------+
|  booking_containers   |
| id (PK), booking_id   |
| container_no, size    |
| truck_no, sort_order  |
+-----------------------+
```

1. **`profiles`**: User profiles extending `auth.users` (`id`, `name`, `email`, `role`, `status`, `access_modules`).
2. **`bookings`** & **`booking_containers`**: Complete booking records and individual container line items (supports multi-container bookings).
3. **`truck_jobs`**: Detailed trip records including import & export legs, broker commissions, MTY box movements, and net profit/loss.
4. **`equipment_fleet`**: Fleet trucks, engine/chassis numbers, MRA, banker, fitness expiry, provincial permits (Sindh, Punjab, KPK, Balochistan), and document path.
5. **`maintenance_jobs`**: Fleet maintenance logs, complaint/repair dates, part names, old/new serial numbers, warranty, cost, driver, and invoice image.
6. **`employees`**: Staff profiles, designation, department, salary, joining date, status, picture path.
7. **`accounts`** & **`account_entries`**: Unified khata for both `receivable` (Customer) and `payable` (Vendor) ledgers with attached receipts/images.
8. **`activity_logs`**: System audit log (`action`, `module`, `record_id`, `description`, `metadata`, `created_at`).

### Private Storage Bucket (`gtls-private-documents`)
- **RLS Protected**: Access strictly enforced according to module permissions.
- **Folder Structure**:
  - `bookings/{jobNo}/{timestamp}.jpg` (Bilty documents)
  - `trucks/{jobNo}/latest.jpg` (Truck trip documents)
  - `equipment/{truckNo}/{timestamp}.jpg|pdf` (Registration/Permit documents)
  - `maintenance/{maintenanceJobNo}/{timestamp}.jpg` (Maintenance receipts/part images)
  - `employees/{employeeNo}/{timestamp}.jpg` (Employee pictures)
  - `receivable/{accountId}-{entryId}/{timestamp}.jpg` (Customer payment receipts)
  - `payable/{accountId}-{entryId}/{timestamp}.jpg` (Vendor payment receipts)
- **Signed URLs**: Loaded on-demand using `client.storage.from('gtls-private-documents').createSignedUrl(path, 3600)`.
- **Automatic Stale File Cleanup**: `removeStaleBookingBiltyFiles()` deletes previous/obsolete image uploads when a document is updated or replaced.

### Realtime Operational Sync Debounce
- When state mutations occur in `sessionStorage`, `saveStore(store)` calls `scheduleOperationalSync()`.
- Debounced by 250ms with a sequential execution queue (`operationalSyncQueue`).
- Compares previous store vs next store to only sync modified tables (`truckExpenses`, `equipmentFleet`, `maintenanceJobs`, `employees`, `customerKhatas`, `vendorKhatas`, `activityLogs`).

---

## 7. Business Logic & Calculation Engine

### 1. Booking Tax Breakdown (`calculateBookingTaxBreakdown`)
Standard transport taxation rules in Pakistan (SRB, PRA, KPRA, BRA):
- **Base Rate / Road Haulage Charges**: `taxableBase = rate`
- **Provincial Sales Tax (15%)**: If authority is SRB, PRA, KPRA, or BRA:
  $$\text{salesTaxAmount} = \text{round}(\text{taxableBase} \times 0.15)$$
- **Total Amount**:
  $$\text{totalAmount} = \text{taxableBase} + \text{salesTaxAmount}$$
- **Income Tax Withholding (7%)**: If authority is not "Without Income Tax":
  $$\text{incomeTaxAmount} = \text{round}(\text{totalAmount} \times 0.07)$$
- **Sales Tax Withholding Ratio ($W\% \in \{20\%, 100\%, 0\%\}$)**:
  - **Sales Tax Withheld by Customer**:
    $$\text{salesTaxWithheldAmount} = \text{round}\left(\text{salesTaxAmount} \times \frac{W}{100}\right)$$
  - **Sales Tax Paid by Us**:
    $$\text{salesTaxByUsAmount} = \text{round}\left(\text{salesTaxAmount} \times \left(1 - \frac{W}{100}\right)\right)$$
- **Net Receivable Amount**:
  $$\text{receivableAmount} = \text{totalAmount} - \text{incomeTaxAmount} - \text{salesTaxWithheldAmount} + \text{detentionCharges}$$

### 2. Khata Balance Engine (`calculateKhataSummary`)
- **Customer Khata (Accounts Receivable)**:
  - `Debit`: Transport billing / amount owed by customer.
  - `Credit`: Payment received from customer.
  - $\text{Closing Balance} = \text{Total Debit} - \text{Total Credit}$
- **Vendor Khata (Accounts Payable)**:
  - `Debit`: Payable service charge / amount owed to vendor.
  - `Credit`: Amount paid to vendor.
  - $\text{Closing Balance} = \text{Total Debit} - \text{Total Credit}$

### 3. Truck Trip Profit / Loss Engine
- **Grand Total (Revenue)** = $\text{Import Freight} + \text{Export Freight} + \text{MTY Box Freight} - \text{Import Commission} - \text{Export Commission}$
- **Net Profit / Loss** = $\text{Grand Total} - \text{Round Trip Expenses}$

### 4. Payment Overdue Alerts (`bindPaymentNotifications`)
- Checks all bookings with `accountFlow === "Awaited"`.
- Calculates due date based on `paymentTerm` ("Immediate", "15 Days", "30 Days", "60 Days").
- If current date > due date, triggers notification dropdown badge with exact days overdue.
- Tracks read alerts in `sessionStorage` (`gtls-payment-alert-read-v1`).

---

## 8. PDF & Document Generation Engine

Powered by `jspdf` and `jspdf-autotable`, with embedded corporate letterheads:
1. **Sales Tax Invoice PDF** (`buildBookingInvoicePdf` in [`app.js`](file:///h:/Transport_Software-main/app.js)):
   - Generated on official letterhead [`assets/Invoice.jpg`](file:///h:/Transport_Software-main/assets/Invoice.jpg).
   - Features booking particulars, container numbers/sizes breakdown, road haulage charges, 15% sales tax calculation, NTN, and authorized signature.
2. **Customer Summary PDF** (`buildSummaryRecordPdf` in [`app.js`](file:///h:/Transport_Software-main/app.js)):
   - Multi-booking tabular ledger with date, booking no, invoice no, container summary, freight, sales tax, and total.
3. **Trip Register PDF** (`createRegisterPdf` in [`app.js`](file:///h:/Transport_Software-main/app.js)):
   - Landscape export for pending and completed truck trips with attached delivery receipt/bilty thumbnail.
4. **Statement on Letterhead & WhatsApp Share** ([`khata.html`](file:///h:/Transport_Software-main/khata.html) / [`accounts-payable.html`](file:///h:/Transport_Software-main/accounts-payable.html)):
   - Formatted printable statement with corporate header [`assets/gtls-letterhead.jpeg`](file:///h:/Transport_Software-main/assets/gtls-letterhead.jpeg) and instant WhatsApp message generator (`wa.me`).

---

## 9. Developer Change Cookbook (How to Make Changes Safely)

### A. Adding a New Field to Bookings
1. **HTML ([`booking.html`](file:///h:/Transport_Software-main/booking.html))**: Add the input inside `<form data-booking-form class="form-grid">` with appropriate CSS class (`quarter`, `half`, `full`).
2. **Normalizer ([`app.js`](file:///h:/Transport_Software-main/app.js))**: In `normalizeBookingContainers()`, add default handling for the new property.
3. **Supabase Mappers ([`app.js`](file:///h:/Transport_Software-main/app.js))**:
   - Update `mapBookingForSupabase()` to send the field to the DB.
   - Update `mapBookingRowFromSupabase()` to hydrate the field from the DB.
4. **Database Migration**: Run `ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS field_name text;` in Supabase SQL editor.
5. **UI Rendering**: If displaying in summary/tables, update [`ledger.html`](file:///h:/Transport_Software-main/ledger.html) and `ledgerPage()` rendering in [`app.js`](file:///h:/Transport_Software-main/app.js).

### B. Adding a New Navigation Module / Page
1. **New HTML File**: Create `new-module.html` copying the layout shell from [`equipment.html`](file:///h:/Transport_Software-main/equipment.html), set `<body data-page="new-module">`.
2. **Navigation List**: Add `{ value: "new-module", label: "New Module Title" }` to `ACCESS_OPTIONS` in [`app.js`](file:///h:/Transport_Software-main/app.js).
3. **Nav Icon**: Add SVG path for `new-module` in `getNavigationIcon()` in [`app.js`](file:///h:/Transport_Software-main/app.js).
4. **Sidebar Navigation**: Add `<a href="new-module.html" data-page="new-module">New Module</a>` in each HTML file's `<nav class="nav">`.
5. **App Initializer**: Add `if (page === "new-module") newModulePage(store);` inside `document.addEventListener("DOMContentLoaded", ...)` in [`app.js`](file:///h:/Transport_Software-main/app.js).
6. **Access Check**: Update `hasModuleAccessForSync()` and Supabase RLS policies in SQL.

### C. Modifying Tax or Calculation Rules
- Modify `calculateBookingTaxBreakdown(rate, detention, authority)` in [`app.js`](file:///h:/Transport_Software-main/app.js#L1725).
- All screens (Booking Form, Booking Summary, Dashboard KPIs, PDF Invoices) automatically consume this single function.

---

## 10. Audit Logging & Pruning Engine

- All modifications are automatically intercepted via `collectAuditChanges()` during `saveStore()`.
- Captures field-level changes: `action` ("CREATE", "UPDATE", "DELETE", "SIGN_IN", "SIGN_OUT"), `module`, `recordId`, and a description of changed fields.
- **3-Month Retention**:
  - Client-side: `pruneActivityLogs()` automatically drops log entries older than 3 months on store load and save.
  - Server-side: Trigger `activity_logs_retention_trigger` executes `prune_old_activity_logs()` in PostgreSQL on every insert.

---

## 11. Documentation Maintenance Protocol & Changelog

> **MANDATORY RULE FOR ALL DEVELOPERS & AI AGENTS**:
> Whenever ANY change is made to the codebase (e.g. adding form fields, modifying calculation math, updating Supabase schema or RLS, adding new pages, or altering styles), you **MUST** update this file (`PROJECT_ARCHITECTURE.md`) and [`AGENTS.md`](file:///h:/Transport_Software-main/AGENTS.md) to record the change.

### Recent Changes Log

| Date | Changed Component | Description of Change | Impacted Files |
| :--- | :--- | :--- | :--- |
| **2026-09-01** | True Supabase 1:1 Hydration & Local Cache Mirroring | Resolved an issue where manually deleting records directly in the Supabase database left stale records in the browser or caused background migration logic to re-upload deleted records. Updated `hydrateBookingsFromSupabase` and `hydrateOperationalStore` in `app.js` to unconditionally mirror Supabase's live remote records (and clear local store if Supabase is emptied), triggering `window.activePageRender()` to immediately clear tables on hard refresh. | `app.js`, `PROJECT_ARCHITECTURE.md` |
| **2026-08-31** | Clean Client Production State & Blank Form Resets | Prepared the application for live client handover. Purged all hardcoded demo seed records (bookings, ledger entries, trucks, equipment fleet, truck expenses, maintenance jobs, employees, customer khatas, vendor khatas) from `seed` in `app.js` and transitioned the storage key to `gtls-transport-live-data-v1`, ensuring sequential IDs begin from 1 (`Job-1`, `BN-1`, `EQP-1`, `MNT-1`, `EMP-1`). Removed hardcoded demo values from `booking.html`, `truck.html`, and `employees.html`, and updated all `resetForm` handlers so "Clear Form" always resets forms to completely blank/pristine states. Preserved Super Admin auth credentials. | `app.js`, `booking.html`, `truck.html`, `employees.html`, `PROJECT_ARCHITECTURE.md` |
| **2026-08-31** | Sales Tax Withholding Ratio Selector & Dynamic Tax Math | Added a dedicated "Sales Tax Withholding" dropdown in `booking.html` (`20% Withheld (80% by us)` default, `100% Withheld (0% by us)`, `0% Withheld (100% by us)`). Updated `calculateBookingTaxBreakdown` in `app.js` to dynamically compute sales tax withheld by customer and sales tax paid by us based on the selected withholding ratio, while dynamically updating field labels (`Sale Tax With Held X%`, `Sale Tax Y% by us`) and receivable math without affecting existing invoices or bookings. | `booking.html`, `app.js`, `PROJECT_ARCHITECTURE.md` |
| **2026-08-31** | Equipment Fleet Nomenclature & 3-Field Grid Alignment | In `equipment.html` and `app.js`, updated "Truck No" label to "Registration No" and "Make" label to "Maker". Added new "Type of Body" field right after Registration No in both the form and table. Aligned "Original Documents Upload" into the 5th row alongside "Punjab Permit Expiry" and "Tax Paid Up To" so every form row maintains an exact 3-field layout. Integrated `typeOfBody` into search filtering, Supabase sync/hydration mapping, and downloadable Equipment Fleet PDF statements. Removed Delete button to safeguard records. | `equipment.html`, `app.js`, `PROJECT_ARCHITECTURE.md` |
| **2026-08-31** | Fleet Maintenance Updates, Clean PDF Downloads & Employee Image Table | In `maintenance.html` / `app.js`, removed the Delete button to prevent accidental record removal, and removed attached image previews from the downloaded maintenance record PDF. In `employees.html` / `app.js`, added an Image column to the Employee Register table with lazy-loading thumbnails and full preview modal dialog (`data-employee-image-modal`); verified that no Supabase DB schema changes are required since `image_path` was already supported. Formatted joining dates with short alphabetical months (`DD MMM YYYY`). | `employees.html`, `app.js`, `PROJECT_ARCHITECTURE.md` |
| **2026-08-31** | Global Current Date Auto-Selection on Click | Implemented `bindGlobalDateAutoSelect` in `app.js` which automatically populates and synchronizes today's current date whenever an empty date field, calendar icon, or date-input group is clicked or focused anywhere across the entire software (Booking Form, Truck Details, Maintenance, Equipment, Employees, Khata, Accounts Payable, and date filters). Updated `resetForm` in Booking and Truck modules to default to current date. | `app.js`, `PROJECT_ARCHITECTURE.md` |
| **2026-08-31** | Completed Truck Summary UI Alignment & Single-Row Design | Aligned `completed-truck-summary.html` to match the exact single-row layout of Pending Truck Summary, featuring left-aligned Stat Cards (Total Trucks, P&L, Total Work Amount), right-aligned controls (Truck No, Start/End Date, Descend/Ascend Job Order), and a dedicated bottom toolbar with the job count badge and compact pill "Clear Filters" button. No calculation or data logic altered. | `completed-truck-summary.html`, `styles.css`, `PROJECT_ARCHITECTURE.md` |
| **2026-08-31** | Booking Summary LHS Stat Card & Full-Width Proportional Summary Bar | In `ledger.html`, removed "Customer Summary" heading and placed "Total Receivable Amount" stat card on the LHS. In `truck-summary.html` and `styles.css`, updated stat cards and dropdown filters to stretch proportionally (`flex: 1`) across the full container width in a single unified line, eliminating central empty spaces while maintaining comfortable padding. Updated Booking No auto-generation sequence in `app.js` to start with prefix `BN-1`, `BN-2`, etc. | `ledger.html`, `truck-summary.html`, `completed-truck-summary.html`, `styles.css`, `app.js`, `AGENTS.md` |
| **2026-08-31** | Pending Truck Summary Broker Filters & Compact Header | Added Imp Broker, Exp Broker, and MTY Broker dropdown filters next to Truck No in Pending Truck Summary (`truck-summary.html`). Compacted `.ledger-filter`, `.ledger-total`, and `.ledger-filter-control` in `styles.css` for balanced one-line alignment. Updated `truckSummaryPage` and `buildPendingTruckSummaryPdf` in `app.js` to dynamically populate available brokers by truck and isolate broker-specific movements, totals, and downloadable PDF statements. | `truck-summary.html`, `styles.css`, `app.js`, `AGENTS.md` |
| **2026-08-31** | Booking No Auto-Generation | Removed the manual "Booking No" input field from the Booking Form (`booking.html`). Updated `bookingPage` in `app.js` to automatically generate sequential Booking Numbers (`BKG-1`, `BKG-2`, etc. via `getNextSequentialId`) on submit, displaying the generated Booking No in the Booking Summary/Ledger tables without requiring manual input. | `booking.html`, `app.js`, `AGENTS.md` |
| **2026-08-31** | Pending Truck Summary MTY Card & Credit Zeroing | Added a new "Total MTY Receivable" KPI summary card in Pending Truck Summary (`truck-summary.html`). Updated `truckSummaryPage` and `buildPendingTruckSummaryPdf` in `app.js` so that in pending mode, any movement/leg with Payment Status "Credit" (Import, Export, or MTY) contributes PKR 0 to pending receivables, while Awaited legs show their pending amounts. Trips automatically move to Completed Truck Summary only once all three legs are marked "Credit". | `truck-summary.html`, `app.js`, `AGENTS.md` |
| **2026-08-31** | Record Deletion Protection | Removed the Delete action button and corresponding event handling from both the Booking Summary table and the Truck Details ledger table in `app.js` to ensure critical business and operational records cannot be deleted accidentally. | `app.js`, `AGENTS.md` |
| **2026-08-24** | UI Styling, Page Transitions, PJAX Routing & HD Sign-in Background | Horizontally centered Role, Action, and Record columns in Activity Logs. Re-ordered the Booking Ledger table headers and cells to match the exact field-by-field order and nomenclature of the Booking Form. Implemented custom PJAX-based dynamic routing for internal app pages using `fetch`, `history.pushState`, and `DOMParser` to update only the `.main` content area (avoiding sidebar/header unmounting and eliminating blank white flashes). While fetching, immediately renders highly accurate skeleton loaders using the project's actual CSS grid structure, distinct label + input outline placeholders, and real table elements with shimmering column cells, complete with back-forward cache popstate restoration. Replaced the low-quality, blurry login background webp with a newly generated, stunning 8k HD cinematic transportation photo (`Sign-in-Background-Image.jpg`) and centered the "Sign In" brand header text in the login card. | `app.js`, `styles.css`, `booking.html`, `assets/Sign-in-Background-Image.jpg` |
| **2026-08-20** | Global Payment Alerts | Added the payment alerts notification center to all remaining software screens (11 HTML views), bound it globally in `app.js`, and implemented premium interactive styling in `styles.css` (glassmorphism panel backdrop, rotate-on-hover close button, translate-on-hover alerts cards, scale-on-hover badge icons, and SVG-animated empty state). Refined KPI card layouts with left offset margins, styled the Activity Logs table to expand fully with stretched details, and refactored the Truck trip ledger table to use a robust `.remarks-cell` wrapper class which resolves the oversized columns spacing. No database changes required. | `app.js`, `styles.css`, `accounts-payable.html`, `activity-logs.html`, `admin.html`, `completed-truck-summary.html`, `employees.html`, `equipment.html`, `khata.html`, `ledger.html`, `maintenance.html`, `truck-summary.html`, `truck.html` |
| **2026-08-18** | UI Styling & Document Previews | Adjusted Actions and Document columns in Fleet Maintenance/Equipment tables. Added image thumbnails, lazy loading for table attachments, and inline preview modals for Equipment documents and Truck trip attachments. Centered table headers and cell text for visual alignment. | `styles.css`, `app.js`, `equipment.html`, `truck.html` |
| **2026-08-18** | Performance, Storage & Sync | Added sessionStorage signed URL caching, optimized Supabase store hydration (making it non-blocking and running it in the background), and implemented automatic Supabase Storage cleanups for deleted records & cleared images. | `app.js` |
| **2026-08-18** | Authentication / RBAC Security | Refactored Deno edge function `manage-user` to perform Super Admin profiles table direct checks rather than executing RPC `is_super_admin`. | `supabase/functions/manage-user/index.ts` |
| **2026-08-18** | Architecture & Knowledge System | Initialized master architecture docs, AI instructions (`AGENTS.md`, `GEMINI.md`), and developer cookbook to eliminate scanning overhead. | `PROJECT_ARCHITECTURE.md`, `AGENTS.md`, `GEMINI.md` |
| **2026-08-11** | Security & File Uploads | Added private document bucket RLS (`gtls-private-documents`), signed URL fetching, and image compression for Bilty, Fleet & Maintenance documents. | `app.js`, `supabase-testing-release.sql`, `supabase-permissions-fix.sql` |
| **2026-08-05** | Tax Engine & Invoices | Standardized 15% provincial sales tax calculation across SRB, PRA, KPRA, BRA, and automated 7% WHT / 20% SST withholding math. | `app.js`, `booking.html`, `ledger.html` |


