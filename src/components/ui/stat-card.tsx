import { formatIDR, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/charts/charts";

export function StatCard({
  label,
  value,
  variant = "currency",
  icon,
  delta,
  sparkline,
}: {
  label: string;
  value: number;
  variant?: "currency" | "number";
  icon?: React.ReactNode;
  delta?: number;
  sparkline?: number[];
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {label}
        </p>
        {icon ? <span className="text-brand-500">{icon}</span> : null}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-foreground">
        {variant === "currency" ? formatIDR(value) : formatNumber(value)}
      </p>
      <div className="mt-2 flex items-end justify-between gap-3">
        {delta !== undefined ? (
          <span
            className={cn(
              "text-xs font-medium",
              up ? "text-emerald-600 dark:text-emerald-400" : "text-brand-500",
            )}
          >
            {up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
          </span>
        ) : (
          <span />
        )}
        {sparkline && sparkline.length > 1 ? (
          <Sparkline data={sparkline} />
        ) : null}
      </div>
    </div>
  );
}
