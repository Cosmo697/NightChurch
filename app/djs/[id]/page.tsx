import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import SoundcloudEmbed from "@/components/soundcloud-embed"

// This would typically come from a database
const getDjData = (id: string) => {
  const djs = {
    mortl: {
      name: "Mortl",
      role: "Founder & Resident DJ",
      image: "/placeholder.svg?height=400&width=400",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC5032-Edit-Edit.jpg-jnWKGPY2GIod00CudfBfuZySNwNUEc.jpeg",
      bio: `Mortl is the founder of Night Church and a resident DJ, specializing in psychedelic sounds and immersive experiences in the desert. With a passion for creating unique sonic journeys, Mortl has been at the forefront of the underground desert rave scene in Southern California.

      As both a DJ and visual artist, Mortl combines music with projection mapping to create fully immersive experiences that transport participants to other dimensions. The Night Church collective was born from a desire to create sacred spaces for musical exploration under the desert stars.`,
      genres: ["Psytrance", "Techno", "Ambient", "Experimental"],
      soundcloudUrl: "https://soundcloud.com/mortl",
      upcomingEvents: [
        { name: "Desert Awakening", date: "June 15, 2024", location: "Joshua Tree, CA" },
        { name: "Cosmic Communion", date: "July 20, 2024", location: "Lucerne Valley, CA" },
      ],
    },
    emote: {
      name: "Emote",
      role: "Resident DJ",
      image: "/placeholder.svg?height=400&width=400",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4783-Enhanced-NR.jpg-NJG89yvWqrZvXV0CX1DwQfa7N0E7jO.jpeg",
      bio: `Emote is known for emotional and uplifting sets that take listeners on a journey through sound. As a resident DJ at Night Church, Emote brings a unique blend of progressive and melodic techno to the desert landscape.

      With a background in music production and sound design, Emote crafts carefully curated sets that evolve throughout the night, building energy and emotion as the journey unfolds.`,
      genres: ["House", "Progressive", "Melodic Techno", "Deep House"],
      soundcloudUrl: "https://soundcloud.com/emote",
      upcomingEvents: [
        { name: "Neon Oasis", date: "May 25, 2024", location: "Mojave Desert, CA" },
        { name: "Desert Awakening", date: "June 15, 2024", location: "Joshua Tree, CA" },
      ],
    },
    "desert-dweller": {
      name: "Desert Dweller",
      role: "Guest DJ",
      image: "/placeholder.svg?height=400&width=400",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4802.jpg-ILujqjKflaTGSnYqbqMTQwwpOTexQy.jpeg",
      bio: `Desert Dweller blends ancient and modern sounds to create a unique desert music experience. Drawing inspiration from global rhythms and indigenous music traditions, Desert Dweller creates a sonic tapestry that resonates with the natural landscape of the desert.

      As a frequent guest at Night Church events, Desert Dweller brings a spiritual dimension to the collective's offerings, often performing during sunrise sets that welcome the new day.`,
      genres: ["Downtempo", "Tribal", "World Fusion", "Organic House"],
      soundcloudUrl: "https://soundcloud.com/desert-dweller",
      upcomingEvents: [{ name: "Cosmic Communion", date: "July 20, 2024", location: "Lucerne Valley, CA" }],
    },
    "cosmic-dust": {
      name: "Cosmic Dust",
      role: "Visual Artist & DJ",
      image: "/placeholder.svg?height=400&width=400",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4807.jpg-nyZ2SJh0HL1fUXcswUxxHbXOQYP0po.jpeg",
      bio: `Cosmic Dust creates immersive audiovisual experiences that blend music with stunning projection mapping. As both a visual artist and musician, Cosmic Dust brings a multidimensional approach to Night Church events.

      Specializing in ambient and experimental sounds, Cosmic Dust's performances are as much about the visual journey as they are about the music, creating environments that transport participants to other realms of consciousness.`,
      genres: ["Ambient", "Experimental", "Drone", "Soundscapes"],
      soundcloudUrl: "https://soundcloud.com/cosmic-dust",
      upcomingEvents: [{ name: "Desert Awakening", date: "June 15, 2024", location: "Joshua Tree, CA" }],
    },
    "neon-shaman": {
      name: "Neon Shaman",
      role: "Guest DJ",
      image: "/placeholder.svg?height=400&width=400",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4723.jpg-xrR1QxvyBaP50VRmZU922NnyPVNm1l.jpeg",
      bio: `Neon Shaman brings spiritual and tribal elements to electronic music for a transcendent dance experience. Combining traditional shamanic instruments with modern electronic production, Neon Shaman creates a bridge between ancient ritual and contemporary dance culture.

      As a guest DJ at Night Church events, Neon Shaman's performances often become ceremonial experiences that guide participants through emotional and spiritual journeys.`,
      genres: ["Tribal House", "Organic House", "Shamanic Tech", "Ritual Techno"],
      soundcloudUrl: "https://soundcloud.com/neon-shaman",
      upcomingEvents: [{ name: "Neon Oasis", date: "May 25, 2024", location: "Mojave Desert, CA" }],
    },
    "desert-fox": {
      name: "Desert Fox",
      role: "Resident DJ",
      image: "/placeholder.svg?height=400&width=400",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC5255.jpg-dZn9uQpEwwIYID3TIYExaKVAzzSo9u.jpeg",
      bio: `Desert Fox delivers high energy sets that blend multiple genres with a focus on heavy bass and breakbeats. As a resident DJ at Night Church, Desert Fox brings a raw energy that contrasts with some of the more ambient and downtempo offerings.

      Known for technical mixing skills and an encyclopedic knowledge of electronic music, Desert Fox's sets are journeys through the history and future of dance music, reimagined for the desert landscape.`,
      genres: ["Breaks", "Electro", "Bass Music", "UK Garage"],
      soundcloudUrl: "https://soundcloud.com/desert-fox",
      upcomingEvents: [
        { name: "Desert Awakening", date: "June 15, 2024", location: "Joshua Tree, CA" },
        { name: "Cosmic Communion", date: "July 20, 2024", location: "Lucerne Valley, CA" },
      ],
    },
  }

  return djs[id as keyof typeof djs] || null
}

export default function DjProfilePage({ params }: { params: { id: string } }) {
  const dj = getDjData(params.id)

  if (!dj) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">DJ Not Found</h1>
        <p className="mb-6">Sorry, we couldn't find the DJ you're looking for.</p>
        <Button asChild>
          <Link href="/djs">Back to DJs</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/djs" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to DJs
          </Link>
        </Button>
      </div>

      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
        <Image src={dj.coverImage || "/placeholder.svg"} alt={`${dj.name} cover image`} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 glow-text">{dj.name}</h1>
          <p className="text-xl text-purple-200">{dj.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-black/50 border border-purple-900/50">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Bio</h2>
              <div className="prose prose-invert max-w-none">
                {dj.bio.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="mb-4 text-muted-foreground">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>

              <Separator className="my-6" />

              <h2 className="text-2xl font-bold mb-4">Music</h2>
              <div className="mb-6">
                <SoundcloudEmbed url={dj.soundcloudUrl} />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <h3 className="text-sm font-medium w-full mb-2">Genres:</h3>
                {dj.genres.map((genre) => (
                  <span key={genre} className="text-xs px-2 py-1 rounded-full bg-purple-900/30 text-purple-200">
                    {genre}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-black/50 border border-purple-900/50 mb-6">
            <CardContent className="p-6">
              <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                <Image src={dj.image || "/placeholder.svg"} alt={dj.name} fill className="object-cover" />
              </div>

              <Button asChild variant="outline" className="w-full border-pink-500 text-pink-300 hover:bg-pink-950/50">
                <Link href="/contact">Book for Event</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border border-purple-900/50">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Upcoming Events</h3>

              {dj.upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {dj.upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-purple-900/30 p-2 rounded-md">
                        <Calendar className="h-5 w-5 text-purple-300" />
                      </div>
                      <div>
                        <h4 className="font-medium">{event.name}</h4>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No upcoming events scheduled.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
