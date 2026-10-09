"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right";
  sortable?: boolean;
  sortValue?: (row: T) => number | string;
  render: (row: T, index: number) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  initialSortKey,
  searchable = false,
  searchText,
  initialQuery = "",
  pageSize = 10,
  csvName,
  csvColumns,
}: {
  columns: Column<T>[];
  rows: T[];
  initialSortKey?: string;
  searchable?: boolean;
  searchText?: (row: T) => string;
  initialQuery?: string;
  pageSize?: number;
  csvName?: string;
  csvColumns?: { header: string; value: (row: T) => string | number }[];
}) {
  const [sortKey, setSortKey] = useState<string | undefined>(initialSortKey);
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!searchable || !searchText || !query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => searchText(r).toLowerCase().includes(q));
  }, [rows, query, searchable, searchText]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return filtered;
    return [...filtered].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return dir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, dir, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pageCount - 1);
  const paged = sorted.slice(current * pageSize, current * pageSize + pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setDir("desc");
    }
  }

  function exportCsv() {
    const cols =
      csvColumns ??
      columns.map((c) => ({ header: c.header, value: () => "" }));
    const header = cols.map((c) => `"${c.header}"`).join(",");
    const body = sorted
      .map((r) => cols.map((c) => `"${c.value(r)}"`).join(","))
      .join("\n");
    const blob = new Blob([`${header}\n${body}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${csvName ?? "export"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {(searchable || csvName) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {searchable ? (
            <div className="relative w-full max-w-xs">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
              />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
                placeholder="Cari…"
                className="h-8 pl-8 text-xs"
              />
            </div>
          ) : (
            <span />
          )}
          {csvName ? (
            <Button variant="secondary" size="sm" onClick={exportCsv}>
              Export CSV
            </Button>
          ) : null}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase text-subtle">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "py-2 pr-3 font-medium",
                    c.align === "right" && "text-right",
                  )}
                >
                  {c.sortable ? (
                    <button
                      onClick={() => toggleSort(c.key)}
                      className={cn(
                        "inline-flex items-center gap-1 hover:text-foreground",
                        c.align === "right" && "flex-row-reverse",
                      )}
                    >
                      {c.header}
                      {sortKey === c.key ? (
                        dir === "asc" ? (
                          <ArrowUp size={12} />
                        ) : (
                          <ArrowDown size={12} />
                        )
                      ) : null}
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr
                key={current * pageSize + i}
                className="border-b border-border/60 last:border-0 hover:bg-surface-muted"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      "py-2 pr-3",
                      c.align === "right" && "text-right",
                    )}
                  >
                    {c.render(row, current * pageSize + i)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 ? (
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>
            Halaman {current + 1} dari {pageCount}
          </span>
          <div className="flex gap-1">
            <Button
              variant="secondary"
              size="icon"
              className="h-7 w-7"
              disabled={current === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft size={14} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-7 w-7"
              disabled={current >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
