-- GTLS testing data: 100 payable accounts with 2-6 entries each.
-- Safe to run more than once: TEST entries are not duplicated.
-- This creates no Storage files or images.

do $$
declare
  account_number integer;
  entry_number integer;
  entry_count integer;
  test_account_id uuid;
begin
  for account_number in 1..100 loop
    insert into public.accounts (account_type, party_name, phone, city, opening_balance)
    values (
      'payable',
      format('TEST-PAY-%s', lpad(account_number::text, 3, '0')),
      format('0300-%s', lpad((1000000 + account_number)::text, 7, '0')),
      'TEST CITY',
      0
    )
    on conflict (account_type, party_name) do update
      set updated_at = now()
    returning id into test_account_id;

    entry_count := 2 + floor(random() * 5)::integer;
    for entry_number in 1..entry_count loop
      insert into public.account_entries (
        account_id, entry_date, entry_type, description, amount
      )
      select
        test_account_id,
        current_date - ((account_number + entry_number) % 30),
        case when entry_number % 3 = 0 then 'Credit' else 'Debit' end,
        format('TEST ENTRY %s', entry_number),
        (5000 + account_number * 250 + entry_number * 125)::numeric(14,2)
      where not exists (
        select 1
        from public.account_entries existing_entry
        where existing_entry.account_id = test_account_id
          and existing_entry.description = format('TEST ENTRY %s', entry_number)
      );
    end loop;
  end loop;
end;
$$;

-- Verification query:
select
  a.party_name,
  count(e.id) as entry_count,
  sum(case when e.entry_type = 'Debit' then e.amount else 0 end) as total_debit,
  sum(case when e.entry_type = 'Credit' then e.amount else 0 end) as total_credit
from public.accounts a
left join public.account_entries e on e.account_id = a.id
where a.account_type = 'payable'
  and a.party_name like 'TEST-PAY-%'
group by a.id, a.party_name
order by a.party_name;

-- Cleanup only this test data when testing is finished. Run separately:
-- delete from public.account_entries
-- where account_id in (
--   select id from public.accounts
--   where account_type = 'payable' and party_name like 'TEST-PAY-%'
-- );
-- delete from public.accounts
-- where account_type = 'payable' and party_name like 'TEST-PAY-%';
