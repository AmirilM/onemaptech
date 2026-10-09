export interface ParsedRow {
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
}

export interface ParsedStore {
  store_code: string;
  store_name: string;
  concept: string;
}

export interface ParseResult {
  rows: ParsedRow[];
  errors: string[];
  stores: ParsedStore[];
}
