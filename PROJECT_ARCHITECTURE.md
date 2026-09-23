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
| [`broker-summary.html`](file:///h:/Transport_Software-main/broker-summary.html) | Trucker/Broker Summary (Paid/Payable broker payments, filters, totals, mark-as-paid action) | `data-page="broker-summary"` |
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
| broker_entries    |   | image_path        |   +--------------------+
| bilty_path        |   |                   |
+-------------------+   +-------------------+
    |                   |
    | (1-to-many)       | (1-to-many)
    v                   v
+-----------------------+  +-----------------------+
|  booking_containers   |  |    booking_brokers    |
| id (PK), booking_id   |  | id (PK), booking_id   |
| container_no, size    |  | trucker_broker        |
| truck_no, sort_order  |  | broker_amount         |
| quantity, unit_price  |  | broker_payment_details|
+-----------------------+  | broker_payment_date   |
                           | container_ref         |
                           | sort_order            |
                           +-----------------------+
```

1. **`profiles`**: User profiles extending `auth.users` (`id`, `name`, `email`, `role`, `status`, `access_modules`).
2. **`bookings`**, **`booking_containers`** & **`booking_brokers`**: Complete booking records, individual container line items (supports multi-container bookings), and individual trucker/broker payment lines (supports multi-broker assignments).
   - Container rows persist `container_no`, `container_size`, `truck_no`, `quantity`, and `unit_price`.
   - Broker rows persist `trucker_broker`, `broker_amount`, `broker_payment_details`, `broker_payment_date`, `container_ref`, and `sort_order`. Apply `supabase-booking-brokers-table.sql` (or `supabase-container-ref.sql`) on Supabase / PostgreSQL VPS before deployment.
   - For backwards compatibility, single-broker columns on `bookings` (`trucker_broker`, `broker_amount`, `broker_payment_details`, `broker_payment_date`), `broker_entries` JSONB, and `broker_lines` JSONB column are automatically maintained so legacy records and offline stores function without data loss.
   - Booking `salesTaxWithholding` persists in nullable `bookings.sales_tax_withholding`; apply `supabase-booking-sales-tax-withholding.sql` before deploying the complete Booking Ledger update. Historical null values normalize to the existing 20% default.
3. **`truck_jobs`**: Detailed trip records including import & export legs, broker commissions, MTY box movements, and net profit/loss.
4. **`equipment_fleet`**: Fleet trucks, type of body, engine/chassis numbers, maker, model, MRA, banker, fitness expiry, provincial permits (Sindh, Punjab, KPK, Balochistan), and document path.
5. **`maintenance_jobs`**: Fleet maintenance logs, complaint/repair dates, part names, old/new serial numbers, warranty, cost, driver, and invoice image.
   - Run `supabase-operational-permissions.sql` as the postgres role before deployment so authenticated users with Equipment or Maintenance module access can read and persist these operational tables through RLS.
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

Booking Form features a dynamic multi-row Trucker/Broker payment matrix (`.broker-block`) immediately above Remarks, mirroring the UX of container rows. Users can add multiple broker rows via "Add Broker Row". Each row includes: `truckerBroker`, `containerRef` (dropdown dynamically populated with container options: "All Containers" or specific "Container X – ContainerNo"), `brokerAmount`, `brokerPaymentDetails` (Payment/Cheque/IBFT reference), `brokerPaymentDate`, `paymentStatus` ("Payable" / "Paid"), read-only row-level `brokerProfitLoss`, and a `Remove` button. When linked to a specific container, the row-level P&L calculates $(\text{Container Qty} \times \text{Container Unit Price}) - \text{Broker Amount}$; when set to "All Containers", P&L calculates $\text{Receivable Amount} - \text{Broker Amount}$. An integrated summary bar dynamically aggregates `Total Broker Amount` ($\sum \text{Broker Amounts}$) and overall `Net P&L` ($\text{Receivable Amount} - \text{Total Broker Amount}$). In the Booking Ledger table (44 columns), each container line item displays its dedicated `Container P&L` (revenue minus all linked broker costs), and each broker row displays its `Broker Container Ref` label. Rows are normalized into `booking.brokerEntries` / `booking.brokerLines` with primary fields mirrored to top-level properties for 100% backwards compatibility. Apply `supabase-container-ref.sql` or `supabase-booking-brokers-table.sql` on Supabase / PostgreSQL VPS before deployment.

Operations Summary is the navigation umbrella for the complete Booking Summary and the separate Trucker/Broker Summary page. Trucker/Broker Summary defaults to Payable rows, supports Payable/All status filters, customer/date/general search filters, Paid and Payable totals, and a Download Summary action. Its report table contains Booking No, Booking Date, Trucker/Broker, Container Ref, Payment/Cheque/IBFT, Payment Date, and Broker P&L, followed by the Action column with a per-row Download button. Broker Summary PDFs contain Booking No, Booking Date, Trucker/Broker, Container Ref, Payment/Cheque/IBFT, and Payment Date only; Broker Amount and Broker P&L are omitted from exports. It is a read-only report; broker status changes continue to be maintained from the Booking Form. Paid rows remain available through All and in the totals, while the complete Booking Summary remains unchanged.

The Booking Form's Booking Ledger exposes every saved form field in a 44-column row. Container No, Size, Truck No, Quantity, and Unit Price retain one-to-one stacked row alignment. For historical remote rows without container pricing, Quantity falls back to the saved aggregate and Unit Price displays `-` rather than inventing a value. Repeatable broker values display as aligned stacks. Broker P&L shows one calculated value per broker row, followed by a separate Net P&L column and then Remarks. The selected sales-tax withholding ratio, customer payment fields, broker payment fields, Bilty, Broker P&L, and Net P&L are included in General Filter search.

The Booking Ledger also has a Download Summary button beside Date Order. It remains disabled until a Customer, Start Date, or End Date filter is selected. The filtered PDF contains only S.No, Date, NTN, Customer / Payer, Invoice, Road Haulage Charges, 15% Sales Tax, Total Amount, and Remarks.

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
   - Directly below Category, displays Quantity (sum of all container quantities) and Unit Price (sum of all container unit prices, not a weighted average or total freight). Uses the existing numeric formatting with up to two decimal places. Charges continue to use the sum of quantity times unit price. For remote historical records without complete per-container pricing, Quantity uses the saved booking quantity and Unit Price displays `-` until the rows are updated.
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

P&L example: a Receivable Amount of 257.90 with two broker rows of 100 each gives each row a Broker P&L of 157.90 and the job a Net P&L of 57.90 (`257.90 - 200`).

### Recent Changes Log

| **2026-09-23** | Non-Destructive Operational Sync | Operational `syncRows` upserts Truck, Equipment, Maintenance, and Employee records without deleting remote rows that are absent from a local snapshot. This protects Supabase data during startup hydration, RLS delays, or concurrent client sessions. | `app.js`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |

| **2026-09-23** | Operational Save Confirmation | Truck Details, Equipment & Handling Fleet, Fleet Maintenance, and Employees now wait for their Supabase sync before showing a successful save. Local session storage remains a fallback, and sync failures are shown as explicit local-only warnings. | `app.js`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |

| **2026-09-23** | Equipment Ownership & Third Party Insurance | Added `Ownership` and `Third Party Insurance Date` after Maker in the Equipment & Handling Fleet form, register table, PDF export, local hydration, and Supabase sync. Added the repeatable migration `supabase-equipment-ownership-insurance.sql`. | `equipment.html`, `app.js`, `MASTER_SUPABASE_SETUP.sql`, `supabase-equipment-ownership-insurance.sql`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |

| **2026-09-23** | Complete Equipment Expiry Alerts | Equipment & Handling Fleet expiry tracking now covers Fitness, Balochistan, Sindh, KPK, Punjab, and Tax Paid Up To dates. Dashboard and Equipment counters include tax dates, and the global notification bell shows expired or next-30-day equipment alerts alongside payment alerts with direct links back to Equipment. | `app.js`, `dashboard.html`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |

| **2026-09-23** | Payment Term Notifications Across Modules | Payment expiry notifications now evaluate Booking Form `paymentTerm` plus Truck Details Import `importPaymentTerm` and Export `exportPaymentTerm`. Alerts use each module's payment date basis and payment status, and link to the relevant module. | `app.js`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |

| **2026-09-23** | Pending Truck Summary Download Availability | Enabled the Pending Truck Summary Download PDF button for every filter state, including All Trucks and empty results; empty filtered results export a valid zero-row summary PDF. | `truck-summary.html`, `app.js`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |

| **2026-09-22** | Booking Form Optional Dates, Trucker/Broker Summary Status & PDF Upgrades, Responsive Box Styling, Detention/Other Charges | (1) Made `Payment Received Date` and `Cheque Number` optional in the main Booking Form (`booking.html` / `app.js`), removing strict required validation and red error outlines. (2) Added `Paid` filter option to Status dropdown in Trucker/Broker Summary (`broker-summary.html` / `app.js`) to filter exclusively for paid brokers alongside `Payable` and `All`. (3) Replaced `Broker P&L` column with `Amount` in the on-page Trucker/Broker Summary table. (4) Scoped `Total Paid` and `Total Payable` KPI cards to the selected Customer in Trucker/Broker Summary. (5) Refactored Trucker/Broker Summary PDF download (`buildBrokerSummaryPdf`): moved Trucker/Broker name to document title header area (`TRUCKER / BROKER: [NAME]`), removed `Payment/Cheque/IBFT`, `Payment Date`, and `Trucker/Broker` from table columns, and formatted PDF table to display `Booking No`, `Booking Date`, `Truck No`, `Container Size`, `Amount`, `Route`, and `Container Ref` with a total Amount row on the final page. (6) Fixed responsive box styling in `styles.css`: configured `.booking-ledger-toolbar` to wrap fluidly preventing stat cards and `Download Summary` from overflowing on laptops, adjusted broker table min-widths to 980px, optimized column ratios, and enforced `white-space: nowrap` on `PAYMENT STATUS` so all 10 columns fit seamlessly. (7) Renamed `Detention` field and column to `Detention/Other Charges` across the main Booking Form (`booking.html` label), Booking Ledger table header, Sales Tax Invoice PDF (`buildBookingInvoicePdf`), and form validation error messaging, and made it completely optional in form submission (defaults to 0 if left blank), preserving backward-compatible data persistence in `bookings.detention`. | `booking.html`, `broker-summary.html`, `app.js`, `styles.css`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |

| **2026-09-19** | Equipment & Maintenance Save Persistence | Preserved local Equipment and Fleet Maintenance records when background Supabase hydration returns an empty remote result during sync, preventing a successful save from disappearing from the register. | `app.js`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |

| **2026-09-22** | Truck Details Symmetrical Export Fields & Auto-Registration Sync | Implemented 1-to-1 field parity between Import Details and Export Details in `truck.html` and `app.js`. Renamed Import Date to `Import Load Date` matching `Export Load Date` in both form and table headers. Added the missing 6 Export fields (`exportCustomer`, `exportCargoDescription`, `exportMtyBoxFreight`, `exportMtyBroker`, `exportMtyPaymentDate`, `exportMtyPaymentStatus`) in identical matching order. Implemented auto-population of `Export Truck Registration No` whenever `Import Truck Registration No` is entered (with manual override preservation). Updated `calculateTruckTripFinancials`, `calculateTrip`, and `numberFields` to integrate `exportMtyBoxFreight` ($\text{Grand Total} = \text{Import Receivable} + \text{Export Receivable} + \text{Import MTY} + \text{Export MTY}$). Updated Supabase sync (`syncTruckJobs`) to persist all 6 new fields into `public.truck_jobs` with automated defensive fallback on schema cache missing columns, updated `hydrateOperationalStore` with local fallbacks, and expanded `truck.html` table header and body rendering to 47 symmetrical columns. Enforced 100% backward compatibility for all historical records in `fillForm` with safe fallbacks. Provided SQL migration `supabase-truck-jobs-export-fields.sql` and updated `MASTER_SUPABASE_SETUP.sql`. | `truck.html`, `app.js`, `MASTER_SUPABASE_SETUP.sql`, `supabase-truck-jobs-export-fields.sql`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-22** | Brand Favicon Across All Pages | Created custom vector and bitmap brand favicons (`favicon.svg` and `favicon.ico`) depicting a stylized commercial freight truck and shipping container in GTLS navy (`#18304d`) and warm copper (`#c56b2d`). Replaced the browser's default blank globe icon across all 16 HTML application pages for a polished, professional brand identity in browser tabs. | `favicon.svg`, `favicon.ico`, all `.html` pages, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-22** | Booking Form Optional vs Mandatory Fields & Indicators | Enforced strict mandatory validation for `Payment Received Date *` and `Cheque Number *` in the main Booking Form (`booking.html` / `app.js`). In Trucker/Broker rows, strictly kept `Amount`, `Payment/Cheque/IBFT`, and `Payment Date` (along with `Bilty`) as optional inputs, while `Trucker/Broker *` name, `Payment Received Date *`, and `Cheque Number *` are mandatory with `.required-star` indicators and automated validation focus. | `booking.html`, `app.js`, `styles.css`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-22** | Booking Ledger Unified Single-Row Toolbar & Invoice Order Sorting | (1) Unified all Booking Ledger controls into a single row (`.booking-ledger-toolbar`) under `<h3>Booking Ledger</h3>`: Left side houses `General Filter`, `Customer`, `Start Date`, `End Date`, and `Date Order`; Right side houses `Total Amount`, `Total P&L`, record count badge (`0 record(s)`), and `Download Summary`. (2) Upgraded `Date Order` dropdown to sort bookings by Invoice number (natural numeric sort) with `Ascend` set as default across all customers or specific customer filter, and switchable to `Descend`. | `booking.html`, `app.js`, `styles.css`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-22** | Booking Ledger Download Summary Button Repositioning | Moved `Download Summary` button to the end of the filter and summary toolbar in `booking.html`, placed immediately after `ledger-count` (`0 record(s)`). Enhanced `.booking-summary-download` in `styles.css` with aligned `38px` height and flex centering for seamless vertical alignment with the stat cards. | `booking.html`, `styles.css`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-22** | Invoice Unit Price Multi-Container Handling | Updated `buildBookingInvoicePdf` in `app.js` so that `Unit Price` is no longer summed across container rows when multiple containers are added. The invoice now displays the actual per-unit container price directly while preserving cumulative `Quantity` summation, correctly maintaining the equation $\text{Road Haulage Charges} = \text{Total Quantity} \times \text{Unit Price}$. | `app.js`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-22** | Booking Sync Defensive Retry for Schema Cache | Resolved Supabase sync error (`Could not find the 'sales_tax_withholding' column of 'bookings' in the schema cache`). Added dynamic multi-attempt retry loop to `saveBookingToSupabase` in `app.js` that catches missing schema cache columns (including `sales_tax_withholding`, `broker_entries`, and `broker_lines`) and retries the upsert without them, ensuring booking saves and updates succeed immediately. Added column migration to `MASTER_SUPABASE_SETUP.sql`. | `app.js`, `MASTER_SUPABASE_SETUP.sql`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-22** | Fleet Maintenance Filter & Equipment/Maintenance Save Persistence | (1) Populated Fleet Maintenance History filter dropdown (`[data-maintenance-truck-filter]`) exclusively with trucks containing actual records in `maintenanceJobs` (`getTrucksWithMaintenance()`), while the create form datalist continues suggesting all fleet trucks. (2) Resolved transient disappearance of records on save in Fleet Maintenance and Equipment: implemented non-destructive key-based merging in `hydrateOperationalStore` (`truckExpenses`, `equipmentFleet`, `maintenanceJobs`, `employees`) preserving local unsynced records and assets during background hydration. (3) Form submit and reset handlers automatically clear active filters (`truckFilter` in maintenance, `search` in equipment) so all entries immediately render upon save. | `app.js`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-22** | Booking Summary P&L Removal & BL No Column Addition | Removed `Total P&L` card from screen head and removed `P&L` column from customer summary tables and footers on `ledger.html` and `app.js` (`ledgerPage`). Added `BL No` column immediately after `Booking No` in both the on-page customer cards table and in the customer summary PDF download (`buildSummaryRecordPdf`), removing internal P&L from customer-facing statements and ensuring complete shipping reference visibility. | `ledger.html`, `app.js`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-22** | Trucker/Broker Filter & Container No Alignment | Replaced `Customer` filter with `Trucker/Broker` in `broker-summary.html` and `app.js` (`data-broker-summary-broker`), dynamically populating all unique Trucker/Brokers and scoping `Total Paid` and `Total Payable` KPIs to the selected Trucker/Broker. Renamed `Container Ref` to `Container No` across the table header and summary PDF export (`buildBrokerSummaryPdf`), using `getBrokerRowContainerNo` to resolve the container number, and repositioned `Container No` immediately after `Truck No` in the PDF export. | `broker-summary.html`, `app.js`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-22** | Defensive File Input Value Setter Shim & Form Autocomplete | Resolved third-party browser extension error (`Uncaught (in promise) jquery.js:2 InvalidStateError: Failed to set the 'value' property on 'HTMLInputElement'`) by adding an `HTMLInputElement.prototype.value` setter shim in `app.js` that intercepts and silently suppresses non-empty string assignments on `type="file"` inputs while allowing standard empty resets. Added `autocomplete="off"` to forms and file inputs across `equipment.html` and `maintenance.html` to prevent rogue autofill extensions and scrapers from attempting programmatic population. | `app.js`, `equipment.html`, `maintenance.html`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-22** | Equipment & Handling Fleet Database Persistence & Schema Sync | Resolved `HTTP 400 Bad Request` on `equipment_fleet` upsert by adding defensive fallback in `syncEquipment` in `app.js` to strip `type_of_body` and retry if the column is absent from the Supabase schema cache. Added `alter table public.equipment_fleet add column if not exists type_of_body text;` to `MASTER_SUPABASE_SETUP.sql` and created standalone migration `supabase-equipment-type-of-body.sql`. Confirmed Fleet Maintenance (`maintenance_jobs`) is saving 100% cleanly to Supabase PostgreSQL database (`Status 201 Created`). | `app.js`, `MASTER_SUPABASE_SETUP.sql`, `supabase-equipment-type-of-body.sql`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-22** | Permissions & Table Grants for Bookings, Containers & Brokers | Resolved Supabase sync permission error (`permission denied for table bookings`) by preparing SQL permissions script `supabase-booking-permissions-fix.sql` granting schema and table-level `ALL` privileges on `public.bookings`, `public.booking_containers`, `public.booking_brokers`, and sequences to `authenticated`, `anon`, and `service_role`, establishing clean RLS policies and storage object grants. Integrated table grants directly into `MASTER_SUPABASE_SETUP.sql`. | `supabase-booking-permissions-fix.sql`, `MASTER_SUPABASE_SETUP.sql`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-22** | Optional Payment Dates & Detention/Other Charges Rename | Made `Payment Received Date`, `Cheque Number`, and `Detention/Other Charges` completely optional in the main Booking Form (`booking.html` / `app.js`). Renamed `Detention` to `Detention/Other Charges` across form, ledger, invoice PDF, and validation messaging while maintaining backend `bookings.detention` compatibility. | `booking.html`, `app.js`, `styles.css`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-22** | Trucker/Broker Summary Status, Amount Column & PDF Redesign | Added `Paid` filter option to Trucker/Broker Summary (`broker-summary.html`). Replaced `Broker P&L` column with `Amount` in table. Scoped `Total Paid` and `Total Payable` KPIs to selected Customer. Refactored summary PDF to display trucker/broker name in title and output `Booking No`, `Booking Date`, `Truck No`, `Container Size`, `Amount`, `Route`, `Container Ref` with totals on last page. Fixed toolbar and broker row responsive box styling. | `broker-summary.html`, `app.js`, `styles.css`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-22** | Container Size LCL, Broker Row Dropdowns, P&L Stats & Schema Fix | Added `LCL` option to Container Size dropdown in Booking Form. Added dynamic `Truck No` and `Container Size` dropdowns to each Trucker/Broker row in `.broker-block` with automatic pre-selection of truck and size when a specific container reference is selected, and updated broker grid to 10 columns (min-width 1280px). Renamed `Broker P&L` column header to `P&L` in Booking Ledger table (`booking.html`) and broker form header. Added `Total P&L` to the summary bar in Booking Ledger (`booking.html`) and included `P&L` column in the filtered summary PDF export. In `ledger.html` (Booking Summary customer cards), added `P&L` column to the table, customer `Total P&L` to card footer, and grand total `Total P&L` to screen header. Resolved Supabase sync error (`Could not find the 'broker_entries' column of 'bookings' in the schema cache`) with defensive fallback in `saveBookingToSupabase` stripping `broker_entries`/`broker_lines` on retry, added `truck_no` and `container_size` to relational `booking_brokers` saves with defensive fallback, updated `MASTER_SUPABASE_SETUP.sql`, and provided migration script `supabase-booking-brokers-truck-size.sql`. | `app.js`, `booking.html`, `ledger.html`, `styles.css`, `MASTER_SUPABASE_SETUP.sql`, `supabase-booking-brokers-truck-size.sql`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-21** | Container Unit Price Auto-Derivation & DB Schema Fallback | Automatically derived container `unitPrice` from `road_haulage_charges / totalQuantity` when editing or loading bookings where container unit pricing was unpopulated or zero in the database. Container rows now populate with their exact proportional unit price upon edit instead of displaying 0 or blank, preventing form validation rejection and preserving Road Haulage Charges and tax calculations. Newly added container rows auto-suggest any shared existing unit price. Added defensive save fallback in `saveBookingToSupabase` for `booking_containers` if DB columns are missing, and updated `MASTER_SUPABASE_SETUP.sql` with `quantity` and `unit_price` columns. | `app.js`, `MASTER_SUPABASE_SETUP.sql`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-20** | Booking Summary 15% Sales Tax Column | Replaced `Sales Tax Authority` with `15% Sales Tax` in the Booking Summary customer boxes table on `ledger.html` and in the filtered Booking Summary PDF download (`buildBookingFilteredSummaryPdf`). Both now display the calculated 15% sales tax amount rather than the tax authority name. | `app.js`, `ledger.html`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-19** | Booking Summary Dropdown & Trucker/Broker Summary | Added a Booking Summary navigation dropdown with separate Booking Summary and read-only Trucker/Broker Summary pages. The broker page defaults to Payable payments, supports status/customer/date/general filters, and displays paid/payable totals while preserving the existing complete booking record. | `broker-summary.html`, `app.js`, `styles.css`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-19** | Broker Summary Download & Fields | Removed the separate Paid status option from the Trucker/Broker Summary filter and added a Download Summary action that exports the currently filtered broker rows to PDF. The UI table omits Broker Amount while retaining Broker P&L and per-row actions; exported PDFs omit both Broker Amount and Broker P&L. | `broker-summary.html`, `app.js`, `styles.css`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-19** | Broker Row Download & Navigation Layout | Added a Download action after Broker P&L for each broker row and kept Operations Summary on one line in the sidebar. | `broker-summary.html`, `app.js`, `styles.css`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-19** | Conditional Booking Ledger Download | Added a Download Summary button beside Date Order that enables only when Customer or a date range is selected and exports the requested nine booking summary fields. | `booking.html`, `app.js`, `styles.css`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-19** | Summary PDF Letterhead & Last-Page Totals | Configured all summary PDF tables with totals to render their footer only on the final page, preventing repeated totals on every page of multi-page downloads. Added the existing company letterhead to the Booking Summary and Trucker/Broker Summary downloads. | `app.js`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-19** | Per-Container P&L & Broker-to-Container Linking | Implemented container-level P&L tracking linked via a dynamic `Container Ref` dropdown in each broker row (`booking.html` / `app.js`). Each broker row now includes a dropdown with options "All Containers" (default booking-level cost) or specific containers ("Container X – ContainerNo"), dynamically synchronized with container row additions, removals, and number edits. When a broker is linked to a container, row-level P&L calculates $(\text{Container Qty} \times \text{Container Unit Price}) - \text{Broker Amount}$; unlinked brokers use $\text{Receivable Amount} - \text{Broker Amount}$. In the Booking Ledger table (expanded to 44 columns), each container row displays its dedicated `Container P&L` (container revenue minus all linked broker expenses), and each broker row displays its `Broker Container Ref` label. Desktop broker grid expanded to 7 columns and ledger min-width increased to 4100px. Added `container_ref text default 'all'` to `booking_brokers` table with migration script `supabase-container-ref.sql`. | `app.js`, `booking.html`, `styles.css`, `supabase-container-ref.sql`, `supabase-booking-brokers-table.sql`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-18** | Booking Ledger Quantity Header & All-Fields Mandatory Enforcement | Renamed `Container Qty` column header to `Quantity` in the Booking Ledger table (`booking.html`). Enforced strict mandatory validation across all Booking Form fields: Bilty attachment, all container line fields (`containerNo`, `truckNo`, `quantity`, `unitPrice`), and all broker line fields (`truckerBroker`, `brokerAmount`, `brokerPaymentDetails`, `brokerPaymentDate`), in addition to all standard form fields and Credit payment details. Submitting with any empty field triggers visual red error outlines (`.input-error`), an explicit notice of missing fields, and automatic scrolling to the first invalid field. | `booking.html`, `app.js`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-18** | Comprehensive Booking Ledger 1-to-1 Form Alignment | Expanded the Booking Ledger table in `booking.html` to display all 42 fields present in the Booking Form: added Sales Tax Withholding, Container Quantity, Container Unit Price, Trucker / Broker, Broker Amount, Payment / Cheque / IBFT, Broker Payment Date, and Broker P&L columns using `.stacked-cell` rendering for multi-row lines. Updated table min-width to 3800px in `styles.css` for clean horizontal viewing and integrated all container and broker fields into the General Filter search in `app.js`. | `booking.html`, `app.js`, `styles.css`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-18** | Relational `booking_brokers` Table & Dynamic Matrix | Transformed the single-row Trucker/Broker section in `booking.html` into a dynamic, multi-row matrix (`.broker-block`) with an "Add Broker Row" button, mirroring the UX and responsiveness of container rows. Implemented the dedicated relational table `public.booking_brokers` in `supabase-booking-brokers-table.sql` with foreign key cascade, indexes, and module RLS for clean VPS/PostgreSQL deployment. In `app.js`, added relational join and upsert logic with automatic defensive fallbacks for `broker_lines` JSON and legacy flat columns so offline, testing, and existing client data remain 100% intact without breaking. Live summary bar aggregates Total Broker Amount and overall Net P&L. | `booking.html`, `styles.css`, `app.js`, `supabase-booking-brokers-table.sql`, `supabase-booking-broker-lines.sql`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-18** | Corrected Booking P&L Direction | Per clarified business rule, P&L is Receivable Amount minus Broker Amount. The form, normalized save/load values, placeholder and documentation use this direction; no database migration needed. | `app.js`, `booking.html`, `supabase-booking-broker.sql` (comment only), `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-18** | Invoice Detention Display & Charges | Invoice hides Detention when its rounded currency amount is zero; otherwise displays it immediately below Unit Price. Invoice Road Haulage Charges = booking rate + detention, and invoice Total = these charges + existing sales tax. Detention is included once; existing tax base, stored booking rate and receivable/P&L rules remain unchanged. Detention accepts finite numeric values including decimals; invalid values are blocked at form submission and PDF generation. No database changes. | `app.js`, `booking.html`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-18** | Booking Trucker/Broker Payment Fields | Added Trucker/Broker, Amount, Payment/Cheque/IBFT, Payment Date and calculated P&L above Remarks. P&L follows Receivable Amount minus Amount and updates live; fields persist through Supabase mapping and edit/reset flows. Added nullable-column migration `supabase-booking-broker.sql`, optional amount validation, responsive layout, and general-search coverage. | `booking.html`, `app.js`, `styles.css`, `supabase-booking-broker.sql`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-18** | Booking Ledger General Filter | Added a General Filter search field immediately before Customer in the Booking Form ledger. Case-insensitive search matches booking/invoice IDs, parties, routes, dates, amounts, container/truck details, status, and remarks; multiple search words must all match. Combines with customer/date filters and updates the displayed count and total. Uses existing responsive filter styles; no database change. | `booking.html`, `app.js`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-18** | Invoice Quantity & Unit Price Totals | Added Quantity and Unit Price below Category in the booking invoice PDF, separately summing all container rows. Updated Supabase container save/load mappings and added an idempotent SQL migration for nullable quantity/unit-price columns. Historical unavailable prices display `-`. Apply `supabase-container-pricing.sql` before deploying the updated app. Refreshed AGENTS.md function line references. | `app.js`, `supabase-container-pricing.sql`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-16** | 5-Field Container Rows & Auto-Calculated Road Haulage Charges | Removed the standalone `Quantity` field from the main Booking Form (`booking.html`). Expanded container rows into a unified 5-field layout: `Container No`, `Container Size`, `Truck No`, `Quantity`, `Unit Price` + `Action` (`styles.css` / `app.js`). Implemented automatic calculation where each row's `Quantity` multiplies with its `Unit Price`, and the cumulative sum of all container rows automatically updates `Road Haulage Charges` (`rate`) in real-time, dynamically cascading into all tax, total, and receivable calculations. Preserved total quantity aggregation and backward compatibility. | `booking.html`, `styles.css`, `app.js`, `PROJECT_ARCHITECTURE.md` |
| **2026-09-16** | Mandatory Booking Fields Validation & Multi-Field Error Indicators | Enforced strict mandatory validation across all Create / Update Booking form fields (`booking.html` / `app.js`). If any required field (Invoice, Date, BL No, NTN, Customer, Consignee, Route, Origin, Destination, Category, Goods Type, Quantity, Road Haulage Charges > 0, Sales Tax Authority, Withholding, Detention, Payment Term, Status, Payment Status, Container lines, Remarks, and Payment Date/Cheque if Credit) is empty or invalid, form submission is blocked. All missing fields are simultaneously highlighted with red error borders/rings (`.input-error`), an explicit notice lists missing fields, and the first invalid field receives focus. Typing or selecting a value dynamically clears the error state on that field in real-time. | `booking.html`, `app.js`, `PROJECT_ARCHITECTURE.md` |
| **2026-09-16** | Viewport-Locked Horizontal Table Scrolling & Sticky Headers | Locked horizontal scrollbar in visible viewport for Booking Ledger (`body[data-page="booking"] .table-wrap`), Truck Details (`truck.html`), Truck Summaries, and Booking Summary boxes (`ledger.html`). Set `max-height: 72vh` with `overflow: auto` and sticky headers (`thead th { position: sticky; top: 0; z-index: 5 }`), ensuring horizontal scrollbars are immediately visible and operable on screen even when viewing the very first record of long tables, eliminating the need to scroll vertically down through hundreds of rows to scroll sideways. Added custom styled scrollbars for high visibility and easy grabbing. | `styles.css`, `PROJECT_ARCHITECTURE.md` |
| **2026-09-16** | Booking Form Invoice Number Uniqueness Enforcement | Enforced strict uniqueness validation for the Invoice Number (`invoiceNo`) field in Booking Form (`booking.html` / `app.js`). When a user submits or blurs the form, the system verifies that the invoice number does not already exist in any other booking (case-insensitive check, excluding the record currently being edited). If a duplicate is detected, form submission is blocked, the field is focused with an error ring (`.input-error` in `styles.css`), and an explicit alert specifies which existing booking already holds that invoice number. | `app.js`, `styles.css`, `PROJECT_ARCHITECTURE.md` |
| **2026-09-16** | Dashboard Total Work Amount KPI Card & Symmetrical 6-Column Grid | Added a dedicated "Total Work Amount" KPI card (`data-kpi="bookingTotalWorkAmount"`) to the Booking Form module on Dashboard (`dashboard.html`), calculating the gross billing volume across all bookings (`getBookingTotalWorkAmount`). Expanded `.booking-kpi-grid` in `styles.css` from 5 to 6 columns on desktop, creating a symmetrical layout matching the Truck Summary KPI grid. Updated `dashboardPage` and skeleton shimmer placeholders in `app.js`. | `dashboard.html`, `app.js`, `styles.css`, `PROJECT_ARCHITECTURE.md` |
| **2026-09-15** | Booking Summary Box-Wise Customer Grouping & Subtotal Ledgers | Redesigned Booking Summary (`ledger.html` / `app.js` / `styles.css`) into a box-wise layout where each customer has their own dedicated visual container card (`.customer-summary-box`) featuring the customer name, booking count badge, and a single "Download PDF" button in the header (generating the consolidated customer summary PDF). Inside each customer box, individual bookings are rendered line-by-line (Date, Booking No, Invoice No, Container, Road Haulage Charges, Sales Tax Authority, Total Amount, Receivable Amount) with 1-to-1 accuracy, followed by a highlighted footer row (`tfoot`) displaying the exact customer subtotal (`Total Receivable: PKR X,XXX,XXX`). Preserves all financial math, date sorting, and customer filter selection. | `app.js`, `ledger.html`, `styles.css`, `PROJECT_ARCHITECTURE.md`, `AGENTS.md` |
| **2026-09-04** | Accounts Receivable & Payable Unified Single Section & Compact Cards | Combined the "Add Customer" / "Add Payee", "Customer Statement" / "Payee Statement" (`.statement-shell`), and "Add Receivable Entry" / "Add Payable Entry" forms into a single unified screen container (`.unified-statement-screen`) separated by sleek, gradient divider lines (`.khata-section-divider`). Made statement metric cards (`.statement-stat`) and info chips (`.khata-mini`) smaller and more compact on both desktop (15px font, 6px padding) and mobile (compact 3-column row with 5px padding and 12px font, eliminating the previous full-width vertical stack). Maintained full compatibility with all event listeners, calculations, and smooth-scrolling behaviors. | `styles.css`, `khata.html`, `accounts-payable.html`, `PROJECT_ARCHITECTURE.md` |
| **2026-09-03** | Mobile Statement Register Responsive Cards, Overview Isolation, Share Cancellation & Desktop Actions Alignment | (1) Restored Customer Account Overview (`account-overview-table`) mobile styles 100% to original compact layout with strict isolation. (2) Fixed Web Share API cancellation behavior in `shareStatementOnWhatsapp` in `app.js` to avoid automatic WhatsApp redirect upon dismiss. (3) Formatted Customer Account Overview on desktop: centered the "Actions" table header and aligned Download (right-aligned in col 3) and Share (left-aligned in col 4) closely side-by-side with an 8px gap, eliminating the excessive empty space between the action buttons. | `styles.css`, `app.js`, `khata.html`, `accounts-payable.html`, `PROJECT_ARCHITECTURE.md` |
| **2026-09-02** | Accounts Receivable & Payable Entry Sync & Continuous Multi-Entry Fix | Fixed an issue where submitting multiple entries in Accounts Receivable (`khata.html`) or Accounts Payable (`accounts-payable.html`) stopped saving after background Supabase hydration. The root cause was that remote Supabase account IDs diverged from local `CUS-1` IDs, causing `data.accountId` lookup to return undefined and resetting the view to read-only `All Customers`. Updated `khataPage()` in `app.js` to match accounts flexibly by ID or customer name (`findAccountByIdOrName`), ensure visible accounts persist even with 0 entries, maintain customer selection across background syncs, show explicit user notices on submit/delete/error, and cleaned hardcoded form defaults in `khata.html` and `accounts-payable.html`. | `app.js`, `khata.html`, `accounts-payable.html`, `PROJECT_ARCHITECTURE.md` |
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


