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

create policy "Users can update own profile"
  on public.profiles for update
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
