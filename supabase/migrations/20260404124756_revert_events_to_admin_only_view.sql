/*
  # Revert Events to Admin-Only View

  1. Changes
    - Revert to original policy: admins can only view their own events
    - Remove policy that allows viewing all events
    - Keep existing policies for create/update/delete (users can only modify their own)
    - Keep public policy for viewing active events

  2. Security
    - Authenticated users can only view their own events
    - Authenticated users can only create/update/delete their own events
    - Public users can only view active events
*/

-- Drop the policy that allows viewing all events
DROP POLICY IF EXISTS "Authenticated users can view all events" ON events;

-- Restore the original policy that only allows admins to view their own events
CREATE POLICY "Admins can view their own events"
  ON events FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);