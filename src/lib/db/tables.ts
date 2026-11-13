/** Tables the generic delete action may touch. The type is derived from this list. */
export const ENTRY_TABLES = ["payments", "transfers"] as const

export type EntryTable = (typeof ENTRY_TABLES)[number]

/**
 * Runtime check for values arriving from the client. Server action arguments
 * are untrusted: TypeScript types are erased, so anyone can POST any value.
 */
export function isEntryTable(value: unknown): value is EntryTable {
  return (
    typeof value === "string" && ENTRY_TABLES.some((table) => table === value)
  )
}
