export type UserRole = "admin" | "viewer";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface Store {
  store_code: string;
  store_name: string;
  concept: string;
}

export interface Transaction {
  id: number;
  date: string;
  store_code: string;
  concept: string;
  brand_name: string;
  brand_code: string;
  product_division: string;
  product_group: string;
  product_category: string;
  lob: string;
  sublob: string;
  kpi_group: string;
  sap_article: string;
  sap_description: string;
  item: string;
  qty_item: number;
  localamount: number;
  month: string;
  year: number;
  week_apple: string;
  week_sf: string;
  quarter_apple: string;
  imported_at: string;
}

export interface Filters {
  dateFrom?: string;
  dateTo?: string;
  concept?: string;
  store?: string;
  brand?: string;
  category?: string;
}

export interface ImportSummary {
  total: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
  revenue: number;
  qty: number;
}
