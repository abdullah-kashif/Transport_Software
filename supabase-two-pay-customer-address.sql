-- Run once in Supabase SQL Editor before saving Two Pay Records with Customer Address.
alter table public.two_pay_records
  add column if not exists customer_address text;
