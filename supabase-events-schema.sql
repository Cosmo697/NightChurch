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