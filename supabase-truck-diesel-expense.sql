-- Run in Supabase SQL Editor before saving Truck Details with Diesel Expense.
alter table public.truck_jobs
  add column if not exists diesel_expense numeric default 0;
