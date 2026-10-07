# GTLS Transport Software - AI & Agent Instructions

> **CRITICAL INSTRUCTION FOR ALL AI SESSIONS**:
> **DO NOT spend tokens/credits scanning all project files or searching the codebase blindly.**
> The entire architecture, file map, database schema, state keys, and business calculation engine are fully documented in [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md).
> Read this file and `PROJECT_ARCHITECTURE.md` before making any modifications.

---

- **2026-10-07 (Update 12)**: Shared summary cards now use Two Pay Records-style colored title badges for clear screen and print visibility. Added the English Builty module (`builty.html`) with searchable local register and excluded driver signature, charges, total rent, and remaining rent fields. Styles cache is `20261007-12`.
- **2026-10-07 (Update 13)**: Applied Two Pay Records typography and badge styling to all summary cards, renamed the visible module label to Bilty, and fixed Bilty navigation initialization before PJAX listeners. Styles cache is `20261007-13`.
- **2026-10-07 (Update 14)**: Rebuilt the Bilty page on the standard GTLS application shell and module layout so its hero, notification area, form, toolbar, and register match the other modules.
- **2026-10-07 (Update 15)**: Added backward-compatible Bilty access normalization so existing admin sessions can open the Bilty module instead of being redirected to Dashboard.
- **2026-10-07 (Update 16)**: Added a direct Bilty route safeguard and excluded Bilty from the legacy access fallback so clicking Bilty cannot redirect to Dashboard.
- **2026-10-07 (Update 17)**: Bumped `app.js` to `20261007-17` across all HTML pages to clear stale cached routing code and load the Bilty fix.
- **2026-10-07 (Update 18)**: Bilty navigation now uses the existing local admin session when Supabase session hydration is temporarily unavailable, preventing the Sign In/Dashboard redirect loop.
- **2026-10-07 (Update 19)**: Preserved the local session before Supabase access validation and bumped `app.js` to `20261007-19` so Bilty navigation can complete during temporary remote-session misses.
- **2026-10-07 (Update 20)**: Rebuilt Bilty with valid nested markup and the standard module shell, including responsive sidebar, hero/notifications, section headers, form grid, and register toolbar. Updated its assets to `20261007-20`.
- **2026-10-07 (Update 21)**: Aligned Bilty form actions with side-by-side Save and Clear Form buttons, added per-record letterhead PDF downloads, and connected Bilty records to Supabase hydration/upsert. Added `supabase-bilty.sql` with the `builty_records` table and module-scoped RLS; bumped application and stylesheet caches across HTML pages.
- **2026-10-07 (Update 22)**: Aligned the Bilty record count with the search field. Repaired missing/duplicate internal record IDs from earlier Bilty saves so editing and saving updates the selected record instead of creating a new one. Bumped app and stylesheet cache keys to `20261007-22`.
- **2026-10-07 (Update 23)**: Bilty Download PDF now uses `assets/Builty.pdf` as the full page background and fills saved record values into its header lines, goods row, and details area. Kept Edit and Download PDF side by side with a wider Action cell. Added pdf-lib and bumped cache keys to `20261007-23`.
- **2026-10-07 (Update 24)**: Standardized ledger table behavior across modules: wrapped tables now scroll horizontally and vertically with sticky, non-wrapping headers. Repositioned Bilty PDF values to their matching header blanks and aligned font baseline sizing to the template. Bumped app and stylesheet cache keys to `20261007-24`.
- **2026-10-07 (Update 26)**: Increased Bilty PDF field text size for clearer print output while retaining field-width fitting; quantity, weight, and remarks also use improved readable sizing. Bumped app cache keys to `20261007-26`.
- **2026-10-07 (Update 27)**: Moved Employee Register's Download PDF button into the Action column beneath Edit. Kept the Status and Image columns dedicated to their respective values and stacked the two actions with matching button widths. Bumped app/style caches to `20261007-27`.
- **2026-10-07 (Update 25)**: Corrected Bilty PDF field alignment by right-aligning header values within their blank lines, fitting long values to each field, and centering quantity/weight in their boxes. Updated app cache keys to `20261007-25`.

## 1. Quick Technical Summary

- **Type**: Enterprise Transport & Logistics Management Application.
- **Frontend**: Multi-Page HTML + Vanilla JavaScript (`app.js`, ~7,100 lines) + Vanilla CSS (`styles.css`). No Webpack / Vite / React build step needed.
- **Backend / Database**: Supabase PostgreSQL with RLS, Auth, Storage Bucket (`gtls-private-documents`), and Edge Function (`manage-user`).
- **Configuration**: [`supabase-config.js`](file:///h:/Transport_Software-main/supabase-config.js) holds `window.GTLS_SUPABASE_CONFIG = { url, publishableKey }`.

---

## 2. Key Files & Line Index in `app.js`

| Module / Page | HTML File | `data-page` Attribute | Handler in `app.js` |
| :--- | :--- | :--- | :--- |
| **Sign In** | [`index.html`](file:///h:/Transport_Software-main/index.html) | `signin` | `softwareLoginPage()` (~Line 2240) |
| **Dashboard** | [`dashboard.html`](file:///h:/Transport_Software-main/dashboard.html) | `dashboard` | `dashboardPage()` (~Line 3847) |
| **Booking Form** | [`booking.html`](file:///h:/Transport_Software-main/booking.html) | `booking` | `bookingPage()` (~Line 4019) |
| **Booking Summary** | [`ledger.html`](file:///h:/Transport_Software-main/ledger.html) | `ledger` | `ledgerPage()` (~Line 5364) |
| **Truck Details** | [`truck.html`](file:///h:/Transport_Software-main/truck.html) | `truck` | `truckPage()` (~Line 5919) |
| **Pending Truck Summary** | [`truck-summary.html`](file:///h:/Transport_Software-main/truck-summary.html) | `truck-summary` | `truckSummaryPage()` (~Line 6535) |
| **Completed Truck Summary**| [`completed-truck-summary.html`](file:///h:/Transport_Software-main/completed-truck-summary.html) | `completed-truck-summary`| `truckSummaryPage()` (~Line 6535) |
| **Two Pay Records** | [`two-pay-records.html`](file:///h:/Transport_Software-main/two-pay-records.html) | `two-pay-records` | `twoPayRecordsPage()` (~Line 6877) |
| **Equipment Fleet** | [`equipment.html`](file:///h:/Transport_Software-main/equipment.html) | `equipment` | `equipmentPage()` (~Line 7104) |
| **Fleet Maintenance** | [`maintenance.html`](file:///h:/Transport_Software-main/maintenance.html) | `maintenance` | `maintenancePage()` (~Line 7449) |
| **Employees** | [`employees.html`](file:///h:/Transport_Software-main/employees.html) | `employee` | `employeePage()` (~Line 7834) |
| **Admin Login** | [`admin-login.html`](file:///h:/Transport_Software-main/admin-login.html) | `admin-login` | `adminLoginPage()` (~Line 8063) |
| **Admin Users** | [`admin.html`](file:///h:/Transport_Software-main/admin.html) | `admin` | `adminPage()` (~Line 8093) |
| **Activity Logs** | [`activity-logs.html`](file:///h:/Transport_Software-main/activity-logs.html) | `activity-logs` | `activityLogsPage()` (~Line 8341) |
| **Accounts Receivable** | [`khata.html`](file:///h:/Transport_Software-main/khata.html) | `khata` | `khataPage()` (~Line 8493) |
| **Accounts Payable** | [`accounts-payable.html`](file:///h:/Transport_Software-main/accounts-payable.html)| `accounts-payable`| `khataPage()` (~Line 8493) |
| **Payment Voucher** | [`payment-voucher.html`](file:///h:/Transport_Software-main/payment-voucher.html)| `payment-voucher`| `paymentVoucherPage()` (~Line 10070) |

---

## 3. Core Engine Functions in `app.js`

- **Sequential IDs**: `getNextSequentialId(items, prefix, field)` (~Line 166) — produces `Job-1`, `EQP-1`, `MNT-1`, `EMP-1`, `ADM-1`, `KHT-1`, `PAYE-1`, `LOG-1`, `PV-1`.
- **State Store**: `loadStore()` (~Line 176) & `saveStore(store, options)` (~Line 381).
- **Audit Logging**: `collectAuditChanges()` (~Line 339), `appendAuditLog()` (~Line 321), `pruneActivityLogs()` (~Line 263).
- **Supabase Session & RBAC**: `getSupabaseSessionUser()` (~Line 475), `signInWithSupabase()` (~Line 506), `enforceSoftwareAccess(page)` (~Line 2269).
- **Tax & Financial Math**: `calculateBookingTaxBreakdown(rate, detention, authority)` (~Line 2715), `calculateKhataSummary(account)` (~Line 2758), `calculateTruckTripFinancials(trip)` (~Line 5895), `convertNumberToWords(amount)` (~Line 9650).
- **PDF Generation**: `buildBookingInvoicePdf()` (~Line 3032), `buildSummaryRecordPdf()` (~Line 3196), `createRegisterPdf()` (~Line 2965), `buildTruckDetailsInvoicePdf()` (~Line 5767), `buildPaymentVoucherPdf()` (~Line 9690), `buildPaymentVoucherSummaryPdf()` (~Line 9850).
- **Sync & Debounce**: `scheduleOperationalSync()` (~Line 961), `syncOperationalStore()` (~Line 1447), `hydrateOperationalStore()` (~Line 1469), `syncTruckJobs()` (~Line 1129), `syncPaymentVouchers()` (~Line 1354).
- **Storage Uploads**: `uploadPrivateDataUrl()` (~Line 1004) & `getPrivateDocumentUrl()` (~Line 693) to bucket `gtls-private-documents`.

---

## 4. Coding & Change Guidelines

1. **Keep Code Synchronized**: If adding a field to an HTML form, always update the normalizer function and the corresponding Supabase mapper in [`app.js`](file:///h:/Transport_Software-main/app.js).
2. **Preserve ID Formats**: Always use `getNextSequentialId()` for generating readable IDs.
3. **No Build Step Required**: Never install bundlers (webpack, vite, rollup) unless explicitly asked. The app runs directly by opening any `.html` file or via a static web server.
4. **Refer to Documentation**: For comprehensive data structures and database schema, read [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md).
5. **Always Update Documentation on Code Changes**: Whenever you make any modifications (add a field, change calculation math, alter Supabase schema or RLS, add new pages, or update styles), you **MUST update [`PROJECT_ARCHITECTURE.md`](file:///h:/Transport_Software-main/PROJECT_ARCHITECTURE.md)** (and this file's line index if shifted) and log the change in the **Changelog** section.

- **2026-10-07 (Update 6)**: Pending and Completed Truck Summary job cards now show Job No on the first line and Broker on the second line. Standardized all downloadable summary/register table headers with the shared theme navy `#18304D` background and white bold text for consistent, print-clear output across Booking, Customer, Broker, Truck, Two Pay, Equipment, Maintenance, Employee, and Payment Voucher summaries. Bumped the two truck summary pages to `app.js` and `styles.css` version `20261007-6`.

- **2026-10-07 (Update 7)**: Removed the individual P&L field from each Trucker/Broker row in the Booking Form and removed the per-broker P&L column from the Booking Ledger. Booking-level Net P&L and container-level P&L remain available; legacy broker P&L data stays internal for compatibility. Bumped `booking.html` and `ledger.html` assets to `v=20261007-7`.

- **2026-10-07 (Update 8)**: Standardized downloadable summary/register table headers to the supplied light blue `#B8DCE7` background with bold black text and print-safe dark borders. Changed Job Order labels to `A-Z` / `Z-A` and Date Order labels to `Oldest First` / `Newest First`, preserving the existing sort behavior. Bumped affected pages to `app.js?v=20261007-8`.

- **2026-10-07 (Update 9)**: Applied the Two Pay Records colored KPI card treatment across dashboard and ledger summary cards. Standardized all visible sort controls to `Sort A to Z` / `Sort Z to A` with consistent `asc` / `desc` values, including date and job controls. Bumped affected pages to `app.js` and `styles.css` version `20261007-9`.

- **2026-10-07 (Update 10)**: Improved print and screenshot readability across the software with dark navy page titles, navy KPI labels, pale blue truck job headers, and light blue high-contrast summary table headers. Bumped `styles.css` to `v=20261007-10` across all HTML pages.

- **2026-10-07 (Update 11)**: Extended colored KPI cards to Equipment, Fleet Maintenance, and Employees; preserved Dashboard expiry and outstanding alert colors; and applied a consistent Trebuchet MS / Segoe UI font stack to all headings. Bumped `styles.css` to `v=20261007-11` across all HTML pages.

- **2026-10-07 (Update 5)**: Pending and Completed Truck Summary job headers now display inline as `Job No: [value], Broker: [value]`. Long broker names wrap responsively while the movement count remains aligned on the right. Bumped `app.js` and `styles.css` to `v=20261007-5` on both summary pages.

- **2026-10-07 (Update 4)**: Completed Truck Summary now has a Download Summary button immediately before Clear Filters. The A3 landscape PDF uses the official letterhead and exports only the completed trips matching General Filter, Truck No, completion date range, and Job Order; its amounts are labeled Received Amount. Updated the completed page's `app.js` cache version to `20261007-4` and documented the change in `PROJECT_ARCHITECTURE.md`.

- **2026-10-07 (Update 3)**: New Payment Voucher Module with Dynamic Multi-Row Line Items, Auto Words Conversion, 1-to-1 PDF & Remote Supabase Persistence:
  1. **New Module (`payment-voucher.html`)**: Added dedicated Payment Voucher module with header metadata (`PV No.`, `Date`, `Pay To`, `Pay By`, `A/C No.`, `Prepared By`, `Received By`), dynamic multi-item line matrix (`Serial No.`, `Payment Method`, `Description`, `Unit Price`, `Amount`), real-time Total Amount & Words conversion (`The Sum of: Rupees ... Only`), top KPI summary counters, and full Voucher Register with search, payee filter, date range, date order, and edit/delete actions.
  2. **1-to-1 Template PDF Export (`buildPaymentVoucherPdf`)**: Generates an exact single-page A4 PDF mirroring the user's template: light green tint (`#e3eee0`), outer double border, solid black top banner "Payment Voucher", company header, underlined metadata lines, black-headed table padded to 7+ grid rows, black total bar, A/C No. & Words underline, and dual signature lines for Prepared By & Received By. Also added `buildPaymentVoucherSummaryPdf` for filtered landscape summary reports.
  3. **Remote Persistence & Security**: Created `public.payment_vouchers` table in `supabase-payment-vouchers.sql` and `MASTER_SUPABASE_SETUP.sql` with RLS policies, permissions, bidirectional sync (`syncPaymentVouchers`), and background hydration.
  4. **RBAC & Navigation**: Added `payment-voucher` to `ACCESS_OPTIONS`, `appPages`, `getNavigationIcon`, `ensurePaymentVoucherNavigation()`, and updated all 18 HTML files with sidebar links and cache bump (`v=20261007-3`).

- **2026-10-07 (Update 2)**: Employee Action/Image Column Overlap Fix, Fleet Maintenance Header UI Overhaul, Equipment Single PDF Third Party Insurance Date Removal, & Universal General Filters:
  1. **Employee Register Table Column Layout**: Resolved column overlapping where Actions (Edit, Download PDF), Image, and profile details collided. Removed restrictive `table-layout: fixed` and legacy 9-column constraints in `styles.css`. Increased table min-width to `1980px`, set `table-layout: auto`, enforced clean padding and `white-space: nowrap` across all 15 columns, added Action table header in `employees.html`, and added horizontal scroll container support (`.employee-register-table-wrap`).
  2. **Fleet Maintenance UI Overlap**: Converted `.maintenance-register-head` to a stacked block layout (`display: block; margin-bottom: 16px;`) and restructured `.maintenance-toolbar` with responsive wrapping (`display: flex; flex-wrap: wrap; gap: 12px; width: 100%;`) and 38px aligned controls. Removed restrictive `@media (min-width: 1161px)` `flex-wrap: nowrap` rule that forced toolbar controls to collide with "Maintenance History" heading on laptop viewports.
  3. **Equipment & Handling Fleet PDF Third Party Insurance Date Removal**: Removed `Third Party Insurance Date` from single equipment record PDF export (`data-download-equipment`) in `app.js`, ensuring all Equipment PDF exports (both summary and single record) omit this date while keeping it fully intact in form inputs, table register, and dashboard expiry alerts.
  4. **Universal General Search Filters**:
     - **Booking Summary (`ledger.html`)**: Added responsive General Filter search input (`data-summary-search`) to `.ledger-filter`, filtering bookings across bookingNo, customer, BL, CRO, invoice, containers, routes, and remarks.
     - **Completed Truck Summary (`completed-truck-summary.html`) & Pending Truck Summary (`truck-summary.html`)**: Added responsive General Filter search input (`data-truck-summary-search`), filtering trips across jobNo, truckNo, customer, parties, brokers, routes, containers, cargo descriptions, and remarks.
     - **Employee Register (`employees.html`)**: Added responsive General Filter search input (`data-employee-search`) and wired it in `employeePage()` for live table rendering and filtered summary PDF downloads.
  5. **Cache-Busting Bump**: Updated cache strings to `app.js?v=20261007-2` and `styles.css?v=20261007-2` across all 17 HTML files.

- **2026-10-07**: Trucker/Broker Summary Truck No in UI & Employee Fields, Fleet Driver & Salary-Free PDF Exports:
  1. **Trucker/Broker Summary Truck No**: Added `Truck No` column to the on-screen table header (`broker-summary.html`) and row rendering in `brokerSummaryPage()` (`app.js`), positioned immediately after Trucker/Broker and before Container No. Empty state colspan updated to 9, and `truckNo` included in the General Filter search.
  2. **Employee Module New Fields & Fleet Driver**: Added `Fleet Driver` to the Department dropdown options in `employees.html`. Added `Registration / License No` (`registrationNo`), `CNIC` (`cnic`), `Date of Birth` (`dob`), `Resignation Date` (`resignationDate`), and `Reference Details` (`referenceDetails`) form fields and register table columns. Fields persist and hydrate through Supabase `public.employees`. Created migration `supabase-employee-fields.sql` and added idempotent columns to `MASTER_SUPABASE_SETUP.sql`.
  3. **Employee PDF Exports Omit Salary**: Both the single-employee record PDF (`data-download-employee`) and the full Employee Register summary PDF (`data-download-employee-summary`) omit the `Salary` column while exporting all other employee profile fields.
  4. **Styles & Cache-Busting Bump**: Added horizontal scroll protection for `.employee-register-table` in `styles.css`. Bumped `app.js?v=20261007-1` and `styles.css?v=20261007-1` across all 17 HTML pages.

- **2026-10-02**: Truck Details final form row now uses a scoped five-column responsive grid so the smaller Image control, Grand Total, Round Trip Expense, Diesel Expense, and P&L fit together on desktop. The row wraps to two columns on narrower screens and one on mobile. Bumped `styles.css?v=20261002-2` across 17 HTML pages. No calculation or schema change.

- **2026-10-02**: Truck Details now has an optional Diesel Expense numeric field immediately after Round Trip Expense. It is saved and hydrated through `public.truck_jobs.diesel_expense` but does not affect Grand Total, Round Trip Expense, or P&L calculations. Added `supabase-truck-diesel-expense.sql` and the idempotent column to `MASTER_SUPABASE_SETUP.sql`; run the migration before saving diesel values. Bumped `app.js?v=20261002-5` across 17 HTML pages.

- **2026-10-02**: Two Pay individual invoice heading now explicitly prints `Customer Name: <name>` and directly underneath `Customer Address: <address>`; missing historical values show `-`. Both lines are bold and the table follows the wrapped address. Bumped `app.js?v=20261002-4` across 17 HTML pages. No schema change.

- **2026-10-02**: Two Pay Register now displays Customer Address immediately after Customer Name, with wrapped address cells and a corrected 31-column empty state. Bumped `app.js?v=20261002-3` and `styles.css?v=20261002-1` across 17 HTML pages. The existing address Supabase mapping and invoice remain unchanged.

- **2026-10-02**: Two Pay Records invoice and Customer Address: Added optional Customer Address directly after Customer Name in the form and persisted it through Supabase `customer_address` mapping and hydration. The individual invoice now uses Customer Name as its heading and prints Customer Address directly below it; the register action is labeled Invoice. Added `supabase-two-pay-customer-address.sql` and the idempotent column to `MASTER_SUPABASE_SETUP.sql`. Run the migration before saving addresses. Updated `app.js?v=20261002-2` on all 17 HTML pages.

- **2026-10-02**: Two Pay Records summary PDF now prints Customer Name in 15 pt bold below the title with extra spacing before the table, and totals the Party Collection column across the exported rows in the final footer. Updated `app.js?v=20261002-1` across 17 HTML pages. No form, register, or schema change.

- **2026-10-01**: Two Pay Records general summary PDF: Removed Destination, Size, Description, Party Balance, Received Date, and Received ID from the exported table, switched its page to A3 landscape, and realigned amount columns and totals. The on-screen register, individual record PDF, and database fields are unchanged. Updated `app.js?v=20261001-1` across 17 HTML pages. No schema change.

- **2026-09-29**: Large-format summary PDFs: Customer Booking, filtered Booking, Trucker/Broker, and Pending Truck summaries now use A3 landscape, proportioned left-aligned letterheads, wider fitted columns, 10+ pt table text, and high-contrast grid lines matching Truck Trip Ledger. Equipment summary remains A3; dense Fleet Maintenance and Two Pay summaries use A2 landscape for readable 10 pt text. Truck Trip Ledger and other headings stay on one line where space permits and wrap at word boundaries otherwise. Individual invoices and account statements are unchanged. Updated `app.js?v=20260929-8` across 17 HTML pages. No schema change.

- **2026-09-29**: Truck Trip Ledger general summary letterhead alignment: Positioned the correctly proportioned A3 letterhead at the 36 pt left margin, matching the summary title. The table and vertical layout remain unchanged. Updated `app.js?v=20260929-7` across all 17 HTML pages.

- **2026-09-29**: Truck Trip Ledger general summary letterhead aspect ratio: The cropped `Invoice.jpg` header is 1131×270. Its A3 PDF rendering now computes width from its existing 136 pt height, preventing the logo and wordmark from stretching while keeping the title and table positions unchanged. Updated `app.js?v=20260929-6` across all 17 HTML pages.

- **2026-09-29**: Pending Truck Summary PDF header layout: Reduced header font to 8 pt and padding to 3.5 pt, centered labels vertically, and split Cargo Description and Receivable Amount at word boundaries. Body rows and column data remain unchanged. Updated `app.js?v=20260929-5` across all 17 HTML pages.

- **2026-09-29**: Letterhead spacing for all summary PDFs: Shared `summaryTitleY()` places summary titles 36 pt below the letterhead image bottom, with subtitles and tables following each title. This covers Customer/Booking, Trucker/Broker, Pending Truck, Truck Trip Ledger, Two Pay, and register PDFs including Equipment and Maintenance. Trucker/Broker PDF Amount cells and total now show numbers without `PKR`. Updated `app.js?v=20260929-4` across all 17 HTML pages. No database change.

- **2026-09-29**: Customer Booking Summary PDF header alignment: Reduced header font to 8 pt, centered labels horizontally and vertically, gave `S.No` enough width to stay on one line, and split `Road Haulage Charges` at a word boundary. Adjusted Remarks width to preserve the A4 landscape table width. Updated `app.js?v=20260929-3` across 17 HTML pages. PDF content and Supabase fields are unchanged.

- **2026-09-29**: PDF summary columns and layout: Removed Job No and Customer / Payer from Truck Trip Ledger general summary, seven requested fields from Equipment & Handling Fleet summary, nine requested fields from Two Pay Records summary, and Booking No from the customer Booking Summary PDF. Two Pay summary now prints Customer Name below its title; mixed-customer exports show All Customers. Rebalanced fixed PDF column widths and moved Equipment summary title and table below the letterhead image. Updated `app.js?v=20260929-2` across all 17 HTML files. Screen tables and Supabase mappings are unchanged.

- **2026-09-29**: Small Laptop Responsive Layout & Dashboard Typography & Text Wrap Overhaul:
  1. **Dashboard KPI Layout & Digit Wrap Elimination**: Removed restrictive 6-column desktop override and established symmetrical 3-column grids (`repeat(3, minmax(0, 1fr))`) for Booking Form (2 rows of 3), Truck Summary (2 rows of 3), and Equipment Fleet (3 rows of 3). Enforced `white-space: nowrap !important;`, `tabular-nums`, and balanced font sizing (`16.5px` desktop, `15px` laptop) on currency amounts (`PKR 599,044,792.38`), eliminating mid-number breaks and orphaned digits across all screen resolutions. Added non-breaking spaces `&nbsp;` between `PKR` and numerical values in `dashboard.html`.
  2. **Uniform Title Alignment & Natural Wrapping**: Standardized `.dashboard-kpi-card h5` to `min-height: 28px` with clean vertical flex alignment and normal word wrapping, guaranteeing perfectly matching card baselines and preventing text truncation across multi-word headings (`Awaiting Payment Bookings`, `Third Party Insurance Expiry`).
  3. **Small Laptop Viewport Optimization (<=1366px)**: Streamlined desktop sidebar from 290px to 260px and compact main content padding to `16px 20px`, freeing substantial horizontal width. Adjusted `.nav a` padding and font size (13.5px) so all navigation labels (`Completed Truck Summary`, `Equipment & Handling Fleet`) fit seamlessly without ellipsis cut-off.
  4. **Styles Cache-Busting Bump**: Updated `styles.css?v=20260929-1` across all 17 HTML files for immediate client refresh.

- **2026-09-28**: All Summaries Letterhead on Page 1 Only, Address Footer on Last Page Only, Two Pay Record Larger Text & Truck Details Customer PDF Filename:
  1. **All Summaries Single-Time Header & Footer Rule**: In all summary exports (`buildBookingFilteredSummaryPdf`, `buildSummaryRecordPdf`, `buildBrokerSummaryPdf`, `buildPendingTruckSummaryPdf`, `truckPage` Truck Trip Ledger Summary, `buildTwoPaySummaryPdf`, and `createRegisterPdf`), the letterhead logo renders strictly once on Page 1 at the top, and the company address footer (`Office # 15, Ayub Shopping Center, Keamari, Karachi`) renders strictly once on the final page (`totalPages`), eliminating multi-page repetitive footers and blank gaps.
  2. **Two Pay Record Invoice Text Enlargement**: Elevated font size from 7.2 pt to **8.6 pt** (`headStyles: 9 pt`) with balanced padding (`3.5 pt`), guaranteeing high readability while strictly fitting all 28 rows on a single page without spilling over.
  3. **Summary Text Enlargement**: Elevated text size across summaries: Booking Summary (9.5 pt), Customer Summary (9.5 pt), Trucker/Broker Summary (10 pt), Pending Truck Summary (9.2 pt), Two Pay Summary (8.5 pt head & body), and Register PDFs (9.5 / 8.8 pt).
  4. **Truck Details Invoice Customer PDF Filename**: In `buildTruckDetailsInvoicePdf`, filenames now strictly prioritize Customer Name (`${customerName}${safeJobNo}_${isImport ? "import" : "export"}_invoice.pdf`) and never fall back to broker or "client".
  5. **Cache-Busting Bump**: Updated `app.js?v=20260928-10` across all 17 HTML files.

- **2026-09-28**: Trucker / Broker Summary Title Normalization & Customer Booking Summary First-Page Letterhead:
  1. **Trucker / Broker Summary Title Fix**: In `buildBrokerSummaryPdf`, when downloading general summary or when no specific broker is selected, the title now strictly reads `TRUCKER / BROKER: ALL TRUCKERS / BROKERS` instead of concatenating every broker's name into a long cut-off header. When a specific trucker/broker is selected or a single-row payment is downloaded, it displays `TRUCKER / BROKER: [NAME]`.
  2. **Booking Summary First-Page Letterhead Enforcement**: In `buildSummaryRecordPdf` (Customer Booking Summary PDF), the company letterhead logo, `CUSTOMER SUMMARY` title, and customer name now render strictly on Page 1 before the table (`startY: 184`), while subsequent pages flow from the top (`margin.top: 36`) without blank letterhead spacing, keeping the official Keamari address footer on every page.
  3. **Cache-Busting Bump**: Updated `app.js?v=20260928-9` across all 17 HTML files.

- **2026-09-28**: Booking Summary PDF Date Column Alignment & Width Expansion:
  1. **Date Column Single-Line Alignment**: Expanded Date column width to 70 pt with centered alignment in `buildBookingFilteredSummaryPdf`, ensuring May (e.g. `22 May 2024`) and all month strings fit cleanly on a single line matching all other months.
  2. **Cache-Busting Bump**: Updated `app.js?v=20260928-8` across all 17 HTML files.

- **2026-09-28**: Booking Summary & Broker Summary `pageHeight` ReferenceError Fix:
  1. **PageHeight Declaration**: Resolved `ReferenceError: pageHeight is not defined` in `buildBookingFilteredSummaryPdf` and `buildBrokerSummaryPdf` by declaring `const pageHeight = pdf.internal.pageSize.getHeight();` before `didDrawPage` footer positioning.
  2. **Cache-Busting Bump**: Updated `app.js?v=20260928-7` across all 17 HTML files.

- **2026-09-28**: Cross-Module General Summary Download Restored & High-Legibility Font Expansion:
  1. **Truck Details Summary PDF Fix**: Resolved critical `ReferenceError: Cannot access 'pdf' before initialization` in `truckPage()` by initializing `const pdf = new jsPDF("l", "pt", "a3");` prior to measuring dimensions.
  2. **Font Size & Row Height Expansion**:
     - **Truck Trip Ledger Summary**: Elevated font size from 8.5 pt to **10 pt** (`headStyles: 9.5 pt`, `bodyStyles.minCellHeight: 38 pt`, `headStyles.minCellHeight: 46 pt`) for crystal-clear readability on A3 landscape.
     - **Two Pay Records Summary**: Elevated font size from 7.2 pt to **8.5 pt** (`headStyles: 7.8 pt`, `bodyStyles.minCellHeight: 34 pt`, `headStyles.minCellHeight: 46 pt`), preserving single-line amount rendering without wrapping.
  3. **Booking Summary Always-Downloadable**: Removed filter-restriction roadblock so users can download Booking Summary PDF at any time (including with General Search or viewing all records).
  4. **Fleet Maintenance Summary Download**: Added "Download Summary" button to `maintenance.html` toolbar and hooked it up in `maintenancePage()` to export letterhead maintenance history summaries.
  5. **Dynamic A3 Support in Register PDFs**: Enhanced `createRegisterPdf` to automatically adapt to A3 landscape whenever headers exceed 11 columns, eliminating squeezed layouts.
  6. **Cache-Busting Bump**: Updated `app.js?v=20260928-6` across all 17 HTML files.

- **2026-09-28**: PDF Header Non-Overlap, Amount Single-Line Protection & Prominent Statement Grid Borders:
  1. **Header Text Wrapping Fix**: Eliminated column header overlapping in Two Pay Records Summary (`buildTwoPaySummaryPdf`) and Truck Trip Ledger Summary (`truck-trip-ledger-summary.pdf`) by scoping `overflow: "linebreak"` strictly to `data.section === "head"` and adding clean newline break boundaries (`\n`) for composite column names (`Road Freight\n/ Paid`, `Global /\nReceivable`, `Party Paid\nAmount`, etc.).
  2. **Single-Line Amount Protection**: Enforced `overflow: "visible"` and right alignment strictly in `body` and `foot` sections for amount columns so monetary numbers (e.g. `355,000`, `412,000`) never wrap or drop digits to a second line.
  3. **Prominent Statement Grid Borders**: Matched the visual style of Pending Truck Summary reference (`All_Trucks_pending_summary.pdf`) with crisp dark borders (`lineColor: [40, 40, 40]`, `lineWidth: 0.65`) and solid black text (`textColor: [0, 0, 0]`) with comfortable row heights (`minCellHeight: 32–34 pt`, `headStyles: 42–44 pt`).
  4. **Cache-Busting Bump**: Updated `app.js?v=20260928-5` across all 17 HTML files.

- **2026-09-28**: Comprehensive PDF Layout, Medium Box Sizing & Official Letterhead Enforcement Across All Modules:
  1. **Medium-Level Summary Boxes**: Upgraded Two Pay Records Summary (`buildTwoPaySummaryPdf`), Pending/Completed Truck Summary (`buildPendingTruckSummaryPdf`), and Truck Trip Ledger Summary (`truck-trip-ledger-summary.pdf`) from microscopic font/padding to comfortable medium-sized boxes (`fontSize: 7.8–9.5 pt`, `cellPadding: 4.8–6.0 pt`, `minCellHeight: 24–28 pt`) for high-contrast legibility and clear viewing.
  2. **Official Letterhead & Address Footer on Every PDF**: Standardized company letterhead banner across all pages and enforced the official bottom address (`Office # 15, Ayub Shopping Center, Keamari, Karachi | 021-328 62660`) with black divider line on every page via `didDrawPage` across all summary and register exports (`buildTwoPaySummaryPdf`, `buildPendingTruckSummaryPdf`, `truck-trip-ledger-summary`, `buildBookingFilteredSummaryPdf`, `buildBrokerSummaryPdf`, `buildSummaryRecordPdf`, `createRegisterPdf`).
  3. **Filename Conventions**: Trucker / Broker single-row summary downloads now strictly use the Trucker / Broker name from the `truckerBroker` field as the PDF filename (`${truckerBrokerName}_${safeBooking}.pdf`). Two Pay Records single-record invoice downloads prefix Customer Name (`${customerName}_${fileKey}_two_pay_invoice.pdf`).
  4. **Two Pay Records Visual Polish**: Renamed `Received Balance` to `Receivable Balance` across form field labels, top KPI card, and PDF exports. Refined top KPI cards with high-contrast themed accents and solid badges. Single-record invoice PDF (`buildTwoPayRecordPdf`) strictly fits all 28 rows on a single A4 page with full letterhead and address footer.
  5. **Cache-Busting Bump**: Updated `app.js?v=20260928-4` across all 17 HTML files.

- **2026-09-26**: Two Pay Records now saves Customer Name to Supabase, shows it after Date in the form/register/PDFs, and supports a Customer filter (including Unassigned historical rows). A new filtered Party Collection Pending card sums positive `Party Collection - Paid Amount` balances; pending rows are marked in the register. The form keeps three regular fields per desktop row. Apply `supabase-two-pay-customer-name.sql` before saving with the new field.

- **2026-09-26**: Booking Summary customer PDF now reserves footer space and paginates all rows; each page prints the letterhead, title, customer, and footer while totals appear only on the last page.

- **2026-09-26**: Equipment expiry alerts now start exactly one calendar month before the date, using the same status rule on Dashboard, notification bell, and Equipment Register. Third Party Insurance Date is included in dashboard and bell alerts alongside Fitness, all provincial permits, and Tax Paid Up To. Updated the `app.js` version on all pages so the new bell logic replaces cached code.

- **2026-09-26**: Moved Truck Trip Ledger heading to the top of its register section and aligned P&L, filters, record count, and rightmost Download Summary in a single desktop toolbar row with responsive wrapping.

- **2026-09-26**: Truck Trip Ledger now marks zero/empty Round Trip Expense as red `Missing` and has an Expense Status dropdown (All Expenses, Missing, Entered) that combines with its other filters and PDF download.

- **2026-09-26**: Truck Trip Ledger now has General Filter and Import Load Date range filters, searches import/export truck registrations, and downloads all or filtered jobs as a letterhead PDF with final-page totals.

- **2026-09-25**: Aligned Equipment Register and Maintenance History filter controls, download/count controls, and moved both register headings to the top of their shared toolbar row for consistent spacing.

- **2026-09-25**: Equipment & Handling Fleet now has a dynamic Maker filter and an always-available Download Summary button that exports all records or the currently filtered records.

- **2026-09-25**: Navigation order is now enforced so Two Pay Records always appears immediately before Equipment & Handling Fleet and Fleet Maintenance, across all pages and refreshes.

- **2026-09-25**: Replaced the plain Operations Summary caret with a styled circular SVG chevron that rotates on open/close without changing dropdown behavior.

- **2026-09-25**: Trucker/Broker Summary Status now defaults to `All`; users can still select `Paid` or `Payable`.

- **2026-09-25**: Made Two Pay Records hydration Supabase-authoritative after a successful read, so manually deleted database records disappear after hard refresh while read failures do not erase the local cache.

- **2026-09-25**: Matched Fleet Maintenance and Equipment Register filter layout to Truck Trip Ledger with General Filter labeling, title-left/filter-right desktop rows, and responsive wrapping on smaller screens.

- **2026-09-25**: Added Fleet Maintenance History General Filter with combined Truck No/Date Order filtering and searchable job, truck, part, serial, warranty, cost, driver, and approval details.

- **2026-09-25**: Completed a cross-module Supabase sync audit covering Booking, Truck Details, Equipment, Fleet Maintenance, Employees, Khata, Activity Logs, and Two Pay Records. User-facing saves now surface unavailable-Supabase failures, Booking broker/container relational errors are no longer silently ignored, and `MASTER_SUPABASE_SETUP.sql` includes grants for all core data tables.

- **2026-09-25**: Added Supabase save-integrity guards: Booking and operational saves no longer silently report success when only browser storage is available, broker/container relational write failures are surfaced, and Two Pay Records participate in operational change detection.

- **2026-09-25**: Fixed clipped Date Order text in the compact Two Pay filter row by correcting select height, padding, and line height.

- **2026-09-25**: Two Pay record detail PDFs show the `Field / Value` header only once, while the register filters and Download Summary/count controls use a compact centered single row on desktop and responsive wrapping on smaller screens.

- **2026-09-25**: Added per-record and filtered-summary PDF downloads to Two Pay Records, removed the helper sentence, aligned the count with filters, and extended the interactive card background treatment to shared software cards.

- **2026-09-25**: Placed compact interactive Billing Amount, Global / Receivable, and Received Balance cards in the first Two Pay Records section below the page title, with responsive General Filter, Start Date, End Date, Date Order, and record-count controls.

- **2026-09-25**: Added the isolated `Two Pay Records` module with the supplied register heads, live Party/Received balance calculations, Supabase `two_pay_records` sync/hydration, navigation/RBAC access key, and RLS migration `supabase-two-pay-records.sql`.

- **2026-09-24**: Import and Export Truck Details Payment Term expiry notifications now show the relevant truck registration number instead of the customer name.

- **2026-09-24**: Added `Payment Received Date` after `Cheque / IBFT` in both Import Details and Export Details. The values persist through Truck Details form/edit/table flows and Supabase; run `supabase-truck-payment-received-date.sql` once before deployment.

- **2026-09-23**: Made operational Supabase sync non-destructive. Truck, Equipment, Maintenance, and Employee upserts no longer delete remote rows missing from a local browser snapshot, protecting data during hydration delays, RLS issues, and concurrent sessions.

- **2026-09-23**: Truck Details, Equipment & Handling Fleet, Fleet Maintenance, and Employees now await Supabase sync before showing a successful save. If remote sync fails, the record remains locally cached but the module shows an explicit sync failure message.

- **2026-09-23**: Added Equipment & Handling Fleet `Ownership` and `Third Party Insurance Date` fields after Maker. Both fields persist through local state and Supabase; run `supabase-equipment-ownership-insurance.sql` once before deployment.

- **2026-09-23**: Complete Equipment & Handling Fleet expiry alerts now cover Fitness, all four provincial permits, and Tax Paid Up To. Dashboard and Equipment counters include tax dates, while the global notification bell shows expired or next-30-day fleet expiry alerts with direct links to Equipment alongside payment alerts.

- **2026-09-23**: Payment Alerts now include overdue Booking Form terms and Truck Details Import/Export Payment Term fields. Equipment, Fleet Maintenance, Booking Summary, and Trucker/Broker Summary have no Payment Term input fields.

- **2026-09-23**: Pending Truck Summary Download PDF is always enabled. It exports the current filter result for a selected truck or All Trucks and generates a valid zero-row PDF when no pending records match.

- **2026-09-22**: Truck Details Import/Export Symmetrical Fields, Detention Freight Integration & Invoice Display:
  1. Added 5 symmetrical operational fields to both Import Details and Export Details: `Customer Collection`, `Paid Date`, `Cheque / IBFT`, `Detention`, and `Payment Term` in the Truck Details form (`truck.html`) and data model.
  2. Updated financial calculations in `calculateTruckTripFinancials` and live `calculateTrip`:
     - $\text{Import Receivable} = (\text{Import Freight} + \text{Import Detention}) - \text{Import Broker Commission}$
     - $\text{Export Receivable} = (\text{Export Freight} + \text{Export Detention}) - \text{Export Broker Commission}$
     - $\text{Grand Total} = \text{Import Receivable} + \text{Export Receivable} + \text{Import MTY} + \text{Export MTY}$
     - $\text{P\&L} = \text{Grand Total} - \text{Round Trip Expense}$
  3. Expanded the Truck Trip Ledger table in `truck.html` and `render()` in `app.js` to 53 columns, displaying `Detention`, `Payment Term`, `Customer Collection`, `Cheque / IBFT`, and `Paid Date` for both legs. Updated table min-width to 6800px with column border separators at columns 25 and 48.
  4. Updated Trip Invoice PDF Generation (`buildTruckDetailsInvoicePdf`): dynamically includes `Detention` cell, computes and displays `Total Freight = Freight + Detention`, updates `Receivable Amount = Total Freight - Broker Commission`, and formats `Payment Term`, `Customer Collection`, `Cheque / IBFT`, and `Paid Date`.
  5. Updated Supabase sync (`syncTruckJobs`) with defensive schema retry fallback, updated hydration (`hydrateOperationalStore`), updated `MASTER_SUPABASE_SETUP.sql`, and provided standalone SQL migration [`supabase-truck-detention-fields.sql`](file:///c:/Users/M.A%20COMPUTERS/Desktop/Transport_Software/supabase-truck-detention-fields.sql).

- **2026-09-22**: Defensive File Input Value Setter Shim & Form Autocomplete:
  1. Resolved third-party browser extension error (`Uncaught (in promise) jquery.js:2 InvalidStateError: Failed to set the 'value' property on 'HTMLInputElement'`) by adding an `HTMLInputElement.prototype.value` setter shim in `app.js` that intercepts and silently suppresses non-empty string assignments on `type="file"` inputs while allowing standard empty resets.
  2. Added `autocomplete="off"` to forms and file inputs across `equipment.html` and `maintenance.html` to prevent rogue autofill extensions and scrapers from attempting programmatic population.

- **2026-09-22**: Equipment & Handling Fleet Database Persistence & Schema Sync:
  1. Resolved `HTTP 400 Bad Request` on `equipment_fleet` upsert by adding defensive fallback in `syncEquipment` in `app.js` to strip `type_of_body` and retry if the column is absent from the Supabase schema cache.
  2. Added `alter table public.equipment_fleet add column if not exists type_of_body text;` to `MASTER_SUPABASE_SETUP.sql` and created standalone migration `supabase-equipment-type-of-body.sql`.
  3. Confirmed Fleet Maintenance (`maintenance_jobs`) is saving 100% cleanly to Supabase PostgreSQL database (`Status 201 Created`).

- **2026-09-22**: Booking Form Optional Payment Dates, Trucker/Broker Summary Status & PDF Layout Upgrades, and Responsive Styling:
  1. Made `Payment Received Date` and `Cheque Number` optional in the main Booking Form (`booking.html` / `app.js`), removing strict required validation and visual asterisks.
  2. Added `Paid` filter option to Status dropdown in Trucker/Broker Summary (`broker-summary.html` / `app.js`), enabling users to filter specifically for paid broker payments alongside `Payable` and `All`.
  3. Replaced `Broker P&L` column with `Amount` in the Trucker/Broker Summary on-page data table to display the actual broker row amount directly.
  4. Scoped `Total Paid` and `Total Payable` KPIs in Trucker/Broker Summary to the selected Customer so selecting a customer calculates metrics exclusively for that customer.
  5. Refactored Trucker/Broker Summary PDF Export (`buildBrokerSummaryPdf`): moved Trucker/Broker name from table columns into the header title area (`TRUCKER / BROKER: [NAME]`), removed `Payment/Cheque/IBFT`, `Payment Date`, and `Trucker/Broker` from table columns, and formatted table to show `Booking No`, `Booking Date`, `Truck No`, `Container Size`, `Amount`, `Route`, and `Container Ref` with a total Amount row on the final page.
  6. Fixed responsive box styling in `styles.css`: updated `.booking-ledger-toolbar` to wrap gracefully preventing stat boxes and `Download Summary` from overflowing or clipping on laptop screens, adjusted `.broker-table-head` and `.broker-row` min-width to 980px, optimized column ratios, and enforced `white-space: nowrap` on `PAYMENT STATUS` so all 10 columns fit seamlessly.
  7. Renamed `Detention` field and column to `Detention/Other Charges` across the main Booking Form (`booking.html` label), Booking Ledger table header, Sales Tax Invoice PDF (`buildBookingInvoicePdf`), and form validation error messaging, and made it completely optional in form submission (defaults to 0 if left blank), preserving backward-compatible data persistence in `bookings.detention`.
  8. Resolved Supabase sync permission error (`permission denied for table bookings`) by preparing SQL permissions migration `supabase-booking-permissions-fix.sql` granting schema and table-level `ALL` privileges on `public.bookings`, `public.booking_containers`, `public.booking_brokers`, and sequences to `authenticated`, `anon`, and `service_role`, establishing clean RLS policies and storage object grants. Integrated table grants directly into `MASTER_SUPABASE_SETUP.sql`.
  9. Updated Trucker/Broker Summary filter: replaced `Customer` filter label with `Trucker/Broker` (`data-broker-summary-broker`), populated options dynamically with unique Trucker/Broker names (`renderBrokerOptions`), scoped `Total Paid` and `Total Payable` KPIs directly to the selected Trucker/Broker, and filtered summary rows accordingly.
  10. Renamed `Container Ref` to `Container No` across the Trucker/Broker Summary table header (`broker-summary.html`), on-page data rows, and PDF export table header (`buildBrokerSummaryPdf`), using helper `getBrokerRowContainerNo` to resolve and display the exact container number.
  11. Reordered Trucker/Broker Summary PDF Export columns (`buildBrokerSummaryPdf`): repositioned `Container No` to appear immediately after `Truck No`, followed by `Container Size`, `Amount`, and `Route`, with corresponding footer total alignment.
  12. Updated Booking Summary (`ledger.html` / `app.js`): removed `Total P&L` card from screen head, removed `P&L` column from customer summary tables and footers, and added `BL No` column immediately after `Booking No`. In customer summary PDF downloads (`buildSummaryRecordPdf`), removed `P&L` column and footer total, and added `BL No` immediately after `Booking No`.

- **2026-09-22**: Truck Details Symmetrical Export Fields & Auto-Registration Sync:
  1. Achieved 1-to-1 parity between Import Details and Export Details in `truck.html` and `app.js`. Renamed Import Date to `Import Load Date` in matching symmetry with `Export Load Date` across the form and table headers. Added the missing 6 Export fields (`exportCustomer`, `exportCargoDescription`, `exportMtyBoxFreight`, `exportMtyBroker`, `exportMtyPaymentDate`, `exportMtyPaymentStatus`) in identical matching sequence.
  2. Implemented real-time auto-population from `Import Truck Registration No` (`truckNo`) to `Export Truck Registration No` (`exportTruckNo`), preserving manual overrides if the user changes export truck registration.
  3. Updated `calculateTruckTripFinancials`, `calculateTrip`, and `numberFields` to integrate `exportMtyBoxFreight` ($\text{Grand Total} = \text{Import Receivable} + \text{Export Receivable} + \text{Import MTY} + \text{Export MTY}$).
  4. Updated Supabase sync (`syncTruckJobs`) to persist all 6 new fields into `public.truck_jobs` with automated defensive fallback stripping new columns on schema cache error, updated `hydrateOperationalStore` with safe fallbacks, and expanded `truck.html` table header and body rendering to 47 symmetrical columns.
  5. Guaranteed 100% backward compatibility for all historical records in `fillForm` with safe fallbacks when editing older trips. Provided SQL migration `supabase-truck-jobs-export-fields.sql` and updated `MASTER_SUPABASE_SETUP.sql`.

- **2026-09-22**: Designed and added custom GTLS Transport brand favicons (`favicon.svg` and `favicon.ico`) featuring a sleek, modern commercial freight truck & cargo container in GTLS navy (`#18304d`) and amber copper (`#c56b2d`). Linked across all 16 HTML pages to replace the browser's default world/globe icon in browser tabs.

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

