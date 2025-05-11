import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VisualArtPage() {
  const projectionMappingWorks: { title: string; image: string; description: string }[] = []
  const artInstallations: { title: string; image: string; description: string }[] = []

  return (
    <div className="container py-12 relative">
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
          {projectionMappingWorks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Projection mapping works would be mapped here */}
            </div>
          ) : (
            <div className="text-center py-16 bg-black/50 border border-purple-900/50 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Projection Mapping Portfolio Coming Soon</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're preparing a showcase of our projection mapping work. Check back soon to see our visual creations.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="installations" className="mt-6">
          {artInstallations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Art installations would be mapped here */}
            </div>
          ) : (
            <div className="text-center py-16 bg-black/50 border border-purple-900/50 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Art Installations Gallery Coming Soon</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're documenting our art installations from past events. Check back soon to explore our creations.
              </p>
            </div>
          )}
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
