-- GTLS Transport: Two Pay Records permissions
-- The public.two_pay_records table and its columns already exist.
-- Run this once in the Supabase SQL Editor before using the module.

grant usage on schema public to authenticated, anon, service_role;
grant select, insert, update, delete on table public.two_pay_records to authenticated, anon, service_role;

alter table public.two_pay_records enable row level security;
drop policy if exists "two_pay_records_module_access" on public.two_pay_records;
create policy "two_pay_records_module_access" on public.two_pay_records
for all to authenticated
using (public.is_active_user() and public.has_module_access('two-pay-records'))
with check (public.is_active_user() and public.has_module_access('two-pay-records'));
