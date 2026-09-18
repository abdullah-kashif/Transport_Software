-- Apply before deploying the booking Trucker/Broker fields update.
-- Adds nullable fields only; existing booking data and amounts are unchanged.
alter table public.bookings
  add column if not exists trucker_broker text,
  add column if not exists broker_amount numeric,
  add column if not exists broker_payment_details text,
  add column if not exists broker_payment_date date;

-- P&L is derived in the app as receivable_amount - broker_amount.
-- It remains blank when no broker amount has been entered.
