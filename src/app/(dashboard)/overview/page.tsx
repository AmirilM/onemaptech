import { redirect } from "next/navigation";
import { Store, Package, Receipt, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFilterOptions } from "@/lib/filter-options";
import { parseFilters } from "@/lib/filters";
import { fetchTransactions, computeTotals, byDay, groupBy } from "@/lib/metrics";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/filters/filter-bar";
import { TrendAreaChart } from "@/components/charts/charts";

export default async function OverviewPage({
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

  const totals = computeTotals(rows);
  const daily = byDay(rows);
  const dailyData = daily.map((d) => ({ label: d.label, revenue: d.revenue }));
  const concept = groupBy(rows, (r) => r.concept).sort(
    (a, b) => b.revenue - a.revenue,
  );

  const half = Math.floor(daily.length / 2);
  const firstHalf = daily.slice(0, half).reduce((a, d) => a + d.revenue, 0);
  const secondHalf = daily.slice(half).reduce((a, d) => a + d.revenue, 0);
  const trendDelta =
    firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : undefined;

  return (
    <div className="space-y-5">
      <FilterBar options={options} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={totals.revenue}
          icon={<Wallet size={18} />}
          delta={trendDelta}
          sparkline={daily.map((d) => d.revenue)}
        />
        <StatCard
          label="Total Qty"
          value={totals.qty}
          variant="number"
          icon={<Package size={18} />}
          sparkline={daily.map((d) => d.qty)}
        />
        <StatCard
          label="Transaksi"
          value={totals.transactions}
          variant="number"
          icon={<Receipt size={18} />}
        />
        <StatCard
          label="Toko Aktif"
          value={totals.stores}
          variant="number"
          icon={<Store size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle subtitle="Tren revenue harian">Revenue Harian</CardTitle>
          {dailyData.length ? (
            <TrendAreaChart data={dailyData} />
          ) : (
            <EmptyState
              icon={<Wallet size={20} />}
              title="Belum ada data"
              description="Unggah file Excel penjualan untuk melihat tren revenue."
            />
          )}
        </Card>

        <Card>
          <CardTitle subtitle="Kontribusi per concept">Concept</CardTitle>
          {concept.length ? (
            <div className="space-y-3">
              {concept.map((c) => (
                <div key={c.key}>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">{c.label}</span>
                    <span className="font-medium text-foreground">
                      {((c.revenue / (totals.revenue || 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-surface-muted">
                    <div
                      className="h-2 rounded-full bg-brand-500"
                      style={{
                        width: `${(c.revenue / (totals.revenue || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Belum ada data" />
          )}
        </Card>
      </div>
    </div>
  );
}
