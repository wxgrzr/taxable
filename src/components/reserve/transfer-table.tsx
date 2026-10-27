import { DeleteEntryButton } from "@/components/delete-entry-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCents } from "@/lib/tax/money"
import type { Transfer } from "@/types"

export function TransferTable({ transfers }: { transfers: Transfer[] }) {
  if (transfers.length === 0) {
    return <p className="text-muted-foreground">No transfers recorded.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Note</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-0" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {transfers.map((transfer) => (
          <TableRow key={transfer.id}>
            <TableCell>{transfer.transferred_on}</TableCell>
            <TableCell className="text-muted-foreground">
              {transfer.note ?? "—"}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCents(transfer.amount_cents)}
            </TableCell>
            <TableCell>
              <DeleteEntryButton table="transfers" id={transfer.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
