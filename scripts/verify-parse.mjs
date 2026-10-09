import ExcelJS from "exceljs";
import { readFile } from "node:fs/promises";

const buf = await readFile("store-transactions.xlsx");
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const wb = new ExcelJS.Workbook();
await wb.xlsx.load(ab);
const ws = wb.getWorksheet("RAW") ?? wb.worksheets[0];

const clean = (v) =>
  v == null ? "" : String(v).replace(/\u00a0/g, " ").trim();
const num = (v) => {
  if (v == null || v === "") return 0;
  if (typeof v === "number") return v;
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const isoDate = (v) => {
  if (v == null || v === "") return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = num(v);
  if (!s) return null;
  return new Date(Date.UTC(1899, 11, 30) + s * 86400000)
    .toISOString()
    .slice(0, 10);
};

const ci = new Map();
ws.getRow(1).eachCell((c, n) => {
  const v = clean(c.value);
  if (v) ci.set(v, n);
});

let revenue = 0;
let qty = 0;
let rows = 0;
const keys = new Set();
const stores = new Map();
ws.eachRow((row, rn) => {
  if (rn === 1) return;
  const get = (name) => row.getCell(ci.get(name)).value;
  const date = isoDate(get("date"));
  const store = clean(get("store_code"));
  const art = clean(get("sap_article"));
  if (!date || !store || !art) return;
  rows++;
  revenue += num(get("localamount"));
  qty += num(get("qty_item"));
  keys.add(`${date}|${store}|${art}`);
  stores.set(store, clean(get("store_name")));
});

console.log("rows:", rows);
console.log("unique keys:", keys.size);
console.log("revenue:", revenue);
console.log("qty:", qty);
console.log("stores:", stores.size);
console.log("sample date first row:", isoDate(46296));
