import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { AppHeader } from "@/components/app-header"
import { ReserveRateForm } from "@/components/settings/reserve-rate-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getSettings } from "@/lib/db/queries"
import { getUserId } from "@/lib/db/supabase/server"

export const metadata: Metadata = { title: "Settings · Taxable" }

export default async function SettingsPage() {
  if (!(await getUserId())) redirect("/login")
  const settings = await getSettings()

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 p-6">
      <AppHeader />
      <Card>
        <CardHeader>
          <CardTitle>Tax reserve</CardTitle>
          <CardDescription>
            The percentage of each 1099 payment to set aside for taxes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReserveRateForm rateBps={settings.reserve_rate_bps} />
        </CardContent>
      </Card>
    </main>
  )
}
