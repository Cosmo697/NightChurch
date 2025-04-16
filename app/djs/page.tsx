import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const djs = [
  {
    id: "mortl",
    name: "Mortl",
    role: "Founder & Resident DJ",
    image: "/placeholder.svg?height=300&width=300",
    genres: ["Psytrance", "Techno", "Ambient"],
    bio: "Founder of Night Church and resident DJ, Mortl brings psychedelic sounds and immersive experiences to the desert.",
  },
  {
    id: "emote",
    name: "Emote",
    role: "Resident DJ",
    image: "/placeholder.svg?height=300&width=300",
    genres: ["House", "Progressive", "Melodic Techno"],
    bio: "Known for emotional and uplifting sets that take listeners on a journey through sound.",
  },
  {
    id: "desert-dweller",
    name: "Desert Dweller",
    role: "Guest DJ",
    image: "/placeholder.svg?height=300&width=300",
    genres: ["Downtempo", "Tribal", "World Fusion"],
    bio: "Blending ancient and modern sounds to create a unique desert music experience.",
  },
  {
    id: "cosmic-dust",
    name: "Cosmic Dust",
    role: "Visual Artist & DJ",
    image: "/placeholder.svg?height=300&width=300",
    genres: ["Ambient", "Experimental", "Drone"],
    bio: "Creating immersive audiovisual experiences that blend music with stunning projection mapping.",
  },
  {
    id: "neon-shaman",
    name: "Neon Shaman",
    role: "Guest DJ",
    image: "/placeholder.svg?height=300&width=300",
    genres: ["Tribal House", "Organic House", "Shamanic Tech"],
    bio: "Bringing spiritual and tribal elements to electronic music for a transcendent dance experience.",
  },
  {
    id: "desert-fox",
    name: "Desert Fox",
    role: "Resident DJ",
    image: "/placeholder.svg?height=300&width=300",
    genres: ["Breaks", "Electro", "Bass Music"],
    bio: "High energy sets that blend multiple genres with a focus on heavy bass and breakbeats.",
  },
]

export default function DJsPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center glow-text">DJs & Artists</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Meet the talented DJs and artists who create the sonic landscape of Night Church
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {djs.map((dj) => (
          <Card key={dj.id} className="bg-black/50 border border-purple-900/50 overflow-hidden">
            <div className="relative h-64">
              <Image src={dj.image || "/placeholder.svg"} alt={dj.name} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold mb-1">{dj.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{dj.role}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {dj.genres.map((genre) => (
                  <span key={genre} className="text-xs px-2 py-1 rounded-full bg-purple-900/30 text-purple-200">
                    {genre}
                  </span>
                ))}
              </div>

              <p className="text-sm text-muted-foreground mb-4">{dj.bio}</p>

              <Button
                asChild
                variant="outline"
                className="w-full border-purple-500 text-purple-300 hover:bg-purple-950/50"
              >
                <Link href={`/djs/${dj.id}`}>View Profile</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
