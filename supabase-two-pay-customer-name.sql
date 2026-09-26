-- Run once in Supabase SQL Editor before using the Two Pay Customer Name field.
-- Existing records remain unchanged; their Customer Name stays blank until edited.
alter table public.two_pay_records
  add column if not exists customer_name text;

notify pgrst, 'reload schema';
