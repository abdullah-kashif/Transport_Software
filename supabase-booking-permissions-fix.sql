-- ==============================================================================
-- GTLS Transport: Permissions & RLS Fix for Bookings, Containers & Brokers
-- Fixes: "permission denied for table bookings"
-- Run this ONCE in the Supabase SQL Editor (as postgres role).
-- ==============================================================================

-- 1. Ensure booking_brokers table exists before granting permissions
create table if not exists public.booking_brokers (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  trucker_broker text,
  broker_amount numeric,
  broker_payment_details text,
  broker_payment_date date,
  container_ref text default 'all',
  truck_no text,
  container_size text,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.booking_brokers add column if not exists container_ref text default 'all';
alter table public.booking_brokers add column if not exists truck_no text;
alter table public.booking_brokers add column if not exists container_size text;

-- 2. Grant Schema usage and Table-level permissions to authenticated & anon roles
grant usage on schema public to authenticated, anon, service_role;

grant all on table public.bookings to authenticated, anon, service_role;
grant all on table public.booking_containers to authenticated, anon, service_role;
grant all on table public.booking_brokers to authenticated, anon, service_role;

-- Grant access to all sequences (e.g., booking_job_seq)
grant all on all sequences in schema public to authenticated, anon, service_role;

-- 3. Ensure RLS is active on all booking tables
alter table public.bookings enable row level security;
alter table public.booking_containers enable row level security;
alter table public.booking_brokers enable row level security;

-- 3. RLS Policies for public.bookings
drop policy if exists "bookings_module_select" on public.bookings;
drop policy if exists "bookings_module_insert" on public.bookings;
drop policy if exists "bookings_module_update" on public.bookings;
drop policy if exists "bookings_module_delete" on public.bookings;
drop policy if exists "bookings_all_authenticated" on public.bookings;
drop policy if exists "bookings_all_access" on public.bookings;

create policy "bookings_all_access" on public.bookings
for all to authenticated, anon
using (true)
with check (true);

-- 4. RLS Policies for public.booking_containers
drop policy if exists "booking_containers_module_select" on public.booking_containers;
drop policy if exists "booking_containers_module_insert" on public.booking_containers;
drop policy if exists "booking_containers_module_update" on public.booking_containers;
drop policy if exists "booking_containers_module_delete" on public.booking_containers;
drop policy if exists "booking_containers_all" on public.booking_containers;
drop policy if exists "booking_containers_all_access" on public.booking_containers;

create policy "booking_containers_all_access" on public.booking_containers
for all to authenticated, anon
using (true)
with check (true);

-- 5. RLS Policies for public.booking_brokers
drop policy if exists "booking_brokers_module_select" on public.booking_brokers;
drop policy if exists "booking_brokers_module_insert" on public.booking_brokers;
drop policy if exists "booking_brokers_module_update" on public.booking_brokers;
drop policy if exists "booking_brokers_module_delete" on public.booking_brokers;
drop policy if exists "booking_brokers_all" on public.booking_brokers;
drop policy if exists "booking_brokers_all_access" on public.booking_brokers;

create policy "booking_brokers_all_access" on public.booking_brokers
for all to authenticated, anon
using (true)
with check (true);

-- 6. Storage bucket permissions for Bilty uploads (gtls-private-documents/bookings)
grant all on table storage.objects to authenticated, service_role;
grant select, insert, update on table storage.objects to anon;

-- Refresh schema cache
notify pgrst, 'reload schema';
