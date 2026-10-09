"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { X } from "lucide-react";
import type { FilterOptions } from "@/lib/filters";
import { cn } from "@/lib/utils";

const SELECT_KEYS = [
  { key: "concept", label: "Concept" },
  { key: "store", label: "Store" },
  { key: "brand", label: "Brand" },
  { key: "category", label: "Kategori" },
] as const;

function startOfDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

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

  const setRange = useCallback(
    (from?: string, to?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (from) params.set("dateFrom", from);
      else params.delete("dateFrom");
      if (to) params.set("dateTo", to);
      else params.delete("dateTo");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const { from, to } = {
    from: searchParams.get("dateFrom") ?? "",
    to: searchParams.get("dateTo") ?? "",
  };

  const presets = useMemo(() => {
    const today = new Date();
    const week = new Date();
    week.setDate(today.getDate() - 6);
    const month = new Date(today.getFullYear(), today.getMonth(), 1);
    return [
      { label: "Semua", from: "", to: "" },
      { label: "Hari ini", from: startOfDay(today), to: startOfDay(today) },
      { label: "7 hari", from: startOfDay(week), to: startOfDay(today) },
      { label: "Bulan ini", from: startOfDay(month), to: startOfDay(today) },
    ];
  }, []);

  const active = SELECT_KEYS.filter((k) => searchParams.get(k.key));

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-1">
          {presets.map((p) => {
            const isActive = from === p.from && to === p.to;
            return (
              <button
                key={p.label}
                onClick={() => setRange(p.from, p.to)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-brand-500 text-white"
                    : "text-muted hover:bg-surface-muted hover:text-foreground",
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

        <label className="flex items-center gap-1.5 text-xs text-muted">
          <input
            type="date"
            value={from}
            onChange={(e) => setParam("dateFrom", e.target.value)}
            className="h-8 rounded-lg border border-border bg-surface px-2 text-xs text-foreground outline-none focus:border-brand-500"
          />
          <span>→</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setParam("dateTo", e.target.value)}
            className="h-8 rounded-lg border border-border bg-surface px-2 text-xs text-foreground outline-none focus:border-brand-500"
          />
        </label>

        <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

        {SELECT_KEYS.map(({ key, label }) => (
          <select
            key={key}
            value={searchParams.get(key) ?? ""}
            onChange={(e) => setParam(key, e.target.value)}
            className="h-8 rounded-lg border border-border bg-surface px-2 text-xs text-foreground outline-none focus:border-brand-500"
          >
            <option value="">{label}: Semua</option>
            {key === "store"
              ? options.stores.map((s) => (
                  <option key={s.store_code} value={s.store_code}>
                    {s.store_name}
                  </option>
                ))
              : (key === "concept"
                  ? options.concepts
                  : key === "brand"
                    ? options.brands
                    : options.categories
                ).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
          </select>
        ))}

        {active.length || from || to ? (
          <button
            onClick={() => router.push(pathname)}
            className="ml-auto inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted hover:bg-surface-muted"
          >
            <X size={13} /> Reset
          </button>
        ) : null}
      </div>

      {active.length ? (
        <div className="mt-2 flex flex-wrap gap-1.5 border-t border-border pt-2">
          {active.map(({ key, label }) => {
            const value = searchParams.get(key)!;
            const display =
              key === "store"
                ? options.stores.find((s) => s.store_code === value)?.store_name ??
                  value
                : value;
            return (
              <button
                key={key}
                onClick={() => setParam(key, "")}
                className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600 dark:bg-brand-950 dark:text-brand-300"
              >
                {label}: {display}
                <X size={12} />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
