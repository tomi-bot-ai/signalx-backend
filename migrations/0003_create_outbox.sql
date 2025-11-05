create table if not exists public.outbox (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_at timestamptz default now(),
  sent boolean default false
);
create index if not exists idx_outbox_sent on public.outbox(sent);
