-- Run in the Supabase SQL Editor before deploying the invoice pricing update.
-- Nullable columns preserve the distinction between unavailable historical
-- container pricing and an explicitly entered zero unit price.
alter table public.booking_containers
  add column if not exists quantity numeric,
  add column if not exists unit_price numeric;

-- Historical per-container amounts cannot be reconstructed from booking totals.
-- Re-enter and save the container quantities/prices for those bookings.
