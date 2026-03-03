-- Station logs
create table public.station_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  station_id text references transit_stations(id) on delete cascade not null,
  logged_at timestamptz default now(),
  visit_date date not null default current_date,
  is_revisit boolean default false,
  rating_reliability int check (rating_reliability between 1 and 5),
  rating_comfort int check (rating_comfort between 1 and 5),
  rating_safety int check (rating_safety between 1 and 5),
  rating_scenery int check (rating_scenery between 1 and 5),
  review_text text,
  tags text[] default '{}',
  is_favorite boolean default false,
  visibility text default 'private' check (visibility in ('public','friends','private')),
  unique(user_id, station_id, visit_date)
);

create index idx_station_logs_user on station_logs(user_id);
create index idx_station_logs_station on station_logs(station_id);
create index idx_station_logs_date on station_logs(visit_date desc);

-- Route logs
create table public.route_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  route_id text references transit_routes(id) on delete cascade not null,
  logged_at timestamptz default now(),
  ride_date date not null default current_date,
  is_revisit boolean default false,
  rating_reliability int check (rating_reliability between 1 and 5),
  rating_comfort int check (rating_comfort between 1 and 5),
  rating_safety int check (rating_safety between 1 and 5),
  rating_scenery int check (rating_scenery between 1 and 5),
  review_text text,
  tags text[] default '{}',
  is_favorite boolean default false,
  visibility text default 'private' check (visibility in ('public','friends','private')),
  unique(user_id, route_id, ride_date)
);

create index idx_route_logs_user on route_logs(user_id);
create index idx_route_logs_route on route_logs(route_id);
create index idx_route_logs_date on route_logs(ride_date desc);

-- Enable RLS
alter table public.station_logs enable row level security;
alter table public.route_logs enable row level security;

-- Users can read their own logs
create policy "Users can read own station logs"
  on public.station_logs for select using (auth.uid() = user_id);

-- Users can read public logs
create policy "Anyone can read public station logs"
  on public.station_logs for select using (visibility = 'public');

-- Users can insert their own logs
create policy "Users can insert own station logs"
  on public.station_logs for insert with check (auth.uid() = user_id);

-- Users can update their own logs
create policy "Users can update own station logs"
  on public.station_logs for update using (auth.uid() = user_id);

-- Users can delete their own logs
create policy "Users can delete own station logs"
  on public.station_logs for delete using (auth.uid() = user_id);

-- Same policies for route logs
create policy "Users can read own route logs"
  on public.route_logs for select using (auth.uid() = user_id);

create policy "Anyone can read public route logs"
  on public.route_logs for select using (visibility = 'public');

create policy "Users can insert own route logs"
  on public.route_logs for insert with check (auth.uid() = user_id);

create policy "Users can update own route logs"
  on public.route_logs for update using (auth.uid() = user_id);

create policy "Users can delete own route logs"
  on public.route_logs for delete using (auth.uid() = user_id);

-- Function to update station/route log counts
create or replace function public.update_log_counts()
returns trigger as $$
begin
  if TG_TABLE_NAME = 'station_logs' then
    update transit_stations
    set total_logs = (select count(*) from station_logs where station_id = coalesce(NEW.station_id, OLD.station_id))
    where id = coalesce(NEW.station_id, OLD.station_id);
  elsif TG_TABLE_NAME = 'route_logs' then
    update transit_routes
    set total_logs = (select count(*) from route_logs where route_id = coalesce(NEW.route_id, OLD.route_id))
    where id = coalesce(NEW.route_id, OLD.route_id);
  end if;
  return coalesce(NEW, OLD);
end;
$$ language plpgsql;

create trigger on_station_log_change
  after insert or delete on station_logs
  for each row execute procedure public.update_log_counts();

create trigger on_route_log_change
  after insert or delete on route_logs
  for each row execute procedure public.update_log_counts();
