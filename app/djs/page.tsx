import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const djs = [
  {
    id: "mortl",
    name: "Mortl",
    role: "Co-Founder & Resident DJ",
    image: "/images/djs/Mortl_Profile.webp",
    genres: ["Psytrance", "Psycore", "Psybient", "Techno", "IDM", "Folk"],
    bio: "Mortl is an electronic music producer, projection artist, and event organizer. He co-founded Night Church alongside Madmanski and Metaperspective. His sets explore the experimental edges of electronic music, ranging from test tones used to probe a space’s acoustic resonance to high-intensity 300 BPM psycore.",
    hasFullProfile: true,
  },
  {
    id: "madmanski",
    name: "Madmanski",
    role: "Co-Founder & Resident DJ",
    image: "/images/djs/Madmanski.webp",
    genres: ["Techno", "DarkPsy", "Ambient"],
    bio: "Madmanski shifts gears between weighty, hypnotic techno with guttural basslines and relentless 14-minute trance epics that offer no escape. But when the dust clears, he reemerges with sunrise downtempo sets that haunt and heal.",
    hasFullProfile: true,
  },
  {
    id: "k-lala",
    name: "K~lala",
    role: "Resident DJ",
    image: "/images/djs/K-lala-dj.webp",
    genres: ["PsyDub", "Psycore", "Psytrance", "Flora", "Tribal House"],
    bio: "K~lala channels feminine mysticism through tribal percussion, folk medicine melodies, and glistening psychedelic beats. Her sets feel ceremonial—raw, beautiful, and totally captivating.",
    hasFullProfile: true,
  },
  {
    id: "subduction",
    name: "Subduction",
    role: "Resident DJ",
    image: "/images/djs/Subduction.webp",
    genres: ["Techno"],
    bio: "Subduction specializes in longform journeys—never less than 5 hours—of deep, hypnotic Italian techno. Steady, immersive, and engineered for dancers who never want to come up for air.",
    hasFullProfile: false,
  },
  {
    id: "d-davis",
    name: "D.Davis",
    role: "Producer, Organizer, Resident DJ",
    image: "/images/djs/DDavis.webp",
    genres: ["World", "House", "Hip-Hop", "Amapiano"],
    bio: "D.Davis opens the party with soul. His sets bring joy, movement, and connection—uplifting global beats laced with groove and intention. A natural vibe-setter with dancer-first instincts.",
    hasFullProfile: false,
  },  
  {
    id: "emotep",
    name: "Emotep",
    role: "Guest DJ",
    image: "/images/djs/Emotep.webp",
    genres: ["EDM", "Dance", "Hard Techno"],
    bio: "Emotep casts high-energy vibrational spells and sonic exorcisms. Known for explosive sets that ride the line between insanity and transcendence, he’s here to shake the floor and short-circuit expectations.",
    hasFullProfile: false,
  },
  {
    id: "sepia",
    name: "Sepia",
    role: "Resident DJ",
    image: "/images/djs/Sepia.webp",
    genres: ["Lo-fi", "Trip-hop", "Pop Electronica"],
    bio: "Sepia curates dusk-toned nostalgia with lo-fi grooves, hazy textures, and emotionally resonant hooks. His sets move slow and deep, like memory itself, filtered through vapor and static.",
    hasFullProfile: false,
  },
  {
    id: "metaperspective",
    name: "Metaperspective",
    role: "Co-Founder & Resident DJ",
    image: "/images/djs/Metaperspective.webp",
    genres: ["Full-on Psytrance", "Ambient", "Noise"],
    bio: "Metaperspective channels intensity into ceremony. A Night Church originator, his sets weave full-power psytrance with abrasive ambiance and spiritual noise—music for trance states and altered perception.",
    hasFullProfile: false,
  },
  {
    id: "samskara",
    name: "Samskara",
    role: "Organizer, Resident DJ",
    image: "/images/djs/samskara-dj.webp",
    genres: ["Psybient", "Psychedelic Rock", "Psycore", "Experimental"],
    bio: "Samskara blends distorted rock, esoteric psychedelia, and introspective ambient into mythic sound journeys. Equal parts seeker and sonic alchemist, she threads raw emotion through the surreal.",
    hasFullProfile: false,
  },
  {
    id: "fungus-amongus",
    name: "Fungus Amongus",
    role: "Resident DJ, Resident Shaman",
    image: "/images/djs/Fungus_Amongus.jpeg",
    genres: ["Classic Rock-EDM Mash-ups"],
    bio: "Fungus Amongus is Night Church’s trickster shaman—delivering bizarre, brilliant mashups that defy logic but hit the soul. Hendrix meets halftime, Pink Floyd meets bassline. Psychedelic comedy with teeth.",
    hasFullProfile: false,
  },
  {
    id: "lil-caca-floja",
    name: "lil caca floja",
    role: "Resident DJ",
    image: "/images/djs/lil_caca_floja.webp",
    genres: ["Tribal House"],
    bio: "lil caca floja weaves primal house rhythms with cheeky irreverence—deep grooves, glowing toys, and a body-forward style that invites movement and mischief. A consistent dancefloor magnet.",
    hasFullProfile: false,
  },
  {
    id: "jafar",
    name: "Jafar",
    role: "Guitarist",
    image: "/images/djs/Jafar.webp",
    genres: ["Rock", "Metal", "Freestyle"],
    bio: "Jafar improvises live guitar to whatever is pulsing through the speakers—melting metal riffs into ambient drones, riffing over psytrance, or just riding the chaos. A wild-card virtuoso with desert dust on his strings.",
    hasFullProfile: false,
  },
]

export default function DJsPage() {
  return (
    <div className="container py-12 relative">
      {/* Moved dancing figure to bottom-left corner */}
      
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