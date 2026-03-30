/*
  # Add Custom Form Fields Support

  1. New Tables
    - `event_fields`
      - `id` (uuid, primary key) - Unique field identifier
      - `event_id` (uuid, foreign key) - References events table
      - `label` (text) - Field label displayed to users
      - `field_type` (text) - Type of field (text, number, dropdown, checkbox)
      - `required` (boolean) - Whether field is required
      - `options` (jsonb) - Options for dropdown fields
      - `order_index` (integer) - Display order of the field
      - `created_at` (timestamptz) - When the field was created

  2. Changes to existing tables
    - Add `custom_responses` (jsonb) column to `registrations` table
      - Stores user responses to custom fields as key-value pairs

  3. Security
    - Enable RLS on `event_fields` table
    - Authenticated users can create/read/update/delete fields for their events
    - Public users can read fields for active events
    - Custom responses are stored with registrations
*/

-- Create event_fields table
CREATE TABLE IF NOT EXISTS event_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  label text NOT NULL,
  field_type text NOT NULL,
  required boolean DEFAULT false,
  options jsonb DEFAULT '[]'::jsonb,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add custom_responses column to registrations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'registrations' AND column_name = 'custom_responses'
  ) THEN
    ALTER TABLE registrations ADD COLUMN custom_responses jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Enable RLS on event_fields
ALTER TABLE event_fields ENABLE ROW LEVEL SECURITY;

-- Event fields policies

-- Authenticated users can view fields for their own events
CREATE POLICY "Admins can view fields for their events"
  ON event_fields FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_fields.event_id
      AND events.created_by = auth.uid()
    )
  );

-- Authenticated users can create fields for their events
CREATE POLICY "Admins can create fields for their events"
  ON event_fields FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_id
      AND events.created_by = auth.uid()
    )
  );

-- Authenticated users can update fields for their events
CREATE POLICY "Admins can update fields for their events"
  ON event_fields FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_fields.event_id
      AND events.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_id
      AND events.created_by = auth.uid()
    )
  );

-- Authenticated users can delete fields for their events
CREATE POLICY "Admins can delete fields for their events"
  ON event_fields FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_fields.event_id
      AND events.created_by = auth.uid()
    )
  );

-- Public users can view fields for active events
CREATE POLICY "Public can view fields for active events"
  ON event_fields FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_fields.event_id
      AND events.status = 'active'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_fields_event_id ON event_fields(event_id);
CREATE INDEX IF NOT EXISTS idx_event_fields_order ON event_fields(event_id, order_index);