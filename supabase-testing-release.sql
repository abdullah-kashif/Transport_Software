-- GTLS testing release patch
-- Run this once in Supabase SQL Editor after supabase-schema.sql.

alter table public.truck_jobs add column if not exists image_path text;
alter table public.equipment_fleet add column if not exists original_documents_path text;
alter table public.employees add column if not exists image_path text;

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
