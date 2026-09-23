-- GTLS Transport: Equipment & Handling Fleet ownership and insurance fields
-- Run once in the Supabase SQL Editor before using the updated form.

alter table public.equipment_fleet
  add column if not exists ownership text,
  add column if not exists third_party_insurance_date date;
