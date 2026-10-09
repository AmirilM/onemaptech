import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFilterOptions } from "@/lib/filter-options";
import { parseFilters } from "@/lib/filters";
import { fetchTransactions, groupBy } from "@/lib/metrics";
import { formatIDR, formatNumber } from "@/lib/format";
import { Card, CardTitle } from "@/components/ui/card";
import { FilterBar } from "@/components/filters/filter-bar";
import { QtyBarChart } from "@/components/charts/charts";

export default async function ProductsPage({
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

  const products = groupBy(
    rows,
    (r) => r.sap_article,
    (r) => r.sap_description || r.item,
  );

  const byQty = [...products].sort((a, b) => b.qty - a.qty).slice(0, 15);
  const byRevenue = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, 15);

  return (
    <div className="space-y-5">
      <FilterBar options={options} />

      <Card>
        <CardTitle subtitle="15 produk dengan qty terjual terbanyak">
          Top Produk (Qty)
        </CardTitle>
        {byQty.length ? (
          <QtyBarChart
            data={byQty.map((p) => ({ label: shorten(p.label), qty: p.qty }))}
          />
        ) : (
          <Empty />
        )}
      </Card>

      <Card>
        <CardTitle subtitle="Tabel 15 produk dengan revenue tertinggi">
          Top Produk (Revenue)
        </CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-400">
                <th className="py-2 pr-3">#</th>
                <th className="py-2 pr-3">Produk</th>
                <th className="py-2 pr-3 text-right">Qty</th>
                <th className="py-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {byRevenue.map((p, i) => (
                <tr key={p.key} className="border-b border-slate-100">
                  <td className="py-2 pr-3 text-slate-400">{i + 1}</td>
                  <td className="py-2 pr-3">
                    <p className="text-slate-700">{p.label}</p>
                    <p className="text-xs text-slate-400">{p.key}</p>
                  </td>
                  <td className="py-2 pr-3 text-right text-slate-500">
                    {formatNumber(p.qty)}
                  </td>
                  <td className="py-2 text-right text-slate-800">
                    {formatIDR(p.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {byRevenue.length ? null : <Empty />}
        </div>
      </Card>
    </div>
  );
}

function shorten(value: string): string {
  return value.length > 30 ? `${value.slice(0, 30)}…` : value;
}

function Empty() {
  return (
    <div className="flex h-40 items-center justify-center text-sm text-slate-400">
      Belum ada data.
    </div>
  );
}
