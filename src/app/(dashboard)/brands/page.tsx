import { redirect } from "next/navigation";
import { Tags } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFilterOptions } from "@/lib/filter-options";
import { parseFilters } from "@/lib/filters";
import { fetchTransactions, groupBy } from "@/lib/metrics";
import { formatIDR, formatNumber } from "@/lib/format";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/filters/filter-bar";
import { RankBarChart, CategoryDonut } from "@/components/charts/charts";

const LEGEND = ["#e60026", "#f2584c", "#ff9daa", "#a3001b", "#86061c"];

export default async function BrandsPage({
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

  const brands = groupBy(rows, (r) => r.brand_name).sort(
    (a, b) => b.revenue - a.revenue,
  );
  const kpiGroups = groupBy(rows, (r) => r.kpi_group).sort(
    (a, b) => b.revenue - a.revenue,
  );
  const categories = groupBy(rows, (r) => r.product_category).sort(
    (a, b) => b.revenue - a.revenue,
  );

  const totalRevenue = brands.reduce((acc, b) => acc + b.revenue, 0);

  return (
    <div className="space-y-5">
      <FilterBar options={options} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle subtitle="Top 10 brand berdasarkan revenue">
            Revenue per Brand
          </CardTitle>
          {brands.length ? (
            <RankBarChart data={brands.slice(0, 10)} />
          ) : (
            <EmptyState icon={<Tags size={20} />} title="Belum ada data" />
          )}
        </Card>

        <Card>
          <CardTitle subtitle="Kontribusi KPI group">KPI Group</CardTitle>
          {kpiGroups.length ? (
            <>
              <CategoryDonut data={kpiGroups} />
              <div className="mt-3 flex flex-wrap gap-3">
                {kpiGroups.map((k, i) => (
                  <div
                    key={k.key}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: LEGEND[i % LEGEND.length] }}
                    />
                    <span className="text-muted">{k.label}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState title="Belum ada data" />
          )}
        </Card>
      </div>

      <Card>
        <CardTitle subtitle="Revenue per kategori produk">
          Kategori Produk
        </CardTitle>
        {categories.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-subtle">
                  <th className="py-2 pr-3 font-medium">Kategori</th>
                  <th className="py-2 pr-3 text-right font-medium">Revenue</th>
                  <th className="py-2 pr-3 text-right font-medium">Qty</th>
                  <th className="py-2 text-right font-medium">Share</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr
                    key={c.key}
                    className="border-b border-border/60 last:border-0 hover:bg-surface-muted"
                  >
                    <td className="py-2 pr-3 text-foreground">{c.label}</td>
                    <td className="py-2 pr-3 text-right font-medium text-foreground">
                      {formatIDR(c.revenue)}
                    </td>
                    <td className="py-2 pr-3 text-right text-muted">
                      {formatNumber(c.qty)}
                    </td>
                    <td className="py-2 text-right text-muted">
                      {totalRevenue
                        ? `${((c.revenue / totalRevenue) * 100).toFixed(1)}%`
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
  );
}
