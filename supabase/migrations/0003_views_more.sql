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
