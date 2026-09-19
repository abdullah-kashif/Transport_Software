-- Apply before deploying the complete Booking Ledger field update.
-- Existing booking records are unchanged; missing historical values use 20% in the app.
alter table public.bookings
  add column if not exists sales_tax_withholding text;
