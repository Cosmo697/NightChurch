import type React from "react"
import { Inter } from 'next/font/google'
import { RadioProvider } from "@/context/radio-context"
import { ThemeProvider } from "@/components/theme-provider"
import { PuzzleProvider } from "@/context/puzzle-context"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Night Church Radio",
  description: "Night Church Radio - Live stream"
}

// This layout completely replaces the root layout for the radio popup route
export default function RadioPopupLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} bg-black text-white min-h-screen flex flex-col overflow-hidden`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <RadioProvider>
            <PuzzleProvider>
              {children}
            </PuzzleProvider>
          </RadioProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}