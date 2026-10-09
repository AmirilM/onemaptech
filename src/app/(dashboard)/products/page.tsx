import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFilterOptions } from "@/lib/filter-options";
import { parseFilters } from "@/lib/filters";
import { fetchTransactions, groupBy, type GroupRow } from "@/lib/metrics";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/filters/filter-bar";
import { QtyBarChart } from "@/components/charts/charts";
import { ProductsTable } from "./products-table";

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

  const params = await searchParams;
  const filters = parseFilters(params);
  const initialQuery =
    typeof params.q === "string" ? params.q : (params.q?.[0] ?? "");
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
  const allByRevenue: GroupRow[] = [...products].sort(
    (a, b) => b.revenue - a.revenue,
  );

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
          <EmptyState icon={<Package size={20} />} title="Belum ada data" />
        )}
      </Card>

      <Card>
        <CardTitle subtitle="Cari, urutkan, dan export seluruh produk">
          Katalog Produk
        </CardTitle>
        {allByRevenue.length ? (
          <ProductsTable rows={allByRevenue} initialQuery={initialQuery} />
        ) : (
          <EmptyState title="Belum ada data" />
        )}
      </Card>
    </div>
  );
}

function shorten(value: string): string {
  return value.length > 30 ? `${value.slice(0, 30)}…` : value;
}
