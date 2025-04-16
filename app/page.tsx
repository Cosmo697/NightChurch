import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import RadioPlayer from "@/components/radio-player"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC5032-Edit-Edit.jpg-jnWKGPY2GIod00CudfBfuZySNwNUEc.jpeg"
            alt="Night Church Desert Rave"
            fill
            priority
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90"></div>
        </div>

        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 glow-text">NIGHT CHURCH</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-purple-100">
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
      </section>

      {/* Radio Player Section */}
      <section className="py-12 bg-black/80">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center glow-text">Listen to Night Church Radio</h2>
          <div className="max-w-2xl mx-auto">
            <RadioPlayer />
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center glow-text">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-black/50 border border-purple-900/50 overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4783-Enhanced-NR.jpg-NJG89yvWqrZvXV0CX1DwQfa7N0E7jO.jpeg"
                  alt="DJ Booth"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold mb-2">Desert Awakening</h3>
                <p className="text-muted-foreground mb-4">
                  A night of psychedelic beats and immersive visuals under the desert stars.
                </p>
                <Button variant="outline" className="w-full border-purple-500 text-purple-300 hover:bg-purple-950/50">
                  View Details
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border border-purple-900/50 overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4807.jpg-nyZ2SJh0HL1fUXcswUxxHbXOQYP0po.jpeg"
                  alt="DJ Booth"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold mb-2">Neon Oasis</h3>
                <p className="text-muted-foreground mb-4">
                  Geometric light displays and cutting-edge electronic music in a secret desert location.
                </p>
                <Button variant="outline" className="w-full border-purple-500 text-purple-300 hover:bg-purple-950/50">
                  View Details
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border border-purple-900/50 overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4802.jpg-ILujqjKflaTGSnYqbqMTQwwpOTexQy.jpeg"
                  alt="Desert Gathering"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold mb-2">Cosmic Communion</h3>
                <p className="text-muted-foreground mb-4">
                  A spiritual journey through sound and light in the heart of the desert.
                </p>
                <Button variant="outline" className="w-full border-purple-500 text-purple-300 hover:bg-purple-950/50">
                  View Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-12 bg-black/80">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center glow-text">Featured Artists</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/50 border border-purple-900/50">
              <CardContent className="p-4 text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-2 border-pink-500">
                  <div className="relative w-full h-full">
                    <Image src="/placeholder.svg?height=128&width=128" alt="Mortl" fill className="object-cover" />
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
                    <Image src="/placeholder.svg?height=128&width=128" alt="Emote" fill className="object-cover" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Emote</h3>
                <p className="text-muted-foreground mb-4">Resident DJ</p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-cyan-500 text-cyan-300 hover:bg-cyan-950/50"
                >
                  <Link href="/djs/emote">View Profile</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border border-purple-900/50">
              <CardContent className="p-4 text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-2 border-purple-500">
                  <div className="relative w-full h-full">
                    <Image
                      src="/placeholder.svg?height=128&width=128"
                      alt="Cosmic Dust"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Cosmic Dust</h3>
                <p className="text-muted-foreground mb-4">Visual Artist</p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-purple-500 text-purple-300 hover:bg-purple-950/50"
                >
                  <Link href="/visual-art">View Work</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
