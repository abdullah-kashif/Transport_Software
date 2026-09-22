-- GTLS Transport: Symmetrical Export Details fields for public.truck_jobs
-- Run this once in the Supabase SQL Editor as postgres.

alter table public.truck_jobs add column if not exists export_customer text;
alter table public.truck_jobs add column if not exists export_cargo_description text;
alter table public.truck_jobs add column if not exists export_mty_box_freight numeric default 0;
alter table public.truck_jobs add column if not exists export_mty_broker text;
alter table public.truck_jobs add column if not exists export_mty_payment_date date;
alter table public.truck_jobs add column if not exists export_mty_payment_status text default 'Awaited';
