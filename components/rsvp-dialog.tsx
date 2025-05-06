"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Event } from "@/lib/events"
import { RsvpForm } from "./rsvp-form"

interface RsvpDialogProps {
  event: Event
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function RsvpDialog({ event, isOpen, onOpenChange }: RsvpDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border border-purple-900/50 text-white sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl mb-2">RSVP to {event.title}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill out the form below to reserve your spot at this event.
          </DialogDescription>
        </DialogHeader>
        
        <RsvpForm 
          eventSlug={event.slug} 
          eventTitle={event.title}
          onSuccess={() => {
            // Close dialog after a delay to show the success message
            setTimeout(() => {
              onOpenChange(false)
            }, 3000)
          }} 
        />
      </DialogContent>
    </Dialog>
  )
}