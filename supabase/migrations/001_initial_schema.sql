-- Profiles table
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null check (char_length(username) between 3 and 30),
  bio text default '' check (char_length(bio) <= 300),
  favorite_genres text[] default '{}',
  avatar_url text,
  created_at timestamptz default now()
);
create index idx_profiles_username on profiles(username);

-- Reviews table
create table reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  spotify_album_id text not null,
  album_name text not null,
  album_artist text not null,
  album_image_url text,
  rating integer not null check (rating between 1 and 5),
  review_text text check (char_length(review_text) <= 2000),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, spotify_album_id)
);
create index idx_reviews_album on reviews(spotify_album_id);
create index idx_reviews_user on reviews(user_id);
create index idx_reviews_created on reviews(created_at desc);

-- Auto-update updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger reviews_updated_at
  before update on reviews
  for each row execute function update_updated_at();

-- Want to listen table
create table want_to_listen (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  spotify_album_id text not null,
  album_name text not null,
  album_artist text not null,
  album_image_url text,
  created_at timestamptz default now(),
  unique(user_id, spotify_album_id)
);
create index idx_wtl_user on want_to_listen(user_id);

-- Trending function
create or replace function get_trending(period text default 'all')
returns table (
  spotify_album_id text,
  album_name text,
  album_artist text,
  album_image_url text,
  review_count bigint,
  avg_rating numeric,
  trending_score numeric
) as $$
begin
  return query
  select
    r.spotify_album_id,
    r.album_name,
    r.album_artist,
    r.album_image_url,
    count(*)::bigint as review_count,
    round(avg(r.rating), 1) as avg_rating,
    count(*) * (2 + avg(r.rating)) as trending_score
  from reviews r
  where case
    when period = 'week' then r.created_at >= now() - interval '7 days'
    when period = 'month' then r.created_at >= now() - interval '30 days'
    else true
  end
  group by r.spotify_album_id, r.album_name, r.album_artist, r.album_image_url
  order by trending_score desc;
end;
$$ language plpgsql;

-- RLS: Profiles
alter table profiles enable row level security;
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- RLS: Reviews
-- Note: Review-lock mechanic is enforced at the API route level, not RLS.
-- RLS allows all authenticated users to read reviews; the API gates visibility.
alter table reviews enable row level security;
create policy "Authenticated users can read reviews" on reviews for select using (auth.uid() is not null);
create policy "Users can insert own reviews" on reviews for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews" on reviews for update using (auth.uid() = user_id);
create policy "Users can delete own reviews" on reviews for delete using (auth.uid() = user_id);

-- RLS: Want to listen
alter table want_to_listen enable row level security;
create policy "Users can manage own saved albums" on want_to_listen for all using (auth.uid() = user_id);
