import type { Metadata } from "next"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import "../index.css"

export const metadata: Metadata = {
  title: "Taxable",
  description: "A lightweight 1099 tax-reserve tracker.",
}

// Runs before first paint so the correct theme class is on <html> before
// ThemeProvider hydrates. Must stay in sync with its storageKey and defaultTheme.
const themeScript = `(function () {
  try {
    var stored = localStorage.getItem("theme")
    var theme = stored === "light" || stored === "dark" ? stored : null
    if (!theme) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }
    document.documentElement.classList.add(theme)
  } catch (e) {}
})()`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
