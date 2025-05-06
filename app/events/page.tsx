"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

// Countdown Timer Component
function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  function calculateTimeLeft(targetDate: string) {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  return (
    <div className="flex justify-center bg-black/40 p-4 rounded-lg mb-6">
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-3xl font-bold text-pink-500">{timeLeft.days}</div>
          <div className="text-xs text-purple-300">Days</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-pink-500">{timeLeft.hours}</div>
          <div className="text-xs text-purple-300">Hours</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-pink-500">{timeLeft.minutes}</div>
          <div className="text-xs text-purple-300">Minutes</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-pink-500">{timeLeft.seconds}</div>
          <div className="text-xs text-purple-300">Seconds</div>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get current date for location reveal logic
  const currentDate = new Date()
  const locationRevealDate = new Date(2025, 4, 4) // May 4, 2025

  useEffect(() => {
    // Fetch events from our file-based API
    fetch('/api/events')
      .then(response => response.json())
      .then(data => {
        setEvents(data.events);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading events:', error);
        setIsLoading(false);
      });
  }, []);

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

  // Get featured event
  const featuredEvent = events.find(event => event.featured);
  // Get non-featured events
  const otherEvents = events.filter(event => !event.featured);

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-6 glow-text text-center">Upcoming Events</h1>
      <p className="text-xl text-purple-200 text-center mb-12 max-w-2xl mx-auto">
        Join us for transformative experiences that blend music, movement, and community in unique locations.
      </p>

      {/* Featured event - larger display */}
      {featuredEvent && (
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-center text-purple-300">Featured Event</h2>
          <Card className="bg-black/50 border border-purple-900/50 overflow-hidden">
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
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-md">
                    <CalendarDays className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Date</h4>
                    <p className="text-sm text-muted-foreground">{featuredEvent.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-md">
                    <Clock className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Time</h4>
                    <p className="text-sm text-muted-foreground">{featuredEvent.time}</p>
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
                          href={`https://maps.google.com/?q=${encodeURIComponent(featuredEvent.location)}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex flex-col"
                        >
                          {featuredEvent.location}
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
              </div>

              <p className="mt-6 text-lg">{featuredEvent.summary}</p>

              <div className="mt-6">
                <h4 className="text-center text-purple-300 mb-2">Countdown to Event</h4>
                <CountdownTimer targetDate="2025-06-21T16:00:00" />
              </div>

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
            <CardFooter className="p-6 pt-0 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Presented by {featuredEvent.presentedBy}</p>
              <Button asChild>
                <Link href={`/events/${featuredEvent.slug}`} className="flex items-center">
                  Details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Other upcoming events - grid of cards */}
      <h2 className="text-2xl font-semibold mb-6 text-center text-purple-300">More Upcoming Events</h2>
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
                
                <p className="text-sm">{event.summary}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  asChild
                  variant={event.ticketsAvailable ? "default" : "outline"}
                  className={`w-full ${event.ticketsAvailable ? "" : ""}`}
                >
                  {event.ticketsAvailable ? (
                    <a href={event.ticketLink} target="_blank" rel="noopener noreferrer">
                      Get Tickets
                    </a>
                  ) : (
                    <Link href={`/events/${event.slug}`}>
                      View Details
                    </Link>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}