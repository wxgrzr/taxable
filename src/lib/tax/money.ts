const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export function formatCents(cents: number) {
  return usd.format(cents / 100)
}

export function formatRate(bps: number) {
  return `${bps / 100}%`
}

/** Parses "1,234.56" or "$1234" into integer cents. Returns null if invalid. */
export function parseDollars(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, "")
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null
  const [whole, frac = ""] = cleaned.split(".")
  return Number(whole) * 100 + Number(frac.padEnd(2, "0"))
}

/** Parses "30" or "30.5" (percent) into basis points. Returns null if invalid. */
export function parsePercent(input: string): number | null {
  const cleaned = input.replace(/[%\s]/g, "")
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null
  const bps = Math.round(Number(cleaned) * 100)
  return bps <= 10000 ? bps : null
}
