-- Additive Truck Details fuel tracking migration.
-- Existing truck_jobs and diesel_expense values are preserved unchanged.
-- New refill rows are linked to a job and can be removed only by their IDs.

begin;

alter table public.truck_jobs
  add column if not exists total_distance_km numeric not null default 0;

create table if not exists public.truck_fuel_refills (
  id uuid primary key default gen_random_uuid(),
  job_no text not null references public.truck_jobs(job_no) on update cascade on delete cascade,
  fuel_station text,
  fuel_quantity_liters numeric,
  amount_pkr numeric,
  refill_date date,
  running_meter numeric,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists truck_fuel_refills_job_sort_idx
  on public.truck_fuel_refills(job_no, sort_order);

alter table public.truck_fuel_refills enable row level security;
revoke all privileges on table public.truck_fuel_refills from anon, public;
grant select, insert, update, delete on table public.truck_fuel_refills to authenticated;
grant all privileges on table public.truck_fuel_refills to service_role;

drop policy if exists truck_fuel_refills_read_access on public.truck_fuel_refills;
create policy truck_fuel_refills_read_access on public.truck_fuel_refills
for select to authenticated using (public.is_active_user() and (
  public.has_module_access('truck') or public.has_module_access('truck-summary')
  or public.has_module_access('completed-truck-summary')
));

drop policy if exists truck_fuel_refills_insert_access on public.truck_fuel_refills;
create policy truck_fuel_refills_insert_access on public.truck_fuel_refills
for insert to authenticated with check (public.is_active_user() and public.has_module_access('truck'));

drop policy if exists truck_fuel_refills_update_access on public.truck_fuel_refills;
create policy truck_fuel_refills_update_access on public.truck_fuel_refills
for update to authenticated using (public.is_active_user() and public.has_module_access('truck'))
with check (public.is_active_user() and public.has_module_access('truck'));

drop policy if exists truck_fuel_refills_delete_access on public.truck_fuel_refills;
create policy truck_fuel_refills_delete_access on public.truck_fuel_refills
for delete to authenticated using (public.is_active_user() and public.has_module_access('truck'));

commit;
