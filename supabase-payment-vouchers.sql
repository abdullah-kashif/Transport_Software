-- GTLS Transport: Payment Vouchers Table & Permissions
-- Run this in the Supabase SQL Editor to enable remote persistence for Payment Vouchers.

create table if not exists public.payment_voucher_bank_accounts (
  id text primary key,
  bank_name text not null,
  account_title text,
  account_number text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists payment_voucher_bank_accounts_name_number_uq
  on public.payment_voucher_bank_accounts (
    lower(btrim(bank_name)),
    regexp_replace(btrim(account_number), '[[:space:]-]+', '', 'g')
  );

create table if not exists public.payment_vouchers (
  id text primary key,
  pv_no text not null,
  voucher_date date not null,
  pay_to text not null,
  pay_by text,
  account_no text,
  bank_account_id text references public.payment_voucher_bank_accounts(id) on delete restrict,
  prepared_by text,
  received_by text,
  total_amount numeric default 0,
  amount_in_words text,
  items jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.payment_vouchers
  add column if not exists bank_account_id text references public.payment_voucher_bank_accounts(id) on delete restrict;

grant usage on schema public to authenticated, service_role;
revoke all privileges on table public.payment_vouchers from anon;
grant select, insert, update, delete on table public.payment_vouchers to authenticated, service_role;

alter table public.payment_vouchers enable row level security;
drop policy if exists "payment_vouchers_module_access" on public.payment_vouchers;
create policy "payment_vouchers_module_access" on public.payment_vouchers
for all to authenticated
using (public.is_active_user() and public.has_module_access('payment-voucher'))
with check (public.is_active_user() and public.has_module_access('payment-voucher'));

alter table public.payment_voucher_bank_accounts enable row level security;
revoke all privileges on table public.payment_voucher_bank_accounts from anon, public;
grant select, insert, update, delete on table public.payment_voucher_bank_accounts to authenticated, service_role;
drop policy if exists payment_voucher_bank_accounts_module_access on public.payment_voucher_bank_accounts;
create policy payment_voucher_bank_accounts_module_access on public.payment_voucher_bank_accounts
for all to authenticated
using (public.is_active_user() and public.has_module_access('payment-voucher'))
with check (public.is_active_user() and public.has_module_access('payment-voucher'));
