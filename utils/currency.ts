export function formatPHP(amount: number, opts?: Intl.NumberFormatOptions): string {
  return `₱${Math.abs(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts,
  })}`;
}

export function parsePHP(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return typeof value === "number" ? value : parseFloat(value) || 0;
}
