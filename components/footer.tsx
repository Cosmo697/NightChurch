"use client"

import Link from "next/link"
import { Instagram, Facebook, CloudIcon as SoundCloud } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  // Function to reset the portal for testing
  const resetPortal = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('nightchurch-visited')
      window.location.reload()
    }
  }

  return (
    <footer className="border-t border-purple-900/20 bg-black/90 py-6">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Night Church. All rights reserved.
          </p>
          
        </div>

        <div className="flex items-center gap-4">
          <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram className="h-5 w-5 text-muted-foreground hover:text-pink-500 transition-colors" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Facebook className="h-5 w-5 text-muted-foreground hover:text-pink-500 transition-colors" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link href="https://soundcloud.com" target="_blank" rel="noopener noreferrer">
            <SoundCloud className="h-5 w-5 text-muted-foreground hover:text-pink-500 transition-colors" />
            <span className="sr-only">SoundCloud</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
