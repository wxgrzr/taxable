import type { Payment, ReserveSummary, Transfer } from "@/types"

/** Required reserve for one payment, using the rate snapshotted on it. */
export function reserveForPayment(payment: Payment) {
  return Math.round((payment.amount_cents * payment.reserve_rate_bps) / 10000)
}

/** "YYYY-MM" for a date string or Date, used to bucket entries by month. */
export function monthKey(date: string | Date) {
  if (typeof date === "string") return date.slice(0, 7)
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${date.getFullYear()}-${month}`
}

/**
 * Rolls payments and transfers up into required-vs-saved totals.
 * Callers pass pre-filtered lists (e.g. one month, or all time).
 *
 * Domain rule: required reserve and amount saved are independent values;
 * remainingCents expresses the gap between them.
 */
export function summarizeReserve(
  payments: Payment[],
  transfers: Transfer[]
): ReserveSummary {
  // TODO(human): compute incomeCents, requiredCents, savedCents, remainingCents.
  void payments
  void transfers
  return { incomeCents: 0, requiredCents: 0, savedCents: 0, remainingCents: 0 }
}
