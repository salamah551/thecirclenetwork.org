create extension if not exists pgcrypto;
create extension if not exists pg_trgm;
create extension if not exists citext;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  headline text,
  company text,
  role text,
  location text,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "profiles readable" on public.profiles for select to authenticated using (true);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  email citext not null,
  code_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  invited_user_auth_id uuid
);
alter table public.invites disable row level security;
create index if not exists invites_email_idx on public.invites(email);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  created_at timestamptz default now()
);
alter table public.requests enable row level security;
create policy "requests readable" on public.requests for select to authenticated using (true);
create policy "requests insert by owner" on public.requests for insert to authenticated with check (auth.uid() = author_id);
create policy "requests update by owner" on public.requests for update to authenticated using (auth.uid() = author_id);
create policy "requests delete by owner" on public.requests for delete to authenticated using (auth.uid() = author_id);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid not null references public.profiles(id) on delete cascade,
  user_b_id uuid not null references public.profiles(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz default now(),
  constraint unique_pair unique (user_a_id, user_b_id)
);
alter table public.conversations enable row level security;
create policy "convos readable by participants" on public.conversations
  for select to authenticated using (auth.uid() = user_a_id or auth.uid() = user_b_id);
create policy "convos insert by participant" on public.conversations
  for insert to authenticated with check ((auth.uid() = user_a_id or auth.uid() = user_b_id) and auth.uid() = created_by);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);
alter table public.messages enable row level security;
create policy "msgs readable by participants" on public.messages
  for select to authenticated using (
    exists (select 1 from public.conversations c where c.id = conversation_id and (auth.uid() = c.user_a_id or auth.uid() = c.user_b_id))
  );
create policy "msgs insert by participants" on public.messages
  for insert to authenticated with check (
    sender_id = auth.uid() and exists (select 1 from public.conversations c where c.id = conversation_id and (auth.uid() = c.user_a_id or auth.uid() = c.user_b_id))
  );
create index if not exists messages_convo_created_idx on public.messages(conversation_id, created_at);

do $$ begin
  if not exists (select 1 from pg_type where typname = 'subscription_status') then
    create type subscription_status as enum ('pending','active','canceled');
  end if;
end $$;

create table if not exists public.member_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status subscription_status not null default 'pending',
  stripe_customer_id text,
  stripe_subscription_id text,
  updated_at timestamptz default now()
);
alter table public.member_subscriptions enable row level security;
create policy "owner read subs" on public.member_subscriptions
  for select to authenticated using (auth.uid() = user_id);

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email citext unique not null,
  note text,
  created_at timestamptz default now()
);
alter table public.waitlist enable row level security;

-- Admins list
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);
alter table public.admins enable row level security;
create policy "self view admins" on public.admins for select to authenticated using (auth.uid() = user_id);
-- (Admins table is managed out-of-band via SQL; API routes verify admin via service role.)

-- Concierge requests
create table if not exists public.concierge_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  ask text,
  intro_to text,
  urgency text default 'normal',
  created_at timestamptz default now()
);
alter table public.concierge_requests enable row level security;
create policy "concierge owner or admin read" on public.concierge_requests
  for select to authenticated using (
    requester_id = auth.uid() or exists (select 1 from public.admins a where a.user_id = auth.uid())
  );
create policy "concierge owner insert" on public.concierge_requests
  for insert to authenticated with check (requester_id = auth.uid());

create or replace function public.search_profiles(query text)
returns setof public.profiles
language sql stable
as $$
  select * from public.profiles
  where full_name ilike '%'||query||'%'
     or company   ilike '%'||query||'%'
     or role      ilike '%'||query||'%'
  order by similarity(full_name, query) desc nulls last
  limit 100;
$$;
grant execute on function public.search_profiles(text) to authenticated;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $fn$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  return new;
end
$fn$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user();
