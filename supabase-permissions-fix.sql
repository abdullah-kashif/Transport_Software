-- Run once in Supabase SQL Editor as the postgres role.
-- The service-role grants are used only by the manage-user Edge Function.
grant usage on schema public to service_role;
grant select, insert, update, delete on table public.profiles to service_role;

-- Keep browser access restricted to authenticated users and RLS policies.
revoke all on table public.profiles from anon;
grant select on table public.profiles to authenticated;

-- Dashboard and Booking Summary are read-only consumers of booking data.
drop policy if exists "bookings_module_select" on public.bookings;
create policy "bookings_module_select" on public.bookings for select to authenticated
using (
  public.has_module_access('dashboard') or
  public.has_module_access('booking') or
  public.has_module_access('ledger') or
  public.has_module_access('khata')
);

drop policy if exists "booking_containers_module_select" on public.booking_containers;
create policy "booking_containers_module_select" on public.booking_containers for select to authenticated
using (
  public.has_module_access('dashboard') or
  public.has_module_access('booking') or
  public.has_module_access('ledger') or
  public.has_module_access('khata')
);
