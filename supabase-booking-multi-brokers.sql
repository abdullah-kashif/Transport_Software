-- Run once in the Supabase SQL Editor before deploying multi-broker bookings.
-- All additions are non-destructive. Existing booking rows and values remain intact.
alter table public.bookings
  add column if not exists trucker_broker text,
  add column if not exists broker_amount numeric,
  add column if not exists broker_payment_details text,
  add column if not exists broker_payment_date date,
  add column if not exists broker_payment_status text,
  add column if not exists sales_tax_withholding text,
  add column if not exists broker_entries jsonb not null default '[]'::jsonb;

comment on column public.bookings.broker_entries is
  'Ordered broker payment rows. Each object stores truckerBroker, containerRef, amount, paymentDetails, paymentDate and paymentStatus.';

-- Legacy single-broker columns are retained for backward compatibility.
-- Existing records load from those columns until the booking is edited and saved,
-- after which the complete row list is also stored in broker_entries.
