-- Add is_private to profiles
alter table profiles add column if not exists is_private boolean default false;

-- Annotations table
create table annotations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  spotify_track_id text not null,
  timestamp_seconds numeric not null,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz default now()
);

create index idx_annotations_track on annotations(spotify_track_id);
create index idx_annotations_user on annotations(user_id);
create index idx_annotations_track_time on annotations(spotify_track_id, timestamp_seconds);

-- RLS
alter table annotations enable row level security;

-- Anyone can see annotations unless the author's account is private
create policy "Annotations visible if author is public or is self" on annotations
  for select using (
    auth.uid() = user_id
    or not exists (
      select 1 from profiles where id = annotations.user_id and is_private = true
    )
  );

create policy "Users can insert own annotations" on annotations
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own annotations" on annotations
  for delete using (auth.uid() = user_id);
