import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const merchItems = [
  {
    id: "tshirt-1",
    name: "Night Church Logo Tee",
    price: 25,
    image: "/placeholder.svg?height=300&width=300",
    category: "clothing",
    description: "Black t-shirt with psychedelic Night Church logo print.",
  },
  {
    id: "tshirt-2",
    name: "Desert Rave Tee",
    price: 25,
    image: "/placeholder.svg?height=300&width=300",
    category: "clothing",
    description: "Black t-shirt with desert rave scene print in UV reactive ink.",
  },
  {
    id: "hoodie-1",
    name: "Night Church Hoodie",
    price: 45,
    image: "/placeholder.svg?height=300&width=300",
    category: "clothing",
    description: "Black hoodie with embroidered Night Church logo.",
  },
  {
    id: "poster-1",
    name: "Desert Awakening Poster",
    price: 15,
    image: "/placeholder.svg?height=300&width=300",
    category: "prints",
    description: '18"x24" poster from our Desert Awakening event.',
  },
  {
    id: "poster-2",
    name: "Night Church Art Print",
    price: 20,
    image: "/placeholder.svg?height=300&width=300",
    category: "prints",
    description: "Limited edition art print featuring Night Church psychedelic artwork.",
  },
  {
    id: "sticker-pack",
    name: "Sticker Pack",
    price: 10,
    image: "/placeholder.svg?height=300&width=300",
    category: "accessories",
    description: "Pack of 5 vinyl stickers featuring Night Church designs.",
  },
  {
    id: "tote-bag",
    name: "Night Church Tote",
    price: 15,
    image: "/placeholder.svg?height=300&width=300",
    category: "accessories",
    description: "Canvas tote bag with Night Church logo print.",
  },
  {
    id: "bandana",
    name: "Psychedelic Bandana",
    price: 12,
    image: "/placeholder.svg?height=300&width=300",
    category: "accessories",
    description: "Colorful bandana with psychedelic pattern, perfect for desert raves.",
  },
]

export default function MerchPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center glow-text">Merchandise</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Support Night Church and take home a piece of the desert rave experience
      </p>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="clothing">Clothing</TabsTrigger>
          <TabsTrigger value="prints">Prints</TabsTrigger>
          <TabsTrigger value="accessories">Accessories</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {merchItems.map((item) => (
              <MerchCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clothing" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {merchItems
              .filter((item) => item.category === "clothing")
              .map((item) => (
                <MerchCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="prints" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {merchItems
              .filter((item) => item.category === "prints")
              .map((item) => (
                <MerchCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="accessories" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {merchItems
              .filter((item) => item.category === "accessories")
              .map((item) => (
                <MerchCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-black/70 border border-purple-900/50 rounded-lg p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">How to Purchase</h2>
        <p className="text-muted-foreground mb-6 text-center">
          Currently, we handle merchandise orders through our contact form. Fill out the form with the items you're
          interested in, and we'll get back to you with payment and shipping details.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700">
            <Link href="/contact" className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Merchandise
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-purple-500 text-purple-300 hover:bg-purple-950/50"
          >
            <Link href="#" className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Visit Our Etsy Shop
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function MerchCard({ item }: { item: (typeof merchItems)[0] }) {
  return (
    <Card className="bg-black/50 border border-purple-900/50 overflow-hidden">
      <div className="relative aspect-square">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold">{item.name}</h3>
        <p className="text-xl font-bold text-pink-500 mb-2">${item.price}</p>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" className="w-full border-purple-500 text-purple-300 hover:bg-purple-950/50">
          <Link href="/contact">Order Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
