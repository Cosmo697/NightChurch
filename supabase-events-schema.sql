-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT,
  badge_text TEXT,
  badge_color TEXT,
  summary TEXT NOT NULL,
  presented_by TEXT,
  featured BOOLEAN DEFAULT false,
  tickets_available BOOLEAN DEFAULT false,
  rsvp_link TEXT,
  registration_opens TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create organizers table for event organizers
CREATE TABLE IF NOT EXISTS event_organizers (
  id SERIAL PRIMARY KEY,
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  instagram TEXT,
  facebook TEXT,
  twitter TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on event_id for faster queries
CREATE INDEX IF NOT EXISTS idx_event_organizers_event_id ON event_organizers(event_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to update the updated_at column on update
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RSVP table to the existing schema

-- Create RSVPs table to track event attendees
CREATE TABLE IF NOT EXISTS public.rsvps (
    id SERIAL PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    guests INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlisted')),
    notes TEXT
);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS rsvp_event_id_idx ON public.rsvps (event_id);
CREATE INDEX IF NOT EXISTS rsvp_email_idx ON public.rsvps (email);

-- Add RLS (Row Level Security) policies for RSVPs
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserting by anyone (for public RSVPs)
CREATE POLICY "Allow public RSVP creation" ON public.rsvps
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create policy for admins to view all RSVPs
CREATE POLICY "Allow admin to view all RSVPs" ON public.rsvps
    FOR SELECT
    TO authenticated
    USING (true);
    
-- Create a function to get RSVP count for an event
CREATE OR REPLACE FUNCTION public.get_event_rsvp_count(event_id TEXT)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.rsvps WHERE event_id = $1 AND status = 'confirmed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if an email has already RSVP'd for an event
CREATE OR REPLACE FUNCTION public.has_rsvp_for_event(event_id TEXT, email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.rsvps WHERE event_id = $1 AND email = $2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;