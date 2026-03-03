-- ═══════════════════════════════════════════════
-- Railboxd App Tables
-- Route logs, reviews, likes, follows, bucket lists
-- ═══════════════════════════════════════════════

-- ── Route Logs (core ride tracking) ──
create table public.route_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  route_id text not null,
  start_station_id text not null,
  end_station_id text not null,
  ride_date date not null,
  rating smallint check (rating between 1 and 5),
  notes text,
  tags text[] default '{}',
  privacy text default 'public' check (privacy in ('public','friends','private')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_route_logs_user on public.route_logs(user_id);
create index idx_route_logs_route on public.route_logs(route_id);
create index idx_route_logs_date on public.route_logs(ride_date desc);

alter table public.route_logs enable row level security;

create policy "Users can view public logs"
  on public.route_logs for select
  using (privacy = 'public' or user_id = auth.uid());

create policy "Users can insert own logs"
  on public.route_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own logs"
  on public.route_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own logs"
  on public.route_logs for delete
  using (auth.uid() = user_id);

-- ── Route Log Photos ──
create table public.route_log_photos (
  id uuid default gen_random_uuid() primary key,
  route_log_id uuid references public.route_logs on delete cascade not null,
  storage_path text not null,
  display_order smallint default 0,
  created_at timestamptz default now()
);

create index idx_photos_log on public.route_log_photos(route_log_id);

alter table public.route_log_photos enable row level security;

create policy "Photos viewable if log is viewable"
  on public.route_log_photos for select
  using (
    exists (
      select 1 from public.route_logs
      where id = route_log_id
      and (privacy = 'public' or user_id = auth.uid())
    )
  );

create policy "Users can insert own log photos"
  on public.route_log_photos for insert
  with check (
    exists (
      select 1 from public.route_logs
      where id = route_log_id and user_id = auth.uid()
    )
  );

create policy "Users can delete own log photos"
  on public.route_log_photos for delete
  using (
    exists (
      select 1 from public.route_logs
      where id = route_log_id and user_id = auth.uid()
    )
  );

-- ── Reviews (community reviews on routes) ──
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  route_id text not null,
  rating smallint not null check (rating between 1 and 5),
  text text not null check (length(text) > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_reviews_route on public.reviews(route_id);
create index idx_reviews_user on public.reviews(user_id);
create unique index idx_reviews_user_route on public.reviews(user_id, route_id);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Users can insert own reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- ── Likes (on reviews) ──
create table public.likes (
  user_id uuid references auth.users on delete cascade not null,
  review_id uuid references public.reviews on delete cascade not null,
  created_at timestamptz default now(),
  primary key (user_id, review_id)
);

create index idx_likes_review on public.likes(review_id);

alter table public.likes enable row level security;

create policy "Likes are viewable by everyone"
  on public.likes for select using (true);

create policy "Users can like reviews"
  on public.likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike reviews"
  on public.likes for delete
  using (auth.uid() = user_id);

-- ── Follows ──
create table public.follows (
  follower_id uuid references auth.users on delete cascade not null,
  following_id uuid references auth.users on delete cascade not null,
  created_at timestamptz default now(),
  primary key (follower_id, following_id),
  check (follower_id != following_id)
);

create index idx_follows_following on public.follows(following_id);
create index idx_follows_follower on public.follows(follower_id);

alter table public.follows enable row level security;

create policy "Follows are viewable by everyone"
  on public.follows for select using (true);

create policy "Users can follow others"
  on public.follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow others"
  on public.follows for delete
  using (auth.uid() = follower_id);

-- ── Bucket List / Watchlist ──
create table public.bucket_list (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  route_id text,
  station_id text,
  created_at timestamptz default now(),
  check (route_id is not null or station_id is not null)
);

create unique index idx_bucket_user_route on public.bucket_list(user_id, route_id) where route_id is not null;
create unique index idx_bucket_user_station on public.bucket_list(user_id, station_id) where station_id is not null;

alter table public.bucket_list enable row level security;

create policy "Users can view own bucket list"
  on public.bucket_list for select
  using (auth.uid() = user_id);

create policy "Users can add to bucket list"
  on public.bucket_list for insert
  with check (auth.uid() = user_id);

create policy "Users can remove from bucket list"
  on public.bucket_list for delete
  using (auth.uid() = user_id);

-- ── Favorites ──
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  route_id text,
  station_id text,
  created_at timestamptz default now(),
  check (route_id is not null or station_id is not null)
);

create unique index idx_fav_user_route on public.favorites(user_id, route_id) where route_id is not null;
create unique index idx_fav_user_station on public.favorites(user_id, station_id) where station_id is not null;

alter table public.favorites enable row level security;

create policy "Users can view own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can add favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can remove favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ── Aggregation views ──

-- Review counts with like totals
create or replace view public.review_with_likes as
select
  r.*,
  p.username,
  p.display_name,
  p.avatar_url,
  coalesce(l.like_count, 0) as like_count
from public.reviews r
join public.profiles p on p.id = r.user_id
left join (
  select review_id, count(*) as like_count
  from public.likes
  group by review_id
) l on l.review_id = r.id;

-- Follower/following counts
create or replace view public.profile_with_counts as
select
  p.*,
  coalesce(fr.follower_count, 0) as follower_count,
  coalesce(fg.following_count, 0) as following_count,
  coalesce(rl.ride_count, 0) as ride_count,
  coalesce(rv.review_count, 0) as review_count
from public.profiles p
left join (
  select following_id, count(*) as follower_count
  from public.follows group by following_id
) fr on fr.following_id = p.id
left join (
  select follower_id, count(*) as following_count
  from public.follows group by follower_id
) fg on fg.follower_id = p.id
left join (
  select user_id, count(*) as ride_count
  from public.route_logs group by user_id
) rl on rl.user_id = p.id
left join (
  select user_id, count(*) as review_count
  from public.reviews group by user_id
) rv on rv.user_id = p.id;

-- ── Updated_at triggers ──
create trigger on_route_logs_updated
  before update on public.route_logs
  for each row execute procedure public.handle_updated_at();

create trigger on_reviews_updated
  before update on public.reviews
  for each row execute procedure public.handle_updated_at();

-- ── Storage bucket for photos ──
insert into storage.buckets (id, name, public) values ('ride-photos', 'ride-photos', true)
on conflict do nothing;

create policy "Anyone can view ride photos"
  on storage.objects for select
  using (bucket_id = 'ride-photos');

create policy "Authenticated users can upload ride photos"
  on storage.objects for insert
  with check (bucket_id = 'ride-photos' and auth.role() = 'authenticated');

create policy "Users can delete own ride photos"
  on storage.objects for delete
  using (bucket_id = 'ride-photos' and auth.uid()::text = (storage.foldername(name))[1]);
