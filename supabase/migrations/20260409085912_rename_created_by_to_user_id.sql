/*
  # Rename created_by to user_id on events table

  1. Changes
    - Rename column `created_by` to `user_id` on the `events` table
    - Drop all existing RLS policies that reference `created_by`
    - Recreate all RLS policies using `user_id`

  2. Security
    - All RLS policies are preserved with equivalent logic
    - Authenticated users can only SELECT/UPDATE/DELETE their own events (user_id = auth.uid())
    - Authenticated users can INSERT events where user_id = auth.uid()
    - Anonymous users can only SELECT active events (for registration page)
    - No data is lost; only the column is renamed
*/

-- Rename the column
ALTER TABLE events RENAME COLUMN created_by TO user_id;

-- Drop existing policies that reference the old column name
DROP POLICY IF EXISTS "Admins can view their own events" ON events;
DROP POLICY IF EXISTS "Admins can create events" ON events;
DROP POLICY IF EXISTS "Admins can update their own events" ON events;
DROP POLICY IF EXISTS "Admins can delete their own events" ON events;
DROP POLICY IF EXISTS "Public can view active events" ON events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
DROP POLICY IF EXISTS "Authenticated users can view all events" ON events;
DROP POLICY IF EXISTS "Authenticated users can view own events" ON events;

-- Recreate policies using user_id

CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view active events"
  ON events FOR SELECT
  TO anon
  USING (status = 'active');

-- Update the index name to reflect the new column name
DROP INDEX IF EXISTS idx_events_created_by;
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
