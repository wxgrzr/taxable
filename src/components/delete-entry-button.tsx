"use client"

import { TrashIcon } from "@phosphor-icons/react"
import { useTransition } from "react"
import { toast } from "sonner"

import { deleteEntry } from "@/app/actions"
import { Button } from "@/components/ui/button"

export function DeleteEntryButton({
  table,
  id,
}: {
  table: "payments" | "transfers"
  id: string
}) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={pending}
      aria-label="Delete"
      onClick={() =>
        startTransition(async () => {
          const result = await deleteEntry(table, id)
          if (result.ok) toast.success("Deleted")
          else toast.error(result.error)
        })
      }
    >
      <TrashIcon />
    </Button>
  )
}
