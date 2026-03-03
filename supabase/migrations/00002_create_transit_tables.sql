-- Transit agencies
create table public.transit_agencies (
  id text primary key,
  name text not null,
  url text,
  timezone text,
  city text,
  state text,
  country text default 'US'
);

-- Transit routes
create table public.transit_routes (
  id text primary key,
  agency_id text references transit_agencies(id) on delete cascade,
  short_name text,
  long_name text,
  route_type int not null default 3,
  route_color text,
  route_text_color text,
  description text,
  geom geography(MultiLineString, 4326),
  total_logs int default 0,
  avg_rating numeric(3,2) default 0
);

create index idx_routes_agency on transit_routes(agency_id);
create index idx_routes_geom on transit_routes using gist(geom);
create index idx_routes_type on transit_routes(route_type);

-- Transit stations
create table public.transit_stations (
  id text primary key,
  name text not null,
  agency_id text references transit_agencies(id) on delete cascade,
  geom geography(Point, 4326) not null,
  location_type int default 0,
  parent_station text,
  wheelchair_accessible boolean,
  route_ids text[] default '{}',
  total_logs int default 0,
  avg_rating numeric(3,2) default 0
);

create index idx_stations_agency on transit_stations(agency_id);
create index idx_stations_geom on transit_stations using gist(geom);
create index idx_stations_name on transit_stations using gin(to_tsvector('english', name));

-- Enable RLS (public read)
alter table public.transit_agencies enable row level security;
alter table public.transit_routes enable row level security;
alter table public.transit_stations enable row level security;

create policy "Transit agencies are viewable by everyone"
  on public.transit_agencies for select using (true);
create policy "Transit routes are viewable by everyone"
  on public.transit_routes for select using (true);
create policy "Transit stations are viewable by everyone"
  on public.transit_stations for select using (true);
