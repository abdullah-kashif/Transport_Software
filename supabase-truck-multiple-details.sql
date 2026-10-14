-- GTLS Transport: relational Import / Export detail tables.
-- Run as postgres in Supabase SQL Editor before deploying the updated app.
-- This transaction copies existing JSONB detail rows but deliberately keeps
-- those source columns intact as a rollback and verification backup.

begin;

alter table public.truck_jobs
  add column if not exists additional_import_details jsonb not null default '[]'::jsonb,
  add column if not exists additional_export_details jsonb not null default '[]'::jsonb;

create table if not exists public.truck_import_details (
  job_no text not null references public.truck_jobs(job_no) on update cascade on delete cascade,
  detail_number integer not null check (detail_number >= 2),
  import_truck_no text,
  import_date date,
  import_customer text,
  import_origin text,
  import_destination text,
  import_size text,
  import_weight text,
  import_cargo_description text,
  mty_box_freight numeric not null default 0,
  mty_broker text,
  import_freight numeric not null default 0,
  import_detention numeric not null default 0,
  import_broker_commission numeric not null default 0,
  import_broker text,
  import_receivable_amount numeric not null default 0,
  import_payment_term text,
  import_cheque_details text,
  import_payment_received_date date,
  import_payment_status text not null default 'Awaited',
  mty_payment_date date,
  mty_payment_status text not null default 'Awaited',
  import_customer_collection numeric not null default 0,
  import_payment_date date,
  import_cheque_details2 text,
  import_remarks text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (job_no, detail_number)
);

create table if not exists public.truck_export_details (
  job_no text not null references public.truck_jobs(job_no) on update cascade on delete cascade,
  detail_number integer not null check (detail_number >= 2),
  export_truck_no text,
  export_load_date date,
  export_customer text,
  export_origin text,
  export_destination text,
  export_size text,
  export_weight text,
  export_cargo_description text,
  export_mty_box_freight numeric not null default 0,
  export_mty_broker text,
  export_freight numeric not null default 0,
  export_detention numeric not null default 0,
  export_broker_commission numeric not null default 0,
  export_broker text,
  export_receivable_amount numeric not null default 0,
  export_payment_term text,
  export_cheque_details text,
  export_payment_received_date date,
  export_payment_status text not null default 'Awaited',
  export_mty_payment_date date,
  export_mty_payment_status text not null default 'Awaited',
  export_customer_collection numeric not null default 0,
  export_payment_date date,
  export_cheque_details2 text,
  export_remarks text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (job_no, detail_number)
);

create index if not exists truck_import_details_import_date_idx
  on public.truck_import_details(import_date);
create index if not exists truck_import_details_truck_no_idx
  on public.truck_import_details(import_truck_no);
create index if not exists truck_export_details_load_date_idx
  on public.truck_export_details(export_load_date);
create index if not exists truck_export_details_truck_no_idx
  on public.truck_export_details(export_truck_no);

-- Copy legacy JSONB entries once. ON CONFLICT DO NOTHING makes reruns safe:
-- later edits in normalized rows are never replaced by stale JSON snapshots.
insert into public.truck_import_details (
  job_no, detail_number, import_truck_no, import_date, import_customer, import_origin,
  import_destination, import_size, import_weight, import_cargo_description, mty_box_freight,
  mty_broker, import_freight, import_detention, import_broker_commission, import_broker,
  import_receivable_amount, import_payment_term, import_cheque_details,
  import_payment_received_date, import_payment_status, mty_payment_date, mty_payment_status,
  import_customer_collection, import_payment_date, import_cheque_details2, import_remarks
)
select
  jobs.job_no,
  (entry.ordinality + 1)::integer,
  nullif(entry.detail->>'truckNo', ''),
  nullif(entry.detail->>'date', '')::date,
  nullif(entry.detail->>'customer', ''),
  nullif(entry.detail->>'origin', ''),
  nullif(entry.detail->>'destination', ''),
  nullif(entry.detail->>'size', ''),
  nullif(entry.detail->>'weight', ''),
  nullif(entry.detail->>'cargoDescription', ''),
  coalesce(nullif(entry.detail->>'mtyBoxFreight', '')::numeric, 0),
  nullif(entry.detail->>'mtyBroker', ''),
  coalesce(nullif(entry.detail->>'importFreight', '')::numeric, 0),
  coalesce(nullif(entry.detail->>'importDetention', '')::numeric, 0),
  coalesce(nullif(entry.detail->>'importBrokerCommission', '')::numeric, 0),
  nullif(entry.detail->>'importBroker', ''),
  coalesce(nullif(entry.detail->>'importReceivedAmount', '')::numeric, 0),
  nullif(entry.detail->>'importPaymentTerm', ''),
  nullif(entry.detail->>'importChequeDetails', ''),
  nullif(entry.detail->>'importPaymentReceivedDate', '')::date,
  coalesce(nullif(entry.detail->>'importPaymentStatus', ''), 'Awaited'),
  nullif(entry.detail->>'mtyPaymentDate', '')::date,
  coalesce(nullif(entry.detail->>'mtyPaymentStatus', ''), 'Awaited'),
  coalesce(nullif(entry.detail->>'importCustomerCollection', '')::numeric, 0),
  nullif(entry.detail->>'importPaymentDate', '')::date,
  nullif(entry.detail->>'importChequeDetails2', ''),
  nullif(entry.detail->>'importRemarks', '')
from public.truck_jobs as jobs
cross join lateral jsonb_array_elements(
  case when jsonb_typeof(jobs.additional_import_details) = 'array'
    then jobs.additional_import_details else '[]'::jsonb end
) with ordinality as entry(detail, ordinality)
on conflict (job_no, detail_number) do nothing;

insert into public.truck_export_details (
  job_no, detail_number, export_truck_no, export_load_date, export_customer, export_origin,
  export_destination, export_size, export_weight, export_cargo_description, export_mty_box_freight,
  export_mty_broker, export_freight, export_detention, export_broker_commission, export_broker,
  export_receivable_amount, export_payment_term, export_cheque_details,
  export_payment_received_date, export_payment_status, export_mty_payment_date,
  export_mty_payment_status, export_customer_collection, export_payment_date,
  export_cheque_details2, export_remarks
)
select
  jobs.job_no,
  (entry.ordinality + 1)::integer,
  nullif(entry.detail->>'exportTruckNo', ''),
  nullif(entry.detail->>'exportLoadDate', '')::date,
  nullif(entry.detail->>'exportCustomer', ''),
  nullif(entry.detail->>'exportOrigin', ''),
  nullif(entry.detail->>'exportDestination', ''),
  nullif(entry.detail->>'exportSize', ''),
  nullif(entry.detail->>'exportWeight', ''),
  nullif(entry.detail->>'exportCargoDescription', ''),
  coalesce(nullif(entry.detail->>'exportMtyBoxFreight', '')::numeric, 0),
  nullif(entry.detail->>'exportMtyBroker', ''),
  coalesce(nullif(entry.detail->>'exportFreight', '')::numeric, 0),
  coalesce(nullif(entry.detail->>'exportDetention', '')::numeric, 0),
  coalesce(nullif(entry.detail->>'exportBrokerCommission', '')::numeric, 0),
  nullif(entry.detail->>'exportBroker', ''),
  coalesce(nullif(entry.detail->>'exportReceivedAmount', '')::numeric, 0),
  nullif(entry.detail->>'exportPaymentTerm', ''),
  nullif(entry.detail->>'exportChequeDetails', ''),
  nullif(entry.detail->>'exportPaymentReceivedDate', '')::date,
  coalesce(nullif(entry.detail->>'exportPaymentStatus', ''), 'Awaited'),
  nullif(entry.detail->>'exportMtyPaymentDate', '')::date,
  coalesce(nullif(entry.detail->>'exportMtyPaymentStatus', ''), 'Awaited'),
  coalesce(nullif(entry.detail->>'exportCustomerCollection', '')::numeric, 0),
  nullif(entry.detail->>'exportPaymentDate', '')::date,
  nullif(entry.detail->>'exportChequeDetails2', ''),
  nullif(entry.detail->>'exportRemarks', '')
from public.truck_jobs as jobs
cross join lateral jsonb_array_elements(
  case when jsonb_typeof(jobs.additional_export_details) = 'array'
    then jobs.additional_export_details else '[]'::jsonb end
) with ordinality as entry(detail, ordinality)
on conflict (job_no, detail_number) do nothing;

do $$
declare
  missing_import bigint;
  missing_export bigint;
begin
  select count(*) into missing_import
  from public.truck_jobs as jobs
  cross join lateral jsonb_array_elements(
    case when jsonb_typeof(jobs.additional_import_details) = 'array'
      then jobs.additional_import_details else '[]'::jsonb end
  ) with ordinality as entry(detail, ordinality)
  where not exists (
    select 1 from public.truck_import_details as details
    where details.job_no = jobs.job_no and details.detail_number = entry.ordinality + 1
  );

  select count(*) into missing_export
  from public.truck_jobs as jobs
  cross join lateral jsonb_array_elements(
    case when jsonb_typeof(jobs.additional_export_details) = 'array'
      then jobs.additional_export_details else '[]'::jsonb end
  ) with ordinality as entry(detail, ordinality)
  where not exists (
    select 1 from public.truck_export_details as details
    where details.job_no = jobs.job_no and details.detail_number = entry.ordinality + 1
  );

  if missing_import > 0 or missing_export > 0 then
    raise exception 'Truck detail migration verification failed: % Import and % Export rows are missing.', missing_import, missing_export;
  end if;
end;
$$;

alter table public.truck_import_details enable row level security;
alter table public.truck_export_details enable row level security;
grant select, insert, update on public.truck_import_details, public.truck_export_details to authenticated;
grant all on public.truck_import_details, public.truck_export_details to service_role;

drop policy if exists truck_import_details_read_access on public.truck_import_details;
create policy truck_import_details_read_access on public.truck_import_details
for select to authenticated
using (
  public.is_active_user() and (
    public.has_module_access('truck') or public.has_module_access('truck-summary')
    or public.has_module_access('completed-truck-summary')
  )
);
drop policy if exists truck_import_details_insert_access on public.truck_import_details;
create policy truck_import_details_insert_access on public.truck_import_details
for insert to authenticated with check (public.is_active_user() and public.has_module_access('truck'));
drop policy if exists truck_import_details_update_access on public.truck_import_details;
create policy truck_import_details_update_access on public.truck_import_details
for update to authenticated using (public.is_active_user() and public.has_module_access('truck'))
with check (public.is_active_user() and public.has_module_access('truck'));

drop policy if exists truck_export_details_read_access on public.truck_export_details;
create policy truck_export_details_read_access on public.truck_export_details
for select to authenticated
using (
  public.is_active_user() and (
    public.has_module_access('truck') or public.has_module_access('truck-summary')
    or public.has_module_access('completed-truck-summary')
  )
);
drop policy if exists truck_export_details_insert_access on public.truck_export_details;
create policy truck_export_details_insert_access on public.truck_export_details
for insert to authenticated with check (public.is_active_user() and public.has_module_access('truck'));
drop policy if exists truck_export_details_update_access on public.truck_export_details;
create policy truck_export_details_update_access on public.truck_export_details
for update to authenticated using (public.is_active_user() and public.has_module_access('truck'))
with check (public.is_active_user() and public.has_module_access('truck'));

comment on column public.truck_jobs.additional_import_details is
  'Legacy migration backup; current additional Import entries are stored in truck_import_details.';
comment on column public.truck_jobs.additional_export_details is
  'Legacy migration backup; current additional Export entries are stored in truck_export_details.';

commit;

-- Verification summary: these counts should match the source array element counts.
select
  (select coalesce(sum(case when jsonb_typeof(additional_import_details) = 'array' then jsonb_array_length(additional_import_details) else 0 end), 0) from public.truck_jobs) as source_import_details,
  (select count(*) from public.truck_jobs as jobs cross join lateral jsonb_array_elements(case when jsonb_typeof(jobs.additional_import_details) = 'array' then jobs.additional_import_details else '[]'::jsonb end) with ordinality as entry(detail, ordinality) join public.truck_import_details as details on details.job_no = jobs.job_no and details.detail_number = entry.ordinality + 1) as migrated_import_details,
  (select coalesce(sum(case when jsonb_typeof(additional_export_details) = 'array' then jsonb_array_length(additional_export_details) else 0 end), 0) from public.truck_jobs) as source_export_details,
  (select count(*) from public.truck_jobs as jobs cross join lateral jsonb_array_elements(case when jsonb_typeof(jobs.additional_export_details) = 'array' then jobs.additional_export_details else '[]'::jsonb end) with ordinality as entry(detail, ordinality) join public.truck_export_details as details on details.job_no = jobs.job_no and details.detail_number = entry.ordinality + 1) as migrated_export_details;
