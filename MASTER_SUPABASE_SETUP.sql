-- GTLS Transport: master testing setup reference
-- Run the base schema first: supabase-schema.sql
-- Then run this file once in the Supabase SQL Editor as postgres.
-- Never paste a service-role key into this file or into frontend code.

alter table public.truck_jobs add column if not exists image_path text;
alter table public.truck_jobs add column if not exists export_customer text;
alter table public.truck_jobs add column if not exists export_cargo_description text;
alter table public.truck_jobs add column if not exists export_mty_box_freight numeric default 0;
alter table public.truck_jobs add column if not exists export_mty_broker text;
alter table public.truck_jobs add column if not exists export_mty_payment_date date;
alter table public.truck_jobs add column if not exists export_mty_payment_status text default 'Awaited';
alter table public.truck_jobs add column if not exists import_detention numeric default 0;
alter table public.truck_jobs add column if not exists import_payment_term text;
alter table public.truck_jobs add column if not exists import_customer_collection numeric default 0;
alter table public.truck_jobs add column if not exists export_detention numeric default 0;
alter table public.truck_jobs add column if not exists export_payment_term text;
alter table public.truck_jobs add column if not exists export_customer_collection numeric default 0;
alter table public.equipment_fleet add column if not exists original_documents_path text;
alter table public.equipment_fleet add column if not exists type_of_body text;
alter table public.employees add column if not exists image_path text;
alter table public.booking_containers add column if not exists quantity numeric;
alter table public.booking_containers add column if not exists unit_price numeric;
alter table public.booking_brokers add column if not exists container_ref text default 'all';
alter table public.booking_brokers add column if not exists truck_no text;
alter table public.booking_brokers add column if not exists container_size text;
alter table public.bookings add column if not exists broker_entries jsonb default '[]'::jsonb;

-- Allow authenticated and anon users to persist and
-- reload Booking, Container, Broker, Equipment & Handling Fleet, and Fleet Maintenance records.
grant usage on schema public to authenticated, anon, service_role;
grant select, insert, update, delete on table public.equipment_fleet to authenticated, anon, service_role;
grant select, insert, update, delete on table public.maintenance_jobs to authenticated, anon, service_role;
grant select, insert, update, delete on table public.bookings to authenticated, anon, service_role;
grant select, insert, update, delete on table public.booking_containers to authenticated, anon, service_role;
grant select, insert, update, delete on table public.booking_brokers to authenticated, anon, service_role;
grant all on all sequences in schema public to authenticated, anon, service_role;

drop policy if exists "equipment_fleet_module_access" on public.equipment_fleet;
create policy "equipment_fleet_module_access" on public.equipment_fleet
for all to authenticated
using (public.is_active_user() and (public.has_module_access('equipment') or public.has_module_access('maintenance')))
with check (public.is_active_user() and (public.has_module_access('equipment') or public.has_module_access('maintenance')));

drop policy if exists "maintenance_jobs_module_access" on public.maintenance_jobs;
create policy "maintenance_jobs_module_access" on public.maintenance_jobs
for all to authenticated
using (public.is_active_user() and public.has_module_access('maintenance'))
with check (public.is_active_user() and public.has_module_access('maintenance'));

-- Keep new generated IDs readable: Job-1, Job-2 and MNT-1, MNT-2.
alter table public.bookings
  alter column job_no set default ('Job-' || nextval('public.booking_job_seq')::text);
alter table public.truck_jobs
  alter column job_no set default ('Job-' || nextval('public.truck_job_seq')::text);
alter table public.maintenance_jobs
  alter column maintenance_job_no set default ('MNT-' || nextval('public.maintenance_job_seq')::text);

-- Ensure Sub Admins with the Khata module can persist and reload statement entries.
create or replace function public.has_account_access(target_account_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.accounts a
    where a.id = target_account_id
      and public.has_module_access(
        case when a.account_type = 'payable' then 'accounts-payable' else 'khata' end
      )
  );
$$;

drop policy if exists "account_entries_module_select" on public.account_entries;
drop policy if exists "account_entries_module_insert" on public.account_entries;
drop policy if exists "account_entries_module_update" on public.account_entries;
drop policy if exists "account_entries_module_delete" on public.account_entries;

create policy "account_entries_module_select" on public.account_entries
for select to authenticated using (public.has_account_access(account_id));
create policy "account_entries_module_insert" on public.account_entries
for insert to authenticated with check (public.has_account_access(account_id));
create policy "account_entries_module_update" on public.account_entries
for update to authenticated
using (public.has_account_access(account_id))
with check (public.has_account_access(account_id));
create policy "account_entries_module_delete" on public.account_entries
for delete to authenticated using (public.has_account_access(account_id));

create or replace function public.prune_old_activity_logs()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.activity_logs
  where created_at < now() - interval '3 months';
  return new;
end;
$$;

drop trigger if exists activity_logs_retention_trigger on public.activity_logs;
create trigger activity_logs_retention_trigger
after insert on public.activity_logs
for each statement execute function public.prune_old_activity_logs();

delete from public.activity_logs
where created_at < now() - interval '3 months';

-- Keep the private bucket private. The frontend receives only signed URLs.
drop policy if exists "private_documents_select" on storage.objects;
drop policy if exists "private_documents_insert" on storage.objects;
drop policy if exists "private_documents_update" on storage.objects;
drop policy if exists "private_documents_delete" on storage.objects;

create policy "private_documents_select" on storage.objects for select to authenticated
using (
  bucket_id = 'gtls-private-documents' and public.is_active_user() and
  case (storage.foldername(name))[1]
    when 'bookings' then public.has_module_access('booking') or public.has_module_access('ledger')
    when 'trucks' then public.has_module_access('truck') or public.has_module_access('truck-summary') or public.has_module_access('completed-truck-summary')
    when 'equipment' then public.has_module_access('equipment')
    when 'maintenance' then public.has_module_access('maintenance')
    when 'employees' then public.has_module_access('employee')
    when 'receivable' then public.has_module_access('khata')
    when 'payable' then public.has_module_access('accounts-payable')
    else public.is_super_admin()
  end
);

create policy "private_documents_insert" on storage.objects for insert to authenticated
with check (
  bucket_id = 'gtls-private-documents' and public.is_active_user() and
  case (storage.foldername(name))[1]
    when 'bookings' then public.has_module_access('booking')
    when 'trucks' then public.has_module_access('truck')
    when 'equipment' then public.has_module_access('equipment')
    when 'maintenance' then public.has_module_access('maintenance')
    when 'employees' then public.has_module_access('employee')
    when 'receivable' then public.has_module_access('khata')
    when 'payable' then public.has_module_access('accounts-payable')
    else public.is_super_admin()
  end
);

create policy "private_documents_update" on storage.objects for update to authenticated
using (
  bucket_id = 'gtls-private-documents' and public.is_active_user() and
  case (storage.foldername(name))[1]
    when 'bookings' then public.has_module_access('booking')
    when 'trucks' then public.has_module_access('truck')
    when 'equipment' then public.has_module_access('equipment')
    when 'maintenance' then public.has_module_access('maintenance')
    when 'employees' then public.has_module_access('employee')
    when 'receivable' then public.has_module_access('khata')
    when 'payable' then public.has_module_access('accounts-payable')
    else public.is_super_admin()
  end
)
with check (
  bucket_id = 'gtls-private-documents' and public.is_active_user() and
  case (storage.foldername(name))[1]
    when 'bookings' then public.has_module_access('booking')
    when 'trucks' then public.has_module_access('truck')
    when 'equipment' then public.has_module_access('equipment')
    when 'maintenance' then public.has_module_access('maintenance')
    when 'employees' then public.has_module_access('employee')
    when 'receivable' then public.has_module_access('khata')
    when 'payable' then public.has_module_access('accounts-payable')
    else public.is_super_admin()
  end
);

create policy "private_documents_delete" on storage.objects for delete to authenticated
using (
  bucket_id = 'gtls-private-documents' and public.is_active_user() and
  case (storage.foldername(name))[1]
    when 'bookings' then public.has_module_access('booking')
    when 'trucks' then public.has_module_access('truck')
    when 'equipment' then public.has_module_access('equipment')
    when 'maintenance' then public.has_module_access('maintenance')
    when 'employees' then public.has_module_access('employee')
    when 'receivable' then public.has_module_access('khata')
    when 'payable' then public.has_module_access('accounts-payable')
    else public.is_super_admin()
  end
);
