-- OneMapTech schema: tables
-- Run in Supabase SQL Editor (project obiyabzgtkxmepsspmtx)

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'viewer' check (role in ('admin','viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.stores (
  store_code text primary key,
  store_name text not null,
  concept text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id bigint generated always as identity primary key,
  date date not null,
  store_code text not null references public.stores(store_code) on update cascade,
  concept text not null default '',
  brand_name text not null default '',
  brand_code text not null default '',
  product_division text not null default '',
  product_group text not null default '',
  product_category text not null default '',
  lob text not null default '',
  sublob text not null default '',
  kpi_group text not null default '',
  sap_article text not null,
  sap_description text not null default '',
  item text not null default '',
  qty_item numeric not null default 0,
  localamount numeric not null default 0,
  month text not null default '',
  year int not null default 0,
  week_apple text not null default '',
  week_sf text not null default '',
  quarter_apple text not null default '',
  imported_at timestamptz not null default now(),
  constraint transactions_unique unique (date, store_code, sap_article)
);

create index if not exists idx_tx_date on public.transactions (date);
create index if not exists idx_tx_store on public.transactions (store_code);
create index if not exists idx_tx_brand on public.transactions (brand_name);
create index if not exists idx_tx_kpi on public.transactions (kpi_group);
-- OneMapTech schema: aggregate views for dashboard

create or replace view public.v_sales_by_day as
select date,
       sum(localamount) as revenue,
       sum(qty_item) as qty,
       count(*) as transactions
from public.transactions
group by date;

create or replace view public.v_sales_by_store as
select store_code,
       max(s.store_name) as store_name,
       max(s.concept) as concept,
       sum(t.localamount) as revenue,
       sum(t.qty_item) as qty,
       count(*) as transactions
from public.transactions t
join public.stores s using (store_code)
group by store_code;
-- OneMapTech schema: more aggregate views

create or replace view public.v_sales_by_brand as
select brand_name,
       brand_code,
       sum(localamount) as revenue,
       sum(qty_item) as qty,
       count(*) as transactions
from public.transactions
group by brand_name, brand_code;

create or replace view public.v_sales_by_category as
select product_group,
       product_category,
       sum(localamount) as revenue,
       sum(qty_item) as qty,
       count(*) as transactions
from public.transactions
group by product_group, product_category;

create or replace view public.v_sales_by_kpi_group as
select kpi_group,
       sum(localamount) as revenue,
       sum(qty_item) as qty,
       count(*) as transactions
from public.transactions
group by kpi_group;

create or replace view public.v_top_products as
select sap_article,
       max(sap_description) as sap_description,
       max(brand_name) as brand_name,
       max(product_category) as product_category,
       sum(localamount) as revenue,
       sum(qty_item) as qty,
       count(*) as transactions
from public.transactions
group by sap_article;

create or replace view public.v_week_compare as
select week_apple,
       week_sf,
       sum(localamount) as revenue,
       sum(qty_item) as qty,
       count(*) as transactions
from public.transactions
group by week_apple, week_sf;
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
-- OneMapTech schema: auto-create profile on signup

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'viewer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
-- OneMapTech: Sales ID login support
-- Adds a numeric sales_id column to profiles and derives it automatically
-- from the synthetic auth email prefix (e.g. 22008205@onemaptech.id).

alter table public.profiles
  add column if not exists sales_id text unique;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, sales_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'viewer'),
    case
      when new.email ~ '^[0-9]+@' then split_part(new.email, '@', 1)
      else null
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Backfill sales_id for any existing users with synthetic numeric emails.
update public.profiles
set sales_id = split_part(email, '@', 1)
where sales_id is null
  and email ~ '^[0-9]+@';
-- OneMapTech: seed stores (part 1)
insert into public.stores (store_code, store_name, concept) values
  ('QA02', 'SAMSUNG RITA SUPERMALL TEGAL', 'Samsung'),
  ('QA03', 'SAMSUNG PACIFIC MALL TEGAL', 'Samsung'),
  ('QF05', 'DIGIPLUS SOLO PARAGON MALL', 'Multibrand'),
  ('QF09', 'DIGIPLUS PAKUWON MALL YOGYAKARTA', 'Multibrand'),
  ('QF20', 'DIGIPLUS THE PARK SEMARANG', 'Multibrand'),
  ('QF27', 'DIGIPLUS RITA SUPERMALL PURWOKERTO', 'Multibrand'),
  ('QF28', 'DIGIPLUS RITA SUPERMALL TEGAL', 'Multibrand'),
  ('QF31', 'DIGIPLUS QUEEN CITY MALL', 'Multibrand')
on conflict (store_code) do update
  set store_name = excluded.store_name, concept = excluded.concept;
-- OneMapTech: seed stores (part 2)
insert into public.stores (store_code, store_name, concept) values
  ('QF34', 'DIGIPLUS LIPPO PLAZA JOGJA', 'Multibrand'),
  ('QF36', 'DIGIPLUS CIPUTRA SEMARANG', 'Multibrand'),
  ('QF37', 'DIGIPLUS JOGJA CITY MALL', 'Multibrand'),
  ('QF41', 'DIGIPLUS ARMADA TOWN SQUARE', 'Multibrand'),
  ('QF48', 'DIGIPLUS SLEMAN CITY HALL', 'Multibrand'),
  ('QF59', 'DIGIPLUS THE PARK SOLO', 'Multibrand'),
  ('QF76', 'DIGIPLUS DP MALL SEMARANG', 'Multibrand'),
  ('QF90', 'DIGIPLUS KLATEN TOWN SQUARE', 'Multibrand'),
  ('QF99', 'DIGIPLUS 23 SEMARANG MALL', 'Multibrand')
on conflict (store_code) do update
  set store_name = excluded.store_name, concept = excluded.concept;
