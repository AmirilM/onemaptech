import { redirect } from "next/navigation";
import { CalendarRange } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFilterOptions } from "@/lib/filter-options";
import { parseFilters } from "@/lib/filters";
import { fetchTransactions, groupBy } from "@/lib/metrics";
import { formatIDR, formatNumber } from "@/lib/format";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { FilterBar } from "@/components/filters/filter-bar";

interface WeekRow {
  key: string;
  label: string;
  revenue: number;
  qty: number;
  transactions: number;
}

export default async function WeeksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const filters = parseFilters(await searchParams);
  const [rows, options] = await Promise.all([
    fetchTransactions(supabase, filters),
    getFilterOptions(supabase),
  ]);

  const apple = groupBy(rows, (r) => r.week_apple).sort((a, b) =>
    a.key.localeCompare(b.key),
  );
  const sf = groupBy(rows, (r) => r.week_sf).sort((a, b) =>
    a.key.localeCompare(b.key),
  );

  return (
    <div className="space-y-5">
      <FilterBar options={options} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WeekCard title="Apple Week" subtitle="Perbandingan week_apple" rows={apple} />
        <WeekCard title="Store Force Week" subtitle="Perbandingan week_sf" rows={sf} />
      </div>
    </div>
  );
}

function WeekCard({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: WeekRow[];
}) {
  const max = Math.max(...rows.map((r) => r.revenue), 1);
  const best = rows.reduce(
    (acc, r) => (r.revenue > acc.revenue ? r : acc),
    rows[0] ?? { revenue: 0, key: "" },
  );

  return (
    <Card>
      <CardTitle subtitle={subtitle}>{title}</CardTitle>
      {rows.length ? (
        <div className="space-y-4">
          {rows.map((r) => {
            const growth =
              rows.length > 1 && rows[0].revenue > 0
                ? ((r.revenue - rows[0].revenue) / rows[0].revenue) * 100
                : undefined;
            return (
              <div key={r.key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    {r.label}
                    {r.key === best.key ? (
                      <Badge variant="brand">tertinggi</Badge>
                    ) : null}
                  </span>
                  <span className="font-medium text-foreground">
                    {formatIDR(r.revenue)}
                  </span>
                </div>
                <div className="mt-1.5 h-3 rounded-full bg-surface-muted">
                  <div
                    className="h-3 rounded-full bg-brand-500"
                    style={{ width: `${(r.revenue / max) * 100}%` }}
                  />
                </div>
                <div className="mt-1 flex gap-4 text-xs text-subtle">
                  <span>Qty: {formatNumber(r.qty)}</span>
                  <span>Transaksi: {formatNumber(r.transactions)}</span>
                  {growth !== undefined && growth !== 0 ? (
                    <span
                      className={
                        growth > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-brand-500"
                      }
                    >
                      {growth > 0 ? "▲" : "▼"} {Math.abs(growth).toFixed(1)}% vs {rows[0].label}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={<CalendarRange size={20} />} title="Belum ada data" />
      )}
    </Card>
  );
}
