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
