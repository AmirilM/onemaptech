import type { createClient } from "@/lib/supabase/server";
import type { Filters } from "@/lib/types";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export interface TxRow {
  date: string;
  store_code: string;
  concept: string;
  brand_name: string;
  product_group: string;
  product_category: string;
  kpi_group: string;
  sap_article: string;
  sap_description: string;
  item: string;
  qty_item: number;
  localamount: number;
  week_apple: string;
  week_sf: string;
}

export async function fetchTransactions(
  supabase: SupabaseServerClient,
  filters: Filters,
): Promise<TxRow[]> {
  let query = supabase
    .from("transactions")
    .select(
      "date,store_code,concept,brand_name,product_group,product_category,kpi_group,sap_article,sap_description,item,qty_item,localamount,week_apple,week_sf",
    )
    .order("date", { ascending: true })
    .limit(50000);

  if (filters.dateFrom) query = query.gte("date", filters.dateFrom);
  if (filters.dateTo) query = query.lte("date", filters.dateTo);
  if (filters.concept) query = query.eq("concept", filters.concept);
  if (filters.store) query = query.eq("store_code", filters.store);
  if (filters.brand) query = query.eq("brand_name", filters.brand);
  if (filters.category) query = query.eq("product_category", filters.category);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as TxRow[];
}

export interface Totals {
  revenue: number;
  qty: number;
  transactions: number;
  avgOrderValue: number;
  stores: number;
}

export function computeTotals(rows: TxRow[]): Totals {
  const revenue = rows.reduce((acc, r) => acc + Number(r.localamount), 0);
  const qty = rows.reduce((acc, r) => acc + Number(r.qty_item), 0);
  const storeSet = new Set(rows.map((r) => r.store_code));
  return {
    revenue,
    qty,
    transactions: rows.length,
    avgOrderValue: rows.length ? revenue / rows.length : 0,
    stores: storeSet.size,
  };
}

export interface GroupRow {
  key: string;
  label: string;
  revenue: number;
  qty: number;
  transactions: number;
}

export function groupBy(
  rows: TxRow[],
  keyFn: (r: TxRow) => string,
  labelFn?: (r: TxRow) => string,
): GroupRow[] {
  const map = new Map<string, GroupRow>();
  for (const r of rows) {
    const key = keyFn(r) || "(kosong)";
    const label = labelFn ? labelFn(r) || key : key;
    const existing = map.get(key);
    if (existing) {
      existing.revenue += Number(r.localamount);
      existing.qty += Number(r.qty_item);
      existing.transactions += 1;
    } else {
      map.set(key, {
        key,
        label,
        revenue: Number(r.localamount),
        qty: Number(r.qty_item),
        transactions: 1,
      });
    }
  }
  return Array.from(map.values());
}

export function byDay(rows: TxRow[]): GroupRow[] {
  return groupBy(rows, (r) => r.date).sort((a, b) =>
    a.key < b.key ? -1 : a.key > b.key ? 1 : 0,
  );
}
