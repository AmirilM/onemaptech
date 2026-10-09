import ExcelJS from "exceljs";
import { clean, serialToISODate, toNumber } from "./normalize";
import type { ParsedRow, ParsedStore, ParseResult } from "./types";

const REQUIRED_COLUMNS = [
  "brand_name",
  "product_division",
  "product_group",
  "product_category",
  "date",
  "item",
  "qty_item",
  "localamount",
  "store_code",
  "month",
  "year",
  "sap_article",
  "sap_description",
  "brand_code",
  "lob",
  "sublob",
  "kpi_group",
  "store_name",
  "concept",
  "week_apple",
  "quarter_apple",
  "week_sf",
] as const;

export async function parseWorkbook(buffer: ArrayBuffer): Promise<ParseResult> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.getWorksheet("RAW") ?? workbook.worksheets[0];
  if (!worksheet) {
    return { rows: [], errors: ["File tidak memiliki worksheet."], stores: [] };
  }

  const columnIndex = new Map<string, number>();
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    const name = clean(cell.value);
    if (name) columnIndex.set(name, colNumber);
  });

  const missing = REQUIRED_COLUMNS.filter((c) => !columnIndex.has(c));
  if (missing.length > 0) {
    return {
      rows: [],
      errors: [`Kolom wajib tidak ditemukan: ${missing.join(", ")}`],
      stores: [],
    };
  }

  const rows: ParsedRow[] = [];
  const errors: string[] = [];
  const storesMap = new Map<string, ParsedStore>();

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const get = (name: string): unknown =>
      row.getCell(columnIndex.get(name)!).value;

    const date = serialToISODate(get("date"));
    const storeCode = clean(get("store_code"));
    const sapArticle = clean(get("sap_article"));

    if (!date || !storeCode || !sapArticle) {
      errors.push(`Baris ${rowNumber}: date/store_code/sap_article kosong.`);
      return;
    }

    const storeName = clean(get("store_name"));
    const concept = clean(get("concept"));
    if (storeName) {
      storesMap.set(storeCode, {
        store_code: storeCode,
        store_name: storeName,
        concept,
      });
    }

    rows.push({
      date,
      store_code: storeCode,
      concept,
      brand_name: clean(get("brand_name")),
      brand_code: clean(get("brand_code")),
      product_division: clean(get("product_division")),
      product_group: clean(get("product_group")),
      product_category: clean(get("product_category")),
      lob: clean(get("lob")),
      sublob: clean(get("sublob")),
      kpi_group: clean(get("kpi_group")),
      sap_article: sapArticle,
      sap_description: clean(get("sap_description")),
      item: clean(get("item")),
      qty_item: toNumber(get("qty_item")),
      localamount: toNumber(get("localamount")),
      month: clean(get("month")),
      year: toNumber(get("year")),
      week_apple: clean(get("week_apple")),
      week_sf: clean(get("week_sf")),
      quarter_apple: clean(get("quarter_apple")),
    });
  });

  return { rows, errors, stores: Array.from(storesMap.values()) };
}
