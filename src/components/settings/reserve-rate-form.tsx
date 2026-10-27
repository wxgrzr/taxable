"use client"

import { useActionState } from "react"

import { updateReserveRate } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionToast } from "@/hooks/use-action-toast"

export function ReserveRateForm({ rateBps }: { rateBps: number }) {
  const [state, action, pending] = useActionState(updateReserveRate, null)
  useActionToast(state, "Reserve rate updated")

  return (
    <form action={action} className="flex flex-col gap-2">
      <Label htmlFor="rate">Reserve rate (%)</Label>
      <div className="flex gap-2">
        <Input
          id="rate"
          name="rate"
          inputMode="decimal"
          defaultValue={rateBps / 100}
          className="max-w-32"
          required
        />
        <Button type="submit" disabled={pending}>
          Save
        </Button>
      </div>
      <p className="text-muted-foreground">
        Applies to payments you record from now on. Existing payments keep the
        rate they were recorded with.
      </p>
    </form>
  )
}
