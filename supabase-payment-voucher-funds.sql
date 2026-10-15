-- GTLS Transport: Payment Voucher cash fund ledger
-- Additive migration: this creates a separate table and does not alter or delete
-- existing Payment Voucher records.

begin;

create table if not exists public.payment_voucher_funds (
  id text primary key,
  entry_type text not null check (entry_type in ('opening_balance', 'fund_added')),
  entry_date date not null,
  source_account text,
  reference text,
  remarks text,
  amount numeric(14, 2) not null check (amount > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists payment_voucher_funds_single_opening_balance
  on public.payment_voucher_funds (entry_type)
  where entry_type = 'opening_balance';

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
