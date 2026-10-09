"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Filter, X } from "lucide-react";
import type { FilterOptions } from "@/lib/filters";
import { FilterField, selectClass } from "./filter-field";

const KEYS = ["dateFrom", "dateTo", "concept", "store", "brand", "category"];

export function FilterBar({ options }: { options: FilterOptions }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const hasActive = KEYS.some((k) => searchParams.get(k));

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <span className="flex items-center gap-1.5 pb-1.5 text-xs font-medium text-slate-500">
        <Filter size={14} /> Filter
      </span>

      <FilterField label="Dari">
        <input
          type="date"
          defaultValue={searchParams.get("dateFrom") ?? ""}
          onChange={(e) => setParam("dateFrom", e.target.value)}
          className={selectClass}
        />
      </FilterField>

      <FilterField label="Sampai">
        <input
          type="date"
          defaultValue={searchParams.get("dateTo") ?? ""}
          onChange={(e) => setParam("dateTo", e.target.value)}
          className={selectClass}
        />
      </FilterField>

      <FilterField label="Concept">
        <select
          defaultValue={searchParams.get("concept") ?? ""}
          onChange={(e) => setParam("concept", e.target.value)}
          className={selectClass}
        >
          <option value="">Semua</option>
          {options.concepts.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FilterField>

      <FilterField label="Store">
        <select
          defaultValue={searchParams.get("store") ?? ""}
          onChange={(e) => setParam("store", e.target.value)}
          className={selectClass}
        >
          <option value="">Semua</option>
          {options.stores.map((s) => (
            <option key={s.store_code} value={s.store_code}>
              {s.store_name}
            </option>
          ))}
        </select>
      </FilterField>

      <FilterField label="Brand">
        <select
          defaultValue={searchParams.get("brand") ?? ""}
          onChange={(e) => setParam("brand", e.target.value)}
          className={selectClass}
        >
          <option value="">Semua</option>
          {options.brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </FilterField>

      <FilterField label="Kategori">
        <select
          defaultValue={searchParams.get("category") ?? ""}
          onChange={(e) => setParam("category", e.target.value)}
          className={selectClass}
        >
          <option value="">Semua</option>
          {options.categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FilterField>

      {hasActive ? (
        <button
          onClick={() => router.push(pathname)}
          className="mb-0.5 inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-50"
        >
          <X size={13} /> Reset
        </button>
      ) : null}
    </div>
  );
}
