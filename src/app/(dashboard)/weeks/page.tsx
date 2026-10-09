import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFilterOptions } from "@/lib/filter-options";
import { parseFilters } from "@/lib/filters";
import { fetchTransactions, groupBy } from "@/lib/metrics";
import { formatIDR, formatNumber } from "@/lib/format";
import { Card, CardTitle } from "@/components/ui/card";
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
        <WeekCard
          title="Apple Week (week_apple)"
          subtitle="Perbandingan W1 vs W2"
          rows={apple}
        />
        <WeekCard
          title="Store Force Week (week_sf)"
          subtitle="Perbandingan W40 vs W41"
          rows={sf}
        />
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

  return (
    <Card>
      <CardTitle subtitle={subtitle}>{title}</CardTitle>
      {rows.length ? (
        <div className="space-y-4">
          {rows.map((r, i) => (
            <div key={r.key}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{r.label}</span>
                <span className="text-slate-800">{formatIDR(r.revenue)}</span>
              </div>
              <div className="mt-1.5 h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${(r.revenue / max) * 100}%`,
                    backgroundColor: i === 0 ? "#3366ff" : "#0ea5e9",
                  }}
                />
              </div>
              <div className="mt-1 flex gap-4 text-xs text-slate-400">
                <span>Qty: {formatNumber(r.qty)}</span>
                <span>Transaksi: {formatNumber(r.transactions)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center text-sm text-slate-400">
          Belum ada data.
        </div>
      )}
    </Card>
  );
}
