"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parseWorkbook } from "@/lib/excel/parse";
import type { ImportSummary } from "@/lib/types";

export async function uploadWorkbook(
  _prev: ImportSummary | null,
  formData: FormData,
): Promise<ImportSummary> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return errorSummary("Sesi tidak valid. Silakan login ulang.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return errorSummary("Hanya admin yang dapat mengunggah data.");
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return errorSummary("Pilih file .xlsx terlebih dahulu.");
  }
  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    return errorSummary("Format file harus .xlsx");
  }

  const buffer = await file.arrayBuffer();
  const parsed = await parseWorkbook(buffer);

  if (parsed.rows.length === 0) {
    return {
      total: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: parsed.errors.length
        ? parsed.errors
        : ["Tidak ada baris data yang dapat diproses."],
      revenue: 0,
      qty: 0,
    };
  }

  // Upsert stores first (transactions reference stores).
  const storeRes = await supabase
    .from("stores")
    .upsert(parsed.stores, { onConflict: "store_code" });
  if (storeRes.error) {
    return errorSummary(`Gagal menyimpan stores: ${storeRes.error.message}`);
  }

  const keys = parsed.rows.map(
    (r) => `${r.date}|${r.store_code}|${r.sap_article}`,
  );

  const existing = new Set<string>();
  const chunkSize = 500;
  for (let i = 0; i < keys.length; i += chunkSize) {
    const slice = keys.slice(i, i + chunkSize);
    const { data } = await supabase
      .from("transactions")
      .select("date,store_code,sap_article")
      .in("sap_article", slice.map((k) => k.split("|")[2]));
    for (const row of data ?? []) {
      existing.add(`${row.date}|${row.store_code}|${row.sap_article}`);
    }
  }

  let inserted = 0;
  let updated = 0;
  for (const key of keys) {
    if (existing.has(key)) updated += 1;
    else inserted += 1;
  }

  const upsertRes = await supabase
    .from("transactions")
    .upsert(parsed.rows, { onConflict: "date,store_code,sap_article" });

  if (upsertRes.error) {
    return errorSummary(`Gagal menyimpan transaksi: ${upsertRes.error.message}`);
  }

  const revenue = parsed.rows.reduce((acc, r) => acc + r.localamount, 0);
  const qty = parsed.rows.reduce((acc, r) => acc + r.qty_item, 0);

  revalidatePath("/overview");
  revalidatePath("/stores");
  revalidatePath("/brands");
  revalidatePath("/products");
  revalidatePath("/weeks");
  revalidatePath("/upload");

  return {
    total: parsed.rows.length,
    inserted,
    updated,
    skipped: parsed.rows.length - inserted - updated,
    errors: parsed.errors.slice(0, 20),
    revenue,
    qty,
  };
}

function errorSummary(message: string): ImportSummary {
  return {
    total: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: [message],
    revenue: 0,
    qty: 0,
  };
}
