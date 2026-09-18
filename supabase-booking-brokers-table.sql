-- ==============================================================================
-- GTLS Transport: All-in-One Setup for Multi-Row Truckers / Brokers
-- Run this ONCE in the Supabase SQL Editor as postgres or on your VPS PostgreSQL.
-- Safe & Idempotent (IF NOT EXISTS): Will not break or duplicate any existing data.
-- ==============================================================================

-- 1. Ensure broker columns exist on main bookings table (for backwards compatibility)
alter table public.bookings
  add column if not exists trucker_broker text,
  add column if not exists broker_amount numeric,
  add column if not exists broker_payment_details text,
  add column if not exists broker_payment_date date,
  add column if not exists broker_lines jsonb;

-- 2. Create Relational Table for Multi-Row Brokers
create table if not exists public.booking_brokers (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  trucker_broker text,
  broker_amount numeric,
  broker_payment_details text,
  broker_payment_date date,
  container_ref text default 'all',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Fast lookup and reporting indexes
create index if not exists idx_booking_brokers_booking_id on public.booking_brokers(booking_id);
create index if not exists idx_booking_brokers_name on public.booking_brokers(trucker_broker);
create index if not exists idx_booking_brokers_date on public.booking_brokers(broker_payment_date);

-- Enable Row Level Security (RLS)
alter table public.booking_brokers enable row level security;

-- Grants
grant select, insert, update, delete on table public.booking_brokers to authenticated;
grant usage on schema public to authenticated;

-- RLS Policies matching booking_containers
drop policy if exists "booking_brokers_module_select" on public.booking_brokers;
create policy "booking_brokers_module_select" on public.booking_brokers for select to authenticated
using (
  public.has_module_access('dashboard') or
  public.has_module_access('booking') or
  public.has_module_access('ledger') or
  public.has_module_access('khata')
);

drop policy if exists "booking_brokers_module_insert" on public.booking_brokers;
create policy "booking_brokers_module_insert" on public.booking_brokers for insert to authenticated
with check (
  public.has_module_access('booking')
);

drop policy if exists "booking_brokers_module_update" on public.booking_brokers;
create policy "booking_brokers_module_update" on public.booking_brokers for update to authenticated
using (
  public.has_module_access('booking')
)
with check (
  public.has_module_access('booking')
);

drop policy if exists "booking_brokers_module_delete" on public.booking_brokers;
create policy "booking_brokers_module_delete" on public.booking_brokers for delete to authenticated
using (
  public.has_module_access('booking')
);
