"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Subscriber {
  _id: string
  email: string
  name: string
  createdAt: string
}

export default function AdminDashboard() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem('admin-token')
    if (!token) {
      router.push('/admin')
      return
    }

    // Verify token is still valid
    const tokenParts = token.split('.')
    if (tokenParts.length !== 2) {
      localStorage.removeItem('admin-token')
      router.push('/admin')
      return
    }

    const expiresAt = parseInt(tokenParts[1], 10)
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      localStorage.removeItem('admin-token')
      router.push('/admin')
      return
    }

    // Fetch subscribers
    fetchSubscribers(token)
  }, [router])

  const fetchSubscribers = async (token: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/subscribers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('admin-token')
          router.push('/admin')
          return
        }
        throw new Error('Failed to fetch subscribers')
      }

      const data = await response.json()
      setSubscribers(data.subscribers)
    } catch (err) {
      console.error('Error fetching subscribers:', err)
      setError('Failed to load subscribers. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-token')
    router.push('/admin')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black p-4 md:p-8">
      <Card className="bg-black/80 border border-purple-900/50 mb-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-purple-300">Night Church Admin</CardTitle>
            <CardDescription className="text-gray-400">
              Manage email subscribers
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="border-red-500 text-red-300 hover:bg-red-900/20"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-400 mb-2">
            {subscribers.length} total subscribers
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <Card className="bg-black/80 border border-red-900/50 p-4">
          <p className="text-red-400">{error}</p>
          <Button 
            className="mt-4 bg-purple-800" 
            onClick={() => fetchSubscribers(localStorage.getItem('admin-token') || '')}
          >
            Try Again
          </Button>
        </Card>
      ) : subscribers.length === 0 ? (
        <Card className="bg-black/80 border border-purple-900/50 p-6 text-center">
          <p className="text-gray-400">No subscribers found.</p>
        </Card>
      ) : (
        <Card className="bg-black/80 border border-purple-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-900/50">
                  <TableHead className="text-purple-300">Name</TableHead>
                  <TableHead className="text-purple-300">Email</TableHead>
                  <TableHead className="text-purple-300">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber._id} className="border-purple-900/30">
                    <TableCell className="text-gray-300">{subscriber.name || 'Anonymous'}</TableCell>
                    <TableCell className="text-gray-300">{subscriber.email}</TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {formatDate(subscriber.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  )
}