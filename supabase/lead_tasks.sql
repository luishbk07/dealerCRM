-- Lead follow-up tasks
-- Requires public.current_dealer_id() (see storage-setup.sql)

create table if not exists public.lead_tasks (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  title text not null,
  notes text null,
  due_at timestamptz not null,
  completed boolean not null default false,
  completed_at timestamptz null,
  created_at timestamptz not null default now()
);

create index if not exists lead_tasks_dealer_due_at_idx
  on public.lead_tasks (dealer_id, due_at asc)
  where not completed;

create index if not exists lead_tasks_lead_id_idx
  on public.lead_tasks (lead_id, due_at asc);

alter table public.lead_tasks enable row level security;

drop policy if exists lead_tasks_dealer_select on public.lead_tasks;
drop policy if exists lead_tasks_dealer_insert on public.lead_tasks;
drop policy if exists lead_tasks_dealer_update on public.lead_tasks;
drop policy if exists lead_tasks_dealer_delete on public.lead_tasks;

create policy lead_tasks_dealer_select
  on public.lead_tasks
  for select
  to authenticated
  using (dealer_id = public.current_dealer_id());

create policy lead_tasks_dealer_insert
  on public.lead_tasks
  for insert
  to authenticated
  with check (dealer_id = public.current_dealer_id());

create policy lead_tasks_dealer_update
  on public.lead_tasks
  for update
  to authenticated
  using (dealer_id = public.current_dealer_id())
  with check (dealer_id = public.current_dealer_id());

create policy lead_tasks_dealer_delete
  on public.lead_tasks
  for delete
  to authenticated
  using (dealer_id = public.current_dealer_id());

grant select, insert, update, delete on public.lead_tasks to authenticated;
