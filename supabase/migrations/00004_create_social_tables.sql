-- Follows
create table public.follows (
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, following_id),
  check (follower_id != following_id)
);

create index idx_follows_follower on follows(follower_id);
create index idx_follows_following on follows(following_id);

-- Bucket list
create table public.bucket_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  station_id text references transit_stations(id) on delete cascade,
  route_id text references transit_routes(id) on delete cascade,
  added_at timestamptz default now(),
  check (station_id is not null or route_id is not null),
  unique(user_id, station_id),
  unique(user_id, route_id)
);

create index idx_bucket_user on bucket_list(user_id);

-- Review likes
create table public.review_likes (
  user_id uuid references profiles(id) on delete cascade,
  log_type text check (log_type in ('station','route')) not null,
  log_id uuid not null,
  created_at timestamptz default now(),
  primary key (user_id, log_type, log_id)
);

-- Enable RLS
alter table public.follows enable row level security;
alter table public.bucket_list enable row level security;
alter table public.review_likes enable row level security;

-- Follows: anyone can see, users manage their own
create policy "Follows are viewable by everyone"
  on public.follows for select using (true);
create policy "Users can follow others"
  on public.follows for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow"
  on public.follows for delete using (auth.uid() = follower_id);

-- Bucket list: owner can manage, public can see
create policy "Users can read own bucket list"
  on public.bucket_list for select using (auth.uid() = user_id);
create policy "Users can add to bucket list"
  on public.bucket_list for insert with check (auth.uid() = user_id);
create policy "Users can remove from bucket list"
  on public.bucket_list for delete using (auth.uid() = user_id);

-- Review likes: anyone can see, users manage their own
create policy "Review likes are viewable by everyone"
  on public.review_likes for select using (true);
create policy "Users can like reviews"
  on public.review_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike reviews"
  on public.review_likes for delete using (auth.uid() = user_id);
