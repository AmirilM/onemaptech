import { formatIDR, formatNumber } from "@/lib/format";

export function StatCard({
  label,
  value,
  hint,
  icon,
  variant = "currency",
}: {
  label: string;
  value: number;
  hint?: string;
  icon?: React.ReactNode;
  variant?: "currency" | "number";
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        {icon ? <span className="text-brand-600">{icon}</span> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-900">
        {variant === "currency" ? formatIDR(value) : formatNumber(value)}
      </p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}
