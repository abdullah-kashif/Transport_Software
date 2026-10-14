-- Add missing type_of_body column to public.equipment_fleet table
-- Run this in the Supabase SQL Editor as postgres.

alter table public.equipment_fleet add column if not exists type_of_body text;

-- Keep this additive migration restricted to authenticated app users.
revoke all privileges on table public.equipment_fleet from anon;
grant select, insert, update, delete on table public.equipment_fleet to authenticated, service_role;
