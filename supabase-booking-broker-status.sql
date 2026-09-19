-- Apply before deploying the booking broker Payment Status update.
-- Existing records are left unchanged; the app treats missing status as Payable.
alter table public.bookings
  add column if not exists broker_payment_status text;

-- Status tracks settlement only. Both Paid and Payable broker amounts are
-- included in job Net P&L (receivable_amount - broker_amount).
