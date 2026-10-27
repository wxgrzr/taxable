import "server-only"

import { createClient } from "@/lib/db/supabase/server"
import type { Payment, Settings, Transfer } from "@/types"

const DEFAULT_RATE_BPS = 3000

export async function getSettings(): Promise<Settings> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("settings")
    .select("reserve_rate_bps")
    .maybeSingle()
  if (error) throw error
  if (data) return data

  // First visit: create the row so later updates have something to hit.
  const { data: created, error: insertError } = await supabase
    .from("settings")
    .upsert({ reserve_rate_bps: DEFAULT_RATE_BPS })
    .select("reserve_rate_bps")
    .single()
  if (insertError) throw insertError
  return created
}

export async function listPayments(): Promise<Payment[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("payments")
    .select("id, payer, amount_cents, reserve_rate_bps, received_on, note")
    .order("received_on", { ascending: false })
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function listTransfers(): Promise<Transfer[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transfers")
    .select("id, amount_cents, transferred_on, note")
    .order("transferred_on", { ascending: false })
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}
