"use client"

// --- IMPORTS SECTION ---
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RsvpDialog } from "@/components/rsvp-dialog"
import { type Event } from "@/lib/events"

// --- HELPER FUNCTIONS ---
// Function to generate Google Calendar links for events
function generateGoogleCalendarLink(event: Event) {
  const startDate = encodeURIComponent("20250621T160000");
  const endDate = encodeURIComponent("20250622T070000");
  const title = encodeURIComponent(`${event.title} - ${event.subtitle}`);
  const location = encodeURIComponent(event.location);
  const details = encodeURIComponent(`${event.summary}\n\nPresented by: ${event.presentedBy}`);
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
}

// --- MAIN EVENTS PAGE COMPONENT ---
export default function EventsPage() {
  // --- STATE MANAGEMENT ---
  const [events, setEvents] = useState<Event[]>([]);  // All events from API
  const [isLoading, setIsLoading] = useState(true);   // Loading state indicator
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);  // Selected event for RSVP dialog
  const [isRsvpDialogOpen, setIsRsvpDialogOpen] = useState(false);  // RSVP dialog visibility
  
  // Date variables used for location reveal logic
  const currentDate = new Date()
  const locationRevealDate = new Date(2025, 4, 4) // May 4, 2025 - controls when locations are shown

  // --- DATA FETCHING ---
  // Fetch events from API on component mount
  useEffect(() => {
    fetch('/api/events')
      .then(response => response.json())
      .then(data => {
        // Sort events by date ascending (oldest to newest)
        const sortedEvents = [...data.events].sort((a, b) => {
          return new Date(a.date.split('-')[0]).getTime() - new Date(b.date.split('-')[0]).getTime();
        });
        setEvents(sortedEvents);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading events:', error);
        setIsLoading(false);
      });
  }, []);

  // --- LOADING STATE ---
  // Show loading spinner while events are being fetched
  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-4xl font-bold mb-6 glow-text">Loading Events...</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  // --- EVENT SORTING/FILTERING ---
  // Separate featured and non-featured events
  const featuredEvent = events.find(event => event.featured);
  const otherEvents = events.filter(event => !event.featured);

  // --- EVENT HANDLERS ---
  // Handle RSVP button clicks
  const handleRsvpClick = (event: Event) => {
    setSelectedEvent(event);
    setIsRsvpDialogOpen(true);
  };

  // --- MAIN RENDER ---
  return (
    <div className="container py-12">
      {/* --- PAGE HEADER --- */}
      <h1 className="text-4xl font-bold mb-6 glow-text text-center">Upcoming Events</h1>
      <p className="text-xl text-purple-200 text-center mb-12 max-w-2xl mx-auto">
        Join us for transformative experiences that blend music, movement, and community in unique locations.
      </p>

      {/* --- FEATURED EVENT SECTION --- */}
      {featuredEvent && (
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-center text-purple-300">Featured Event</h2>
          <Card className="bg-black/50 border border-purple-900/50 overflow-hidden">
            {/* Featured Event Hero Image with Badge and Title Overlay */}
            <div className="relative h-80 md:h-96">
              <Image
                src={featuredEvent.image}
                alt={featuredEvent.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <Badge className={`${featuredEvent.badgeColor} text-white px-3 py-1 text-sm font-medium`}>
                  {featuredEvent.badgeText}
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-3xl md:text-4xl font-bold mb-2 glow-text">{featuredEvent.title}</h3>
                <p className="text-lg md:text-xl text-purple-200">{featuredEvent.subtitle}</p>
              </div>
            </div>
            
            {/* Featured Event Details Content */}
            <CardContent className="p-6">
              {/* Event Metadata Grid (Date, Time, Location) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Date Information */}
                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-md">
                    <CalendarDays className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Date</h4>
                    <p className="text-sm text-muted-foreground">{featuredEvent.date}</p>
                  </div>
                </div>

                {/* Time Information */}
                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-md">
                    <Clock className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Time</h4>
                    <p className="text-sm text-muted-foreground">{featuredEvent.time}</p>
                  </div>
                </div>

                {/* Location Information - Conditionally shows either the location or "to be announced" */}
                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-md">
                    <MapPin className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p className="text-sm text-green-400">
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(featuredEvent.location)}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex flex-col"
                      >
                        {featuredEvent.location}
                        <span className="text-xs italic mt-1">Click for directions</span>
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Add to Calendar Button */}
              <div className="flex items-center gap-2 mt-4">
                <Button asChild variant="outline" size="sm">
                  <a 
                    href={generateGoogleCalendarLink(featuredEvent)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" /> Add to Calendar
                  </a>
                </Button>
              </div>
            </CardContent>
            
            {/* Featured Event Footer with Presenter Info and Action Buttons */}
            <CardFooter className="p-6 pt-0 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Presented by {featuredEvent.presentedBy}</p>
              <div className="flex gap-2">
                {/* RSVP Button - Only shown if tickets are available */}
                {featuredEvent.ticketsAvailable && (
                  <Button 
                    onClick={() => handleRsvpClick(featuredEvent)}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    RSVP Now
                  </Button>
                )}
                {/* View Details Button */}
                <Button asChild>
                  <Link href={`/events/${featuredEvent.slug}`} className="flex items-center">
                    Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* --- OTHER EVENTS SECTION --- */}
      <h2 className="text-2xl font-semibold mb-6 text-center text-purple-300">More Upcoming Events</h2>
      
      {/* Conditional rendering based on whether there are other events */}
      {otherEvents.length === 0 ? (
        <Card className="bg-black/50 border border-purple-900/50 p-6 text-center">
          <p className="text-muted-foreground">No other events currently scheduled.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherEvents.map((event) => (
            <Card key={event.id} className="bg-black/50 border border-purple-900/50 overflow-hidden flex flex-col h-full">
              <div className="relative h-48">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute top-2 left-2">
                  <Badge className={`${event.badgeColor} text-white px-2 py-1 text-xs font-medium`}>
                    {event.badgeText}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 flex-grow">
                <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                <p className="text-sm text-purple-200 mb-3">{event.subtitle}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-purple-300" />
                    <p className="text-muted-foreground">{event.date}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-purple-300" />
                    <p className="text-muted-foreground">{event.time}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-purple-300" />
                    {currentDate > locationRevealDate ? (
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:underline"
                      >
                        {event.location}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">
                        To be announced May 4th
                      </p>
                    )}
                  </div>
                </div>
                
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  {event.ticketsAvailable && (
                    <Button 
                      onClick={() => handleRsvpClick(event)}
                      className="bg-pink-600 hover:bg-pink-700 sm:flex-1"
                    >
                      RSVP Now
                    </Button>
                  )}
                  <Button 
                    asChild
                    variant={event.ticketsAvailable ? "outline" : "default"}
                    className="sm:flex-1"
                  >
                    <Link href={`/events/${event.slug}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* --- RSVP DIALOG COMPONENT --- */}
      {selectedEvent && (
        <RsvpDialog 
          event={selectedEvent} 
          isOpen={isRsvpDialogOpen} 
          onOpenChange={setIsRsvpDialogOpen} 
        />
      )}
    </div>
  )
}