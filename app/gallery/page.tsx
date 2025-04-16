import Image from "next/image"
import { Card } from "@/components/ui/card"

export default function GalleryPage() {
  const galleryImages = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC5032-Edit-Edit.jpg-jnWKGPY2GIod00CudfBfuZySNwNUEc.jpeg",
      alt: "Night Church Logo Art",
      caption: "Night Church psychedelic art featuring desert rave scene",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4768-Enhanced-NR.jpg-v8qaynDkSBKv5IlQ6j8oSOYHzK9kKe.jpeg",
      alt: "DJs performing at Night Church",
      caption: "DJs performing at a Night Church desert event",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4783-Enhanced-NR.jpg-NJG89yvWqrZvXV0CX1DwQfa7N0E7jO.jpeg",
      alt: "DJ booth with projection mapping",
      caption: "EMOTEP DJ booth with custom projection mapping",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4807.jpg-nyZ2SJh0HL1fUXcswUxxHbXOQYP0po.jpeg",
      alt: "Geometric light display",
      caption: "Geometric light display and projection mapping",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4802.jpg-ILujqjKflaTGSnYqbqMTQwwpOTexQy.jpeg",
      alt: "Desert gathering",
      caption: "Night Church desert gathering with light installations",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4723.jpg-xrR1QxvyBaP50VRmZU922NnyPVNm1l.jpeg",
      alt: "Inflatable castle with lights",
      caption: "Illuminated inflatable castle installation",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC5255.jpg-dZn9uQpEwwIYID3TIYExaKVAzzSo9u.jpeg",
      alt: "Daytime desert DJ setup",
      caption: "Daytime desert DJ setup at Night Church",
    },
  ]

  return (
    <div className="container py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center glow-text">Gallery</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Explore the visual journey of Night Church events in the Southern California desert
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryImages.map((image, index) => (
          <Card key={index} className="overflow-hidden bg-black/50 border border-purple-900/50 group">
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
        ))}
      </div>
    </div>
  )
}
