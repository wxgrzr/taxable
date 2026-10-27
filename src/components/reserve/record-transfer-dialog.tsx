"use client"

import { addTransfer } from "@/app/actions"
import { EntryDialog } from "@/components/entry-dialog"

export function RecordTransferDialog() {
  return (
    <EntryDialog
      action={addTransfer}
      trigger="Record transfer"
      title="Record savings transfer"
      description="Log money you've already moved to your tax savings account."
      successMessage="Transfer recorded"
      variant="outline"
      fields={[
        {
          name: "amount",
          label: "Amount",
          placeholder: "300.00",
          inputMode: "decimal",
          required: true,
        },
        {
          name: "transferred_on",
          label: "Transferred",
          type: "date",
          required: true,
        },
        { name: "note", label: "Note", placeholder: "Optional" },
      ]}
    />
  )
}
