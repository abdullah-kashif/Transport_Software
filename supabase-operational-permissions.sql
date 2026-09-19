-- Run once in the Supabase SQL Editor as the postgres role.
-- These policies let authenticated users with the matching module access
-- persist and reload Equipment & Handling Fleet and Fleet Maintenance rows.

grant select, insert, update, delete on table public.equipment_fleet to authenticated;
grant select, insert, update, delete on table public.maintenance_jobs to authenticated;

drop policy if exists "equipment_fleet_module_access" on public.equipment_fleet;
create policy "equipment_fleet_module_access" on public.equipment_fleet
for all to authenticated
using (
  public.is_active_user() and
  (public.has_module_access('equipment') or public.has_module_access('maintenance'))
)
with check (
  public.is_active_user() and
  (public.has_module_access('equipment') or public.has_module_access('maintenance'))
);

drop policy if exists "maintenance_jobs_module_access" on public.maintenance_jobs;
create policy "maintenance_jobs_module_access" on public.maintenance_jobs
for all to authenticated
using (
  public.is_active_user() and public.has_module_access('maintenance')
)
with check (
  public.is_active_user() and public.has_module_access('maintenance')
);
