-- GTLS Transport: Supabase grants and module-scoped RLS.
-- Run as postgres. Grants/policies only; no application rows are modified.

begin;

revoke all privileges on schema public from anon;
revoke all privileges on all tables in schema public from anon;
revoke all privileges on all sequences in schema public from anon;
revoke all privileges on schema storage from anon, public;
revoke all privileges on table storage.objects from anon, public;

grant usage on schema public to authenticated, service_role;
grant usage on schema storage to authenticated, service_role;
grant select, insert, update, delete on table public.profiles to service_role;
grant select on table public.profiles to authenticated;
grant select, insert, update, delete on table
  public.bookings, public.booking_containers, public.booking_brokers
to authenticated, service_role;
grant all privileges on all sequences in schema public to authenticated, service_role;
grant all privileges on table storage.objects to authenticated, service_role;

alter table public.bookings enable row level security;
alter table public.booking_containers enable row level security;
alter table public.booking_brokers enable row level security;

-- Remove policies that gave anon or every authenticated user unconditional access.
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

drop policy if exists "bookings_module_select" on public.bookings;
drop policy if exists "bookings_module_insert" on public.bookings;
drop policy if exists "bookings_module_update" on public.bookings;
drop policy if exists "bookings_module_delete" on public.bookings;
create policy "bookings_module_select" on public.bookings
for select to authenticated
using (
  public.is_active_user() and (
    public.has_module_access('dashboard') or public.has_module_access('booking') or
    public.has_module_access('ledger') or public.has_module_access('broker-summary') or
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

drop policy if exists "booking_containers_module_select" on public.booking_containers;
drop policy if exists "booking_containers_module_insert" on public.booking_containers;
drop policy if exists "booking_containers_module_update" on public.booking_containers;
drop policy if exists "booking_containers_module_delete" on public.booking_containers;
create policy "booking_containers_module_select" on public.booking_containers
for select to authenticated
using (
  public.is_active_user() and (
    public.has_module_access('dashboard') or public.has_module_access('booking') or
    public.has_module_access('ledger') or public.has_module_access('broker-summary') or
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

drop policy if exists "booking_brokers_module_select" on public.booking_brokers;
drop policy if exists "booking_brokers_module_insert" on public.booking_brokers;
drop policy if exists "booking_brokers_module_update" on public.booking_brokers;
drop policy if exists "booking_brokers_module_delete" on public.booking_brokers;
create policy "booking_brokers_module_select" on public.booking_brokers
for select to authenticated
using (
  public.is_active_user() and (
    public.has_module_access('dashboard') or public.has_module_access('booking') or
    public.has_module_access('ledger') or public.has_module_access('broker-summary') or
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
