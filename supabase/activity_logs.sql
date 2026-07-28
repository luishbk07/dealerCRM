-- Activity logs for dealer CRM timeline
-- Requires public.current_dealer_id() (see storage-setup.sql)

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers (id) on delete cascade,
  user_id uuid null references auth.users (id) on delete set null,
  entity_type text not null,
  entity_id uuid null,
  action text not null,
  title text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create index if not exists activity_logs_dealer_created_at_idx
  on public.activity_logs (dealer_id, created_at desc);

alter table public.activity_logs enable row level security;

drop policy if exists activity_logs_dealer_select on public.activity_logs;
drop policy if exists activity_logs_dealer_insert on public.activity_logs;

create policy activity_logs_dealer_select
  on public.activity_logs
  for select
  to authenticated
  using (dealer_id = public.current_dealer_id());

create policy activity_logs_dealer_insert
  on public.activity_logs
  for insert
  to authenticated
  with check (dealer_id = public.current_dealer_id());

grant select, insert on public.activity_logs to authenticated;
