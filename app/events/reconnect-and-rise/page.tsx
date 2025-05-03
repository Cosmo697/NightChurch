import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, CalendarDays, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DancerFigure } from "@/components/dancing-figures"
import { LocationCountdown } from "@/components/location-countdown"

export default function ReconnectAndRisePage() {
  return (
    <div className="container py-12 relative">
      {/* Dancing figure in the corner */}
      <div className="absolute bottom-0 right-0 z-0">
        <DancerFigure delay={800} />
      </div>

      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ecoshire-9roBa65uiHaXls0a60XoaDKCuyHMvw.webp"
          alt="RECONNECT & RISE event - Outdoor desert gathering with canopies and atmospheric lighting"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <Badge className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 text-sm font-medium">
            Camping Event
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 glow-text">RECONNECT & RISE</h1>
          <p className="text-xl md:text-2xl text-purple-200">
            A Night to Celebrate Our Community
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-black/50 border border-purple-900/50">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">The Celebration</h2>
              <p className="text-lg text-center italic text-purple-200 mb-6">
                "To dance with our shadows, ground in our truth, and rise in our light, together."
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-black/50 border border-purple-900/50 mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Event Details</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-md">
                    <CalendarDays className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Date</h4>
                    <p className="text-sm text-muted-foreground">June 21-22, 2025</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-md">
                    <Clock className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Time</h4>
                    <p className="text-sm text-muted-foreground">Saturday 4 PM - Sunday 7 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-md">
                    <MapPin className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Location</h4>
                    {new Date() > new Date(2025, 4, 4) ? (
                      <p className="text-sm text-green-400">Skydive Lake Elsinore</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        To be announced on Sunday, May 4th
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-md">
                    <Users className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Presented By</h4>
                    <p className="text-sm text-muted-foreground">Risk2Rebirth & Night Church</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border border-purple-900/50">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Collaborators</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Night Church</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">Instagram:</span>
                    <a
                      href="https://instagram.com/socalnightchurch"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-pink-400 hover:underline"
                    >
                      @SoCalNightChurch
                    </a>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">Facebook:</span>
                    <a
                      href="https://facebook.com/NightChurch"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-pink-400 hover:underline"
                    >
                      @NightChurch
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Risk2Rebirth</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">Instagram:</span>
                    <a
                      href="https://instagram.com/Risk2Rebirth"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-pink-400 hover:underline"
                    >
                      @Risk2Rebirth
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-muted-foreground italic">
                  "This is a judgment-free zone. Everyone will be met where they are, no expectations, just love."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
