-- GTLS Transport: Payment Voucher cash fund ledger
-- Additive migration: this creates a separate table and does not alter or delete
-- existing Payment Voucher records.

begin;

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

create table if not exists public.payment_voucher_funds (
  id text primary key,
  entry_type text not null check (entry_type in ('opening_balance', 'fund_added')),
  entry_date date not null,
  bank_account_id text references public.payment_voucher_bank_accounts(id) on delete restrict,
  source_account text,
  reference text,
  remarks text,
  amount numeric(14, 2) not null check (amount > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payment_voucher_funds
  add column if not exists bank_account_id text references public.payment_voucher_bank_accounts(id) on delete restrict;

drop index if exists public.payment_voucher_funds_single_opening_balance;
create unique index if not exists payment_voucher_funds_single_opening_balance_per_bank
  on public.payment_voucher_funds (bank_account_id)
  where entry_type = 'opening_balance' and bank_account_id is not null;
create unique index if not exists payment_voucher_funds_single_unassigned_opening
  on public.payment_voucher_funds (entry_type)
  where entry_type = 'opening_balance' and bank_account_id is null;
create index if not exists payment_voucher_funds_bank_account_date_idx
  on public.payment_voucher_funds (bank_account_id, entry_date);

alter table public.payment_voucher_bank_accounts enable row level security;
revoke all privileges on table public.payment_voucher_bank_accounts from anon, public;
grant select, insert, update, delete on table public.payment_voucher_bank_accounts to authenticated, service_role;

drop policy if exists payment_voucher_bank_accounts_module_access on public.payment_voucher_bank_accounts;
create policy payment_voucher_bank_accounts_module_access on public.payment_voucher_bank_accounts
for all to authenticated
using (public.is_active_user() and public.has_module_access('payment-voucher'))
with check (public.is_active_user() and public.has_module_access('payment-voucher'));

alter table public.payment_voucher_funds enable row level security;
grant usage on schema public to authenticated, service_role;
revoke all privileges on table public.payment_voucher_funds from anon, public;
grant select, insert, update, delete on table public.payment_voucher_funds to authenticated, service_role;

drop policy if exists payment_voucher_funds_module_access on public.payment_voucher_funds;
create policy payment_voucher_funds_module_access on public.payment_voucher_funds
for all to authenticated
using (public.is_active_user() and public.has_module_access('payment-voucher'))
with check (public.is_active_user() and public.has_module_access('payment-voucher'));

commit;
