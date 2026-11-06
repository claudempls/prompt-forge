-- PromptForge — Supabase schema
-- Run this in the Supabase SQL editor

-- Profiles (auto-created on signup via trigger)
create table if not exists public.profiles (
  id                      uuid references auth.users on delete cascade primary key,
  email                   text,
  full_name               text,
  avatar_url              text,
  plan                    text not null default 'free',  -- 'free' | 'pro'
  stripe_customer_id      text unique,
  stripe_subscription_id  text,
  created_at              timestamp with time zone default now()
);

-- Waitlist
create table if not exists public.waitlist (
  id         uuid default gen_random_uuid() primary key,
  email      text unique not null,
  created_at timestamp with time zone default now()
);

-- Prompt history
create table if not exists public.prompt_history (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references auth.users on delete cascade not null,
  original_prompt  text not null,
  enhanced_prompt  text,
  quality_before   integer,
  quality_after    integer,
  model_used       text,
  created_at       timestamp with time zone default now()
);

-- Trigger: create profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table public.profiles      enable row level security;
alter table public.waitlist      enable row level security;
alter table public.prompt_history enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Waitlist policies
create policy "Anyone can join waitlist"
  on public.waitlist for insert
  with check (true);

-- Prompt history policies
create policy "Users can view own prompts"
  on public.prompt_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own prompts"
  on public.prompt_history for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own prompts"
  on public.prompt_history for delete
  using (auth.uid() = user_id);

-- Keep profile editing while reserving billing fields for the service role.
drop policy if exists "Users can update own profile" on public.profiles;
revoke update on public.profiles from public, anon, authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users on delete cascade,
  anon_id text null,
  ip_hash text null,
  kind text not null check (kind in ('forge')),
  created_at timestamptz default now()
);
create index if not exists usage_events_user_created on public.usage_events (user_id, created_at);
create index if not exists usage_events_anon_created on public.usage_events (anon_id, created_at);
create index if not exists usage_events_ip_created on public.usage_events (ip_hash, created_at);
alter table public.usage_events enable row level security;
-- No RLS policies: only service-role access.
revoke all on public.usage_events from public, anon, authenticated;
grant all on public.usage_events to service_role;

-- Serialize the final check + insert so concurrent completions cannot exceed limits.
-- Called only after successful generation; questions never call this function.
create or replace function public.record_forge(p_user_id uuid, p_anon_id text, p_ip_hash text)
returns integer language plpgsql security invoker set search_path = public as $$
declare
  used_count integer;
  ip_count integer;
  is_pro boolean;
begin
  if p_user_id is not null then
    perform pg_advisory_xact_lock(hashtextextended('user:' || p_user_id::text, 0));
    select plan = 'pro' into is_pro from public.profiles where id = p_user_id;
    if not coalesce(is_pro, false) then
      select count(*) into used_count from public.usage_events
        where user_id = p_user_id and kind = 'forge'
        and created_at >= (date_trunc('day', now() at time zone 'UTC') at time zone 'UTC');
      if used_count >= 5 then raise exception 'LIMIT_FREE'; end if;
    end if;
  else
    if p_anon_id is null or p_ip_hash is null then raise exception 'Anonymous identity required'; end if;
    -- Always acquire the IP lock first, then the cookie lock.
    perform pg_advisory_xact_lock(hashtextextended('ip:' || p_ip_hash, 0));
    perform pg_advisory_xact_lock(hashtextextended('anon:' || p_anon_id, 0));
    select count(*) into used_count from public.usage_events where anon_id = p_anon_id and kind = 'forge';
    select count(*) into ip_count from public.usage_events where ip_hash = p_ip_hash and kind = 'forge';
    used_count := greatest(used_count, ip_count);
    if used_count >= 2 then raise exception 'LIMIT_ANON'; end if;
  end if;
  insert into public.usage_events (user_id, anon_id, ip_hash, kind)
    values (p_user_id, case when p_user_id is null then p_anon_id end,
      case when p_user_id is null then p_ip_hash end, 'forge');
  if coalesce(is_pro, false) then return null; end if;
  return (case when p_user_id is null then 2 else 5 end) - used_count - 1;
end;
$$;
revoke all on function public.record_forge(uuid, text, text) from public, anon, authenticated;
grant execute on function public.record_forge(uuid, text, text) to service_role;
