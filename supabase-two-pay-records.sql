-- GTLS Transport: Two Pay Records permissions
-- The public.two_pay_records table and its columns already exist.
-- Run this once in the Supabase SQL Editor before using the module.

begin;

revoke all privileges on schema public from anon;
revoke all privileges on all tables in schema public from anon;
revoke all privileges on all sequences in schema public from anon;
revoke all privileges on schema storage from anon, public;
revoke all privileges on table storage.objects from anon, public;
grant usage on schema public to authenticated, service_role;
grant usage on schema storage to authenticated, service_role;
grant select, insert, update, delete on table public.two_pay_records to authenticated, service_role;

alter table public.two_pay_records enable row level security;
drop policy if exists "Enable all for anon users on two_pay_records" on public.two_pay_records;
drop policy if exists "Enable all for authenticated users on two_pay_records" on public.two_pay_records;
drop policy if exists "Enable all for service_role on two_pay_records" on public.two_pay_records;
drop policy if exists "two_pay_records_module_access" on public.two_pay_records;
create policy "two_pay_records_module_access" on public.two_pay_records
for all to authenticated
using (public.is_active_user() and public.has_module_access('two-pay-records'))
with check (public.is_active_user() and public.has_module_access('two-pay-records'));

notify pgrst, 'reload schema';
commit;
