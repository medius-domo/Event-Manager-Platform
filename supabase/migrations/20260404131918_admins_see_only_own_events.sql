/*
  # Admins See Only Their Own Events

  1. Changes
    - Allow all authenticated users (admins) to create events
    - Allow authenticated users to view only their own events
    - Keep policies for update/delete to only own events
    - Keep public policy for viewing active events

  2. Security
    - Authenticated users can create any event
    - Authenticated users can only view their own events (created_by = auth.uid())
    - Authenticated users can only update/delete their own events
    - Public users can only view active events
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view all events" ON events;

-- Allow authenticated users to view only their own events
CREATE POLICY "Authenticated users can view own events"
  ON events FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);