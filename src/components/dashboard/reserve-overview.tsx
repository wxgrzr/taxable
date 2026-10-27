import { WalletIcon } from "@phosphor-icons/react/dist/ssr"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { formatCents, formatRate } from "@/lib/tax/money"
import { reserveForPayment } from "@/lib/tax/reserve"
import type { Payment, ReserveSummary } from "@/types"

type ReserveOverviewProps = {
  allTime: ReserveSummary
  month: ReserveSummary
  monthLabel: string
  rateBps: number
  recentPayment: Payment | undefined
}

export function ReserveOverview({
  allTime,
  month,
  monthLabel,
  rateBps,
  recentPayment,
}: ReserveOverviewProps) {
  const progress =
    month.requiredCents > 0
      ? Math.min(100, (month.savedCents / month.requiredCents) * 100)
      : 0

  return (
    <Card className="[--card-spacing:--spacing(6)]">
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs tracking-widest text-muted-foreground uppercase">
              Tax reserve · all time
            </span>
            <span className="text-4xl font-semibold tabular-nums">
              {formatCents(allTime.savedCents)}
            </span>
            <span className="text-muted-foreground">
              set aside of {formatCents(allTime.requiredCents)} required
            </span>
          </div>
          <div className="bg-muted p-3">
            <WalletIcon className="size-6" />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <Stat
            label={`1099 income · ${monthLabel}`}
            value={formatCents(month.incomeCents)}
          />
          <Stat label="Reserve rate" value={formatRate(rateBps)} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span>Monthly tax reserve goal</span>
            <span className="tabular-nums">
              {formatCents(month.requiredCents)}
            </span>
          </div>
          <Progress value={progress} aria-label="Monthly reserve progress" />
          <span className="text-muted-foreground tabular-nums">
            {formatCents(month.savedCents)} set aside ·{" "}
            {month.remainingCents >= 0
              ? `${formatCents(month.remainingCents)} remaining`
              : `${formatCents(-month.remainingCents)} ahead`}
          </span>
        </div>

        <Separator />

        {recentPayment ? (
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm">Recent payment</span>
              <span className="text-muted-foreground">
                {recentPayment.payer} ·{" "}
                {formatCents(recentPayment.amount_cents)}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm text-green-500 tabular-nums">
                +{formatCents(reserveForPayment(recentPayment))}
              </span>
              <span className="text-muted-foreground">Tax reserve</span>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">
            No payments yet. Record your first 1099 payment to start tracking.
          </span>
        )}
      </CardContent>
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
    </div>
  )
}
