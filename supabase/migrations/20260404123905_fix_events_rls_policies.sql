/*
  # Fix RLS Policies for Events Table

  1. Changes
    - Add policy to allow authenticated users to view ALL events (not just their own)
    - This allows admins to see all events in the dashboard
    - Keep existing policies for create/update/delete (users can only modify their own)
    - Keep public policy for viewing active events

  2. Security
    - Authenticated users can view all events (needed for admin dashboard)
    - Authenticated users can only create/update/delete their own events
    - Public users can only view active events
*/

-- Drop the restrictive policy that only allows admins to view their own events
DROP POLICY IF EXISTS "Admins can view their own events" ON events;

-- Add a new policy that allows authenticated users to view all events
CREATE POLICY "Authenticated users can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (true);
