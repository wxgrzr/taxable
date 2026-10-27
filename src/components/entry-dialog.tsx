"use client"

import { useActionState, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionToast } from "@/hooks/use-action-toast"
import type { ActionResult } from "@/types"

type Action = (
  prev: ActionResult | null,
  form: FormData
) => Promise<ActionResult>

export type EntryField = {
  name: string
  label: string
  type?: "text" | "date"
  placeholder?: string
  required?: boolean
  inputMode?: "decimal"
}

type EntryDialogProps = {
  action: Action
  trigger: string
  title: string
  description: string
  successMessage: string
  fields: EntryField[]
  variant?: "default" | "outline"
}

function today() {
  return new Date().toLocaleDateString("en-CA") // YYYY-MM-DD in local time
}

/** A dialog with a small form that submits to a server action. */
export function EntryDialog({
  action,
  trigger,
  title,
  description,
  successMessage,
  fields,
  variant = "default",
}: EntryDialogProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(action, null)
  useActionToast(state, successMessage, () => setOpen(false))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant={variant} />}>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                required={field.required}
                inputMode={field.inputMode}
                defaultValue={field.type === "date" ? today() : undefined}
              />
            </div>
          ))}
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
