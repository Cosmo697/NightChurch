'use server';

import supabase from './supabase';

// Define organizer type
export type Organizer = {
  id?: number;
  name: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
};

// Create data structure
export type Event = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  image: string;
  badgeText: string;
  badgeColor: string;
  summary: string;
  presentedBy: string; // Kept for backward compatibility
  organizers: Organizer[]; // New field for multiple organizers with social links
  featured: boolean;
  ticketsAvailable?: boolean;
  rsvpLink?: string; // Renamed from ticketLink
  registrationOpens?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Get all events
export async function getAllEvents(): Promise<Event[]> {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }
    
    // Format the events to match our expected type
    const formattedEvents = await Promise.all(events.map(async (event) => {
      // Get organizers for this event
      const { data: organizers, error: organizersError } = await supabase
        .from('event_organizers')
        .select('*')
        .eq('event_id', event.id);
        
      if (organizersError) {
        console.error('Error fetching organizers:', organizersError);
        return null;
      }

      // Convert from snake_case to camelCase
      const formattedEvent: Event = {
        id: event.id,
        slug: event.slug,
        title: event.title,
        subtitle: event.subtitle || '',
        date: event.date,
        time: event.time,
        location: event.location,
        image: event.image || '',
        badgeText: event.badge_text || 'Event',
        badgeColor: event.badge_color || 'bg-purple-600 hover:bg-purple-700',
        summary: event.summary,
        presentedBy: event.presented_by || '',
        organizers: organizers || [],
        featured: event.featured || false,
        ticketsAvailable: event.tickets_available || false,
        rsvpLink: event.rsvp_link || '',
        registrationOpens: event.registration_opens || '',
        createdAt: event.created_at,
        updatedAt: event.updated_at,
      };
      
      // Handle backward compatibility for older events without organizers
      if (!formattedEvent.organizers || formattedEvent.organizers.length === 0) {
        formattedEvent.organizers = [{ name: formattedEvent.presentedBy }];
      }
      
      return formattedEvent;
    }));
    
    // Filter out any null events (in case of errors)
    return formattedEvents.filter(Boolean) as Event[];
  } catch (error) {
    console.error('Error reading events:', error);
    return [];
  }
}

// Get event by slug
export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error fetching event by slug:', error);
      return null;
    }
    
    // Get organizers for this event
    const { data: organizers, error: organizersError } = await supabase
      .from('event_organizers')
      .select('*')
      .eq('event_id', event.id);
      
    if (organizersError) {
      console.error('Error fetching organizers:', organizersError);
      return null;
    }
    
    // Convert from snake_case to camelCase
    const formattedEvent: Event = {
      id: event.id,
      slug: event.slug,
      title: event.title,
      subtitle: event.subtitle || '',
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image || '',
      badgeText: event.badge_text || 'Event',
      badgeColor: event.badge_color || 'bg-purple-600 hover:bg-purple-700',
      summary: event.summary,
      presentedBy: event.presented_by || '',
      organizers: organizers || [],
      featured: event.featured || false,
      ticketsAvailable: event.tickets_available || false,
      rsvpLink: event.rsvp_link || '',
      registrationOpens: event.registration_opens || '',
      createdAt: event.created_at,
      updatedAt: event.updated_at,
    };
    
    // Handle backward compatibility for older events without organizers
    if (!formattedEvent.organizers || formattedEvent.organizers.length === 0) {
      formattedEvent.organizers = [{ name: formattedEvent.presentedBy }];
    }
    
    return formattedEvent;
  } catch (error) {
    console.error('Error getting event by slug:', error);
    return null;
  }
}

// Create or update an event
export async function saveEvent(event: Event): Promise<boolean> {
  try {
    // First check connection to ensure DB is available
    const { data: connectionOk, error: connectionError } = await supabase
      .rpc('check_connection');
      
    if (connectionError || !connectionOk) {
      console.error('Database connection error:', connectionError);
      return false;
    }
    
    // Ensure backward compatibility
    if (!event.organizers) {
      event.organizers = [{ name: event.presentedBy }];
    }
    
    // Update presentedBy field for compatibility with older code
    if (event.organizers && event.organizers.length > 0) {
      event.presentedBy = event.organizers.map(o => o.name).join(' & ');
    }
    
    // Convert from camelCase to snake_case for the database
    const dbEvent = {
      id: event.id,
      slug: event.slug,
      title: event.title,
      subtitle: event.subtitle,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image,
      badge_text: event.badgeText,
      badge_color: event.badgeColor,
      summary: event.summary,
      presented_by: event.presentedBy,
      featured: event.featured,
      tickets_available: event.ticketsAvailable,
      rsvp_link: event.rsvpLink,
      registration_opens: event.registrationOpens,
    };
    
    // Insert or update the event
    const { error: eventError } = await supabase
      .from('events')
      .upsert(dbEvent, { onConflict: 'id' });
    
    if (eventError) {
      console.error('Error saving event:', eventError);
      return false;
    }
    
    // Delete existing organizers (we'll re-add them)
    const { error: deleteError } = await supabase
      .from('event_organizers')
      .delete()
      .eq('event_id', event.id);
    
    if (deleteError) {
      console.error('Error deleting existing organizers:', deleteError);
      return false;
    }
    
    // Add organizers
    if (event.organizers && event.organizers.length > 0) {
      const organizers = event.organizers.map(org => ({
        event_id: event.id,
        name: org.name,
        instagram: org.instagram || null,
        facebook: org.facebook || null,
        twitter: org.twitter || null,
        website: org.website || null,
      }));
      
      const { error: organizersError } = await supabase
        .from('event_organizers')
        .insert(organizers);
      
      if (organizersError) {
        console.error('Error saving organizers:', organizersError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error saving event:', error);
    return false;
  }
}

// Delete an event
export async function deleteEvent(slug: string): Promise<boolean> {
  try {
    // Get the event ID first
    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (fetchError) {
      console.error('Error finding event to delete:', fetchError);
      return false;
    }
    
    // Delete the event (will cascade to organizers because of our FK constraint)
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', event.id);
    
    if (deleteError) {
      console.error('Error deleting event:', deleteError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    return false;
  }
}

// Initialize with default events if none exist
export async function initializeDefaultEvents(): Promise<void> {
  const events = await getAllEvents();
  
  // Only initialize if no events exist
  if (events.length === 0) {
    const defaultEvents: Event[] = [
      {
        id: "reconnect-and-rise",
        slug: "reconnect-and-rise",
        title: "RECONNECT & RISE",
        subtitle: "A Night to Celebrate Our Community",
        date: "June 21-22, 2025",
        time: "Saturday 4 PM - Sunday 7 AM",
        location: "Skydive Lake Elsinore, 20701 Cereal St, Lake Elsinore, CA 92530",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ecoshire-9roBa65uiHaXls0a60XoaDKCuyHMvw.webp",
        badgeText: "Camping Event",
        badgeColor: "bg-pink-600 hover:bg-pink-700",
        summary: "Join us for an overnight desert gathering where we'll dance with our shadows, ground in our truth, and rise in our light, together.",
        presentedBy: "Risk2Rebirth & Night Church",
        organizers: [
          { name: "Risk2Rebirth", instagram: "Risk2Rebirth" },
          { name: "Night Church", instagram: "socalnightchurch" }
        ],
        featured: true,
        ticketsAvailable: true,
        rsvpLink: "https://example.com/tickets/reconnect-rise",
        registrationOpens: "June 1, 2025",
      },
      {
        id: "summer-solstice",
        slug: "summer-solstice",
        title: "SUMMER SOLSTICE",
        subtitle: "Urban Dance Night",
        date: "July 19, 2025",
        time: "9 PM - 5 AM",
        location: "Downtown Los Angeles",
        image: "/images/cover/night-church-urban-dance.webp",
        badgeText: "Urban Dance",
        badgeColor: "bg-purple-600 hover:bg-purple-700",
        summary: "An immersive urban dance experience celebrating the peak of summer energy in the heart of the city.",
        presentedBy: "Night Church",
        organizers: [
          { name: "Night Church", instagram: "socalnightchurch" }
        ],
        featured: false,
        ticketsAvailable: false,
        registrationOpens: "June 15, 2025",
      },
      {
        id: "autumn-equinox",
        slug: "autumn-equinox",
        title: "AUTUMN EQUINOX",
        subtitle: "Balance & Release",
        date: "September 21, 2025",
        time: "6 PM - 2 AM",
        location: "Secret Forest Location",
        image: "/images/cover/autumn-ceremony.webp",
        badgeText: "Ceremony",
        badgeColor: "bg-amber-600 hover:bg-amber-700",
        summary: "A forest ceremony marking the transition to autumn with fire rituals, sound healing, and conscious dance.",
        presentedBy: "Night Church & Forest Collective",
        organizers: [
          { name: "Night Church", instagram: "socalnightchurch" },
          { name: "Forest Collective", instagram: "forestcollective" }
        ],
        featured: false,
        ticketsAvailable: false,
        registrationOpens: "July 1, 2025",
      }
    ];
    
    // Save each default event
    for (const event of defaultEvents) {
      await saveEvent(event);
    }
  }
}