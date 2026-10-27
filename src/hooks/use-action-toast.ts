"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"

import type { ActionResult } from "@/types"

/** Shows a toast whenever a server action returns, and runs onSuccess on ok. */
export function useActionToast(
  state: ActionResult | null,
  successMessage: string,
  onSuccess?: () => void
) {
  const onSuccessRef = useRef(onSuccess)
  useEffect(() => {
    onSuccessRef.current = onSuccess
  })

  useEffect(() => {
    if (!state) return
    if (state.ok) {
      toast.success(successMessage)
      onSuccessRef.current?.()
    } else {
      toast.error(state.error)
    }
  }, [state, successMessage])
}
