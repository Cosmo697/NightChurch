"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RockerFigure } from "@/components/dancing-figures"

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  return (
    <div className="container py-12 relative">
      {/* Moved dancing figure to bottom-right corner */}
      <div className="absolute bottom-0 right-0 z-0">
        <RockerFigure delay={600} />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center glow-text">Contact Us</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Get in touch with Night Church for bookings, merchandise, or general inquiries
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="bg-black/50 border border-purple-900/50">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Reach out to us for any questions or inquiries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Email</h3>
              <p className="text-muted-foreground">info@socalnightchurch.com</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Social Media</h3>
              <p className="text-muted-foreground">@socalnightchurch on Instagram</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Location</h3>
              <p className="text-muted-foreground">Southern California</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border border-purple-900/50">
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you</CardDescription>
          </CardHeader>
          <CardContent>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSeEXVvrQxIvm_KitPSaeb6xz5e_5F7UeqWuTlejMw1yKx3mQw/viewform?embedded=true"
              width="100%"
              height="1024"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              className="w-full"
            >
              Loading…
            </iframe>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
