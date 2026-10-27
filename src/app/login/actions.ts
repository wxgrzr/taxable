"use server"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/db/supabase/server"
import type { ActionResult } from "@/types"

export async function authenticate(
  _prev: ActionResult | null,
  form: FormData
): Promise<ActionResult> {
  const email = String(form.get("email") ?? "").trim()
  const password = String(form.get("password") ?? "")
  const mode = form.get("mode") === "sign-up" ? "sign-up" : "sign-in"

  if (!email || password.length < 8) {
    return { ok: false, error: "Enter an email and a password of 8+ chars." }
  }

  const supabase = await createClient()
  const { data, error } =
    mode === "sign-up"
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

  if (error) return { ok: false, error: error.message }
  if (!data.session) {
    return {
      ok: false,
      error: "Check your email to confirm your account, then sign in.",
    }
  }

  redirect("/")
}
