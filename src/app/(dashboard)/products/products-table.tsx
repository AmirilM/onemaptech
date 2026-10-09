"use client";

import type { GroupRow } from "@/lib/metrics";
import { formatIDR, formatNumber } from "@/lib/format";
import { DataTable, type Column } from "@/components/ui/data-table";

const columns: Column<GroupRow>[] = [
  {
    key: "label",
    header: "Produk",
    sortable: true,
    sortValue: (r) => r.label,
    render: (r) => (
      <div>
        <p className="text-foreground">{r.label}</p>
        <p className="text-xs text-subtle">{r.key}</p>
      </div>
    ),
  },
  {
    key: "qty",
    header: "Qty",
    align: "right",
    sortable: true,
    sortValue: (r) => r.qty,
    render: (r) => <span className="text-muted">{formatNumber(r.qty)}</span>,
  },
  {
    key: "revenue",
    header: "Revenue",
    align: "right",
    sortable: true,
    sortValue: (r) => r.revenue,
    render: (r) => (
      <span className="font-medium text-foreground">{formatIDR(r.revenue)}</span>
    ),
  },
];

export function ProductsTable({
  rows,
  initialQuery = "",
}: {
  rows: GroupRow[];
  initialQuery?: string;
}) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      initialSortKey="revenue"
      searchable
      initialQuery={initialQuery}
      pageSize={10}
      searchText={(r) => `${r.label} ${r.key}`}
      csvName="produk"
      csvColumns={[
        { header: "Kode", value: (r) => r.key },
        { header: "Produk", value: (r) => r.label },
        { header: "Qty", value: (r) => r.qty },
        { header: "Revenue", value: (r) => r.revenue },
      ]}
    />
  );
}
