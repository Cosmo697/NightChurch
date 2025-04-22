import Image from "next/image"
import { Card } from "@/components/ui/card"
import { DancerFigure } from "@/components/dancing-figures"

export default function GalleryPage() {
  // Define gallery images
  const galleryImages = [
    { src: "/images/gallery/desert-gathering.jpeg", alt: "Desert Gathering", caption: "Desert Gathering" },
    { src: "/images/gallery/djs-performing.jpeg", alt: "DJs Performing", caption: "DJs Performing" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_03.webp", alt: "Astral Mirage 03", caption: "Astral Mirage 03" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_04.webp", alt: "Astral Mirage 04", caption: "Astral Mirage 04" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_05.webp", alt: "Astral Mirage 05", caption: "Astral Mirage 05" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_07.webp", alt: "Astral Mirage 07", caption: "Astral Mirage 07" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_08.webp", alt: "Astral Mirage 08", caption: "Astral Mirage 08" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_11.webp", alt: "Astral Mirage 11", caption: "Astral Mirage 11" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_13.webp", alt: "Astral Mirage 13", caption: "Astral Mirage 13" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_14.webp", alt: "Astral Mirage 14", caption: "Astral Mirage 14" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_17.webp", alt: "Astral Mirage 17", caption: "Astral Mirage 17" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_18.webp", alt: "Astral Mirage 18", caption: "Astral Mirage 18" },
    { src: "/images/gallery/Gallery_Astral_Mirage_web_21.webp", alt: "Astral Mirage 21", caption: "Astral Mirage 21" },
    { src: "/images/gallery/Gallery_Event_0_01.webp", alt: "Event 01", caption: "Event 01" },
    { src: "/images/gallery/Gallery_Mythos_web_01.webp", alt: "Mythos 01", caption: "Mythos 01" },
    { src: "/images/gallery/Gallery_Mythos_web_03.webp", alt: "Mythos 03", caption: "Mythos 03" },
    { src: "/images/gallery/Gallery_Mythos_web_04.webp", alt: "Mythos 04", caption: "Mythos 04" },
    { src: "/images/gallery/Gallery_Mythos_web_05.webp", alt: "Mythos 05", caption: "Mythos 05" },
    { src: "/images/gallery/Gallery_Mythos_web_06.webp", alt: "Mythos 06", caption: "Mythos 06" },
    { src: "/images/gallery/Gallery_Soma_web_01.webp", alt: "Soma 01", caption: "Soma 01" },
    { src: "/images/gallery/Gallery_Soma_web_02.webp", alt: "Soma 02", caption: "Soma 02" },
    { src: "/images/gallery/Gallery_Soma_web_03.webp", alt: "Soma 03", caption: "Soma 03" },
    { src: "/images/gallery/inflatable-castle.jpeg", alt: "Inflatable Castle", caption: "Inflatable Castle" },
  ]

  return (
    <div className="container py-12 relative">
      {/* Dancing figure in the top-right corner */}
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
                  src={image.src}
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
