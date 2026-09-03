# GTLS Transport Project Status

Last reviewed: 2026-09-02

## Current Architecture

- Frontend: multi-page HTML, `app.js`, and `styles.css`; no build step is required.
- Backend: Supabase Auth, PostgreSQL with RLS, private Storage bucket `gtls-private-documents`, and Edge Function `manage-user`.
- Configuration: `supabase-config.js` contains only the project URL and publishable key. Secret/service-role keys must stay in Supabase secrets and never enter frontend files.
- Main implementation and business logic: `app.js`.

## Completed In This Review

- Standardized replacement uploads for Booking, Truck Details, Equipment, Maintenance, Employees, and Receivable/Payable entry attachments.
- Booking Bilty now uses a stable `bookings/<job>/latest.jpg` object and removes older objects in that record folder.
- Generic uploads use `latest.<extension>` inside a record folder when replacement mode is enabled.
- Existing attachment paths determine their folder during edits, so a remote UUID change does not create a second folder for the same Khata entry.
- Empty image/document values remove the stored object and clear the database path during sync.
- Existing record deletion cleanup remains in `syncRows`, booking deletion, account-entry deletion, and account deletion flows.
- Removed artificial navigation waits that caused visible lag during internal module changes.
- Fixed Accounts Receivable/Payable delete races: account entries are preserved by matching/updating existing rows instead of deleting and reinserting the entire statement on every sync.
- Delete now waits for pending sync work, resolves the current remote entry, removes its Storage attachment, and deletes the parent account when its final entry is removed.

## Verification Checklist

1. Add a record with an attachment and confirm one object appears under its record folder.
2. Edit the same record with a different attachment and confirm only `latest.*` remains.
3. Edit without selecting a new attachment and confirm the existing attachment remains.
4. Clear the attachment, save, and confirm the database path becomes null and the folder is empty.
5. Delete a supported record and confirm its Storage object is removed.
6. Sign in as a Sub Admin and confirm only assigned modules are visible and usable.
7. Navigate between modules repeatedly and confirm there is no blank flash or forced multi-second pause.
8. Run the SQL in `MASTER_SUPABASE_SETUP.sql` after the base schema if the corresponding columns/policies are not already installed.

## Known Testing Limitation

The local workspace cannot log into the user's live Supabase session or click through the deployed client account. The code paths have been statically reviewed and syntax-checked locally; the seven browser/Supabase checks above still require one live test session.

## Change Log

### 2026-09-02

- Unified attachment replacement behavior across all supported modules.
- Stabilized Storage folder selection using the current saved path.
- Reduced dynamic navigation latency by removing hard-coded transition sleeps.
- Repaired Khata deletion and account cleanup so deleted statements do not return after refresh.
- Added remote account UUID resolution for local IDs such as `CUS-1` and `PAY-1`, preventing PostgreSQL UUID errors during entry/account deletion.
- Added an accessible confirmation dialog before Admin user deletion and Khata entry/account deletion, with record-specific wording and Escape/overlay cancellation.
- Added this project status document and a paste-ready Supabase setup reference.
- Fixed repeated document-level event listeners during dynamic navigation to reduce
  lag and duplicate Escape/notification handling.
- Added explicit error handling for background account deletion.
- Updated schema defaults so new Job and Maintenance IDs start as `1`, `2`, `3`
  without leading zeroes.
- Removed stray literal newline markers from all HTML entry pages.
- Final Khata deletion now verifies that the Supabase account is truly gone and
  removes any stale local duplicate before resetting the dropdown.
- Background Supabase sync failures are now surfaced in the active module, and
  the master SQL includes the complete account-entry RLS/access repair.
- Khata account and entry saves now wait for direct Supabase synchronization so
  entries cannot appear saved locally and disappear after refresh.
- Protected in-flight Supabase hydration from overwriting a newer local Khata
  account or entry mutation.
- Success notices for Khata accounts and entries now appear only after direct
  Supabase synchronization succeeds; failed remote saves remain visible as
  errors instead of showing a false success message.
- Recovered the queued sync pipeline after a failed request so one failed save
  cannot block all later Khata edits and updates.
- Optimized normal Khata account and entry saves to sync only the affected
  account instead of serially reconciling the complete account register.
- Added a Customer/Payee Account Overview table above the statement wizard on
  both Khata pages, with clickable rows and Share PDF/Download actions.
- Corrected Share PDF so it no longer triggers an automatic download; it uses
  the native file share sheet where supported and otherwise opens WhatsApp
  without downloading a duplicate file.
- Added a compact mobile layout for the account overview so S.No, name,
  balance, Share and Download remain visible together without horizontal scrolling.
- Re-checked JavaScript syntax, loaded all 15 HTML pages through a local server,
  and confirmed the unauthenticated redirect/sign-in path has no console errors.
