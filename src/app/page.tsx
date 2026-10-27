import { redirect } from "next/navigation"

import { AppHeader } from "@/components/app-header"
import { ReserveOverview } from "@/components/dashboard/reserve-overview"
import { AddPaymentDialog } from "@/components/payments/add-payment-dialog"
import { PaymentTable } from "@/components/payments/payment-table"
import { RecordTransferDialog } from "@/components/reserve/record-transfer-dialog"
import { TransferTable } from "@/components/reserve/transfer-table"
import { getSettings, listPayments, listTransfers } from "@/lib/db/queries"
import { getUserId } from "@/lib/db/supabase/server"
import { monthKey, summarizeReserve } from "@/lib/tax/reserve"

export default async function DashboardPage() {
  if (!(await getUserId())) redirect("/login")

  const [settings, payments, transfers] = await Promise.all([
    getSettings(),
    listPayments(),
    listTransfers(),
  ])

  const now = new Date()
  const currentMonth = monthKey(now)
  const monthLabel = now.toLocaleDateString("en-US", { month: "long" })
  const month = summarizeReserve(
    payments.filter((p) => monthKey(p.received_on) === currentMonth),
    transfers.filter((t) => monthKey(t.transferred_on) === currentMonth)
  )
  const allTime = summarizeReserve(payments, transfers)

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 p-6">
      <AppHeader />

      <ReserveOverview
        allTime={allTime}
        month={month}
        monthLabel={monthLabel}
        rateBps={settings.reserve_rate_bps}
        recentPayment={payments[0]}
      />

      <div className="flex gap-2">
        <AddPaymentDialog rateBps={settings.reserve_rate_bps} />
        <RecordTransferDialog />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Payments</h2>
        <PaymentTable payments={payments} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Transfers to savings</h2>
        <TransferTable transfers={transfers} />
      </section>
    </main>
  )
}
