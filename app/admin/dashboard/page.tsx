"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react'
import { Event, Organizer } from '@/lib/events'
import { initializeDefaultEvents } from '@/lib/events'

interface Subscriber {
  _id: string
  email: string
  name: string
  createdAt: string
}

export default function AdminDashboard() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('subscribers')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Partial<Event>>({
    id: '',
    slug: '',
    title: '',
    subtitle: '',
    date: '',
    time: '',
    location: '',
    image: '',
    badgeText: '',
    badgeColor: 'bg-purple-600 hover:bg-purple-700',
    summary: '',
    presentedBy: '',
    organizers: [{ name: '' }],
    featured: false,
    ticketsAvailable: false,
    rsvpLink: '',
    registrationOpens: '',
  })
  const [isNewEvent, setIsNewEvent] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [dialogError, setDialogError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin-token')
    if (!token) {
      router.push('/admin')
      return
    }

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

    // Call the async initializeDefaultEvents function
    initializeDefaultEvents().catch(error => {
      console.error('Error initializing default events:', error)
    })

    if (activeTab === 'subscribers') {
      fetchSubscribers(token)
    } else if (activeTab === 'events') {
      fetchEvents(token)
    }
  }, [router, activeTab])

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

  const fetchEvents = async (token: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/events', {
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
        throw new Error('Failed to fetch events')
      }

      const data = await response.json()
      setEvents(data.events)
    } catch (err) {
      console.error('Error fetching events:', err)
      setError('Failed to load events. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-token')
    router.push('/admin')
  }

  const handleCreateEvent = () => {
    setCurrentEvent({
      id: '',
      slug: '',
      title: '',
      subtitle: '',
      date: '',
      time: '',
      location: '',
      image: '',
      badgeText: '',
      badgeColor: 'bg-purple-600 hover:bg-purple-700',
      summary: '',
      presentedBy: '',
      organizers: [{ name: '' }],
      featured: false,
      ticketsAvailable: false,
      rsvpLink: '',
      registrationOpens: '',
    })
    setIsNewEvent(true)
    setDialogError('')
    setIsDialogOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    // Ensure event has organizers array
    if (!event.organizers || event.organizers.length === 0) {
      event.organizers = [{ name: event.presentedBy }]
    }
    
    setCurrentEvent({...event})
    setIsNewEvent(false)
    setDialogError('')
    setIsDialogOpen(true)
  }

  const handleDeleteEvent = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return
    }
    
    try {
      const token = localStorage.getItem('admin-token')
      const response = await fetch('/api/admin/events', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ slug })
      })

      if (!response.ok) {
        throw new Error('Failed to delete event')
      }

      fetchEvents(token || '')
    } catch (err) {
      console.error('Error deleting event:', err)
      alert('Failed to delete event. Please try again.')
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      setIsUploading(true)
      
      const token = localStorage.getItem('admin-token')
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload image')
      }
      
      const data = await response.json()
      setCurrentEvent({...currentEvent, image: data.url})
    } catch (err) {
      console.error('Error uploading image:', err)
      setDialogError('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }
  
  const handleAddOrganizer = () => {
    const organizers = [...(currentEvent.organizers || []), { name: '' }]
    setCurrentEvent({...currentEvent, organizers})
  }
  
  const handleRemoveOrganizer = (index: number) => {
    if ((currentEvent.organizers?.length || 0) <= 1) return
    
    const organizers = [...(currentEvent.organizers || [])]
    organizers.splice(index, 1)
    setCurrentEvent({...currentEvent, organizers})
  }
  
  const handleOrganizerChange = (index: number, field: keyof Organizer, value: string) => {
    const organizers = [...(currentEvent.organizers || [])]
    if (!organizers[index]) {
      organizers[index] = { name: '' }
    }
    
    organizers[index] = { ...organizers[index], [field]: value }
    setCurrentEvent({...currentEvent, organizers})
  }

  const handleSaveEvent = async () => {
    if (!currentEvent.title || !currentEvent.slug || !currentEvent.date || !currentEvent.location) {
      setDialogError('Please fill out all required fields')
      return
    }
    
    // Validate that at least one organizer has a name
    if (!currentEvent.organizers?.some(org => org.name.trim())) {
      setDialogError('Please add at least one organizer')
      return
    }
    
    setIsSaving(true)
    setDialogError('')
    
    try {
      const token = localStorage.getItem('admin-token')
      
      if (!currentEvent.id) {
        currentEvent.id = currentEvent.slug
      }
      
      // Update presentedBy field from organizers for backward compatibility
      currentEvent.presentedBy = (currentEvent.organizers || [])
        .filter(org => org.name.trim())
        .map(org => org.name)
        .join(' & ')
      
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentEvent)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to save event')
      }

      setIsDialogOpen(false)
      fetchEvents(token || '')
    } catch (err) {
      console.error('Error saving event:', err)
      setDialogError('Failed to save event: ' + (err as Error).message)
    } finally {
      setIsSaving(false)
    }
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
              Manage your website content
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
          <Tabs defaultValue="subscribers" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="subscribers">
              <div className="text-sm text-gray-400 mb-2">
                {subscribers.length} total subscribers
              </div>
            </TabsContent>
            
            <TabsContent value="events">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-400">
                  {events.length} events
                </div>
                <Button 
                  onClick={handleCreateEvent} 
                  className="bg-purple-800 hover:bg-purple-700"
                >
                  Create New Event
                </Button>
              </div>
            </TabsContent>
          </Tabs>
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
            onClick={() => {
              const token = localStorage.getItem('admin-token') || ''
              if (activeTab === 'subscribers') {
                fetchSubscribers(token)
              } else {
                fetchEvents(token)
              }
            }}
          >
            Try Again
          </Button>
        </Card>
      ) : activeTab === 'subscribers' ? (
        subscribers.length === 0 ? (
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
        )
      ) : events.length === 0 ? (
        <Card className="bg-black/80 border border-purple-900/50 p-6 text-center">
          <p className="text-gray-400">No events found.</p>
        </Card>
      ) : (
        <Card className="bg-black/80 border border-purple-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-900/50">
                  <TableHead className="text-purple-300">Title</TableHead>
                  <TableHead className="text-purple-300">Date</TableHead>
                  <TableHead className="text-purple-300">Location</TableHead>
                  <TableHead className="text-purple-300">Featured</TableHead>
                  <TableHead className="text-purple-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id} className="border-purple-900/30">
                    <TableCell className="text-gray-300 font-medium">{event.title}</TableCell>
                    <TableCell className="text-gray-300">{event.date}</TableCell>
                    <TableCell className="text-gray-300">{event.location}</TableCell>
                    <TableCell className="text-gray-300">
                      {event.featured ? (
                        <span className="inline-block px-2 py-1 bg-green-900/30 text-green-400 rounded-md text-xs">
                          Featured
                        </span>
                      ) : '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-400 border-blue-900/50 hover:bg-blue-900/20"
                          onClick={() => handleEditEvent(event)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-400 border-red-900/50 hover:bg-red-900/20"
                          onClick={() => handleDeleteEvent(event.slug)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 border border-purple-900/50 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isNewEvent ? 'Create New Event' : 'Edit Event'}</DialogTitle>
            <DialogDescription>
              {isNewEvent 
                ? 'Fill out the details to create a new event.' 
                : 'Update the event details below.'}
            </DialogDescription>
          </DialogHeader>
          
          {dialogError && (
            <div className="bg-red-900/30 border border-red-900/50 text-red-300 p-3 rounded-md">
              {dialogError}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                value={currentEvent.title} 
                onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})}
                className="bg-black/50 border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input 
                id="subtitle" 
                value={currentEvent.subtitle} 
                onChange={(e) => setCurrentEvent({...currentEvent, subtitle: e.target.value})}
                className="bg-black/50 border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug * <span className="text-xs text-gray-400">(URL-friendly name, e.g., "summer-event")</span>
              </Label>
              <Input 
                id="slug" 
                value={currentEvent.slug} 
                onChange={(e) => setCurrentEvent({
                  ...currentEvent, 
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                })}
                className="bg-black/50 border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Event Image *</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input 
                    id="image" 
                    value={currentEvent.image} 
                    onChange={(e) => setCurrentEvent({...currentEvent, image: e.target.value})}
                    className="bg-black/50 border-gray-700 pr-12"
                    placeholder="URL or upload an image"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="h-8 w-8"
                    >
                      {isUploading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-b-transparent border-purple-500 rounded-full" />
                      ) : (
                        <Upload className="h-4 w-4 text-purple-300" />
                      )}
                    </Button>
                  </div>
                </div>
                {currentEvent.image && (
                  <div className="border border-gray-700 rounded p-1 w-12 h-12 flex items-center justify-center">
                    {currentEvent.image.startsWith('http') || currentEvent.image.startsWith('/') ? (
                      <img src={currentEvent.image} alt="Preview" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input 
                id="date" 
                value={currentEvent.date} 
                onChange={(e) => setCurrentEvent({...currentEvent, date: e.target.value})}
                className="bg-black/50 border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input 
                id="time" 
                value={currentEvent.time} 
                onChange={(e) => setCurrentEvent({...currentEvent, time: e.target.value})}
                className="bg-black/50 border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input 
                id="location" 
                value={currentEvent.location} 
                onChange={(e) => setCurrentEvent({...currentEvent, location: e.target.value})}
                className="bg-black/50 border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="badgeText">Badge Text</Label>
              <Input 
                id="badgeText" 
                value={currentEvent.badgeText} 
                onChange={(e) => setCurrentEvent({...currentEvent, badgeText: e.target.value})}
                className="bg-black/50 border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="badgeColor">Badge Color</Label>
              <Input 
                id="badgeColor" 
                value={currentEvent.badgeColor} 
                onChange={(e) => setCurrentEvent({...currentEvent, badgeColor: e.target.value})}
                className="bg-black/50 border-gray-700"
              />
            </div>
            
            <div className="space-y-2 col-span-1 md:col-span-2">
              <Label htmlFor="summary">Event Summary *</Label>
              <Textarea 
                id="summary" 
                value={currentEvent.summary} 
                onChange={(e) => setCurrentEvent({...currentEvent, summary: e.target.value})}
                className="bg-black/50 border-gray-700 h-20"
              />
            </div>
            
            {/* Organizers Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label>Event Organizers *</Label>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleAddOrganizer}
                  className="border-purple-900/50 text-purple-300 hover:bg-purple-900/20"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Organizer
                </Button>
              </div>
              
              {currentEvent.organizers?.map((organizer, index) => (
                <div key={index} className="bg-black/30 border border-purple-900/30 p-3 rounded-md mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-purple-300">Organizer {index + 1}</h4>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-900/10"
                      onClick={() => handleRemoveOrganizer(index)}
                      disabled={(currentEvent.organizers?.length || 0) <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`organizer-name-${index}`} className="text-xs mb-1">Name*</Label>
                      <Input 
                        id={`organizer-name-${index}`}
                        value={organizer.name || ''}
                        onChange={(e) => handleOrganizerChange(index, 'name', e.target.value)}
                        className="bg-black/50 border-gray-700"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`organizer-instagram-${index}`} className="text-xs mb-1">Instagram (without @)</Label>
                      <Input 
                        id={`organizer-instagram-${index}`}
                        value={organizer.instagram || ''}
                        onChange={(e) => handleOrganizerChange(index, 'instagram', e.target.value)}
                        className="bg-black/50 border-gray-700"
                        placeholder="username"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`organizer-facebook-${index}`} className="text-xs mb-1">Facebook</Label>
                      <Input 
                        id={`organizer-facebook-${index}`}
                        value={organizer.facebook || ''}
                        onChange={(e) => handleOrganizerChange(index, 'facebook', e.target.value)}
                        className="bg-black/50 border-gray-700"
                        placeholder="username or page name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`organizer-website-${index}`} className="text-xs mb-1">Website</Label>
                      <Input 
                        id={`organizer-website-${index}`}
                        value={organizer.website || ''}
                        onChange={(e) => handleOrganizerChange(index, 'website', e.target.value)}
                        className="bg-black/50 border-gray-700"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="featured" 
                checked={currentEvent.featured} 
                onCheckedChange={(checked) => 
                  setCurrentEvent({...currentEvent, featured: checked === true})}
              />
              <Label htmlFor="featured">Set as Featured Event</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ticketsAvailable" 
                checked={currentEvent.ticketsAvailable} 
                onCheckedChange={(checked) => 
                  setCurrentEvent({...currentEvent, ticketsAvailable: checked === true})}
              />
              <Label htmlFor="ticketsAvailable">RSVP Available</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rsvpLink">RSVP Link</Label>
              <Input 
                id="rsvpLink" 
                value={currentEvent.rsvpLink || currentEvent.ticketLink || ''} 
                onChange={(e) => setCurrentEvent({...currentEvent, rsvpLink: e.target.value})}
                className="bg-black/50 border-gray-700"
                disabled={!currentEvent.ticketsAvailable}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registrationOpens">Registration Opens</Label>
              <Input 
                id="registrationOpens" 
                value={currentEvent.registrationOpens} 
                onChange={(e) => setCurrentEvent({...currentEvent, registrationOpens: e.target.value})}
                className="bg-black/50 border-gray-700"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="border-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEvent}
              className="bg-purple-800 hover:bg-purple-700"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}