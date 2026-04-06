create table if not exists public.customer_accounts (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_account_tenants (
  account_id uuid not null references public.customer_accounts(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (account_id, tenant_id)
);

create index if not exists idx_customer_account_tenants_tenant on public.customer_account_tenants(tenant_id);

drop trigger if exists set_customer_accounts_updated_at on public.customer_accounts;
create trigger set_customer_accounts_updated_at
before update on public.customer_accounts
for each row execute function public.set_updated_at();

alter table public.customer_accounts enable row level security;
alter table public.customer_account_tenants enable row level security;

drop policy if exists customer_accounts_blocked on public.customer_accounts;
create policy customer_accounts_blocked on public.customer_accounts
for all using (false) with check (false);

drop policy if exists customer_account_tenants_blocked on public.customer_account_tenants;
create policy customer_account_tenants_blocked on public.customer_account_tenants
for all using (false) with check (false);
