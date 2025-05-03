"use client"

import { useEffect } from "react"
import { usePuzzle } from "@/context/puzzle-context"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ResetPage() {
  const { setPortalSolved } = usePuzzle()
  const router = useRouter()

  useEffect(() => {
    // Function to reset all portal and puzzle state
    const resetPortalState = () => {
      // Reset the solved state in the context
      setPortalSolved(false)
      
      // Clear localStorage and sessionStorage items related to the portal
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nightchurch-portal-solved')
        localStorage.removeItem('nightchurch-puzzle-progress')
        sessionStorage.removeItem('nightchurch-portal-bypassed')
      }
      
      // Redirect to home page after a brief delay
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }

    // Automatically reset portal state when the page loads
    resetPortalState()
  }, [setPortalSolved, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full">
        <Card className="bg-black/40 border border-red-900/50">
          <CardContent className="p-6 text-center">
            <div className="mb-6 opacity-50 mx-auto w-32 h-32 relative">
              <Image
                src="/images/NC_Logo_2025.webp"
                alt="Night Church Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-red-400">Portal Reset</h1>
            <p className="text-gray-400 mb-2">Your portal state has been reset.</p>
            <p className="text-gray-500">Redirecting to home page...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}