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
       max(store_name) as store_name,
       max(concept) as concept,
       sum(t.localamount) as revenue,
       sum(t.qty_item) as qty,
       count(*) as transactions
from public.transactions t
join public.stores s using (store_code)
group by store_code;
