import { redirect } from "next/navigation";
import { Store, Package, Receipt, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFilterOptions } from "@/lib/filter-options";
import { parseFilters } from "@/lib/filters";
import { fetchTransactions, computeTotals, byDay, groupBy } from "@/lib/metrics";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardTitle } from "@/components/ui/card";
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
  const daily = byDay(rows).map((d) => ({ label: d.label, revenue: d.revenue }));
  const concept = groupBy(rows, (r) => r.concept);

  return (
    <div className="space-y-5">
      <FilterBar options={options} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={totals.revenue}
          icon={<Wallet size={18} />}
        />
        <StatCard
          label="Total Qty"
          value={totals.qty}
          variant="number"
          icon={<Package size={18} />}
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
          {daily.length ? (
            <TrendAreaChart data={daily} />
          ) : (
            <EmptyState />
          )}
        </Card>

        <Card>
          <CardTitle subtitle="Kontribusi per concept">Concept</CardTitle>
          <div className="space-y-3">
            {concept.length ? (
              concept
                .sort((a, b) => b.revenue - a.revenue)
                .map((c) => (
                  <div key={c.key}>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">{c.label}</span>
                      <span className="font-medium text-slate-800">
                        {Math.round(
                          (c.revenue / (totals.revenue || 1)) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-brand-500"
                        style={{
                          width: `${(c.revenue / (totals.revenue || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
            ) : (
              <EmptyState />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-40 items-center justify-center text-sm text-slate-400">
      Belum ada data. Silakan unggah file Excel.
    </div>
  );
}
