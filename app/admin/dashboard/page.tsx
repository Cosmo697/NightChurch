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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, X, Upload, Image as ImageIcon, Download } from 'lucide-react'
import { Event, Organizer } from '@/lib/events'
import { initializeDefaultEvents } from '@/lib/events'

interface Subscriber {
  _id: string
  email: string
  name: string
  createdAt: string
}

interface Rsvp {
  id: number
  event_id: string
  name: string
  email: string
  guests: number
  status: 'confirmed' | 'cancelled' | 'waitlisted'
  notes?: string
  created_at: string
}

export default function AdminDashboard() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRsvps, setIsLoadingRsvps] = useState(false)
  const [error, setError] = useState('')
  const [rsvpError, setRsvpError] = useState('')
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
  const [debugInfo, setDebugInfo] = useState<any>(null)
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
    } else if (activeTab === 'rsvps') {
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
      
      // If we're on the RSVPs tab and no event is selected yet, select the first one
      if (activeTab === 'rsvps' && data.events.length > 0 && !selectedEventForRsvp) {
        setSelectedEventForRsvp(data.events[0].id)
        fetchRsvpsForEvent(data.events[0].id, token)
      }
    } catch (err) {
      console.error('Error fetching events:', err)
      setError('Failed to load events. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const fetchRsvpsForEvent = async (eventId: string, token?: string) => {
    if (!eventId) return;
    
    const authToken = token || localStorage.getItem('admin-token');
    if (!authToken) return;
    
    try {
      setIsLoadingRsvps(true);
      setRsvpError('');
      
      console.log('Fetching RSVPs for event ID:', eventId);
      
      // Try both with the event ID and with the slug (in case they're different)
      const response = await fetch(`/api/admin/rsvps?eventId=${eventId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('admin-token');
          router.push('/admin');
          return;
        }
        throw new Error('Failed to fetch RSVPs');
      }

      const data = await response.json();
      console.log('RSVPs received from API:', data.rsvps?.length || 0);
      
      if (data.rsvps && data.rsvps.length > 0) {
        setRsvps(data.rsvps || []);
      } else {
        // If no RSVPs found, try checking with the debug endpoint which shows all RSVPs
        const debugResponse = await fetch(`/api/events/rsvp?debug=true`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (debugResponse.ok) {
          const debugData = await debugResponse.json();
          console.log('Debug data:', debugData);
          
          // Filter RSVPs for the current event ID
          const eventRsvps = debugData.rsvps?.filter(
            (rsvp: any) => rsvp.event_id === eventId || 
                          rsvp.event_id === events.find(e => e.id === eventId)?.slug
          );
          
          if (eventRsvps && eventRsvps.length > 0) {
            console.log(`Found ${eventRsvps.length} RSVPs for event through debug endpoint`);
            setRsvps(eventRsvps);
          } else {
            setRsvps([]);
          }
        } else {
          setRsvps([]);
        }
      }
    } catch (err) {
      console.error('Error fetching RSVPs:', err);
      setRsvpError('Failed to load RSVPs. Please try again.');
      setRsvps([]);
    } finally {
      setIsLoadingRsvps(false);
    }
  }

  const fetchAllRsvps = async () => {
    const token = localStorage.getItem('admin-token');
    if (!token) return;
    
    try {
      setIsLoadingRsvps(true);
      setRsvpError('');
      
      console.log('Fetching ALL RSVPs');
      
      const response = await fetch(`/api/admin/rsvps?all=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch all RSVPs');
      }

      const data = await response.json();
      console.log('All RSVPs:', data);
      
      // If we have RSVPs for events with IDs that don't match our current events list
      if (data.eventIds && data.eventIds.length > 0) {
        const unknownEventIds = data.eventIds.filter(id => 
          !events.some(event => event.id === id || event.slug === id)
        );
        
        if (unknownEventIds.length > 0) {
          console.log('Found RSVPs for unknown event IDs:', unknownEventIds);
          setRsvpError(`Found RSVPs with unknown event IDs: ${unknownEventIds.join(', ')}`);
          
          // Show all RSVPs grouped by event ID
          if (data.rsvps && data.rsvps.length > 0) {
            setRsvps(data.rsvps);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching all RSVPs:', err);
      setRsvpError('Failed to load all RSVPs. Please try again.');
    } finally {
      setIsLoadingRsvps(false);
    }
  };

  const handleEventSelectionForRsvp = (eventId: string) => {
    console.log('Selected event ID for RSVPs:', eventId);
    setSelectedEventForRsvp(eventId);
    fetchRsvpsForEvent(eventId);
  }
  
  const createTestRsvp = async () => {
    if (!selectedEventForRsvp) {
      setRsvpError('Please select an event first');
      return;
    }
    
    setIsLoadingRsvps(true);
    setDebugInfo(null);
    
    try {
      const token = localStorage.getItem('admin-token');
      
      // First, try to directly submit a test RSVP through the regular API endpoint
      console.log('Creating test RSVP for event:', selectedEventForRsvp);
      
      const testData = {
        eventSlug: selectedEventForRsvp,
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
        guests: 2,
        notes: "This is a test RSVP created from admin panel"
      };
      
      // Submit via the regular RSVP API
      const response = await fetch('/api/events/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Failed to create test RSVP:', result);
        setRsvpError(`Failed to create test RSVP: ${result.message}`);
        setDebugInfo({
          error: true,
          status: response.status,
          message: result.message,
          data: testData
        });
        return;
      }
      
      console.log('Successfully created test RSVP:', result);
      setDebugInfo({
        success: true,
        message: 'Test RSVP created successfully',
        response: result,
        data: testData
      });
      
      // Refresh the RSVP list
      fetchRsvpsForEvent(selectedEventForRsvp);
      
    } catch (err) {
      console.error('Error creating test RSVP:', err);
      setRsvpError('Error creating test RSVP. See console for details.');
      setDebugInfo({
        error: true,
        message: String(err)
      });
    } finally {
      setIsLoadingRsvps(false);
    }
  };

  const exportRsvpsToCSV = () => {
    if (rsvps.length === 0) return
    
    // Find the event details for the header
    const selectedEvent = events.find(event => event.id === selectedEventForRsvp)
    
    // Convert RSVPs to CSV
    const headers = ['Name', 'Email', 'Guests', 'Status', 'Notes', 'RSVP Date']
    
    // Add headers row
    let csvContent = headers.join(',') + '\n'
    
    // Add data rows
    rsvps.forEach(rsvp => {
      const row = [
        `"${rsvp.name.replace(/"/g, '""')}"`, // Handle quotes in names
        `"${rsvp.email.replace(/"/g, '""')}"`,
        rsvp.guests,
        rsvp.status,
        `"${(rsvp.notes || '').replace(/"/g, '""')}"`,
        new Date(rsvp.created_at).toLocaleString()
      ]
      csvContent += row.join(',') + '\n'
    })
    
    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${selectedEvent?.title.replace(/\s+/g, '-')}_RSVPs_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
              <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
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
            
            <TabsContent value="rsvps">
              {events.length > 0 && (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div className="flex-1 w-full md:w-auto">
                    <Label htmlFor="event-select" className="mb-2 block text-sm">Select Event</Label>
                    <Select 
                      value={selectedEventForRsvp} 
                      onValueChange={handleEventSelectionForRsvp}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-700">
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-gray-700">
                        {events.map(event => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.title} - {event.date}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-4 md:mt-8">
                    <div className="flex gap-2">
                      <Button 
                        onClick={fetchAllRsvps}
                        variant="outline" 
                        className="border-blue-500 text-blue-300 hover:bg-blue-900/20"
                      >
                        View All RSVPs
                      </Button>
                      
                      <Button 
                        onClick={createTestRsvp}
                        variant="outline" 
                        className="border-purple-500 text-purple-300 hover:bg-purple-900/20"
                      >
                        Create Test RSVP
                      </Button>
                      
                      {rsvps.length > 0 && (
                        <Button 
                          onClick={exportRsvpsToCSV}
                          variant="outline" 
                          className="border-green-500 text-green-300 hover:bg-green-900/20"
                        >
                          <Download className="h-4 w-4 mr-2" /> Export to CSV
                        </Button>
                      )}
                    </div>
                    
                    {debugInfo && (
                      <div className="text-xs bg-gray-900 p-2 rounded border border-gray-700 mt-2 overflow-auto max-h-40">
                        <pre className="text-gray-300">{JSON.stringify(debugInfo, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="text-sm text-gray-400 mb-2">
                {rsvps.length} RSVPs for this event
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
              } else if (activeTab === 'events') {
                fetchEvents(token)
              } else if (activeTab === 'rsvps') {
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
      ) : activeTab === 'events' ? (
        events.length === 0 ? (
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
        )
      ) : activeTab === 'rsvps' ? (
        events.length === 0 ? (
          <Card className="bg-black/80 border border-purple-900/50 p-6 text-center">
            <p className="text-gray-400">No events found. Create an event first to manage RSVPs.</p>
          </Card>
        ) : isLoadingRsvps ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : rsvpError ? (
          <Card className="bg-black/80 border border-red-900/50 p-4">
            <p className="text-red-400">{rsvpError}</p>
            <Button 
              className="mt-4 bg-purple-800" 
              onClick={() => fetchRsvpsForEvent(selectedEventForRsvp)}
            >
              Try Again
            </Button>
          </Card>
        ) : rsvps.length === 0 ? (
          <Card className="bg-black/80 border border-purple-900/50 p-6 text-center">
            <p className="text-gray-400">No RSVPs found for this event.</p>
          </Card>
        ) : (
          <Card className="bg-black/80 border border-purple-900/50 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-900/50">
                    <TableHead className="text-purple-300">Name</TableHead>
                    <TableHead className="text-purple-300">Email</TableHead>
                    <TableHead className="text-purple-300">Guests</TableHead>
                    <TableHead className="text-purple-300">Status</TableHead>
                    <TableHead className="text-purple-300">Notes</TableHead>
                    <TableHead className="text-purple-300">RSVP Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rsvps.map((rsvp) => (
                    <TableRow key={rsvp.id} className="border-purple-900/30">
                      <TableCell className="text-gray-300 font-medium">{rsvp.name}</TableCell>
                      <TableCell className="text-gray-300">{rsvp.email}</TableCell>
                      <TableCell className="text-gray-300">{rsvp.guests}</TableCell>
                      <TableCell className="text-gray-300">
                        <span className={`inline-block px-2 py-1 rounded-md text-xs ${
                          rsvp.status === 'confirmed' 
                            ? 'bg-green-900/30 text-green-400' 
                            : rsvp.status === 'waitlisted' 
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-red-900/30 text-red-400'
                        }`}>
                          {rsvp.status.charAt(0).toUpperCase() + rsvp.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {rsvp.notes ? (
                          <div className="max-w-xs truncate" title={rsvp.notes}>
                            {rsvp.notes}
                          </div>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {formatDate(rsvp.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )
      ) : null}

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
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input 
                      id="image" 
                      value={currentEvent.image} 
                      onChange={(e) => setCurrentEvent({...currentEvent, image: e.target.value})}
                      className="bg-black/50 border-gray-700 pr-12"
                      placeholder="Enter image URL directly"
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
                <div className="text-gray-400 text-xs">
                  <p>Tip: You can paste an image URL directly or use the upload button to try uploading an image.</p>
                  <p>For manual entry, you can use image hosting services like:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li><a href="https://imgbb.com/upload" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">imgBB</a> - Upload and copy the "Direct Link"</li>
                    <li><a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">PostImages</a> - Free, no account required</li>
                  </ul>
                </div>
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