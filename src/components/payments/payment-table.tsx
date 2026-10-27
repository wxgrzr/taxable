import { DeleteEntryButton } from "@/components/delete-entry-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCents, formatRate } from "@/lib/tax/money"
import { reserveForPayment } from "@/lib/tax/reserve"
import type { Payment } from "@/types"

export function PaymentTable({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return <p className="text-muted-foreground">No payments recorded.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Payer</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Rate</TableHead>
          <TableHead className="text-right">Reserve</TableHead>
          <TableHead className="w-0" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{payment.received_on}</TableCell>
            <TableCell>
              {payment.payer}
              {payment.note && (
                <span className="text-muted-foreground"> · {payment.note}</span>
              )}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCents(payment.amount_cents)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatRate(payment.reserve_rate_bps)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCents(reserveForPayment(payment))}
            </TableCell>
            <TableCell>
              <DeleteEntryButton table="payments" id={payment.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
