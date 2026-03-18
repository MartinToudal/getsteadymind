create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamp with time zone not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.users (id, email)
select id, email
from auth.users
on conflict (id) do update set email = excluded.email;

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  mood integer not null check (mood between 1 and 5),
  energy text not null check (energy in ('Low', 'Medium', 'High')),
  stress text not null check (stress in ('Low', 'Medium', 'High')),
  reflection_text text,
  created_at timestamp with time zone not null default timezone('utc', now())
);

create table if not exists public.sessions (
  id uuid primary key,
  program_id text not null,
  title text not null,
  description text not null,
  question text not null,
  phase text not null,
  "order" integer not null unique
);

create table if not exists public.session_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  session_id uuid not null references public.sessions (id) on delete cascade,
  response_text text,
  action_step text,
  completed_at timestamp with time zone not null default timezone('utc', now())
);

create index if not exists checkins_user_id_created_at_idx on public.checkins (user_id, created_at desc);
create index if not exists session_completions_user_id_completed_at_idx on public.session_completions (user_id, completed_at desc);

alter table public.users enable row level security;
alter table public.checkins enable row level security;
alter table public.sessions enable row level security;
alter table public.session_completions enable row level security;

drop policy if exists "Users can read own profile" on public.users;
drop policy if exists "Users can insert own profile" on public.users;
drop policy if exists "Users can update own profile" on public.users;
drop policy if exists "Users can manage own checkins" on public.checkins;
drop policy if exists "Authenticated users can read sessions" on public.sessions;
drop policy if exists "Users can manage own completions" on public.session_completions;

create policy "Users can read own profile"
on public.users
for select
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.users
for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.users
for update
using (auth.uid() = id);

create policy "Users can manage own checkins"
on public.checkins
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Authenticated users can read sessions"
on public.sessions
for select
using (auth.role() = 'authenticated');

create policy "Users can manage own completions"
on public.session_completions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
