-- Two Pay Records: relational multi-container and Trucker/Broker detail rows.
-- Run in the Supabase SQL Editor before deploying the updated app.
-- Existing two_pay_records rows stay intact; their current container fields are
-- copied into the first relational container row for backward compatibility.

begin;

create table if not exists public.two_pay_containers (
  id uuid primary key default gen_random_uuid(),
  two_pay_record_id uuid not null references public.two_pay_records(id) on delete cascade,
  container_no text,
  container_size text,
  truck_no text,
  quantity numeric not null default 1 check (quantity >= 0),
  road_freight_two_pay numeric not null default 0,
  global_receivable numeric not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.two_pay_brokers (
  id uuid primary key default gen_random_uuid(),
  two_pay_record_id uuid not null references public.two_pay_records(id) on delete cascade,
  trucker_broker text,
  container_ref text,
  truck_no text,
  container_size text,
  amount numeric,
  payment_details text,
  payment_date date,
  payment_status text not null default 'Payable' check (payment_status in ('Payable', 'Paid')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists two_pay_containers_parent_sort_idx
  on public.two_pay_containers(two_pay_record_id, sort_order);
create index if not exists two_pay_brokers_parent_sort_idx
  on public.two_pay_brokers(two_pay_record_id, sort_order);

-- Preserve the current single-container values as detail row 1. This is safe to
-- rerun: rows are backfilled only when a record has no relational rows yet.
insert into public.two_pay_containers (
  two_pay_record_id, container_no, container_size, truck_no, quantity,
  road_freight_two_pay, global_receivable, sort_order
)
select
  record.id, record.container_no, record.size, record.truck_no, 1,
  coalesce(record.road_freight_two_pay, 0), coalesce(record.global_receivable, 0), 0
from public.two_pay_records as record
where (
  nullif(btrim(coalesce(record.container_no, '')), '') is not null
  or nullif(btrim(coalesce(record.size, '')), '') is not null
  or nullif(btrim(coalesce(record.truck_no, '')), '') is not null
  or coalesce(record.road_freight_two_pay, 0) <> 0
  or coalesce(record.global_receivable, 0) <> 0
)
and not exists (
  select 1 from public.two_pay_containers as detail
  where detail.two_pay_record_id = record.id
);

revoke all privileges on table public.two_pay_containers, public.two_pay_brokers from anon, public;
grant select, insert, update, delete on table public.two_pay_containers, public.two_pay_brokers to authenticated, service_role;

alter table public.two_pay_containers enable row level security;
drop policy if exists two_pay_containers_module_access on public.two_pay_containers;
create policy two_pay_containers_module_access on public.two_pay_containers
for all to authenticated
using (public.is_active_user() and public.has_module_access('two-pay-records'))
with check (public.is_active_user() and public.has_module_access('two-pay-records'));

alter table public.two_pay_brokers enable row level security;
drop policy if exists two_pay_brokers_module_access on public.two_pay_brokers;
create policy two_pay_brokers_module_access on public.two_pay_brokers
for all to authenticated
using (public.is_active_user() and public.has_module_access('two-pay-records'))
with check (public.is_active_user() and public.has_module_access('two-pay-records'));

notify pgrst, 'reload schema';
commit;
