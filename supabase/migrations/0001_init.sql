-- Taxable phase 1 schema.
-- Money is stored as integer cents; rates as basis points (3000 = 30%).

create table public.settings (
  user_id uuid primary key default auth.uid() references auth.users on delete cascade,
  reserve_rate_bps integer not null default 3000
    check (reserve_rate_bps between 0 and 10000),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  payer text not null,
  amount_cents bigint not null check (amount_cents > 0),
  -- Snapshot of the rate at entry time so later rate changes don't rewrite history.
  reserve_rate_bps integer not null check (reserve_rate_bps between 0 and 10000),
  received_on date not null,
  note text,
  created_at timestamptz not null default now()
);

create table public.transfers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  amount_cents bigint not null check (amount_cents > 0),
  transferred_on date not null,
  note text,
  created_at timestamptz not null default now()
);

create index payments_user_received_idx on public.payments (user_id, received_on desc);
create index transfers_user_transferred_idx on public.transfers (user_id, transferred_on desc);

alter table public.settings enable row level security;
alter table public.payments enable row level security;
alter table public.transfers enable row level security;

create policy "own settings" on public.settings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own payments" on public.payments
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own transfers" on public.transfers
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
