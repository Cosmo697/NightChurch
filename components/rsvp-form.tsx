"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { CalendarPlus, Check, Loader2 } from "lucide-react"

// Define form schema with zod
const rsvpFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  guests: z.number().min(1).max(10, { message: "Maximum 10 guests allowed." }).default(1),
  notes: z.string().max(500, { message: "Notes must be less than 500 characters." }).optional(),
});

// Form values type
type RsvpFormValues = z.infer<typeof rsvpFormSchema>;

// Component props
interface RsvpFormProps {
  eventSlug: string;
  eventTitle: string;
  onSuccess?: () => void;
}

export function RsvpForm({ eventSlug, eventTitle, onSuccess }: RsvpFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Initialize form
  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      guests: 1,
      notes: "",
    },
  });

  // Handle form submission
  async function onSubmit(data: RsvpFormValues) {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      console.log(`Submitting RSVP for event: ${eventSlug}`, data);
      
      const response = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventSlug,
          ...data,
        }),
      });
      
      // Log response status
      console.log(`RSVP API response status: ${response.status}`);
      
      // Get response text first to debug any JSON parsing issues
      const responseText = await response.text();
      console.log(`RSVP API response text:`, responseText);
      
      // Try to parse response as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to create RSVP");
      }
      
      // Show success state
      setIsSuccess(true);
      
      // Show success toast
      toast({
        title: "RSVP Successful!",
        description: `You're confirmed for ${eventTitle}. We've sent a confirmation to your email.`,
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error('RSVP error:', error);
      
      // Set error message for display in the form
      setErrorMessage(error.message || "There was a problem with your RSVP. Please try again.");
      
      // Show error toast
      toast({
        title: "RSVP Failed",
        description: error.message || "There was a problem with your RSVP. Please try again.",
        variant: "destructive",
      });
      
    } finally {
      setIsSubmitting(false);
    }
  }

  // If already successful, show confirmation
  if (isSuccess) {
    return (
      <div className="bg-green-900/20 border border-green-900/50 rounded-lg p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-500 mb-2">You're confirmed!</h3>
        <p className="text-gray-400 mb-4">
          Thank you for your RSVP to {eventTitle}. We've sent a confirmation to your email.
        </p>
        
        <Button 
          asChild 
          variant="outline" 
          className="mt-2 border-green-900/50 text-green-400 hover:bg-green-900/20"
        >
          <a 
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <CalendarPlus className="mr-2 h-4 w-4" /> Add to Calendar
          </a>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {errorMessage && (
          <div className="bg-red-900/20 border border-red-900/50 rounded-md p-3 text-red-400 text-sm">
            {errorMessage}
          </div>
        )}
      
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} className="bg-black/50 border-gray-700" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" {...field} className="bg-black/50 border-gray-700" />
              </FormControl>
              <FormDescription>
                We'll send your confirmation to this email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="guests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Guests</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1} 
                  max={10} 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value))}
                  className="bg-black/50 border-gray-700 w-20" 
                />
              </FormControl>
              <FormDescription>
                Including yourself (max 10)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any special requests or information" 
                  {...field} 
                  className="bg-black/50 border-gray-700 min-h-20" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 text-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Confirm RSVP"
          )}
        </Button>
      </form>
    </Form>
  );
}