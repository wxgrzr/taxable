"use client"

import { addPayment } from "@/app/actions"
import { EntryDialog } from "@/components/entry-dialog"
import { formatRate } from "@/lib/tax/money"

export function AddPaymentDialog({ rateBps }: { rateBps: number }) {
  return (
    <EntryDialog
      action={addPayment}
      trigger="Record payment"
      title="Record 1099 payment"
      description={`Reserve will be calculated at your current rate of ${formatRate(rateBps)}.`}
      successMessage="Payment recorded"
      fields={[
        {
          name: "payer",
          label: "Payer",
          placeholder: "Acme Co.",
          required: true,
        },
        {
          name: "amount",
          label: "Amount",
          placeholder: "1,000.00",
          inputMode: "decimal",
          required: true,
        },
        {
          name: "received_on",
          label: "Received",
          type: "date",
          required: true,
        },
        { name: "note", label: "Note", placeholder: "Optional" },
      ]}
    />
  )
}
