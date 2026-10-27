import Link from "next/link"

import { signOut } from "@/app/actions"
import { Button } from "@/components/ui/button"

export function AppHeader() {
  return (
    <header className="flex items-center justify-between gap-4">
      <Link href="/" className="text-sm font-medium tracking-widest uppercase">
        Taxable
      </Link>
      <nav className="flex items-center gap-1">
        <Button
          variant="ghost"
          nativeButton={false}
          render={<Link href="/settings" />}
        >
          Settings
        </Button>
        <form action={signOut}>
          <Button type="submit" variant="ghost">
            Sign out
          </Button>
        </form>
      </nav>
    </header>
  )
}
