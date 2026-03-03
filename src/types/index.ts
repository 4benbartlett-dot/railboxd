export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  home_city: string | null;
  home_zip: string | null;
  privacy_default: "public" | "friends" | "private";
  ghost_mode: boolean;
  hide_home_station: boolean;
  delay_hours: number;
  created_at: string;
  updated_at: string;
}

export interface TransitAgency {
  id: string;
  name: string;
  url: string | null;
  timezone: string | null;
  city: string | null;
  state: string | null;
  country: string;
}

export interface TransitRoute {
  id: string;
  agency_id: string | null;
  short_name: string | null;
  long_name: string | null;
  route_type: number;
  route_color: string | null;
  route_text_color: string | null;
  description: string | null;
  total_logs: number;
  avg_rating: number;
  agency?: TransitAgency;
}

export interface TransitStation {
  id: string;
  name: string;
  agency_id: string | null;
  lat: number;
  lng: number;
  location_type: number | null;
  parent_station: string | null;
  wheelchair_accessible: boolean | null;
  route_ids: string[];
  total_logs: number;
  avg_rating: number;
  agency?: TransitAgency;
}

export interface StationLog {
  id: string;
  user_id: string;
  station_id: string;
  logged_at: string;
  visit_date: string;
  is_revisit: boolean;
  rating_reliability: number | null;
  rating_comfort: number | null;
  rating_safety: number | null;
  rating_scenery: number | null;
  review_text: string | null;
  tags: string[];
  is_favorite: boolean;
  visibility: "public" | "friends" | "private";
  station?: TransitStation;
  profile?: Profile;
}

export interface RouteLog {
  id: string;
  user_id: string;
  route_id: string;
  logged_at: string;
  ride_date: string;
  is_revisit: boolean;
  rating_reliability: number | null;
  rating_comfort: number | null;
  rating_safety: number | null;
  rating_scenery: number | null;
  review_text: string | null;
  tags: string[];
  is_favorite: boolean;
  visibility: "public" | "friends" | "private";
  route?: TransitRoute;
  profile?: Profile;
}

export interface BucketListItem {
  id: string;
  user_id: string;
  station_id: string | null;
  route_id: string | null;
  added_at: string;
  station?: TransitStation;
  route?: TransitRoute;
}

export type Visibility = "public" | "friends" | "private";

export type TransitMode = "tram" | "subway" | "rail" | "bus" | "ferry" | "other";