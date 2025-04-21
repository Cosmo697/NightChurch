import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, CalendarDays, Clock, MapPin, Users, Tent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DancerFigure } from "@/components/dancing-figures"

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
            A Holistic All-Night Rave & Mental Health Camping Experience
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-black/50 border border-purple-900/50">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">The Mission</h2>
              <p className="text-lg text-center italic text-purple-200 mb-6">
                "To dance with our shadows, ground in our truth, and rise in our light, together."
              </p>
              <p className="mb-4 text-muted-foreground">
                This is a celebration of healing and being human. Co-created by two community-rooted organizations, this
                gathering is an invitation to reconnect with self and each other through movement, expression, and
                exploration in a safe, judgment-free space.
              </p>
              <p className="mb-4 text-muted-foreground">
                Night Church brings years of grassroots experience cultivating immersive, open-air gatherings rooted in
                art, sound, and psychedelic soulwork. Known for transforming desert landscapes into vibrant playgrounds
                of audio-visual storytelling and deep communal resonance, Their presence aims to deepen the ritual,
                raise the frequency, and amplify the healing.
              </p>
              <p className="mb-4 text-muted-foreground">
                Expect a fully curated N.C. experience, featuring projection-mapped visuals, deep sonic journeys, and
                sacred psychedelic ambiance, all designed to stir the spirit and strengthen the bonds that hold our
                community together.
              </p>

              <Separator className="my-6" />

              <h2 className="text-2xl font-bold mb-4">Core Elements</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">Night Church sound system + all-night DJ sets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">Vie Giving Gratitude Speech</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">Ecstatic dance floor + barefoot ritual spaces</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">
                    Immersive projection-mapped visuals + sacred lighting design
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">Fire spinners, flow artists, and open mic rituals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">Holistic healing zone: sound therapy, guided breathwork</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">Creative expression corner: glow in the dark paint</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">Safe tent: decompress, reflect, talk to someone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">Grounding sunrise rituals and integration circle</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">Disc golf optional 18 holes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">Drum circle</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">Pool available</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">Showers and indoor bathrooms available</span>
                </li>
              </ul>

              <Separator className="my-6" />

              <h2 className="text-2xl font-bold mb-4">Event Flow</h2>
              <h3 className="text-xl font-semibold mb-3">Saturday, June 21: DROP IN & RELEASE</h3>

              <div className="space-y-6 mb-6">
                <div>
                  <h4 className="font-medium text-purple-300">4:00 PM – 5:00 PM | Arrival & Camp Setup</h4>
                  <ul className="ml-6 mt-2 space-y-1">
                    <li className="text-sm text-muted-foreground">
                      Welcome hugs, intention bracelets, vibe check-in station
                    </li>
                    <li className="text-sm text-muted-foreground">
                      Night Church + community DJs begin the sonic journey
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-300">6:00 PM – 7:30 PM | Holistic Warm-Up Zone</h4>
                  <ul className="ml-6 mt-2 space-y-1">
                    <li className="text-sm text-muted-foreground">Sunset yoga flow + immersive sound bath journey</li>
                    <li className="text-sm text-muted-foreground">Optional art journaling & tea bar open</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-300">7:30 PM – 9:00 PM</h4>
                  <ul className="ml-6 mt-2 space-y-1">
                    <li className="text-sm text-muted-foreground">Fire lighting ritual</li>
                    <li className="text-sm text-muted-foreground">Vie Gratitude Speech</li>
                    <li className="text-sm text-muted-foreground">
                      Share a story, light a candle, drop into heart space
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-300">9:00 PM – 12:00 AM | Holistic RAVE Ignites</h4>
                  <ul className="ml-6 mt-2 space-y-1">
                    <li className="text-sm text-muted-foreground">Live DJs (house, tribal, experimental, psytrance)</li>
                    <li className="text-sm text-muted-foreground">Fire spinners, LED flow artists</li>
                    <li className="text-sm text-muted-foreground">
                      Sacred rage station, barefoot dance circle, movement meditation
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-300">12:00 AM – 2:00 AM | Midnight Integration</h4>
                  <ul className="ml-6 mt-2 space-y-1">
                    <li className="text-sm text-muted-foreground">Sound healing journey tent</li>
                    <li className="text-sm text-muted-foreground">Whisper poetry</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-300">All night:</h4>
                  <ul className="ml-6 mt-2 space-y-1">
                    <li className="text-sm text-muted-foreground">Story altar open for anonymous shares</li>
                    <li className="text-sm text-muted-foreground">One-on-one reflection booth ("Talk to a Mirror")</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-300">2:00 AM | Night Church's Traditional Heilung Hour</h4>
                  <p className="ml-6 mt-2 text-sm text-muted-foreground">
                    Lights dim, the healing sounds of ancient Nordic poetry and tribal drumming fill the night air—a
                    ritual of stillness, listening, and reverence
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-purple-300">3:00 AM – 5:00 AM | Night Church DJs Return</h4>
                  <p className="ml-6 mt-2 text-sm text-muted-foreground">
                    Ambient, hypnotic sets guide us through the final stretch toward dawn
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-purple-300">5:00 AM – 6:00 AM | Sunrise Ceremony</h4>
                  <ul className="ml-6 mt-2 space-y-1">
                    <li className="text-sm text-muted-foreground">Drum circle, tribal breathwork, meditation</li>
                    <li className="text-sm text-muted-foreground">Group scream, grounding chant, collective exhale</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3">Sunday, June 22: RISE & RETURN</h3>
              <div>
                <h4 className="font-medium text-purple-300">
                  9:00 AM – 10:00 AM | Camp Breakdown + Leave No Trace Ritual
                </h4>
                <ul className="ml-6 mt-2 space-y-1">
                  <li className="text-sm text-muted-foreground">Final hugs, and send-off</li>
                </ul>
              </div>

              <Separator className="my-6" />

              <h2 className="text-2xl font-bold mb-4">What Makes This Different</h2>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">100% community-created</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">Judgment-free, body-positive, emotionally safe space</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">No substances required, the high is you</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-muted-foreground">All bodies, all identities, all hearts welcome</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700">
                  <a href="https://forms.gle/vZ262qc69oeQhNmi9" target="_blank" rel="noopener noreferrer">
                    Pre-Register Now
                  </a>
                </Button>
              </div>
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
                    <p className="text-sm text-muted-foreground">Saturday 4 PM - Sunday 10 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-md">
                    <MapPin className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p className="text-sm text-muted-foreground">To be announced</p>
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

                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-md">
                    <Tent className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Camping Fee</h4>
                    <p className="text-sm text-muted-foreground">$20 per night</p>
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
