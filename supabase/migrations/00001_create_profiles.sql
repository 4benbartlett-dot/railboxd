-- Enable PostGIS extension
create extension if not exists postgis;

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  home_location geography(Point, 4326),
  home_city text,
  home_zip text,
  privacy_default text default 'private' check (privacy_default in ('public','friends','private')),
  ghost_mode boolean default false,
  hide_home_station boolean default true,
  delay_hours int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Anyone can read profiles
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
