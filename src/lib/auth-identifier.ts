export const SALES_EMAIL_DOMAIN = "onemaptech.id";

export function normalizeSalesId(value: string): string {
  return value.replace(/\s+/g, "").trim();
}

export function isSalesId(value: string): boolean {
  return /^[0-9]+$/.test(normalizeSalesId(value));
}

export function toAuthEmail(salesId: string): string {
  return `${normalizeSalesId(salesId)}@${SALES_EMAIL_DOMAIN}`;
}
