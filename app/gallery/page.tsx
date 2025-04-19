import Image from "next/image"
import { Card } from "@/components/ui/card"
import { DancerFigure } from "@/components/dancing-figures"

export default function GalleryPage() {
  const galleryImages: { src: string; alt: string; caption: string }[] = []

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

      {galleryImages.length > 0 ? (
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
      ) : (
        <div className="text-center py-16 bg-black/50 border border-purple-900/50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Gallery Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're curating a collection of images from our events. Check back soon to see the visual journey of Night
            Church.
          </p>
        </div>
      )}
    </div>
  )
}
