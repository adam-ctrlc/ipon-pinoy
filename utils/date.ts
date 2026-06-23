export function toMonthKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function currentMonthKey(): string {
  return toMonthKey(new Date());
}

export function monthLabel(key: string): string {
  return new Date(key + "-01").toLocaleString("default", { month: "long", year: "numeric" });
}

export function shortMonthLabel(date: Date): string {
  return date.toLocaleString("default", { month: "short" });
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
