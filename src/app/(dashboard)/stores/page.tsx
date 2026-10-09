import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFilterOptions } from "@/lib/filter-options";
import { parseFilters } from "@/lib/filters";
import { fetchTransactions, groupBy } from "@/lib/metrics";
import { formatIDR, formatNumber } from "@/lib/format";
import { Card, CardTitle } from "@/components/ui/card";
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
          {rank.length ? <RankBarChart data={rank} /> : <Empty />}
        </Card>

        <Card>
          <CardTitle subtitle="Tabel performa toko">Detail Store</CardTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-400">
                  <th className="py-2 pr-3">#</th>
                  <th className="py-2 pr-3">Store</th>
                  <th className="py-2 pr-3 text-right">Revenue</th>
                  <th className="py-2 pr-3 text-right">Qty</th>
                  <th className="py-2 text-right">Share</th>
                </tr>
              </thead>
              <tbody>
                {rank.map((r, i) => (
                  <tr key={r.key} className="border-b border-slate-100">
                    <td className="py-2 pr-3 text-slate-400">{i + 1}</td>
                    <td className="py-2 pr-3 text-slate-700">{r.label}</td>
                    <td className="py-2 pr-3 text-right text-slate-800">
                      {formatIDR(r.revenue)}
                    </td>
                    <td className="py-2 pr-3 text-right text-slate-500">
                      {formatNumber(r.qty)}
                    </td>
                    <td className="py-2 text-right text-slate-500">
                      {totalRevenue
                        ? `${((r.revenue / totalRevenue) * 100).toFixed(1)}%`
                        : "0%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rank.length ? null : <Empty />}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="flex h-40 items-center justify-center text-sm text-slate-400">
      Belum ada data.
    </div>
  );
}
