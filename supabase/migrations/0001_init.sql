-- BalesinAI · initial schema
-- Run this once in Supabase SQL Editor (or `psql $SUPABASE_DB_URL -f 0001_init.sql`).
-- Idempotent — safe to re-run.

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =====================================================================
-- Enums
-- =====================================================================

do $$ begin
  create type platform_role as enum ('user', 'super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type workspace_role as enum ('owner', 'admin', 'agent', 'viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type plan_tier as enum ('free', 'pro', 'business');
exception when duplicate_object then null; end $$;

do $$ begin
  create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending', 'paid', 'expired', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type wa_status as enum ('disconnected', 'pending', 'connected', 'error');
exception when duplicate_object then null; end $$;

do $$ begin
  create type knowledge_type as enum ('product', 'faq', 'promo', 'policy', 'misc');
exception when duplicate_object then null; end $$;

do $$ begin
  create type message_role as enum ('customer', 'ai', 'admin', 'system');
exception when duplicate_object then null; end $$;

do $$ begin
  create type conversation_status as enum ('open', 'resolved', 'snoozed', 'spam');
exception when duplicate_object then null; end $$;

-- =====================================================================
-- profiles  (1:1 with auth.users)
-- =====================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  platform_role platform_role not null default 'user',
  is_banned boolean not null default false,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_platform_role_idx on public.profiles (platform_role);

-- Trigger: when an auth.users row is created, create a profile row.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  resolved_role platform_role := 'user';
begin
  -- bootstrap super admin (your email)
  if new.email = 'kekeakt77@gmail.com' then
    resolved_role := 'super_admin';
  end if;

  insert into public.profiles (id, email, full_name, platform_role)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', resolved_role)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================================
-- workspaces
-- =====================================================================

create table if not exists public.workspaces (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  store_name text,
  logo_url text,
  primary_locale text not null default 'id',
  ai_persona jsonb not null default '{"tone":"casual","greeting":"Halo kak!","language":"auto"}'::jsonb,
  active_hours jsonb,
  is_suspended boolean not null default false,
  suspended_reason text,
  owner_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workspaces_owner_idx on public.workspaces (owner_id);

-- =====================================================================
-- workspace_members
-- =====================================================================

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role workspace_role not null default 'agent',
  invited_by uuid references public.profiles(id),
  invited_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create index if not exists workspace_members_user_idx on public.workspace_members (user_id);

-- helper: is the calling user a super admin?
create or replace function public.is_super_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select platform_role = 'super_admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- helper: is the calling user a member of this workspace?
create or replace function public.is_workspace_member(ws_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = ws_id and m.user_id = auth.uid()
  );
$$;

-- helper: is the calling user an admin/owner of this workspace?
create or replace function public.is_workspace_admin(ws_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = ws_id
      and m.user_id = auth.uid()
      and m.role in ('owner','admin')
  );
$$;

-- =====================================================================
-- wa_connections  (per workspace, encrypted in app layer)
-- =====================================================================

create table if not exists public.wa_connections (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null unique references public.workspaces(id) on delete cascade,
  display_phone text,
  meta_phone_number_id text,
  meta_business_account_id text,
  -- encrypted values (cipher text only — never store plaintext tokens)
  access_token_cipher text,
  verify_token_cipher text,
  status wa_status not null default 'disconnected',
  last_error text,
  connected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- knowledge_entries
-- =====================================================================

create table if not exists public.knowledge_entries (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  external_id text,
  type knowledge_type not null default 'misc',
  title text not null,
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, external_id)
);

create index if not exists knowledge_workspace_idx on public.knowledge_entries (workspace_id);
create index if not exists knowledge_type_idx on public.knowledge_entries (workspace_id, type);

-- =====================================================================
-- conversations + messages
-- =====================================================================

create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  customer_phone text not null,
  customer_name text,
  status conversation_status not null default 'open',
  last_message_at timestamptz not null default now(),
  is_ai_active boolean not null default true,
  assigned_to uuid references public.profiles(id),
  unread_count integer not null default 0,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, customer_phone)
);

create index if not exists conv_workspace_status_idx on public.conversations (workspace_id, status);
create index if not exists conv_workspace_last_message_idx on public.conversations (workspace_id, last_message_at desc);

create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role message_role not null,
  body text not null,
  meta jsonb not null default '{}'::jsonb,
  wa_message_id text,
  delivered_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists msg_conv_idx on public.messages (conversation_id, created_at);
create index if not exists msg_workspace_created_idx on public.messages (workspace_id, created_at desc);

-- =====================================================================
-- subscriptions + payments
-- =====================================================================

create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null unique references public.workspaces(id) on delete cascade,
  plan plan_tier not null default 'free',
  status subscription_status not null default 'trialing',
  amount_idr integer not null default 0,
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null default (now() + interval '30 days'),
  cancel_at_period_end boolean not null default false,
  trial_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  initiated_by uuid references public.profiles(id),
  -- KlikQRIS fields
  order_id text unique not null,
  klikqris_signature text,
  amount_idr integer not null,
  total_amount_idr integer not null,
  qris_url text,
  qris_expired_at timestamptz,
  status payment_status not null default 'pending',
  paid_at timestamptz,
  raw_response jsonb,
  raw_webhook jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_workspace_idx on public.payments (workspace_id);
create index if not exists payments_status_idx on public.payments (status, created_at desc);

-- =====================================================================
-- audit_logs
-- =====================================================================

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  workspace_id uuid references public.workspaces(id) on delete set null,
  actor_id uuid references public.profiles(id) on delete set null,
  actor_email text,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists audit_workspace_created_idx on public.audit_logs (workspace_id, created_at desc);
create index if not exists audit_actor_created_idx on public.audit_logs (actor_id, created_at desc);

-- =====================================================================
-- feature_flags
-- =====================================================================

create table if not exists public.feature_flags (
  key text primary key,
  description text,
  is_enabled_globally boolean not null default false,
  enabled_for_plans plan_tier[] default '{}',
  enabled_for_workspaces uuid[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- updated_at triggers
-- =====================================================================

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

do $$
declare t text;
begin
  for t in
    select unnest(array[
      'profiles','workspaces','wa_connections','knowledge_entries',
      'conversations','messages','subscriptions','payments','feature_flags'
    ])
  loop
    execute format(
      'drop trigger if exists trg_touch_updated_at on public.%I;
       create trigger trg_touch_updated_at before update on public.%I
       for each row execute procedure public.touch_updated_at();',
      t, t
    );
  end loop;
end $$;

-- =====================================================================
-- RLS policies
-- =====================================================================

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.wa_connections enable row level security;
alter table public.knowledge_entries enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.audit_logs enable row level security;
alter table public.feature_flags enable row level security;

-- profiles: a user can read/update their own row. super admin reads all.
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles
  for select using (id = auth.uid() or public.is_super_admin());

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "profiles super admin all" on public.profiles;
create policy "profiles super admin all" on public.profiles
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- workspaces: members read; admins update; super admin all.
drop policy if exists "ws members read" on public.workspaces;
create policy "ws members read" on public.workspaces
  for select using (public.is_workspace_member(id) or public.is_super_admin());

drop policy if exists "ws admins update" on public.workspaces;
create policy "ws admins update" on public.workspaces
  for update using (public.is_workspace_admin(id) or public.is_super_admin())
  with check (public.is_workspace_admin(id) or public.is_super_admin());

drop policy if exists "ws insert by owner" on public.workspaces;
create policy "ws insert by owner" on public.workspaces
  for insert with check (owner_id = auth.uid());

drop policy if exists "ws super admin delete" on public.workspaces;
create policy "ws super admin delete" on public.workspaces
  for delete using (public.is_super_admin());

-- workspace_members: members of the workspace can see fellow members.
drop policy if exists "wm members read" on public.workspace_members;
create policy "wm members read" on public.workspace_members
  for select using (
    public.is_workspace_member(workspace_id) or public.is_super_admin()
  );

drop policy if exists "wm admins write" on public.workspace_members;
create policy "wm admins write" on public.workspace_members
  for all using (public.is_workspace_admin(workspace_id) or public.is_super_admin())
  with check (public.is_workspace_admin(workspace_id) or public.is_super_admin());

-- generic per-workspace policy template applied to remaining tables
do $$
declare t text;
begin
  for t in select unnest(array[
    'wa_connections','knowledge_entries','conversations','messages',
    'subscriptions','payments','audit_logs'
  ])
  loop
    execute format(
      'drop policy if exists "%1$s members read" on public.%1$s;
       create policy "%1$s members read" on public.%1$s
         for select using (public.is_workspace_member(workspace_id) or public.is_super_admin());

       drop policy if exists "%1$s admins write" on public.%1$s;
       create policy "%1$s admins write" on public.%1$s
         for all using (public.is_workspace_admin(workspace_id) or public.is_super_admin())
         with check (public.is_workspace_admin(workspace_id) or public.is_super_admin());',
      t
    );
  end loop;
end $$;

-- feature_flags: super admin only
drop policy if exists "ff super admin all" on public.feature_flags;
create policy "ff super admin all" on public.feature_flags
  for all using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists "ff anyone read" on public.feature_flags;
create policy "ff anyone read" on public.feature_flags
  for select using (true);

-- =====================================================================
-- Seed feature flags (idempotent)
-- =====================================================================

insert into public.feature_flags (key, description, is_enabled_globally) values
  ('demo_mode', 'Show demo mode banner & sample data on dashboards', true),
  ('ai_real_replies', 'Use OpenAI for replies (otherwise mock)', false),
  ('payments_klikqris', 'Enable KlikQRIS payment flow', true),
  ('wa_cloud_api', 'Enable WhatsApp Cloud API connection wizard', true),
  ('email_brevo', 'Send transactional emails via Brevo SMTP', true),
  ('beta_super_admin_broadcast', 'Show broadcast composer in super admin', true)
on conflict (key) do nothing;
