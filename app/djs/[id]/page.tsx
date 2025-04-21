import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import SoundcloudEmbed from "@/components/soundcloud-embed"
import { InterpretiveFigure } from "@/components/dancing-figures"

// Update the getDjData function to use the new cover image for all DJs
const getDjData = (id: string) => {
  const djs = {
    mortl: {
      name: "Mortl",
      role: "Founder & Resident DJ",
      image: "/images/djs/Mortl_Profile.webp",
      coverImage: "/images/Cover_01.webp",
      bio: `Mortl is the founder and resident DJ of Night Church, a desert rave collective acclaimed for delivering sophisticated, multi-dimensional psychedelic experiences in remote outdoor California locations. His DJ sets expertly navigate through genres such as psytrance, techno, ambient, and experimental music, characterized by meticulous EQing, seamless transitions, and an intuitive ability to curate emotional and rhythmic journeys tailored specifically for each event.

      As a professional visual artist, Mortl specializes in creating vibrant, surrealistic visual narratives through advanced projection mapping techniques, generative digital art, and precise geometric designs. His installations feature dynamic, immersive visual environments that enhance and synchronize with the audio during performances, significantly elevating the sensory impact of any event. Mortl employs vibrant colors, complex patterns, and psychedelic aesthetics to produce engaging and memorable experiences for event attendees.
      
      Driven by innovation and a commitment to artistic excellence, Mortl continuously pushes the boundaries of audiovisual artistry. His dedication to refining his craft, combined with a passion for fostering creative community engagement, ensures that Night Church events remain at the forefront of experiential entertainment and cultural expression.`,
      genres: ["Psytrance", "Techno", "Ambient", "Experimental"],
      soundcloudUrl:
        "https://soundcloud.com/mmortl/sets/tracks-and-mixes-by-mortl?si=36d6d1805b324bc79c32d03211d6ce64&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      upcomingEvents: [
        { name: "Desert Awakening", date: "June 15, 2024", location: "Joshua Tree, CA" },
        { name: "Cosmic Communion", date: "July 20, 2024", location: "Lucerne Valley, CA" },
      ],
    },
    madmanski: {
      name: "Madmanski",
      role: "Co-Founder & Resident DJ",
      image: "/images/djs/Madmanski.webp",
      coverImage: "/images/Cover_01.webp",
      bio: `Madmanski is a co-founder and resident DJ at Night Church, known for energetic sets that blend multiple electronic genres. With a background in traditional DJing techniques and a passion for cutting-edge sounds, Madmanski creates dance floor experiences that are both accessible and innovative.

      Drawing from influences across house, techno, and breaks, Madmanski's sets are characterized by driving rhythms, unexpected transitions, and moments of pure euphoria that keep dancers moving throughout the night.`,
      genres: ["House", "Techno", "Breaks"],
      soundcloudUrl: "https://soundcloud.com",
      upcomingEvents: [{ name: "Desert Awakening", date: "June 15, 2024", location: "Joshua Tree, CA" }],
    },
    "k-lala": {
      name: "K~lala",
      role: "Resident DJ",
      image: "/images/djs/K-lala.webp",
      coverImage: "/images/Cover_01.webp",
      bio: `K~lala crafts immersive sonic journeys that take listeners through emotional landscapes of sound. Her sets are known for their narrative quality, building stories through carefully selected tracks and thoughtful progression.

      With a background in music theory and composition, K~lala approaches DJing as an art form, creating experiences that resonate on both intellectual and emotional levels.`,
      genres: ["Deep House", "Progressive", "Melodic"],
      soundcloudUrl: "https://soundcloud.com/kayla-hoxie/sets/klala",
      upcomingEvents: [{ name: "Neon Oasis", date: "May 25, 2024", location: "Mojave Desert, CA" }],
    },
    "d-davis": {
      name: "D.Davis",
      role: "Resident DJ",
      image: "/images/djs/DDavis.webp",
      coverImage: "/images/Cover_01.webp",
      bio: `D.Davis is known for pushing the boundaries of electronic music with innovative mixing techniques and track selection. Their approach to DJing is experimental yet accessible, creating spaces where dancers can lose themselves in sound.

      With a keen ear for emerging trends and underground sounds, D.Davis brings fresh energy to the Night Church collective, constantly evolving their style while maintaining a signature sound.`,
      genres: ["Techno", "Minimal", "Experimental"],
      soundcloudUrl: "https://soundcloud.com",
      upcomingEvents: [{ name: "Cosmic Communion", date: "July 20, 2024", location: "Lucerne Valley, CA" }],
    },
    emotep: {
      name: "Emotep",
      role: "Guest DJ",
      image: "/images/djs/Emotep.webp",
      coverImage: "/images/Cover_01.webp",
      bio: `Emotep creates atmospheric soundscapes that perfectly complement Night Church's immersive visual experiences. Their sets blend downtempo rhythms with ambient textures and world music influences, creating a meditative yet engaging sonic environment.

      As both a DJ and producer, Emotep brings original compositions into their sets, offering unique sounds that can't be heard anywhere else.`,
      genres: ["Downtempo", "Ambient", "World Fusion"],
      soundcloudUrl: "https://soundcloud.com",
      upcomingEvents: [{ name: "Desert Awakening", date: "June 15, 2024", location: "Joshua Tree, CA" }],
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
    <div className="container py-12 relative">
      {/* Moved dancing figure to bottom-right corner */}
      <div className="absolute bottom-0 right-0 z-0">
        <InterpretiveFigure delay={1000} />
      </div>

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
