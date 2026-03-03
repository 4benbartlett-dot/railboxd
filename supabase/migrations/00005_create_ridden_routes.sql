-- ═══════════════════════════════════════════════
-- Quick-mark "ridden" routes (no full log required)
-- ═══════════════════════════════════════════════

create table public.ridden_routes (
  user_id uuid references auth.users on delete cascade not null,
  route_id text not null,
  created_at timestamptz default now(),
  primary key (user_id, route_id)
);

create index idx_ridden_routes_user on public.ridden_routes(user_id);

alter table public.ridden_routes enable row level security;

create policy "Users can view own ridden routes"
  on public.ridden_routes for select
  using (auth.uid() = user_id);

create policy "Users can mark routes as ridden"
  on public.ridden_routes for insert
  with check (auth.uid() = user_id);

create policy "Users can unmark ridden routes"
  on public.ridden_routes for delete
  using (auth.uid() = user_id);
