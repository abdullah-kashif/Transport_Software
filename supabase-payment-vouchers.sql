-- GTLS Transport: Payment Vouchers Table & Permissions
-- Run this in the Supabase SQL Editor to enable remote persistence for Payment Vouchers.

create table if not exists public.payment_vouchers (
  id text primary key,
  pv_no text not null,
  voucher_date date not null,
  pay_to text not null,
  pay_by text,
  account_no text,
  prepared_by text,
  received_by text,
  total_amount numeric default 0,
  amount_in_words text,
  items jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

grant usage on schema public to authenticated, anon, service_role;
grant select, insert, update, delete on table public.payment_vouchers to authenticated, anon, service_role;

alter table public.payment_vouchers enable row level security;
drop policy if exists "payment_vouchers_module_access" on public.payment_vouchers;
create policy "payment_vouchers_module_access" on public.payment_vouchers
for all to authenticated
using (public.is_active_user() and public.has_module_access('payment-voucher'))
with check (public.is_active_user() and public.has_module_access('payment-voucher'));
