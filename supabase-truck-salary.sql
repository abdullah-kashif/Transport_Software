-- Add the trip-level Salary field without changing or deleting existing truck jobs.
-- Run this once in the Supabase SQL Editor as postgres before saving Salary values.

alter table public.truck_jobs
  add column if not exists salary numeric not null default 0;

comment on column public.truck_jobs.salary is
  'Trip-level salary amount; stored separately and not deducted from P&L.';
