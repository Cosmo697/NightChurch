'use server';

import path from 'path';
import { promises as fs } from 'fs';

// Path to events data folder
const eventsDirectory = path.join(process.cwd(), 'data', 'events');

// Define organizer type
export type Organizer = {
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
};

// Helper to ensure the directory exists
async function ensureDirectoryExists() {
  try {
    await fs.mkdir(eventsDirectory, { recursive: true });
  } catch (error) {
    console.error('Error creating directory:', error);
  }
}

// Get all events
export async function getAllEvents(): Promise<Event[]> {
  await ensureDirectoryExists();
  
  try {
    const fileNames = await fs.readdir(eventsDirectory);
    const eventFiles = fileNames.filter(file => file.endsWith('.json'));
    
    const eventsPromises = eventFiles.map(async (fileName) => {
      const fullPath = path.join(eventsDirectory, fileName);
      const fileContents = await fs.readFile(fullPath, 'utf8');
      const parsedEvent = JSON.parse(fileContents) as Event;
      
      // Handle backward compatibility for older events without organizers
      if (!parsedEvent.organizers) {
        parsedEvent.organizers = [{ name: parsedEvent.presentedBy }];
      }
      
      // Handle renamed ticketLink to rsvpLink for backward compatibility
      if (parsedEvent.ticketLink && !parsedEvent.rsvpLink) {
        parsedEvent.rsvpLink = parsedEvent.ticketLink;
      }
      
      return parsedEvent;
    });
    
    return await Promise.all(eventsPromises);
  } catch (error) {
    console.error('Error reading events:', error);
    return [];
  }
}

// Get event by slug
export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const events = await getAllEvents();
    return events.find(event => event.slug === slug) || null;
  } catch (error) {
    console.error('Error getting event by slug:', error);
    return null;
  }
}

// Create or update an event
export async function saveEvent(event: Event): Promise<boolean> {
  await ensureDirectoryExists();
  
  try {
    // Ensure backward compatibility
    if (!event.organizers) {
      event.organizers = [{ name: event.presentedBy }];
    }
    
    // Update presentedBy field for compatibility with older code
    if (event.organizers && event.organizers.length > 0) {
      event.presentedBy = event.organizers.map(o => o.name).join(' & ');
    }
    
    // Handle renamed ticketLink to rsvpLink
    if (event.ticketLink && !event.rsvpLink) {
      event.rsvpLink = event.ticketLink;
    }
    
    const filePath = path.join(eventsDirectory, `${event.slug}.json`);
    await fs.writeFile(filePath, JSON.stringify(event, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving event:', error);
    return false;
  }
}

// Delete an event
export async function deleteEvent(slug: string): Promise<boolean> {
  try {
    const filePath = path.join(eventsDirectory, `${slug}.json`);
    await fs.unlink(filePath);
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