import type { Filters } from "@/lib/types";

export function parseFilters(
  searchParams: Record<string, string | string[] | undefined>,
): Filters {
  const pick = (key: string): string | undefined => {
    const value = searchParams[key];
    if (Array.isArray(value)) return value[0];
    return value;
  };

  return {
    dateFrom: pick("dateFrom"),
    dateTo: pick("dateTo"),
    concept: pick("concept"),
    store: pick("store"),
    brand: pick("brand"),
    category: pick("category"),
  };
}

export function buildQueryString(filters: Filters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params.toString();
}

export interface FilterOptions {
  stores: { store_code: string; store_name: string; concept: string }[];
  brands: string[];
  categories: string[];
  concepts: string[];
}
