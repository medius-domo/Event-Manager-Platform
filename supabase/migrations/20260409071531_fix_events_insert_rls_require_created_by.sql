/*
  # Fix Events INSERT RLS Policy

  1. Changes
    - Drop the permissive INSERT policy that used WITH CHECK (true)
    - Recreate it to require auth.uid() = created_by

  2. Security
    - Ensures every inserted event must have created_by set to the authenticated user's ID
    - Prevents users from inserting events attributed to other users
*/

DROP POLICY IF EXISTS "Authenticated users can create events" ON events;

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);
