import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { RadioProvider } from "@/context/radio-context"
import PersistentRadioPlayer from "@/components/persistent-radio-player"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Night Church | Desert Raves in Southern California",
  description:
    "Night Church is a collective that throws immersive desert raves in Southern California featuring projection mapping, art installations, and electronic music.",
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NC_Logo_2025-F39vF9jIFkONP3LZ5PIZDZH6YUFnE9.webp",
      },
    ],
    apple: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NC_Logo_2025-F39vF9jIFkONP3LZ5PIZDZH6YUFnE9.webp",
      },
    ],
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <RadioProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <PersistentRadioPlayer />
          </RadioProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
