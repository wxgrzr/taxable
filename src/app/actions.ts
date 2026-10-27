"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient, getUserId } from "@/lib/db/supabase/server"
import { getSettings } from "@/lib/db/queries"
import { parseDollars, parsePercent } from "@/lib/tax/money"
import type { ActionResult } from "@/types"

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function text(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim()
}

async function requireUser() {
  const userId = await getUserId()
  if (!userId) redirect("/login")
  return userId
}

export async function addPayment(
  _prev: ActionResult | null,
  form: FormData
): Promise<ActionResult> {
  await requireUser()
  const payer = text(form, "payer")
  const amount = parseDollars(text(form, "amount"))
  const receivedOn = text(form, "received_on")

  if (!payer) return { ok: false, error: "Payer is required." }
  if (!amount) return { ok: false, error: "Enter an amount above $0." }
  if (!DATE_RE.test(receivedOn)) return { ok: false, error: "Pick a date." }

  const { reserve_rate_bps } = await getSettings()
  const supabase = await createClient()
  const { error } = await supabase.from("payments").insert({
    payer,
    amount_cents: amount,
    reserve_rate_bps,
    received_on: receivedOn,
    note: text(form, "note") || null,
  })
  if (error) return { ok: false, error: error.message }

  revalidatePath("/")
  return { ok: true }
}

export async function addTransfer(
  _prev: ActionResult | null,
  form: FormData
): Promise<ActionResult> {
  await requireUser()
  const amount = parseDollars(text(form, "amount"))
  const transferredOn = text(form, "transferred_on")

  if (!amount) return { ok: false, error: "Enter an amount above $0." }
  if (!DATE_RE.test(transferredOn)) return { ok: false, error: "Pick a date." }

  const supabase = await createClient()
  const { error } = await supabase.from("transfers").insert({
    amount_cents: amount,
    transferred_on: transferredOn,
    note: text(form, "note") || null,
  })
  if (error) return { ok: false, error: error.message }

  revalidatePath("/")
  return { ok: true }
}

export async function deleteEntry(
  table: "payments" | "transfers",
  id: string
): Promise<ActionResult> {
  await requireUser()
  const supabase = await createClient()
  const { error } = await supabase.from(table).delete().eq("id", id)
  if (error) return { ok: false, error: error.message }

  revalidatePath("/")
  return { ok: true }
}

export async function updateReserveRate(
  _prev: ActionResult | null,
  form: FormData
): Promise<ActionResult> {
  const userId = await requireUser()
  const rate = parsePercent(text(form, "rate"))
  if (rate === null) return { ok: false, error: "Enter a rate from 0 to 100." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("settings")
    .upsert({ user_id: userId, reserve_rate_bps: rate, updated_at: new Date() })
  if (error) return { ok: false, error: error.message }

  revalidatePath("/", "layout")
  return { ok: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
