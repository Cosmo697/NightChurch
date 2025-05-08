"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin } from 'lucide-react'
import RadioPlayer from "@/components/radio-player"
import Portal from "@/components/portal"
import EasterEgg from "@/components/easter-egg"
import { RsvpDialog } from "@/components/rsvp-dialog"
import { usePuzzle } from "@/context/puzzle-context"
import { Event } from "@/lib/events"

export default function Home() {
  const { portalSolved, setPortalSolved } = usePuzzle()
  const [showPortal, setShowPortal] = useState(!portalSolved)
  const [hasEntered, setHasEntered] = useState(false)
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isLoadingEvent, setIsLoadingEvent] = useState(true)
  const [isRsvpDialogOpen, setIsRsvpDialogOpen] = useState(false)

  // Check for portal bypass in sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const portalBypassed = sessionStorage.getItem('nightchurch-portal-bypassed') === 'true'
      if (portalBypassed) {
        setShowPortal(false)
        setHasEntered(true)
      }
    }
  }, [])

  // Fetch featured events from API
  useEffect(() => {
    fetch('/api/events')
      .then(response => response.json())
      .then(data => {
        // Get all featured events (or use the first event if none are featured)
        let featured = data.events.filter((event: Event) => event.featured)
        
        // If no featured events, use the first event
        if (featured.length === 0 && data.events.length > 0) {
          featured = [data.events[0]]
        }
        
        // Sort events by date (assuming date format like "June 21-22, 2025")
        featured.sort((a: Event, b: Event) => {
          // Extract first date from range and convert to timestamp
          const getFirstDate = (dateStr: string) => {
            const dateMatch = dateStr.match(/([A-Za-z]+)\s+(\d+)/)
            if (dateMatch) {
              const month = dateMatch[1]
              const day = parseInt(dateMatch[2])
              const year = dateStr.match(/\d{4}/) ? dateStr.match(/\d{4}/)![0] : "2025"
              return new Date(`${month} ${day}, ${year}`).getTime()
            }
            return 0
          }
          
          return getFirstDate(a.date) - getFirstDate(b.date)
        })
        
        setFeaturedEvents(featured)
        setIsLoadingEvent(false)
      })
      .catch(error => {
        console.error('Error loading events:', error)
        setIsLoadingEvent(false)
      })
  }, [])

  // Handle direct entry without solving puzzle
  const handlePortalEnter = () => {
    setShowPortal(false)
    setHasEntered(true)
  }

  // Get current date for location reveal logic
  const currentDate = new Date()
  const locationRevealDate = new Date(2025, 4, 4) // May 4, 2025

  return (
    <>
      {/* Prevent flash by initially hiding content until we know portal state */}
      <style jsx global>{`
        html.portal-loading body > div:first-child {
          visibility: hidden;
        }
      `}</style>

      {/* Add a script to handle portal loading state */}
      <script 
        dangerouslySetInnerHTML={{
          __html: `
            document.documentElement.classList.add('portal-loading');
            setTimeout(() => {
              document.documentElement.classList.remove('portal-loading');
            }, 300);
          `
        }}
      />

      {/* Show the portal if it hasn't been solved yet */}
      {showPortal && <Portal onEnter={handlePortalEnter} />}

      <div className="flex flex-col min-h-screen relative">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/NC_Background.webp"
              alt="Night Church Desert Rave - Psychedelic desert scene with neon figures dancing around a bonfire"
              fill
              priority
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90"></div>
          </div>

          <div className="container relative z-10 text-center">
            <div className="relative w-full max-w-3xl mx-auto h-32 md:h-40 lg:h-48 mb-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Night_Church_Lettering_2025-91Om38Pp5FVchfMDtevijvAfdYGf6f.webp"
                alt="NIGHT CHURCH"
                width={1200}
                height={200}
                className="object-contain w-full h-auto"
                priority
              />
              
            </div>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-purple-100 text-shadow">
              
            </p>
            
            {/* Radio Player integrated into hero section */}
            <div className="max-w-2xl mx-auto mb-8 bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-purple-900/30">
              <h3 className="text-xl font-bold mb-3 text-purple-200">Listen to Night Church Radio</h3>
              <RadioPlayer />
            </div>            

          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-12">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center glow-text">Upcoming Events</h2>
            <div className="max-w-3xl mx-auto">
              {isLoadingEvent ? (
                <div className="text-center p-12">
                  <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-purple-500 rounded-full mx-auto mb-4"></div>
                  <p className="text-purple-300">Loading events...</p>
                </div>
              ) : featuredEvents.length > 0 ? (
                <div className="space-y-6">
                  {featuredEvents.map((event) => (
                    <Card key={event.id} className="bg-black/50 border border-purple-900/50 overflow-hidden">
                      <div className="relative h-64 md:h-72">
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
                          <h3 className="text-3xl md:text-4xl font-bold mb-2 glow-text">{event.title}</h3>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                              <div className="bg-purple-900/30 p-2 rounded-md">
                                <CalendarDays className="h-5 w-5 text-purple-300" />
                              </div>
                              <div>
                                <h4 className="font-medium">Date & Time</h4>
                                <p className="text-sm text-muted-foreground">{event.date}</p>
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
                                  <p className="text-sm text-green-400">{event.location}</p>
                                ) : (
                                  <p className="text-sm text-muted-foreground">To be announced</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Organizers section */}
                          <div className="mt-2 text-center">
                            <h4 className="text-sm font-medium text-purple-300 mb-1">Presented by</h4>
                            <p className="text-muted-foreground">{event.presentedBy}</p>
                            {event.organizers && event.organizers.length > 0 && (
                              <div className="flex justify-center gap-2 mt-2">
                                {event.organizers.map((organizer, index) => (
                                  organizer.instagram && (
                                    <a 
                                      key={index}
                                      href={`https://instagram.com/${organizer.instagram}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-purple-400 hover:text-purple-300 text-sm"
                                    >
                                      @{organizer.instagram}
                                    </a>
                                  )
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex justify-center pt-2">
                            <Button
                              asChild
                              size="lg"
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <Link href={`/events/${event.slug}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-black/50 border border-purple-900/50 p-6 text-center">
                  <p className="text-muted-foreground">No upcoming events currently scheduled.</p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 border-purple-500 text-purple-300 hover:bg-purple-950/50"
                  >
                    <Link href="/events">View Past Events</Link>
                  </Button>
                </Card>
              )}
            </div>
            <div className="mt-6 text-center">
              <Button
                asChild
                variant="link"
                className="text-purple-300 hover:text-purple-200"
              >
                <Link href="/events">View All Events →</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Artists */}
        <section className="py-12 bg-black/80 relative">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center glow-text">Featured Artists</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-black/50 border border-purple-900/50">
                <CardContent className="p-4 text-center">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-2 border-pink-500">
                    <div className="relative w-full h-full">
                      <Image
                        src="images/djs/Mortl_Profile.webp"
                        alt="Mortl"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">Mortl</h3>
                  <p className="text-muted-foreground mb-4">Founder & Resident DJ</p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-pink-500 text-pink-300 hover:bg-pink-950/50"
                  >
                    <Link href="/djs/mortl">View Profile</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border border-purple-900/50">
                <CardContent className="p-4 text-center">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-2 border-cyan-500">
                    <div className="relative w-full h-full">
                      <Image
                        src="images/djs/K-lala-dj.webp"
                        alt="K~lala"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">K~lala</h3>
                  <p className="text-muted-foreground mb-4">Resident DJ</p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-cyan-500 text-cyan-300 hover:bg-cyan-950/50"
                  >
                    <Link href="/djs/k-lala">View Profile</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border border-purple-900/50">
                <CardContent className="p-4 text-center">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-2 border-purple-500">
                    <div className="relative w-full h-full">
                      <Image
                        src="images/djs/Madmanski.webp"
                        alt="Madmanski"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">Madmanski</h3>
                  <p className="text-muted-foreground mb-4">Co-Founder & Resident DJ</p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-purple-500 text-purple-300 hover:bg-purple-950/50"
                  >
                    <Link href="/djs/madmanski">View Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      {/* RSVP Dialog */}
      {selectedEvent && (
        <RsvpDialog 
          event={selectedEvent} 
          isOpen={isRsvpDialogOpen} 
          onOpenChange={setIsRsvpDialogOpen} 
        />
      )}
    </>
  )
}