-- OneMapTech schema: RLS + helpers + signup trigger

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Keep views subject to caller RLS
alter view public.v_sales_by_day set (security_invoker = true);
alter view public.v_sales_by_store set (security_invoker = true);
alter view public.v_sales_by_brand set (security_invoker = true);
alter view public.v_sales_by_category set (security_invoker = true);
alter view public.v_sales_by_kpi_group set (security_invoker = true);
alter view public.v_top_products set (security_invoker = true);
alter view public.v_week_compare set (security_invoker = true);

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.transactions enable row level security;

-- profiles
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated using (true);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- stores
drop policy if exists stores_select on public.stores;
create policy stores_select on public.stores
  for select to authenticated using (true);

drop policy if exists stores_admin_write on public.stores;
create policy stores_admin_write on public.stores
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- transactions
drop policy if exists tx_select on public.transactions;
create policy tx_select on public.transactions
  for select to authenticated using (true);

drop policy if exists tx_admin_write on public.transactions;
create policy tx_admin_write on public.transactions
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
