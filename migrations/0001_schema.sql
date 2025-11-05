create table if not exists ohlcv (
  symbol text not null,
  ts timestamptz not null,
  open double precision not null,
  high double precision not null,
  low double precision not null,
  close double precision not null,
  volume double precision not null default 0,
  timeframe text not null default '15m',
  primary key (symbol, ts, timeframe)
);

create table if not exists signals (
  id bigserial primary key,
  symbol text not null,
  direction text not null check (direction in ('LONG','SHORT')),
  entry double precision not null,
  sl double precision not null,
  tp1 double precision not null,
  tp2 double precision not null,
  tp3 double precision not null,
  rr1 double precision not null,
  rr2 double precision not null,
  rr3 double precision not null,
  probability double precision not null,
  model text not null,
  timeframe text not null default '15m',
  created_at timestamptz not null default now(),
  unique (symbol, timeframe, created_at)
);

create table if not exists outbox_events (
  id bigserial primary key,
  type text not null,
  payload jsonb not null,
  status text not null default 'NEW',
  attempts int not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists api_keys (
  key_id text primary key,
  role text not null,
  created_at timestamptz not null default now()
);

create table if not exists signals_meta (
  signal_id bigint primary key references signals(id) on delete cascade,
  features jsonb
);
