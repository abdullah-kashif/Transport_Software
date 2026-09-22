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
| **Sign In** | [`index.html`](file:///h:/Transport_Software-main/index.html) | `signin` | `softwareLoginPage()` (~Line 2014) |
| **Dashboard** | [`dashboard.html`](file:///h:/Transport_Software-main/dashboard.html) | `dashboard` | `dashboardPage()` (~Line 3414) |
| **Booking Form** | [`booking.html`](file:///h:/Transport_Software-main/booking.html) | `booking` | `bookingPage()` (~Line 3591) |
| **Booking Summary** | [`ledger.html`](file:///h:/Transport_Software-main/ledger.html) | `ledger` | `ledgerPage()` (~Line 4898) |
| **Truck Details** | [`truck.html`](file:///h:/Transport_Software-main/truck.html) | `truck` | `truckPage()` (~Line 5408) |
| **Pending Truck Summary** | [`truck-summary.html`](file:///h:/Transport_Software-main/truck-summary.html) | `truck-summary` | `truckSummaryPage()` (~Line 5665) |
| **Completed Truck Summary**| [`completed-truck-summary.html`](file:///h:/Transport_Software-main/completed-truck-summary.html) | `completed-truck-summary`| `truckSummaryPage()` (~Line 5665) |
| **Equipment Fleet** | [`equipment.html`](file:///h:/Transport_Software-main/equipment.html) | `equipment` | `equipmentPage()` (~Line 5953) |
| **Fleet Maintenance** | [`maintenance.html`](file:///h:/Transport_Software-main/maintenance.html) | `maintenance` | `maintenancePage()` (~Line 6247) |
| **Employees** | [`employees.html`](file:///h:/Transport_Software-main/employees.html) | `employee` | `employeePage()` (~Line 6586) |
| **Admin Login** | [`admin-login.html`](file:///h:/Transport_Software-main/admin-login.html) | `admin-login` | `adminLoginPage()` (~Line 6812) |
| **Admin Users** | [`admin.html`](file:///h:/Transport_Software-main/admin.html) | `admin` | `adminPage()` (~Line 6842) |
| **Activity Logs** | [`activity-logs.html`](file:///h:/Transport_Software-main/activity-logs.html) | `activity-logs` | `activityLogsPage()` (~Line 7090) |
| **Accounts Receivable** | [`khata.html`](file:///h:/Transport_Software-main/khata.html) | `khata` | `khataPage()` (~Line 7242) |
| **Accounts Payable** | [`accounts-payable.html`](file:///h:/Transport_Software-main/accounts-payable.html)| `accounts-payable`| `khataPage()` (~Line 7242) |

---

## 3. Core Engine Functions in `app.js`

- **Sequential IDs**: `getNextSequentialId(items, prefix, field)` (~Line 144) — produces `Job-1`, `EQP-1`, `MNT-1`, `EMP-1`, `ADM-1`, `KHT-1`, `PAYE-1`, `LOG-1`.
- **State Store**: `loadStore()` (~Line 154) & `saveStore(store, options)` (~Line 354).
- **Audit Logging**: `collectAuditChanges()` (~Line 312), `appendAuditLog()` (~Line 294), `pruneActivityLogs()` (~Line 237).
- **Supabase Session & RBAC**: `getSupabaseSessionUser()` (~Line 448), `signInWithSupabase()` (~Line 479), `enforceSoftwareAccess(page)` (~Line 2043).
- **Tax & Financial Math**: `calculateBookingTaxBreakdown(rate, detention, authority)` (~Line 2372), `calculateKhataSummary(account)` (~Line 2415).
- **PDF Generation**: `buildBookingInvoicePdf()` (~Line 2643), `buildSummaryRecordPdf()` (~Line 2806), `createRegisterPdf()` (~Line 2585).
- **Sync & Debounce**: `scheduleOperationalSync()` (~Line 923), `syncOperationalStore()` (~Line 1274), `hydrateOperationalStore()` (~Line 1295).
- **Storage Uploads**: `uploadPrivateDataUrl()` (~Line 973) & `getPrivateDocumentUrl()` (~Line 673) to bucket `gtls-private-documents`.

---

## 4. Coding & Change Guidelines

1. **Keep Code Synchronized**: If adding a field to an HTML form, always update the normalizer function and the corresponding Supabase mapper in [`app.js`](file:///h:/Transport_Software-main/app.js).
2. **Preserve ID Formats**: Always use `getNextSequentialId()` for generating readable IDs.
3. **No Build Step Required**: Never install bundlers (webpack, vite, rollup) unless explicitly asked. The app runs directly by opening any `.html` file or via a static web server.
4. **Refer to Documentation**: For comprehensive data structures and database schema, read [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md).
5. **Always Update Documentation on Code Changes**: Whenever you make any modifications (add a field, change calculation math, alter Supabase schema or RLS, add new pages, or update styles), you **MUST update [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md)** (and this file's line index if shifted) and log the change in the **Changelog** section.

## 5. Changelog

- **2026-09-22**: Enforced mandatory validation for `Payment Received Date *` and `Cheque Number *` in the main Booking Form (`booking.html` / `app.js`). In Trucker/Broker rows, strictly kept `Amount`, `Payment/Cheque/IBFT`, and `Payment Date` (along with `Bilty`) as optional inputs, while `Trucker/Broker *` name, `Payment Received Date *`, and `Cheque Number *` are strictly required with `.required-star` visual indicators and automated validation highlighting.

- **2026-09-22**: Booking Ledger layout & sorting redesign:
  1. Unified all controls into a single unified row (`.booking-ledger-toolbar`) directly under `<h3>Booking Ledger</h3>`: Left side houses `General Filter`, `Customer`, `Start Date`, `End Date`, and `Date Order`; Right side houses `Total Amount`, `Total P&L`, record count badge (`0 record(s)`), and `Download Summary`.
  2. Updated `Date Order` sorting logic (`compareBookingInvoiceOrder`) to sort bookings by Invoice number (natural numeric sort) with `Ascend` set as the default option across all customers or for any selected customer, with switchable `Descend` option.

- **2026-09-22**: Repositioned `Download Summary` button to the end of the Booking Ledger filter/summary toolbar in `booking.html`, placed right after `ledger-count` (`0 record(s)`). Enhanced `.booking-summary-download` in `styles.css` with aligned `38px` height and flex centering for seamless visual integration with the ledger stats.

- **2026-09-22**: Updated Booking Sales Tax Invoice (`buildBookingInvoicePdf`) so `Unit Price` is no longer summed across container rows when multiple containers exist. The invoice now displays the direct container unit price while keeping `Quantity` summed across rows, preserving the correct relation $\text{Road Haulage Charges} = \text{Total Quantity} \times \text{Unit Price}$.

- **2026-09-22**: Fixed Fleet Maintenance and Equipment record persistence and filter population:
  1. Fleet Maintenance History filter dropdown (`[data-maintenance-truck-filter]`) now strictly populates only with truck numbers that actually have maintenance records (`getTrucksWithMaintenance()`), preventing empty-truck filter choices. The create/update form datalist (`#maintenance-trucks`) continues to suggest all fleet trucks (`getTruckNumbers()`).
  2. Fixed transient record disappearance on save in Fleet Maintenance and Equipment & Handling Fleet: implemented non-destructive key-based merging in `hydrateOperationalStore` for `equipmentFleet`, `maintenanceJobs`, `truckExpenses`, and `employees` so background Supabase hydration never clears unsynced local records or image previews.
  3. Form submit and clear form handlers in Fleet Maintenance automatically reset `truckFilter` to "All Trucks", ensuring newly submitted and existing records immediately display in the table.
  4. Form submit and clear form handlers in Equipment automatically reset active search filtering and support flexible record matching by `id` or `truckNo`.

- **2026-09-22**: Added `LCL` option to Container Size dropdown in Booking Form. Added dynamic `Truck No` and `Container Size` dropdowns to each Trucker/Broker row in `.broker-block` with automatic pre-selection of truck and size when a specific container reference is selected, and updated broker grid to 10 columns (min-width 1280px). Renamed `Broker P&L` column header to `P&L` in Booking Ledger table (`booking.html`) and broker form header. Added `Total P&L` to the summary bar in Booking Ledger (`booking.html`) and included `P&L` column in the filtered summary PDF export. In `ledger.html` (Booking Summary customer cards), added `P&L` column to the table, customer `Total P&L` to card footer, and grand total `Total P&L` to screen header. Resolved Supabase sync error (`Could not find the 'broker_entries' column of 'bookings' in the schema cache`) with defensive fallback in `saveBookingToSupabase` stripping `broker_entries`/`broker_lines` on retry, added `truck_no` and `container_size` to relational `booking_brokers` saves with defensive fallback, updated `MASTER_SUPABASE_SETUP.sql`, and provided migration script `supabase-booking-brokers-truck-size.sql`.

- **2026-09-21**: Automatically derived container `unitPrice` from `road_haulage_charges / totalQuantity` when editing or loading bookings where container unit pricing was unpopulated or zero in the database. Container rows now populate with their exact proportional unit price upon edit instead of displaying 0 or blank, preventing form validation rejection and preserving Road Haulage Charges and tax calculations. Newly added container rows auto-suggest any shared existing unit price. Added defensive save fallback in `saveBookingToSupabase` for `booking_containers` if DB columns are missing, and updated `MASTER_SUPABASE_SETUP.sql` with `quantity` and `unit_price` columns.

- **2026-09-20**: Replaced `Sales Tax Authority` with `15% Sales Tax` in the Booking Summary customer boxes table on `ledger.html` and in the filtered Booking Summary PDF export (`buildBookingFilteredSummaryPdf`). Both the on-page table and summary PDF downloads now display the formatted 15% sales tax amount rather than the tax authority name.

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

