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
