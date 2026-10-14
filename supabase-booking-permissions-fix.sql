-- GTLS Transport: authenticated, module-scoped permissions for bookings.
-- Run as postgres. This script changes grants and policies only; no rows are changed.

begin;

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

-- Keep the publishable key usable for Supabase Auth, but deny it direct database
-- access. Authenticated application users retain their table privileges.
revoke all privileges on schema public from anon;
revoke all privileges on all tables in schema public from anon;
revoke all privileges on all sequences in schema public from anon;
revoke all privileges on schema storage from anon, public;
revoke all privileges on table storage.objects from anon, public;

grant usage on schema public to authenticated, service_role;
grant usage on schema storage to authenticated, service_role;
grant select, insert, update, delete on table
  public.bookings, public.booking_containers, public.booking_brokers
to authenticated, service_role;
grant all privileges on all sequences in schema public to authenticated, service_role;
grant all privileges on table storage.objects to authenticated, service_role;

alter table public.bookings enable row level security;
alter table public.booking_containers enable row level security;
alter table public.booking_brokers enable row level security;

-- Remove anonymous and unconditional authenticated policies, including any
-- legacy policy names that differ from the ones below.
do $$
declare
  policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('bookings', 'booking_containers', 'booking_brokers')
      and (
        'anon'::name = any(roles)
        or (
          'authenticated'::name = any(roles)
          and (
            (cmd in ('SELECT', 'UPDATE', 'DELETE', 'ALL')
              and coalesce(nullif(btrim(qual), ''), 'true') = 'true')
            or
            (cmd in ('INSERT', 'UPDATE', 'ALL')
              and coalesce(nullif(btrim(with_check), ''), 'true') = 'true')
          )
        )
      )
  loop
    execute format('drop policy %I on %I.%I',
      policy_row.policyname, policy_row.schemaname, policy_row.tablename);
  end loop;
end;
$$;

drop policy if exists "bookings_all_access" on public.bookings;
drop policy if exists "bookings_all_authenticated" on public.bookings;
drop policy if exists "bookings_module_select" on public.bookings;
drop policy if exists "bookings_module_insert" on public.bookings;
drop policy if exists "bookings_module_update" on public.bookings;
drop policy if exists "bookings_module_delete" on public.bookings;

drop policy if exists "booking_containers_all_access" on public.booking_containers;
drop policy if exists "booking_containers_all" on public.booking_containers;
drop policy if exists "booking_containers_module_select" on public.booking_containers;
drop policy if exists "booking_containers_module_insert" on public.booking_containers;
drop policy if exists "booking_containers_module_update" on public.booking_containers;
drop policy if exists "booking_containers_module_delete" on public.booking_containers;

drop policy if exists "booking_brokers_all_access" on public.booking_brokers;
drop policy if exists "booking_brokers_all" on public.booking_brokers;
drop policy if exists "booking_brokers_module_select" on public.booking_brokers;
drop policy if exists "booking_brokers_module_insert" on public.booking_brokers;
drop policy if exists "booking_brokers_module_update" on public.booking_brokers;
drop policy if exists "booking_brokers_module_delete" on public.booking_brokers;

create policy "bookings_module_select" on public.bookings
for select to authenticated
using (
  public.is_active_user() and (
    public.has_module_access('dashboard') or
    public.has_module_access('booking') or
    public.has_module_access('ledger') or
    public.has_module_access('broker-summary') or
    public.has_module_access('khata')
  )
);
create policy "bookings_module_insert" on public.bookings
for insert to authenticated
with check (public.is_active_user() and public.has_module_access('booking'));
create policy "bookings_module_update" on public.bookings
for update to authenticated
using (public.is_active_user() and public.has_module_access('booking'))
with check (public.is_active_user() and public.has_module_access('booking'));
create policy "bookings_module_delete" on public.bookings
for delete to authenticated
using (public.is_active_user() and public.has_module_access('booking'));

create policy "booking_containers_module_select" on public.booking_containers
for select to authenticated
using (
  public.is_active_user() and (
    public.has_module_access('dashboard') or
    public.has_module_access('booking') or
    public.has_module_access('ledger') or
    public.has_module_access('broker-summary') or
    public.has_module_access('khata')
  )
);
create policy "booking_containers_module_insert" on public.booking_containers
for insert to authenticated
with check (public.is_active_user() and public.has_module_access('booking'));
create policy "booking_containers_module_update" on public.booking_containers
for update to authenticated
using (public.is_active_user() and public.has_module_access('booking'))
with check (public.is_active_user() and public.has_module_access('booking'));
create policy "booking_containers_module_delete" on public.booking_containers
for delete to authenticated
using (public.is_active_user() and public.has_module_access('booking'));

create policy "booking_brokers_module_select" on public.booking_brokers
for select to authenticated
using (
  public.is_active_user() and (
    public.has_module_access('dashboard') or
    public.has_module_access('booking') or
    public.has_module_access('ledger') or
    public.has_module_access('broker-summary') or
    public.has_module_access('khata')
  )
);
create policy "booking_brokers_module_insert" on public.booking_brokers
for insert to authenticated
with check (public.is_active_user() and public.has_module_access('booking'));
create policy "booking_brokers_module_update" on public.booking_brokers
for update to authenticated
using (public.is_active_user() and public.has_module_access('booking'))
with check (public.is_active_user() and public.has_module_access('booking'));
create policy "booking_brokers_module_delete" on public.booking_brokers
for delete to authenticated
using (public.is_active_user() and public.has_module_access('booking'));

notify pgrst, 'reload schema';
commit;
