import Image from "next/image"
import { Card } from "@/components/ui/card"
import { DancerFigure } from "@/components/dancing-figures"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GalleryPage() {
  const galleryImages = [
    {
      src: "/images/gallery/Mortl_Profile.webp",
      alt: "Mortl - Founder & Resident DJ",
      caption: "Mortl - Founder & Resident DJ",
      category: "djs",
    },
    {
      src: "/images/gallery/Madmanski.webp",
      alt: "Madmanski - Co-Founder & Resident DJ",
      caption: "Madmanski - Co-Founder & Resident DJ",
      category: "djs",
    },
    {
      src: "/images/gallery/K-lala.webp",
      alt: "K~lala - Resident DJ",
      caption: "K~lala - Resident DJ",
      category: "djs",
    },
    {
      src: "/images/gallery/Emotep.webp",
      alt: "Emotep - Guest DJ",
      caption: "Emotep - Guest DJ",
      category: "djs",
    },
    {
      src: "/images/gallery/Metaperspective.webp",
      alt: "Metaperspective - Resident DJ",
      caption: "Metaperspective - Resident DJ",
      category: "djs",
    },
    {
      src: "/images/gallery/Sepia.webp",
      alt: "Sepia - Resident DJ",
      caption: "Sepia - Resident DJ",
      category: "djs",
    },
    {
      src: "/images/gallery/lil_caca_floja.webp",
      alt: "lil caca floja - Resident DJ",
      caption: "lil caca floja - Resident DJ",
      category: "djs",
    },
    {
      src: "/images/gallery/Fungus_Amongus.jpeg",
      alt: "Fungus Amongus - Resident DJ",
      caption: "Fungus Amongus - Resident DJ",
      category: "djs",
    },
    {
      src: "/images/gallery/Jafar.webp",
      alt: "Jafar - Guitarist",
      caption: "Jafar - Guitarist",
      category: "djs",
    },
  ]

  // Filter images by category
  const djImages = galleryImages.filter((img) => img.category === "djs")
  const eventImages = galleryImages.filter((img) => img.category === "events")
  const artImages = galleryImages.filter((img) => img.category === "art")

  return (
    <div className="container py-12 relative">
      {/* Moved dancing figure to top-right corner */}
      <div className="absolute top-0 right-0 z-0">
        <DancerFigure delay={800} />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center glow-text">Gallery</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Explore the visual journey of Night Church events in the Southern California desert
      </p>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="djs">DJs</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="art">Art</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <GalleryCard key={index} image={image} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="djs" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {djImages.map((image, index) => (
              <GalleryCard key={index} image={image} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          {eventImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventImages.map((image, index) => (
                <GalleryCard key={index} image={image} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-black/50 border border-purple-900/50 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Event Photos Coming Soon</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're curating photos from our recent events. Check back soon to see more.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="art" className="mt-6">
          {artImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artImages.map((image, index) => (
                <GalleryCard key={index} image={image} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-black/50 border border-purple-900/50 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Art Installations Coming Soon</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're documenting our art installations from past events. Check back soon to explore our creations.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function GalleryCard({ image }: { image: { src: string; alt: string; caption: string } }) {
  return (
    <Card className="overflow-hidden bg-black/50 border border-purple-900/50 group">
      <div className="relative aspect-square">
        <Image
          src={image.src || "/placeholder.svg"}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-3 text-sm text-center text-muted-foreground">{image.caption}</div>
    </Card>
  )
}