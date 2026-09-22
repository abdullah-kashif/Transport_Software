-- Add missing type_of_body column to public.equipment_fleet table
-- Run this in the Supabase SQL Editor as postgres.

alter table public.equipment_fleet add column if not exists type_of_body text;

-- Ensure authenticated and anon roles have access to equipment_fleet
grant select, insert, update, delete on table public.equipment_fleet to authenticated, anon, service_role;
