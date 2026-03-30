/*
  # Event Registration Platform Schema

  1. New Tables
    - `events`
      - `id` (uuid, primary key) - Unique event identifier
      - `title` (text) - Event title
      - `description` (text) - Event description
      - `event_date` (timestamptz) - When the event occurs
      - `location` (text) - Event location
      - `status` (text) - Event status (active/closed)
      - `slug` (text, unique) - Unique shareable identifier for the event URL
      - `created_by` (uuid) - References auth.users (admin who created it)
      - `created_at` (timestamptz) - When the event was created
    
    - `registrations`
      - `id` (uuid, primary key) - Unique registration identifier
      - `event_id` (uuid) - References events table
      - `name` (text) - Registrant name
      - `email` (text) - Registrant email
      - `phone` (text) - Registrant phone number
      - `created_at` (timestamptz) - When the registration was submitted

  2. Security
    - Enable RLS on both tables
    - Events policies:
      - Authenticated users (admins) can create, read, update their own events
      - Public users can read active events by slug
    - Registrations policies:
      - Authenticated users (admins) can read all registrations for their events
      - Public users can insert registrations for active events
      - Public users can read their own registration (for confirmation)
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_date timestamptz NOT NULL,
  location text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  slug text UNIQUE NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Events policies

-- Authenticated users can view their own events
CREATE POLICY "Admins can view their own events"
  ON events FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

-- Authenticated users can create events
CREATE POLICY "Admins can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Authenticated users can update their own events
CREATE POLICY "Admins can update their own events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Authenticated users can delete their own events
CREATE POLICY "Admins can delete their own events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Public users can view active events by slug (for registration page)
CREATE POLICY "Public can view active events"
  ON events FOR SELECT
  TO anon
  USING (status = 'active');

-- Registrations policies

-- Authenticated users can view all registrations for their events
CREATE POLICY "Admins can view registrations for their events"
  ON registrations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = registrations.event_id
      AND events.created_by = auth.uid()
    )
  );

-- Public users can register for active events
CREATE POLICY "Public can register for active events"
  ON registrations FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_id
      AND events.status = 'active'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);