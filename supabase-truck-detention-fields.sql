-- Migration: Add Detention, Payment Term, and Customer Collection to public.truck_jobs
-- Run this in the Supabase SQL Editor as postgres.

alter table public.truck_jobs add column if not exists import_detention numeric default 0;
alter table public.truck_jobs add column if not exists import_payment_term text;
alter table public.truck_jobs add column if not exists import_customer_collection numeric default 0;

alter table public.truck_jobs add column if not exists export_detention numeric default 0;
alter table public.truck_jobs add column if not exists export_payment_term text;
alter table public.truck_jobs add column if not exists export_customer_collection numeric default 0;

-- Ensure table permissions for all active roles
grant usage on schema public to authenticated, anon, service_role;
grant select, insert, update, delete on table public.truck_jobs to authenticated, anon, service_role;
