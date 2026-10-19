-- GTLS Transport: relational bank accounts for Payment Voucher funds and payments.
-- Additive migration: existing vouchers and fund entries are retained. Old rows
-- remain unassigned until an authorized user links them to a registered account.

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

alter table public.payment_voucher_funds
  add column if not exists bank_account_id text;

alter table public.payment_vouchers
  add column if not exists bank_account_id text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'payment_voucher_funds_bank_account_id_fkey'
      and conrelid = 'public.payment_voucher_funds'::regclass
  ) then
    alter table public.payment_voucher_funds
      add constraint payment_voucher_funds_bank_account_id_fkey
      foreign key (bank_account_id)
      references public.payment_voucher_bank_accounts(id)
      on delete restrict;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'payment_vouchers_bank_account_id_fkey'
      and conrelid = 'public.payment_vouchers'::regclass
  ) then
    alter table public.payment_vouchers
      add constraint payment_vouchers_bank_account_id_fkey
      foreign key (bank_account_id)
      references public.payment_voucher_bank_accounts(id)
      on delete restrict;
  end if;
end
$$;

create index if not exists payment_voucher_funds_bank_account_date_idx
  on public.payment_voucher_funds (bank_account_id, entry_date);

create index if not exists payment_vouchers_bank_account_date_idx
  on public.payment_vouchers (bank_account_id, voucher_date);

-- Replace the old one-opening-balance-for-everything rule with one per bank.
-- The separate NULL index preserves the existing single unassigned legacy row.
drop index if exists public.payment_voucher_funds_single_opening_balance;

create unique index if not exists payment_voucher_funds_single_opening_balance_per_bank
  on public.payment_voucher_funds (bank_account_id)
  where entry_type = 'opening_balance' and bank_account_id is not null;

create unique index if not exists payment_voucher_funds_single_unassigned_opening
  on public.payment_voucher_funds (entry_type)
  where entry_type = 'opening_balance' and bank_account_id is null;

alter table public.payment_voucher_bank_accounts enable row level security;
revoke all privileges on table public.payment_voucher_bank_accounts from anon, public;
grant select, insert, update, delete on table public.payment_voucher_bank_accounts to authenticated, service_role;

drop policy if exists payment_voucher_bank_accounts_module_access on public.payment_voucher_bank_accounts;
create policy payment_voucher_bank_accounts_module_access on public.payment_voucher_bank_accounts
for all to authenticated
using (public.is_active_user() and public.has_module_access('payment-voucher'))
with check (public.is_active_user() and public.has_module_access('payment-voucher'));

commit;
