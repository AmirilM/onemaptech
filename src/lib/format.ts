export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value ?? 0);
}

export function formatCompactIDR(value: number): string {
  const abs = Math.abs(value ?? 0);
  if (abs >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
  if (abs >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)} Jt`;
  if (abs >= 1_000) return `Rp ${(value / 1_000).toFixed(0)} Rb`;
  return `Rp ${value}`;
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(d);
}
