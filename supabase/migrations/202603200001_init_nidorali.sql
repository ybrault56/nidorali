create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('app.current_tenant_id', true), '')::uuid;
$$;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  app_name text not null,
  bundle_id text unique not null,
  contact_email text,
  status text not null default 'pending'
    check (status in ('pending','building','live','suspended','cancelled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null default 'starter'
    check (plan in ('starter','pro','enterprise')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_configs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  logo_url text,
  primary_color text not null default '#0F62FE',
  secondary_color text not null default '#A7D8FF',
  font text not null default 'Inter',
  splash_bg_color text not null default '#FFFFFF',
  module_members boolean not null default true,
  module_messaging boolean not null default false,
  module_planning boolean not null default false,
  module_notifications boolean not null default true,
  module_news boolean not null default false,
  module_documents boolean not null default false,
  module_map boolean not null default false,
  module_forms boolean not null default false,
  max_users integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id)
);

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('member','admin','moderator')),
  password_hash text,
  password_updated_at timestamptz,
  push_token text,
  is_active boolean not null default true,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, email)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text,
  type text not null default 'direct' check (type in ('direct','group','broadcast')),
  created_by uuid references public.app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.app_users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid references public.app_users(id),
  content text not null,
  type text not null default 'text' check (type in ('text','image','file')),
  media_url text,
  read_by uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  description text,
  location text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  is_all_day boolean not null default false,
  color text,
  created_by uuid references public.app_users(id),
  max_attendees integer,
  created_at timestamptz not null default now()
);

create table if not exists public.event_attendees (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.app_users(id) on delete cascade,
  status text not null default 'going' check (status in ('going','maybe','not_going')),
  primary key (event_id, user_id)
);

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  content text not null,
  cover_url text,
  author_id uuid references public.app_users(id),
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.push_notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  body text not null,
  data jsonb not null default '{}'::jsonb,
  target text not null default 'all' check (target in ('all','admins','specific')),
  target_user_ids uuid[],
  sent_at timestamptz,
  created_by uuid references public.app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  file_url text not null,
  file_type text,
  file_size integer,
  category text,
  uploaded_by uuid references public.app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.forms (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  description text,
  fields jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.form_responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid references public.app_users(id),
  answers jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now()
);

create table if not exists public.build_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  status text not null default 'queued'
    check (status in ('queued','processing','building','submitting','done','failed')),
  platform text not null check (platform in ('android','ios','both')),
  eas_build_id_android text,
  eas_build_id_ios text,
  android_artifact_url text,
  ios_artifact_url text,
  play_store_url text,
  app_store_url text,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_app_users_tenant on public.app_users(tenant_id);
create index if not exists idx_conversations_tenant on public.conversations(tenant_id);
create index if not exists idx_messages_tenant_conversation on public.messages(tenant_id, conversation_id);
create index if not exists idx_events_tenant on public.events(tenant_id, start_at);
create index if not exists idx_news_tenant on public.news_posts(tenant_id, created_at desc);
create index if not exists idx_documents_tenant on public.documents(tenant_id, created_at desc);
create index if not exists idx_forms_tenant on public.forms(tenant_id, created_at desc);
create index if not exists idx_build_jobs_tenant on public.build_jobs(tenant_id, created_at desc);

drop trigger if exists set_tenants_updated_at on public.tenants;
create trigger set_tenants_updated_at
before update on public.tenants
for each row execute function public.set_updated_at();

drop trigger if exists set_tenant_configs_updated_at on public.tenant_configs;
create trigger set_tenant_configs_updated_at
before update on public.tenant_configs
for each row execute function public.set_updated_at();

alter table public.tenant_configs enable row level security;
alter table public.app_users enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.events enable row level security;
alter table public.event_attendees enable row level security;
alter table public.news_posts enable row level security;
alter table public.push_notifications enable row level security;
alter table public.documents enable row level security;
alter table public.forms enable row level security;
alter table public.form_responses enable row level security;
alter table public.build_jobs enable row level security;

drop policy if exists tenant_configs_isolated on public.tenant_configs;
create policy tenant_configs_isolated on public.tenant_configs
for all using (tenant_id = public.current_tenant_id()) with check (tenant_id = public.current_tenant_id());

drop policy if exists app_users_isolated on public.app_users;
create policy app_users_isolated on public.app_users
for all using (tenant_id = public.current_tenant_id()) with check (tenant_id = public.current_tenant_id());

drop policy if exists conversations_isolated on public.conversations;
create policy conversations_isolated on public.conversations
for all using (tenant_id = public.current_tenant_id()) with check (tenant_id = public.current_tenant_id());

drop policy if exists conversation_members_isolated on public.conversation_members;
create policy conversation_members_isolated on public.conversation_members
for all using (
  exists (
    select 1
    from public.conversations
    where public.conversations.id = conversation_members.conversation_id
      and public.conversations.tenant_id = public.current_tenant_id()
  )
)
with check (
  exists (
    select 1
    from public.conversations
    where public.conversations.id = conversation_members.conversation_id
      and public.conversations.tenant_id = public.current_tenant_id()
  )
);

drop policy if exists messages_isolated on public.messages;
create policy messages_isolated on public.messages
for all using (tenant_id = public.current_tenant_id()) with check (tenant_id = public.current_tenant_id());

drop policy if exists events_isolated on public.events;
create policy events_isolated on public.events
for all using (tenant_id = public.current_tenant_id()) with check (tenant_id = public.current_tenant_id());

drop policy if exists event_attendees_isolated on public.event_attendees;
create policy event_attendees_isolated on public.event_attendees
for all using (
  exists (
    select 1
    from public.events
    where public.events.id = event_attendees.event_id
      and public.events.tenant_id = public.current_tenant_id()
  )
)
with check (
  exists (
    select 1
    from public.events
    where public.events.id = event_attendees.event_id
      and public.events.tenant_id = public.current_tenant_id()
  )
);

drop policy if exists news_posts_isolated on public.news_posts;
create policy news_posts_isolated on public.news_posts
for all using (tenant_id = public.current_tenant_id()) with check (tenant_id = public.current_tenant_id());

drop policy if exists push_notifications_isolated on public.push_notifications;
create policy push_notifications_isolated on public.push_notifications
for all using (tenant_id = public.current_tenant_id()) with check (tenant_id = public.current_tenant_id());

drop policy if exists documents_isolated on public.documents;
create policy documents_isolated on public.documents
for all using (tenant_id = public.current_tenant_id()) with check (tenant_id = public.current_tenant_id());

drop policy if exists forms_isolated on public.forms;
create policy forms_isolated on public.forms
for all using (tenant_id = public.current_tenant_id()) with check (tenant_id = public.current_tenant_id());

drop policy if exists form_responses_isolated on public.form_responses;
create policy form_responses_isolated on public.form_responses
for all using (tenant_id = public.current_tenant_id()) with check (tenant_id = public.current_tenant_id());

drop policy if exists build_jobs_isolated on public.build_jobs;
create policy build_jobs_isolated on public.build_jobs
for all using (tenant_id = public.current_tenant_id()) with check (tenant_id = public.current_tenant_id());
