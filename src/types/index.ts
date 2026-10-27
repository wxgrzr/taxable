export type Payment = {
  id: string
  payer: string
  amount_cents: number
  reserve_rate_bps: number
  received_on: string // YYYY-MM-DD
  note: string | null
}

export type Transfer = {
  id: string
  amount_cents: number
  transferred_on: string // YYYY-MM-DD
  note: string | null
}

export type Settings = {
  reserve_rate_bps: number
}

export type ReserveSummary = {
  incomeCents: number
  requiredCents: number
  savedCents: number
  remainingCents: number
}

export type ActionResult = { ok: true } | { ok: false; error: string }
