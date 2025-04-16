import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VisualArtPage() {
  const projectionMappingWorks = [
    {
      title: "Geometric Dreamscape",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4807.jpg-nyZ2SJh0HL1fUXcswUxxHbXOQYP0po.jpeg",
      description:
        "Projection mapping featuring geometric patterns and vibrant colors on a custom-built DJ booth structure.",
    },
    {
      title: "EMOTEP Visual Experience",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4783-Enhanced-NR.jpg-NJG89yvWqrZvXV0CX1DwQfa7N0E7jO.jpeg",
      description: "Custom projection mapping for EMOTEP featuring psychedelic patterns and animated visuals.",
    },
    {
      title: "Hexagon Portal",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4807.jpg-nyZ2SJh0HL1fUXcswUxxHbXOQYP0po.jpeg",
      description: "Geometric hexagon projection with animated triangular patterns creating a portal effect.",
    },
  ]

  const artInstallations = [
    {
      title: "Neon Castle",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4723.jpg-xrR1QxvyBaP50VRmZU922NnyPVNm1l.jpeg",
      description: "Illuminated inflatable castle with custom lighting design for immersive play spaces.",
    },
    {
      title: "Desert Fire Circle",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC4802.jpg-ILujqjKflaTGSnYqbqMTQwwpOTexQy.jpeg",
      description: "Fire installation with LED lighting and comfortable seating for communal gathering.",
    },
    {
      title: "Night Church Banner",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_DSC5032-Edit-Edit.jpg-jnWKGPY2GIod00CudfBfuZySNwNUEc.jpeg",
      description: "Hand-painted psychedelic banner featuring the Night Church aesthetic and desert imagery.",
    },
  ]

  return (
    <div className="container py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center glow-text">Visual Art & Projection Mapping</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Explore the visual creations and projection mapping work by Mortl and the Night Church collective
      </p>

      <Tabs defaultValue="projection" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="projection">Projection Mapping</TabsTrigger>
          <TabsTrigger value="installations">Art Installations</TabsTrigger>
        </TabsList>

        <TabsContent value="projection" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectionMappingWorks.map((work, index) => (
              <Card key={index} className="bg-black/50 border border-purple-900/50 overflow-hidden">
                <div className="relative aspect-video">
                  <Image src={work.image || "/placeholder.svg"} alt={work.title} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold mb-2">{work.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{work.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="installations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artInstallations.map((installation, index) => (
              <Card key={index} className="bg-black/50 border border-purple-900/50 overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={installation.image || "/placeholder.svg"}
                    alt={installation.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold mb-2">{installation.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{installation.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-black/70 border border-purple-900/50 rounded-lg p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Hire for Projection Mapping</h2>
        <p className="text-muted-foreground mb-6 text-center">
          Interested in custom projection mapping for your event? Mortl is available for hire to create immersive visual
          experiences.
        </p>
        <div className="flex justify-center">
          <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
