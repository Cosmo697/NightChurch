import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TrippinFigure } from "@/components/dancing-figures"

export default function MerchPage() {
  return (
    <div className="container py-12 relative">
      {/* Moved dancing figure to top-left corner */}
      <div className="absolute top-0 left-0 z-0">
        <TrippinFigure delay={900} />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center glow-text">Merchandise</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Support Night Church and take home a piece of the desert rave experience
      </p>

      <div className="text-center py-16 bg-black/50 border border-purple-900/50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Merchandise Coming Soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          We're designing a collection of Night Church merchandise. Check back soon to shop our unique desert
          rave-inspired items.
        </p>
        <Button asChild className="bg-pink-600 hover:bg-pink-700">
          <Link href="/contact" className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Contact for Pre-Orders
          </Link>
        </Button>
      </div>
    </div>
  )
}
