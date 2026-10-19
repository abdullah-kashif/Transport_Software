-- GTLS Transport: add section-level Trucker / Broker Remarks to Two Pay Records.
-- Additive migration: existing records and detail rows are retained unchanged.

begin;

alter table public.two_pay_records
  add column if not exists broker_remarks text;

comment on column public.two_pay_records.broker_remarks is
  'Section-level remarks for the Two Pay record Trucker / Broker Details.';

commit;
