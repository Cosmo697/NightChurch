import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import SoundcloudEmbed from "@/components/soundcloud-embed"
import { InterpretiveFigure } from "@/components/dancing-figures"

// This would typically come from a database
const getDjData = (id: string) => {
  const djs = {
    mortl: {
      name: "Mortl",
      role: "Founder & Resident DJ",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mortl_Profile-bxo3UjGbPDzQL1UuPjYqFnsaYXgfnd.webp",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC5032-Edit-Edit.jpg-jnWKGPY2GIod00CudfBfuZySNwNUEc.jpeg",
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
      role: "Resident DJ",
      image: "/focused-dj.png",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4783-Enhanced-NR.jpg-NJG89yvWqrZvXV0CX1DwQfa7N0E7jO.jpeg",
      bio: `Madmanski is a resident DJ at Night Church, known for energetic sets that blend multiple electronic genres. With a background in traditional DJing techniques and a passion for cutting-edge sounds, Madmanski creates dance floor experiences that are both accessible and innovative.

      Drawing from influences across house, techno, and breaks, Madmanski's sets are characterized by driving rhythms, unexpected transitions, and moments of pure euphoria that keep dancers moving throughout the night.`,
      genres: ["House", "Techno", "Breaks"],
      soundcloudUrl: "https://soundcloud.com",
      upcomingEvents: [{ name: "Desert Awakening", date: "June 15, 2024", location: "Joshua Tree, CA" }],
    },
    "k-lala": {
      name: "K~lala",
      role: "Resident DJ",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/K-lala-1HOjE9tSbpjQYWdxUZPLboMiNlUuCm.webp",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4807.jpg-nyZ2SJh0HL1fUXcswUxxHbXOQYP0po.jpeg",
      bio: `K~lala crafts immersive sonic journeys that take listeners through emotional landscapes of sound. Her sets are known for their narrative quality, building stories through carefully selected tracks and thoughtful progression.

      With a background in music theory and composition, K~lala approaches DJing as an art form, creating experiences that resonate on both intellectual and emotional levels.`,
      genres: ["Deep House", "Progressive", "Melodic"],
      soundcloudUrl: "https://soundcloud.com/kayla-hoxie/sets/klala",
      upcomingEvents: [{ name: "Neon Oasis", date: "May 25, 2024", location: "Mojave Desert, CA" }],
    },
    subduction: {
      name: "Subduction",
      role: "Resident DJ",
      image: "/subduction-dj.png",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4802.jpg-ILujqjKflaTGSnYqbqMTQwwpOTexQy.jpeg",
      bio: `Subduction takes listeners on a journey into the depths of techno, where layers of sound collide and transform like tectonic plates beneath the earth's surface. Their sets are characterized by hypnotic rhythms, deep bass frequencies, and textural soundscapes that create an immersive sonic environment.

      Drawing inspiration from geological processes, Subduction's approach to DJing emphasizes gradual transformation and powerful momentum, building pressure and releasing energy in ways that move both body and mind. Each set is a carefully crafted exploration of depth and density in electronic music.
      
      As a resident DJ at Night Church, Subduction contributes a unique sonic signature to the collective's events, complementing the desert landscape with sounds that seem to emerge from deep within the earth itself.`,
      genres: ["Deep Techno", "Dub Techno", "Ambient"],
      soundcloudUrl: "https://soundcloud.com",
      upcomingEvents: [
        { name: "Desert Awakening", date: "June 15, 2024", location: "Joshua Tree, CA" },
        { name: "Cosmic Communion", date: "July 20, 2024", location: "Lucerne Valley, CA" },
      ],
    },
    "d-davis": {
      name: "D.Davis",
      role: "Resident DJ",
      image: "/desert-beats.png",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4802.jpg-ILujqjKflaTGSnYqbqMTQwwpOTexQy.jpeg",
      bio: `D.Davis is known for pushing the boundaries of electronic music with innovative mixing techniques and track selection. Their approach to DJing is experimental yet accessible, creating spaces where dancers can lose themselves in sound.

      With a keen ear for emerging trends and underground sounds, D.Davis brings fresh energy to the Night Church collective, constantly evolving their style while maintaining a signature sound.`,
      genres: ["Techno", "Minimal", "Experimental"],
      soundcloudUrl: "https://soundcloud.com",
      upcomingEvents: [{ name: "Cosmic Communion", date: "July 20, 2024", location: "Lucerne Valley, CA" }],
    },
    emotep: {
      name: "Emotep",
      role: "Resident DJ",
      image: "/vibrant-dj-projection.png",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4807.jpg-nyZ2SJh0HL1fUXcswUxxHbXOQYP0po.jpeg",
      bio: `Emotep creates atmospheric soundscapes that perfectly complement Night Church's immersive visual experiences. Their sets blend downtempo rhythms with ambient textures and world music influences, creating a meditative yet engaging sonic environment.

      As both a DJ and producer, Emotep brings original compositions into their sets, offering unique sounds that can't be heard anywhere else.`,
      genres: ["Downtempo", "Ambient", "World Fusion"],
      soundcloudUrl: "https://soundcloud.com",
      upcomingEvents: [{ name: "Desert Awakening", date: "June 15, 2024", location: "Joshua Tree, CA" }],
    },
    sepia: {
      name: "Sepia",
      role: "Resident DJ",
      image: "/retro-grooves.png",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4723.jpg-xrR1QxvyBaP50VRmZU922NnyPVNm1l.jpeg",
      bio: `Sepia blends nostalgic sounds with modern production techniques for a unique auditory experience. Their sets evoke a sense of timelessness, drawing from vintage recordings and classic electronic tracks while maintaining a contemporary edge.

      With a background in audio engineering, Sepia brings technical precision to their performances, ensuring that every frequency is perfectly balanced for maximum impact.`,
      genres: ["Lo-fi", "Trip-hop", "Electronica"],
      soundcloudUrl: "https://soundcloud.com",
      upcomingEvents: [{ name: "Neon Oasis", date: "May 25, 2024", location: "Mojave Desert, CA" }],
    },
    metaperspective: {
      name: "Metaperspective",
      role: "Resident DJ",
      image: "/cosmic-grooves.png",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC5255.jpg-dZn9uQpEwwIYID3TIYExaKVAzzSo9u.jpeg",
      bio: `Metaperspective takes listeners on mind-bending journeys through psychedelic soundscapes and driving rhythms. Their sets are characterized by complex patterns, hypnotic beats, and moments of transcendent release.

      As a longtime contributor to the psychedelic music scene, Metaperspective brings deep knowledge and experience to their performances, guiding dancers through carefully crafted sonic experiences.`,
      genres: ["Psytrance", "Progressive", "Full-on"],
      soundcloudUrl: "https://soundcloud.com",
      upcomingEvents: [{ name: "Cosmic Communion", date: "July 20, 2024", location: "Lucerne Valley, CA" }],
    },
    samskara: {
      name: "Samskara",
      role: "Resident DJ",
      image: "/cosmic-grooves.png",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4802.jpg-ILujqjKflaTGSnYqbqMTQwwpOTexQy.jpeg",
      bio: `Samskara infuses spiritual elements into electronic music for transcendent dance experiences. Drawing from various cultural traditions and ritual music practices, their sets create spaces for communal connection and personal transformation.

      With a deep respect for the sacred potential of dance music, Samskara approaches DJing as a form of modern shamanism, guiding participants through emotional and spiritual journeys.`,
      genres: ["Tribal", "Organic House", "Shamanic Tech"],
      soundcloudUrl: "https://soundcloud.com",
      upcomingEvents: [{ name: "Desert Awakening", date: "June 15, 2024", location: "Joshua Tree, CA" }],
    },
    "fungus-amongus": {
      name: "Fungus Amongus",
      role: "Resident DJ",
      image: "/funky-fungi-beats.png",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4723.jpg-xrR1QxvyBaP50VRmZU922NnyPVNm1l.jpeg",
      bio: `Fungus Amongus sprouts groovy beats and mind-expanding sounds that connect dancers to the earth and beyond. Their sets are characterized by organic textures, funky rhythms, and psychedelic flourishes that create a playful yet profound dance floor experience.

      Inspired by the interconnected networks of mycelium, Fungus Amongus approaches music as a way to foster community and ecological awareness through shared sonic experiences.`,
      genres: ["Psychedelic", "Bass Music", "Glitch Hop"],
      soundcloudUrl: "https://soundcloud.com",
      upcomingEvents: [{ name: "Neon Oasis", date: "May 25, 2024", location: "Mojave Desert, CA" }],
    },
    "lil-caca-floja": {
      name: "lil caca floja",
      role: "Resident DJ",
      image: "/sonic-alchemy.png",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC5255.jpg-dZn9uQpEwwIYID3TIYExaKVAzzSo9u.jpeg",
      bio: `lil caca floja pushes boundaries with unconventional sounds and unexpected rhythmic patterns. Their sets challenge listeners while maintaining a playful energy that keeps the dance floor moving.

      With a background in sound design and experimental music, lil caca floja brings technical innovation to their performances, creating unique sonic textures and surprising musical moments.`,
      genres: ["Experimental", "Bass", "Leftfield"],
      soundcloudUrl: "https://soundcloud.com",
      upcomingEvents: [{ name: "Cosmic Communion", date: "July 20, 2024", location: "Lucerne Valley, CA" }],
    },
    jafar: {
      name: "Jafar",
      role: "Resident DJ",
      image: "/desert-grooves.png",
      coverImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4783-Enhanced-NR.jpg-NJG89yvWqrZvXV0CX1DwQfa7N0E7jO.jpeg",
      bio: `Jafar weaves Middle Eastern influences with electronic beats for a truly global dance experience. Their sets blend traditional instruments and melodies with contemporary production techniques, creating a bridge between cultural traditions and modern dance music.

      With a deep knowledge of both Middle Eastern musical traditions and electronic genres, Jafar creates unique sonic fusions that transport listeners across time and space.`,
      genres: ["World Music", "Ethnic Electronic", "Desert Tech"],
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
