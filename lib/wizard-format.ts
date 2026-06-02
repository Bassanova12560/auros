import type { Currency } from "@/lib/wizard-types";

export function formatWithSpaces(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatCurrencyDisplay(value: number, currency: Currency): string {
  const n = formatWithSpaces(value);
  switch (currency) {
    case "EUR":
      return `${n} €`;
    case "USD":
      return `$${n}`;
    case "GBP":
      return `£${n}`;
    case "CHF":
      return `CHF ${n}`;
  }
}
