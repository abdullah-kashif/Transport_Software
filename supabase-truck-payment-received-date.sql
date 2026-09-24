-- GTLS Transport: payment received dates for Import and Export Details
-- Run once in the Supabase SQL Editor before using the updated Truck Details form.

alter table public.truck_jobs
  add column if not exists import_payment_received_date date,
  add column if not exists export_payment_received_date date;
