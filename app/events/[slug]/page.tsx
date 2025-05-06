"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, CalendarDays, Clock, MapPin, CalendarPlus, Globe, Instagram, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RsvpDialog } from "@/components/rsvp-dialog"
import { type Event } from "@/lib/events"

// Helper function to generate calendar links
function generateGoogleCalendarLink(event: Event) {
  const startDate = encodeURIComponent("20250621T160000");
  const endDate = encodeURIComponent("20250622T070000");
  const title = encodeURIComponent(`${event.title} - ${event.subtitle}`);
  const location = encodeURIComponent(event.location);
  const details = encodeURIComponent(`${event.summary}\n\nPresented by: ${event.presentedBy}`);
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
}

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  // Use React.use() to properly handle params
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRsvpDialogOpen, setIsRsvpDialogOpen] = useState(false);
  
  // Get current date for location reveal logic
  const currentDate = new Date()
  const locationRevealDate = new Date(2025, 4, 4) // May 4, 2025

  useEffect(() => {
    fetch(`/api/events/${slug}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Event not found');
        }
        return response.json();
      })
      .then(data => {
        setEvent(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading event:', err);
        setError('Event not found. It may have been removed or the URL is incorrect.');
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-4xl font-bold mb-6 glow-text">Loading Event...</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container py-12">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/events" className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>
        
        <Card className="bg-black/50 border border-purple-900/50 p-6 text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link href="/events">View All Events</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12 relative">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/events" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
      </div>
      
      <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
        <Image
          src={event.image}
          alt={`${event.title} - ${event.subtitle}`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <Badge className={`${event.badgeColor} text-white px-3 py-1 text-sm font-medium`}>
            {event.badgeText}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 glow-text">{event.title}</h1>
          <p className="text-xl md:text-2xl text-purple-200">
            {event.subtitle}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-black/50 border border-purple-900/50">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Event Details</h2>
              <p className="text-lg text-center italic text-purple-200 mb-6">
                {event.summary}
              </p>
              
              <div className="mt-6">
                {event.ticketsAvailable ? (
                  <div className="flex flex-col items-center">
                    <Button 
                      size="lg" 
                      className="mb-2 bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg"
                      onClick={() => setIsRsvpDialogOpen(true)}
                    >
                      RSVP Now
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Let us know you're coming - spaces are limited
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Button 
                      disabled
                      size="lg" 
                      className="mb-2 bg-gray-700 cursor-not-allowed text-white px-8 py-6 text-lg opacity-70"
                    >
                      RSVP Available {event.registrationOpens}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Add to calendar to get notified when RSVP opens
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Social Sharing Section */}
          <Card className="bg-black/50 border border-purple-900/50 mt-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Share This Event</h3>
              <div className="flex gap-3">
                <Button 
                  asChild 
                  variant="outline" 
                  className="flex-1 border-blue-900/50 text-blue-400 hover:bg-blue-900/20"
                >
                  <a 
                    href={`https://twitter.com/intent/tweet?text=Join me at ${encodeURIComponent(event.title)}&url=${encodeURIComponent(`${window.location.origin}/events/${event.slug}`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Share on Twitter
                  </a>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="flex-1 border-blue-900/50 text-blue-400 hover:bg-blue-900/20"
                >
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/events/${event.slug}`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Share on Facebook
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-black/50 border border-purple-900/50 mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Event Information</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-md">
                    <CalendarDays className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Date</h4>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-md">
                    <Clock className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Time</h4>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-md">
                    <MapPin className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Location</h4>
                    {currentDate > locationRevealDate ? (
                      <p className="text-sm text-green-400">
                        <a 
                          href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex flex-col"
                        >
                          {event.location}
                          <span className="text-xs italic mt-1">Click for directions</span>
                        </a>
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        To be announced on Sunday, May 4th
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full border-purple-900/50 hover:bg-purple-900/20"
                  >
                    <a 
                      href={generateGoogleCalendarLink(event)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <CalendarPlus className="mr-2 h-4 w-4" /> Add to Calendar
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border border-purple-900/50">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Organizers</h3>
              
              {event.organizers && event.organizers.length > 0 ? (
                <div className="space-y-5">
                  {event.organizers.map((organizer, index) => (
                    <div key={index}>
                      <h4 className="font-medium">{organizer.name}</h4>
                      
                      <div className="flex flex-wrap gap-3 mt-2">
                        {organizer.instagram && (
                          <a
                            href={`https://instagram.com/${organizer.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-pink-400 hover:underline flex items-center"
                          >
                            <Instagram className="h-3 w-3 mr-1" />
                            @{organizer.instagram}
                          </a>
                        )}
                        
                        {organizer.facebook && (
                          <a
                            href={`https://facebook.com/${organizer.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:underline flex items-center"
                          >
                            <Facebook className="h-3 w-3 mr-1" />
                            {organizer.facebook}
                          </a>
                        )}
                        
                        {organizer.website && (
                          <a
                            href={organizer.website.startsWith('http') ? organizer.website : `https://${organizer.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green-400 hover:underline flex items-center"
                          >
                            <Globe className="h-3 w-3 mr-1" />
                            Website
                          </a>
                        )}
                      </div>
                      
                      {index < event.organizers.length - 1 && (
                        <Separator className="my-4 bg-purple-900/30" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  Presented by {event.presentedBy}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* RSVP Dialog */}
      <RsvpDialog 
        event={event} 
        isOpen={isRsvpDialogOpen} 
        onOpenChange={setIsRsvpDialogOpen} 
      />
    </div>
  )
}