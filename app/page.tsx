import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, MapPin, Music, Tent, Users } from "lucide-react"
import RadioPlayer from "@/components/radio-player"
import { StarGazingFigure } from "@/components/dancing-figures"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/NC_Background.webp"
            alt="Night Church Desert Rave - Psychedelic desert scene with neon figures dancing around a fire"
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
            Immersive desert raves in Southern California
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700">
              <Link href="/gallery">View Gallery</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-purple-500 text-purple-300 hover:bg-purple-950/50"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>

        {/* Star gazing figures at the bottom of hero - moved to bottom edge */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-0">
          <StarGazingFigure delay={1200} />
        </div>
      </section>

      {/* Radio Player Section */}
      <section className="py-12 bg-black/80 relative">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center glow-text">Listen to Night Church Radio</h2>
          <div className="max-w-2xl mx-auto">
            <RadioPlayer />
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center glow-text">Upcoming Events</h2>
          <div className="max-w-3xl mx-auto">
            <Card className="bg-black/50 border border-purple-900/50 overflow-hidden">
              <div className="relative h-64 md:h-80">
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
                  <h3 className="text-3xl md:text-4xl font-bold mb-2 glow-text">RECONNECT & RISE</h3>
                  <p className="text-xl text-purple-200">
                    A Holistic All-Night Rave & Mental Health Camping Experience
                  </p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-col gap-6">
                  <p className="text-lg text-muted-foreground">
                    "To dance with our shadows, ground in our truth, and rise in our light, together."
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Event Highlights</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Music className="h-4 w-4 text-pink-400" />
                        <span>Night Church sound system & DJ sets</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Tent className="h-4 w-4 text-pink-400" />
                        <span>Camping ($20/night)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-4 w-4 flex items-center justify-center text-pink-400">✨</span>
                        <span>Immersive projection-mapped visuals</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-4 w-4 flex items-center justify-center text-pink-400">🔥</span>
                        <span>Fire spinners & flow artists</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-4 w-4 flex items-center justify-center text-pink-400">🧘</span>
                        <span>Holistic healing zones</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-4 w-4 flex items-center justify-center text-pink-400">🥁</span>
                        <span>Drum circles & sunrise rituals</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                    <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700">
                      <a href="https://forms.gle/vZ262qc69oeQhNmi9" target="_blank" rel="noopener noreferrer">
                        Pre-Register Now
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-purple-500 text-purple-300 hover:bg-purple-950/50"
                    >
                      <Link href="/events/reconnect-and-rise">View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mortl_Profile-bxo3UjGbPDzQL1UuPjYqFnsaYXgfnd.webp"
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
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/K-lala-1HOjE9tSbpjQYWdxUZPLboMiNlUuCm.webp"
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
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Madmanski-vKqtGsEKXej8KHabBi1uHGjnAeUgZd.webp"
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
  )
}
