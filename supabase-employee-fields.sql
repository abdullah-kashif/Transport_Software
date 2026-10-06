-- Run in Supabase SQL Editor to support new employee fields:
-- Registration / License No, CNIC, Date of Birth, Resignation Date, Reference Details

alter table public.employees
  add column if not exists registration_no text,
  add column if not exists cnic text,
  add column if not exists dob date,
  add column if not exists resignation_date date,
  add column if not exists reference_details text;
