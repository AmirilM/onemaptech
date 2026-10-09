import { redirect } from "next/navigation";
import { Store as StoreIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFilterOptions } from "@/lib/filter-options";
import { parseFilters } from "@/lib/filters";
import { fetchTransactions, groupBy } from "@/lib/metrics";
import { formatIDR, formatNumber } from "@/lib/format";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/filters/filter-bar";
import { RankBarChart } from "@/components/charts/charts";

export default async function StoresPage({
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

  const storeNames = new Map(
    options.stores.map((s) => [s.store_code, s.store_name]),
  );

  const rank = groupBy(
    rows,
    (r) => r.store_code,
    (r) => storeNames.get(r.store_code) ?? r.store_code,
  ).sort((a, b) => b.revenue - a.revenue);

  const totalRevenue = rank.reduce((acc, r) => acc + r.revenue, 0);

  return (
    <div className="space-y-5">
      <FilterBar options={options} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle subtitle="Peringkat berdasarkan revenue">
            Revenue per Store
          </CardTitle>
          {rank.length ? (
            <RankBarChart data={rank} />
          ) : (
            <EmptyState icon={<StoreIcon size={20} />} title="Belum ada data" />
          )}
        </Card>

        <Card>
          <CardTitle subtitle="Tabel performa toko">Detail Store</CardTitle>
          {rank.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase text-subtle">
                    <th className="py-2 pr-3 font-medium">#</th>
                    <th className="py-2 pr-3 font-medium">Store</th>
                    <th className="py-2 pr-3 text-right font-medium">Revenue</th>
                    <th className="py-2 pr-3 text-right font-medium">Qty</th>
                    <th className="py-2 text-right font-medium">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {rank.map((r, i) => (
                    <tr
                      key={r.key}
                      className="border-b border-border/60 last:border-0 hover:bg-surface-muted"
                    >
                      <td className="py-2 pr-3 text-subtle">{i + 1}</td>
                      <td className="py-2 pr-3 text-foreground">{r.label}</td>
                      <td className="py-2 pr-3 text-right font-medium text-foreground">
                        {formatIDR(r.revenue)}
                      </td>
                      <td className="py-2 pr-3 text-right text-muted">
                        {formatNumber(r.qty)}
                      </td>
                      <td className="py-2 text-right text-muted">
                        {totalRevenue
                          ? `${((r.revenue / totalRevenue) * 100).toFixed(1)}%`
                          : "0%"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="Belum ada data" />
          )}
        </Card>
      </div>
    </div>
  );
}
