import type { createClient } from "@/lib/supabase/server";
import type { FilterOptions } from "@/lib/filters";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function getFilterOptions(
  supabase: SupabaseServerClient,
): Promise<FilterOptions> {
  const [storesRes, brandsRes, categoriesRes, conceptsRes] = await Promise.all([
    supabase.from("stores").select("store_code,store_name,concept").order("store_name"),
    supabase.from("transactions").select("brand_name").limit(100000),
    supabase.from("transactions").select("product_category").limit(100000),
    supabase.from("transactions").select("concept").limit(100000),
  ]);

  const uniq = (values: (string | null)[]) =>
    Array.from(new Set(values.filter((v): v is string => !!v && v !== ""))).sort();

  return {
    stores: (storesRes.data ?? []) as FilterOptions["stores"],
    brands: uniq((brandsRes.data ?? []).map((r) => r.brand_name)),
    categories: uniq((categoriesRes.data ?? []).map((r) => r.product_category)),
    concepts: uniq((conceptsRes.data ?? []).map((r) => r.concept)),
  };
}
