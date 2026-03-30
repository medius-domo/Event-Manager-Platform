/*
  # Add Poster URL Column to Events Table

  1. Changes
    - Add `poster_url` column to `events` table
      - `poster_url` (text, nullable) - URL to the event poster image stored in Supabase Storage
    
  2. Notes
    - Column is nullable to support existing events without posters
    - Will store public URLs from Supabase Storage bucket
*/

-- Add poster_url column to events table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'poster_url'
  ) THEN
    ALTER TABLE events ADD COLUMN poster_url text;
  END IF;
END $$;