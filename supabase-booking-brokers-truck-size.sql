-- GTLS Transport: Schema Update for Truck No, Container Size in Brokers, and broker_entries
-- Run this once in the Supabase SQL Editor as postgres.

alter table public.booking_brokers add column if not exists truck_no text;
alter table public.booking_brokers add column if not exists container_size text;
alter table public.bookings add column if not exists broker_entries jsonb default '[]'::jsonb;

comment on column public.booking_brokers.truck_no is 'Assigned truck number for this broker row';
comment on column public.booking_brokers.container_size is 'Container size for this broker row (e.g. 20 FT, 40 FT, 45 FT, LCL)';
comment on column public.bookings.broker_entries is 'JSON array backup of broker entries';
