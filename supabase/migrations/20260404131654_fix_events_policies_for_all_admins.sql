/*
  # Fix Events Policies for All Admins

  1. Changes
    - Allow all authenticated users (admins) to create events
    - Allow all authenticated users (admins) to view all events
    - Keep policies for update/delete to only own events
    - Keep public policy for viewing active events

  2. Security
    - Authenticated users can create any event
    - Authenticated users can view all events
    - Authenticated users can only update/delete their own events
    - Public users can only view active events
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can create events" ON events;
DROP POLICY IF EXISTS "Admins can view their own events" ON events;

-- Allow all authenticated users to create events
CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow all authenticated users to view all events
CREATE POLICY "Authenticated users can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (true);