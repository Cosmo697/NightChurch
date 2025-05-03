"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function AdminAuth() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        // Set a session token or cookie
        const { token } = await response.json()
        localStorage.setItem('admin-token', token)
        router.push('/admin/dashboard')
      } else {
        const data = await response.json()
        setError(data.message || 'Authentication failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
      <Card className="w-full max-w-md border border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
          <CardDescription className="text-center">
            Enter your password to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}