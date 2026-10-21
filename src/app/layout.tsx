import type { Metadata } from "next"

import { ThemeProvider } from "@/components/theme-provider"

import "../index.css"

export const metadata: Metadata = {
  title: "Taxable",
  description: "A lightweight 1099 tax-reserve tracker.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
