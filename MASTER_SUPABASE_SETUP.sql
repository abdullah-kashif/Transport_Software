-- GTLS Transport: master testing setup reference
-- Run the base schema first: supabase-schema.sql
-- Then run this file once in the Supabase SQL Editor as postgres.
-- Never paste a service-role key into this file or into frontend code.

alter table public.truck_jobs add column if not exists image_path text;
alter table public.truck_jobs add column if not exists export_customer text;
alter table public.truck_jobs add column if not exists export_cargo_description text;
alter table public.truck_jobs add column if not exists export_mty_box_freight numeric default 0;
alter table public.truck_jobs add column if not exists export_mty_broker text;
alter table public.truck_jobs add column if not exists export_mty_payment_date date;
alter table public.truck_jobs add column if not exists export_mty_payment_status text default 'Awaited';
alter table public.truck_jobs add column if not exists import_detention numeric default 0;
alter table public.truck_jobs add column if not exists import_payment_term text;
alter table public.truck_jobs add column if not exists import_customer_collection numeric default 0;
alter table public.truck_jobs add column if not exists export_detention numeric default 0;
alter table public.truck_jobs add column if not exists export_payment_term text;
alter table public.truck_jobs add column if not exists export_customer_collection numeric default 0;
alter table public.truck_jobs add column if not exists import_payment_received_date date;
alter table public.truck_jobs add column if not exists export_payment_received_date date;
alter table public.truck_jobs add column if not exists diesel_expense numeric default 0;
alter table public.truck_jobs add column if not exists salary numeric not null default 0;
alter table public.truck_jobs add column if not exists additional_import_details jsonb not null default '[]'::jsonb;
alter table public.truck_jobs add column if not exists additional_export_details jsonb not null default '[]'::jsonb;

create table if not exists public.truck_import_details (
  job_no text not null references public.truck_jobs(job_no) on update cascade on delete cascade,
  detail_number integer not null check (detail_number >= 2),
  import_truck_no text, import_date date, import_customer text, import_origin text, import_destination text,
  import_size text, import_weight text, import_cargo_description text,
  mty_box_freight numeric not null default 0, mty_broker text, import_freight numeric not null default 0,
  import_detention numeric not null default 0, import_broker_commission numeric not null default 0,
  import_broker text, import_receivable_amount numeric not null default 0, import_payment_term text,
  import_cheque_details text, import_payment_received_date date, import_payment_status text not null default 'Awaited',
  mty_payment_date date, mty_payment_status text not null default 'Awaited',
  import_customer_collection numeric not null default 0, import_payment_date date, import_cheque_details2 text,
  import_remarks text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  primary key (job_no, detail_number)
);
create table if not exists public.truck_export_details (
  job_no text not null references public.truck_jobs(job_no) on update cascade on delete cascade,
  detail_number integer not null check (detail_number >= 2),
  export_truck_no text, export_load_date date, export_customer text, export_origin text, export_destination text,
  export_size text, export_weight text, export_cargo_description text,
  export_mty_box_freight numeric not null default 0, export_mty_broker text, export_freight numeric not null default 0,
  export_detention numeric not null default 0, export_broker_commission numeric not null default 0,
  export_broker text, export_receivable_amount numeric not null default 0, export_payment_term text,
  export_cheque_details text, export_payment_received_date date, export_payment_status text not null default 'Awaited',
  export_mty_payment_date date, export_mty_payment_status text not null default 'Awaited',
  export_customer_collection numeric not null default 0, export_payment_date date, export_cheque_details2 text,
  export_remarks text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  primary key (job_no, detail_number)
);
create index if not exists truck_import_details_import_date_idx on public.truck_import_details(import_date);
create index if not exists truck_import_details_truck_no_idx on public.truck_import_details(import_truck_no);
create index if not exists truck_export_details_load_date_idx on public.truck_export_details(export_load_date);
create index if not exists truck_export_details_truck_no_idx on public.truck_export_details(export_truck_no);
alter table public.equipment_fleet add column if not exists original_documents_path text;
alter table public.equipment_fleet add column if not exists type_of_body text;
alter table public.equipment_fleet add column if not exists ownership text;
alter table public.equipment_fleet add column if not exists third_party_insurance_date date;
alter table public.employees add column if not exists image_path text;
alter table public.employees add column if not exists registration_no text;
alter table public.employees add column if not exists cnic text;
alter table public.employees add column if not exists dob date;
alter table public.employees add column if not exists resignation_date date;
alter table public.employees add column if not exists reference_details text;
alter table public.booking_containers add column if not exists quantity numeric;
alter table public.booking_containers add column if not exists unit_price numeric;
alter table public.booking_brokers add column if not exists container_ref text default 'all';
alter table public.booking_brokers add column if not exists truck_no text;
alter table public.booking_brokers add column if not exists container_size text;
alter table public.bookings add column if not exists broker_entries jsonb default '[]'::jsonb;
alter table public.two_pay_records add column if not exists customer_name text;
alter table public.two_pay_records add column if not exists customer_address text;

create table if not exists public.two_pay_containers (
  id uuid primary key default gen_random_uuid(),
  two_pay_record_id text not null references public.two_pay_records(id) on delete cascade,
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
  two_pay_record_id text not null references public.two_pay_records(id) on delete cascade,
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

do $$
begin
  if exists (
    select 1
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
    )
  ) then
    raise exception 'Two Pay container backfill verification failed; setup halted.';
  end if;
end;
$$;

create table if not exists public.builty_records (
  id text primary key,
  builty_no text not null,
  bilty_date date,
  consignor text,
  consignee text,
  truck_no text,
  driver_name text,
  route text,
  goods_description text,
  quantity text,
  weight text,
  received_by text,
  remarks text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Business data is available only after Supabase authentication. The browser
-- publishable key is public by design, so anon receives no public-schema grants.
revoke all privileges on schema public from anon;
revoke all privileges on all tables in schema public from anon;
revoke all privileges on all sequences in schema public from anon;
revoke all privileges on schema storage from anon, public;
revoke all privileges on table storage.objects from anon, public;

-- Authenticated users persist/reload records under the module-scoped policies below.
grant usage on schema public to authenticated, service_role;
grant usage on schema storage to authenticated, service_role;
grant select, insert, update, delete on table public.equipment_fleet to authenticated, service_role;
grant select, insert, update, delete on table public.maintenance_jobs to authenticated, service_role;
grant select, insert, update, delete on table public.two_pay_records, public.two_pay_containers, public.two_pay_brokers to authenticated, service_role;
grant select, insert, update, delete on table public.builty_records to authenticated, service_role;
grant select, insert, update, delete on table public.bookings to authenticated, service_role;
grant select, insert, update, delete on table public.booking_containers to authenticated, service_role;
grant select, insert, update, delete on table public.booking_brokers to authenticated, service_role;
grant select, insert, update, delete on table public.truck_jobs to authenticated, service_role;
grant select, insert, update on table public.truck_import_details, public.truck_export_details to authenticated;
grant all on table public.truck_import_details, public.truck_export_details to service_role;
grant select, insert, update, delete on table public.employees to authenticated, service_role;
grant select, insert, update, delete on table public.accounts to authenticated, service_role;
grant select, insert, update, delete on table public.account_entries to authenticated, service_role;
grant select, insert on table public.activity_logs to authenticated, service_role;
grant all on all sequences in schema public to authenticated, service_role;
grant all privileges on table storage.objects to authenticated, service_role;

-- Remove legacy anon and unconditional-authenticated policies before rebuilding
-- the booking and Two Pay rules with module checks.
do $$
declare
  policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and (
        ('anon'::name = any(roles) or 'public'::name = any(roles))
        or (
          tablename in ('bookings', 'booking_containers', 'booking_brokers', 'two_pay_records', 'two_pay_containers', 'two_pay_brokers')
          and
          'authenticated'::name = any(roles)
          and (
            (cmd in ('SELECT', 'UPDATE', 'DELETE', 'ALL')
              and coalesce(nullif(btrim(qual), ''), 'true') = 'true')
            or
            (cmd in ('INSERT', 'UPDATE', 'ALL')
              and coalesce(nullif(btrim(with_check), ''), 'true') = 'true')
          )
        )
      )
  loop
    execute format('drop policy %I on %I.%I',
      policy_row.policyname, policy_row.schemaname, policy_row.tablename);
  end loop;
end;
$$;

do $$
declare
  policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and ('anon'::name = any(roles) or 'public'::name = any(roles))
  loop
    execute format('drop policy %I on %I.%I',
      policy_row.policyname, policy_row.schemaname, policy_row.tablename);
  end loop;
end;
$$;

alter table public.bookings enable row level security;
alter table public.booking_containers enable row level security;
alter table public.booking_brokers enable row level security;

drop policy if exists "bookings_module_select" on public.bookings;
drop policy if exists "bookings_module_insert" on public.bookings;
drop policy if exists "bookings_module_update" on public.bookings;
drop policy if exists "bookings_module_delete" on public.bookings;
create policy "bookings_module_select" on public.bookings
for select to authenticated
using (
  public.is_active_user() and (
    public.has_module_access('dashboard') or public.has_module_access('booking') or
    public.has_module_access('ledger') or public.has_module_access('broker-summary') or
    public.has_module_access('khata')
  )
);
create policy "bookings_module_insert" on public.bookings
for insert to authenticated
with check (public.is_active_user() and public.has_module_access('booking'));
create policy "bookings_module_update" on public.bookings
for update to authenticated
using (public.is_active_user() and public.has_module_access('booking'))
with check (public.is_active_user() and public.has_module_access('booking'));
create policy "bookings_module_delete" on public.bookings
for delete to authenticated
using (public.is_active_user() and public.has_module_access('booking'));

alter table public.booking_containers enable row level security;
drop policy if exists "booking_containers_module_select" on public.booking_containers;
drop policy if exists "booking_containers_module_insert" on public.booking_containers;
drop policy if exists "booking_containers_module_update" on public.booking_containers;
drop policy if exists "booking_containers_module_delete" on public.booking_containers;
create policy "booking_containers_module_select" on public.booking_containers
for select to authenticated
using (
  public.is_active_user() and (
    public.has_module_access('dashboard') or public.has_module_access('booking') or
    public.has_module_access('ledger') or public.has_module_access('broker-summary') or
    public.has_module_access('khata')
  )
);
create policy "booking_containers_module_insert" on public.booking_containers
for insert to authenticated
with check (public.is_active_user() and public.has_module_access('booking'));
create policy "booking_containers_module_update" on public.booking_containers
for update to authenticated
using (public.is_active_user() and public.has_module_access('booking'))
with check (public.is_active_user() and public.has_module_access('booking'));
create policy "booking_containers_module_delete" on public.booking_containers
for delete to authenticated
using (public.is_active_user() and public.has_module_access('booking'));

alter table public.booking_brokers enable row level security;
drop policy if exists "booking_brokers_module_select" on public.booking_brokers;
drop policy if exists "booking_brokers_module_insert" on public.booking_brokers;
drop policy if exists "booking_brokers_module_update" on public.booking_brokers;
drop policy if exists "booking_brokers_module_delete" on public.booking_brokers;
create policy "booking_brokers_module_select" on public.booking_brokers
for select to authenticated
using (
  public.is_active_user() and (
    public.has_module_access('dashboard') or public.has_module_access('booking') or
    public.has_module_access('ledger') or public.has_module_access('broker-summary') or
    public.has_module_access('khata')
  )
);
create policy "booking_brokers_module_insert" on public.booking_brokers
for insert to authenticated
with check (public.is_active_user() and public.has_module_access('booking'));
create policy "booking_brokers_module_update" on public.booking_brokers
for update to authenticated
using (public.is_active_user() and public.has_module_access('booking'))
with check (public.is_active_user() and public.has_module_access('booking'));
create policy "booking_brokers_module_delete" on public.booking_brokers
for delete to authenticated
using (public.is_active_user() and public.has_module_access('booking'));

drop policy if exists "equipment_fleet_module_access" on public.equipment_fleet;
create policy "equipment_fleet_module_access" on public.equipment_fleet
for all to authenticated
using (public.is_active_user() and (public.has_module_access('equipment') or public.has_module_access('maintenance')))
with check (public.is_active_user() and (public.has_module_access('equipment') or public.has_module_access('maintenance')));

drop policy if exists "maintenance_jobs_module_access" on public.maintenance_jobs;
create policy "maintenance_jobs_module_access" on public.maintenance_jobs
for all to authenticated
using (public.is_active_user() and public.has_module_access('maintenance'))
with check (public.is_active_user() and public.has_module_access('maintenance'));

alter table public.truck_import_details enable row level security;
drop policy if exists truck_import_details_read_access on public.truck_import_details;
create policy truck_import_details_read_access on public.truck_import_details
for select to authenticated using (public.is_active_user() and (
  public.has_module_access('truck') or public.has_module_access('truck-summary')
  or public.has_module_access('completed-truck-summary')
));
drop policy if exists truck_import_details_insert_access on public.truck_import_details;
create policy truck_import_details_insert_access on public.truck_import_details
for insert to authenticated with check (public.is_active_user() and public.has_module_access('truck'));
drop policy if exists truck_import_details_update_access on public.truck_import_details;
create policy truck_import_details_update_access on public.truck_import_details
for update to authenticated using (public.is_active_user() and public.has_module_access('truck'))
with check (public.is_active_user() and public.has_module_access('truck'));

alter table public.truck_export_details enable row level security;
drop policy if exists truck_export_details_read_access on public.truck_export_details;
create policy truck_export_details_read_access on public.truck_export_details
for select to authenticated using (public.is_active_user() and (
  public.has_module_access('truck') or public.has_module_access('truck-summary')
  or public.has_module_access('completed-truck-summary')
));
drop policy if exists truck_export_details_insert_access on public.truck_export_details;
create policy truck_export_details_insert_access on public.truck_export_details
for insert to authenticated with check (public.is_active_user() and public.has_module_access('truck'));
drop policy if exists truck_export_details_update_access on public.truck_export_details;
create policy truck_export_details_update_access on public.truck_export_details
for update to authenticated using (public.is_active_user() and public.has_module_access('truck'))
with check (public.is_active_user() and public.has_module_access('truck'));

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

grant select, insert, update, delete on table public.payment_vouchers to authenticated, service_role;

alter table public.two_pay_records enable row level security;
drop policy if exists "Enable all for anon users on two_pay_records" on public.two_pay_records;
drop policy if exists "Enable all for authenticated users on two_pay_records" on public.two_pay_records;
drop policy if exists "Enable all for service_role on two_pay_records" on public.two_pay_records;
drop policy if exists "two_pay_records_module_access" on public.two_pay_records;
create policy "two_pay_records_module_access" on public.two_pay_records
for all to authenticated
using (public.is_active_user() and public.has_module_access('two-pay-records'))
with check (public.is_active_user() and public.has_module_access('two-pay-records'));

alter table public.two_pay_containers enable row level security;
revoke all privileges on table public.two_pay_containers from anon, public;
drop policy if exists two_pay_containers_module_access on public.two_pay_containers;
create policy two_pay_containers_module_access on public.two_pay_containers
for all to authenticated
using (public.is_active_user() and public.has_module_access('two-pay-records'))
with check (public.is_active_user() and public.has_module_access('two-pay-records'));

alter table public.two_pay_brokers enable row level security;
revoke all privileges on table public.two_pay_brokers from anon, public;
drop policy if exists two_pay_brokers_module_access on public.two_pay_brokers;
create policy two_pay_brokers_module_access on public.two_pay_brokers
for all to authenticated
using (public.is_active_user() and public.has_module_access('two-pay-records'))
with check (public.is_active_user() and public.has_module_access('two-pay-records'));

alter table public.payment_vouchers enable row level security;
drop policy if exists "payment_vouchers_module_access" on public.payment_vouchers;
create policy "payment_vouchers_module_access" on public.payment_vouchers
for all to authenticated
using (public.is_active_user() and public.has_module_access('payment-voucher'))
with check (public.is_active_user() and public.has_module_access('payment-voucher'));

alter table public.payment_voucher_funds enable row level security;
revoke all privileges on table public.payment_voucher_funds from anon, public;
grant select, insert, update, delete on table public.payment_voucher_funds to authenticated, service_role;
drop policy if exists payment_voucher_funds_module_access on public.payment_voucher_funds;
create policy payment_voucher_funds_module_access on public.payment_voucher_funds
for all to authenticated
using (public.is_active_user() and public.has_module_access('payment-voucher'))
with check (public.is_active_user() and public.has_module_access('payment-voucher'));

alter table public.builty_records enable row level security;
drop policy if exists "builty_records_module_access" on public.builty_records;
create policy "builty_records_module_access" on public.builty_records
for all to authenticated
using (public.is_active_user() and public.has_module_access('builty'))
with check (public.is_active_user() and public.has_module_access('builty'));

-- Keep new generated IDs readable: Job-1, Job-2 and MNT-1, MNT-2.
alter table public.bookings
  alter column job_no set default ('Job-' || nextval('public.booking_job_seq')::text);
alter table public.truck_jobs
  alter column job_no set default ('Job-' || nextval('public.truck_job_seq')::text);
alter table public.maintenance_jobs
  alter column maintenance_job_no set default ('MNT-' || nextval('public.maintenance_job_seq')::text);

-- Ensure Sub Admins with the Khata module can persist and reload statement entries.
create or replace function public.has_account_access(target_account_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.accounts a
    where a.id = target_account_id
      and public.has_module_access(
        case when a.account_type = 'payable' then 'accounts-payable' else 'khata' end
      )
  );
$$;

drop policy if exists "account_entries_module_select" on public.account_entries;
drop policy if exists "account_entries_module_insert" on public.account_entries;
drop policy if exists "account_entries_module_update" on public.account_entries;
drop policy if exists "account_entries_module_delete" on public.account_entries;

create policy "account_entries_module_select" on public.account_entries
for select to authenticated using (public.has_account_access(account_id));
create policy "account_entries_module_insert" on public.account_entries
for insert to authenticated with check (public.has_account_access(account_id));
create policy "account_entries_module_update" on public.account_entries
for update to authenticated
using (public.has_account_access(account_id))
with check (public.has_account_access(account_id));
create policy "account_entries_module_delete" on public.account_entries
for delete to authenticated using (public.has_account_access(account_id));

create or replace function public.prune_old_activity_logs()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.activity_logs
  where created_at < now() - interval '3 months';
  return new;
end;
$$;

drop trigger if exists activity_logs_retention_trigger on public.activity_logs;
create trigger activity_logs_retention_trigger
after insert on public.activity_logs
for each statement execute function public.prune_old_activity_logs();

delete from public.activity_logs
where created_at < now() - interval '3 months';

-- Keep the private bucket private. The frontend receives only signed URLs.
drop policy if exists "private_documents_select" on storage.objects;
drop policy if exists "private_documents_insert" on storage.objects;
drop policy if exists "private_documents_update" on storage.objects;
drop policy if exists "private_documents_delete" on storage.objects;

create policy "private_documents_select" on storage.objects for select to authenticated
using (
  bucket_id = 'gtls-private-documents' and public.is_active_user() and
  case (storage.foldername(name))[1]
    when 'bookings' then public.has_module_access('booking') or public.has_module_access('ledger')
    when 'trucks' then public.has_module_access('truck') or public.has_module_access('truck-summary') or public.has_module_access('completed-truck-summary')
    when 'equipment' then public.has_module_access('equipment')
    when 'maintenance' then public.has_module_access('maintenance')
    when 'employees' then public.has_module_access('employee')
    when 'receivable' then public.has_module_access('khata')
    when 'payable' then public.has_module_access('accounts-payable')
    else public.is_super_admin()
  end
);

create policy "private_documents_insert" on storage.objects for insert to authenticated
with check (
  bucket_id = 'gtls-private-documents' and public.is_active_user() and
  case (storage.foldername(name))[1]
    when 'bookings' then public.has_module_access('booking')
    when 'trucks' then public.has_module_access('truck')
    when 'equipment' then public.has_module_access('equipment')
    when 'maintenance' then public.has_module_access('maintenance')
    when 'employees' then public.has_module_access('employee')
    when 'receivable' then public.has_module_access('khata')
    when 'payable' then public.has_module_access('accounts-payable')
    else public.is_super_admin()
  end
);

create policy "private_documents_update" on storage.objects for update to authenticated
using (
  bucket_id = 'gtls-private-documents' and public.is_active_user() and
  case (storage.foldername(name))[1]
    when 'bookings' then public.has_module_access('booking')
    when 'trucks' then public.has_module_access('truck')
    when 'equipment' then public.has_module_access('equipment')
    when 'maintenance' then public.has_module_access('maintenance')
    when 'employees' then public.has_module_access('employee')
    when 'receivable' then public.has_module_access('khata')
    when 'payable' then public.has_module_access('accounts-payable')
    else public.is_super_admin()
  end
)
with check (
  bucket_id = 'gtls-private-documents' and public.is_active_user() and
  case (storage.foldername(name))[1]
    when 'bookings' then public.has_module_access('booking')
    when 'trucks' then public.has_module_access('truck')
    when 'equipment' then public.has_module_access('equipment')
    when 'maintenance' then public.has_module_access('maintenance')
    when 'employees' then public.has_module_access('employee')
    when 'receivable' then public.has_module_access('khata')
    when 'payable' then public.has_module_access('accounts-payable')
    else public.is_super_admin()
  end
);

create policy "private_documents_delete" on storage.objects for delete to authenticated
using (
  bucket_id = 'gtls-private-documents' and public.is_active_user() and
  case (storage.foldername(name))[1]
    when 'bookings' then public.has_module_access('booking')
    when 'trucks' then public.has_module_access('truck')
    when 'equipment' then public.has_module_access('equipment')
    when 'maintenance' then public.has_module_access('maintenance')
    when 'employees' then public.has_module_access('employee')
    when 'receivable' then public.has_module_access('khata')
    when 'payable' then public.has_module_access('accounts-payable')
    else public.is_super_admin()
  end
);

-- Final access guard: also covers tables created later in this setup file.
revoke all privileges on schema public from anon;
revoke all privileges on all tables in schema public from anon;
revoke all privileges on all sequences in schema public from anon;
revoke all privileges on schema storage from anon, public;
revoke all privileges on table storage.objects from anon, public;
grant usage on schema storage to authenticated, service_role;

do $$
declare
  policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and ('anon'::name = any(roles) or 'public'::name = any(roles))
  loop
    execute format('drop policy %I on %I.%I',
      policy_row.policyname, policy_row.schemaname, policy_row.tablename);
  end loop;
end;
$$;
