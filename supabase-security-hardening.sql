-- GTLS Transport: close anonymous access and restore module-scoped RLS.
-- Run as postgres in the Supabase SQL Editor. This changes grants and policies,
-- not application rows.

begin;

-- Business data and private documents require a Supabase-authenticated user.
revoke all privileges on schema public from anon;
revoke all privileges on all tables in schema public from anon;
revoke all privileges on all sequences in schema public from anon;

-- storage.objects had effective anon access inherited through PUBLIC. Remove
-- both direct and inherited grants, then explicitly grant signed-in roles.
revoke all privileges on schema storage from anon, public;
revoke all privileges on table storage.objects from anon, public;

grant usage on schema public to authenticated, service_role;
grant usage on schema storage to authenticated, service_role;
grant select, insert, update, delete on table
  public.bookings,
  public.booking_containers,
  public.booking_brokers,
  public.two_pay_records
to authenticated, service_role;
grant all privileges on all sequences in schema public to authenticated, service_role;
grant all privileges on table storage.objects to authenticated, service_role;

-- Remove every anon/PUBLIC policy in public, plus unconditional authenticated
-- policies on Booking and Two Pay tables. Then recreate scoped policies below.
do $$
declare
  policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and (
        ('anon'::name = any(roles) or 'public'::name = any(roles))
        or (
          tablename in ('bookings', 'booking_containers', 'booking_brokers', 'two_pay_records')
          and 'authenticated'::name = any(roles)
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

-- The private document bucket must not have anon/PUBLIC object policies either.
do $$
declare
  policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and ('anon'::name = any(roles) or 'public'::name = any(roles))
  loop
    execute format('drop policy %I on %I.%I',
      policy_row.policyname, policy_row.schemaname, policy_row.tablename);
  end loop;
end;
$$;

-- Rebuild named module policies so rerunning this migration is safe.
drop policy if exists "bookings_module_select" on public.bookings;
drop policy if exists "bookings_module_insert" on public.bookings;
drop policy if exists "bookings_module_update" on public.bookings;
drop policy if exists "bookings_module_delete" on public.bookings;

drop policy if exists "booking_containers_module_select" on public.booking_containers;
drop policy if exists "booking_containers_module_insert" on public.booking_containers;
drop policy if exists "booking_containers_module_update" on public.booking_containers;
drop policy if exists "booking_containers_module_delete" on public.booking_containers;

drop policy if exists "booking_brokers_module_select" on public.booking_brokers;
drop policy if exists "booking_brokers_module_insert" on public.booking_brokers;
drop policy if exists "booking_brokers_module_update" on public.booking_brokers;
drop policy if exists "booking_brokers_module_delete" on public.booking_brokers;

drop policy if exists "two_pay_records_module_access" on public.two_pay_records;
drop policy if exists "Enable all for service_role on two_pay_records" on public.two_pay_records;

alter table public.bookings enable row level security;
alter table public.booking_containers enable row level security;
alter table public.booking_brokers enable row level security;
alter table public.two_pay_records enable row level security;

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

create policy "two_pay_records_module_access" on public.two_pay_records
for all to authenticated
using (public.is_active_user() and public.has_module_access('two-pay-records'))
with check (public.is_active_user() and public.has_module_access('two-pay-records'));

notify pgrst, 'reload schema';
commit;

-- Expected: all anon privilege checks are false, and both policy counts are 0.
select relation_name,
       has_table_privilege('anon', relation_name, 'SELECT') as anon_can_select,
       has_table_privilege('anon', relation_name, 'INSERT') as anon_can_insert,
       has_table_privilege('anon', relation_name, 'UPDATE') as anon_can_update,
       has_table_privilege('anon', relation_name, 'DELETE') as anon_can_delete,
       (select count(*)
          from pg_policies
         where schemaname = 'public'
           and ('anon'::name = any(roles) or 'public'::name = any(roles)))
         as remaining_public_schema_anon_or_public_policies,
       (select count(*)
          from pg_policies
         where schemaname = 'storage'
           and tablename = 'objects'
           and ('anon'::name = any(roles) or 'public'::name = any(roles)))
         as remaining_storage_objects_anon_or_public_policies
from (values
  ('public.bookings'),
  ('public.booking_containers'),
  ('public.booking_brokers'),
  ('public.two_pay_records'),
  ('storage.objects')
) as targets(relation_name);
