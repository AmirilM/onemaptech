"use client";

import { useActionState, useEffect } from "react";
import { Upload, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { uploadWorkbook } from "@/app/actions/upload";
import { formatIDR, formatNumber } from "@/lib/format";
import type { ImportSummary } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function UploadForm() {
  const [summary, formAction, pending] = useActionState<
    ImportSummary | null,
    FormData
  >(uploadWorkbook, null);

  useEffect(() => {
    if (!summary) return;
    if (summary.total > 0 && summary.errors.length === 0) {
      toast.success("Impor berhasil", {
        description: `${formatNumber(summary.inserted)} baru, ${formatNumber(
          summary.updated,
        )} diperbarui.`,
      });
    } else {
      toast.warning("Impor selesai dengan catatan", {
        description: summary.errors[0] ?? "Periksa detail di bawah.",
      });
    }
  }, [summary]);

  return (
    <div className="space-y-5">
      <form
        action={formAction}
        className="rounded-2xl border-2 border-dashed border-border bg-surface p-8 text-center"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-950 dark:text-brand-300">
          <Upload size={22} />
        </div>
        <h2 className="font-display text-sm font-semibold text-foreground">
          Unggah file Excel penjualan harian
        </h2>
        <p className="mt-1 text-xs text-muted">
          Format .xlsx dengan sheet <span className="font-mono">RAW</span>. Data
          dengan tanggal sama akan diperbarui otomatis.
        </p>

        <input
          type="file"
          name="file"
          accept=".xlsx"
          required
          className="mx-auto mt-4 block w-full max-w-sm text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-600"
        />

        <Button type="submit" disabled={pending} className="mt-4">
          <Upload size={16} />
          {pending ? "Memproses…" : "Proses & Simpan"}
        </Button>
      </form>

      {summary ? <ResultCard summary={summary} /> : null}
    </div>
  );
}

function ResultCard({ summary }: { summary: ImportSummary }) {
  const hasErrors = summary.errors.length > 0;
  const success = summary.total > 0 && !hasErrors;

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        {success ? (
          <CheckCircle2 className="text-emerald-500" size={18} />
        ) : (
          <AlertTriangle className="text-amber-500" size={18} />
        )}
        <h3 className="text-sm font-semibold text-foreground">
          {success ? "Impor berhasil" : "Impor selesai dengan catatan"}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Total baris" value={formatNumber(summary.total)} />
        <Metric label="Baru" value={formatNumber(summary.inserted)} />
        <Metric label="Diperbarui" value={formatNumber(summary.updated)} />
        <Metric label="Revenue" value={formatIDR(summary.revenue)} />
      </div>

      {hasErrors ? (
        <div className="mt-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/40">
          <p className="mb-1 text-xs font-medium text-amber-700 dark:text-amber-400">
            Catatan ({summary.errors.length})
          </p>
          <ul className="list-inside list-disc space-y-0.5 text-xs text-amber-700 dark:text-amber-400">
            {summary.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-muted p-3">
      <p className="text-xs text-subtle">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
