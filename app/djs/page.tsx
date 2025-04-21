import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StokedFigure } from "@/components/dancing-figures"

const djs = [
  {
    id: "mortl",
    name: "Mortl",
    role: "Founder & Resident DJ",
    image: "/images/djs/Mortl_Profile.webp",
    genres: ["Psytrance", "Techno", "Ambient"],
    bio: "Founder of Night Church and resident DJ, Mortl brings psychedelic sounds and immersive experiences to the desert.",
    hasFullProfile: true,
  },
  {
    id: "madmanski",
    name: "Madmanski",
    role: "Co-Founder & Resident DJ",
    image: "/images/djs/Madmanski.webp",
    genres: ["House", "Techno", "Breaks"],
    bio: "Co-Founder and resident DJ at Night Church, known for energetic sets that blend multiple electronic genres.",
    hasFullProfile: true,
  },
  {
    id: "k-lala",
    name: "K~lala",
    role: "Resident DJ",
    image: "/images/djs/K-lala.webp",
    genres: ["Deep House", "Progressive", "Melodic"],
    bio: "Crafting immersive sonic journeys that take listeners through emotional landscapes of sound.",
    hasFullProfile: true,
  },
  {
    id: "subduction",
    name: "Subduction",
    role: "Resident DJ",
    image: "/images/djs/Subduction.webp",
    genres: ["Deep Techno", "Dub Techno", "Ambient"],
    bio: "Creating hypnotic, tectonic soundscapes that pull listeners into the depths of rhythm and texture.",
    hasFullProfile: false,
  },
  {
    id: "d-davis",
    name: "D.Davis",
    role: "Resident DJ",
    image: "/images/djs/DDavis.webp",
    genres: ["Techno", "Minimal", "Experimental"],
    bio: "Pushing the boundaries of electronic music with innovative mixing techniques and track selection.",
    hasFullProfile: true,
  },
  {
    id: "emotep",
    name: "Emotep",
    role: "Guest DJ",
    image: "/images/djs/Emotep.webp",
    genres: ["Downtempo", "Ambient", "World Fusion"],
    bio: "Creating atmospheric soundscapes that perfectly complement Night Church's immersive visual experiences.",
    hasFullProfile: true,
  },
  {
    id: "sepia",
    name: "Sepia",
    role: "Resident DJ",
    image: "/images/djs/Sepia.webp",
    genres: ["Lo-fi", "Trip-hop", "Electronica"],
    bio: "Blending nostalgic sounds with modern production techniques for a unique auditory experience.",
    hasFullProfile: false,
  },
  {
    id: "metaperspective",
    name: "Metaperspective",
    role: "Resident DJ",
    image: "/images/djs/Metaperspective.webp",
    genres: ["Psytrance", "Progressive", "Full-on"],
    bio: "Taking listeners on mind-bending journeys through psychedelic soundscapes and driving rhythms.",
    hasFullProfile: false,
  },
  {
    id: "samskara",
    name: "Samskara",
    role: "Resident DJ",
    image: "/rhythmic-earth.png",
    genres: ["Tribal", "Organic House", "Shamanic Tech"],
    bio: "Infusing spiritual elements into electronic music for transcendent dance experiences.",
    hasFullProfile: false,
  },
  {
    id: "fungus-amongus",
    name: "Fungus Amongus",
    role: "Resident DJ",
    image: "/images/djs/Fungus_Amongus.jpeg",
    genres: ["Psychedelic", "Bass Music", "Glitch Hop"],
    bio: "Sprouting groovy beats and mind-expanding sounds that connect dancers to the earth and beyond.",
    hasFullProfile: false,
  },
  {
    id: "lil-caca-floja",
    name: "lil caca floja",
    role: "Resident DJ",
    image: "/images/djs/lil_caca_floja.webp",
    genres: ["Experimental", "Bass", "Leftfield"],
    bio: "Pushing boundaries with unconventional sounds and unexpected rhythmic patterns.",
    hasFullProfile: false,
  },
  {
    id: "jafar",
    name: "Jafar",
    role: "Guitarist",
    image: "/images/djs/Jafar.webp",
    genres: ["World Music", "Ethnic Electronic", "Desert Tech"],
    bio: "Weaving Middle Eastern influences with guitar to create a truly global musical experience.",
    hasFullProfile: false,
  },
]

export default function DJsPage() {
  return (
    <div className="container py-12 relative">
      {/* Moved dancing figure to bottom-left corner */}
      <div className="absolute bottom-0 left-0 z-0">
        <StokedFigure delay={500} />
      </div>

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

              {dj.hasFullProfile ? (
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-purple-500 text-purple-300 hover:bg-purple-950/50"
                >
                  <Link href={`/djs/${dj.id}`}>View Profile</Link>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-purple-500 text-purple-300 hover:bg-purple-950/50 opacity-50 cursor-not-allowed"
                  disabled
                >
                  <span>Profile Coming Soon</span>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}