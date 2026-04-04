/*
  # Create Storage Bucket for Event Posters

  1. New Storage Bucket
    - `event-posters` bucket for storing event poster images
    - Public access enabled for viewing posters
    - File size limit: 5MB
    - Allowed MIME types: image/jpeg, image/png, image/webp

  2. Security Policies
    - Anyone can view/download posters (public access)
    - Only authenticated admins can upload posters
    - Only authenticated admins can update/delete posters

  3. Notes
    - Posters are publicly accessible via URL
    - File naming convention: {event-id}-{timestamp}.{ext}
*/

-- Create the event-posters bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-posters',
  'event-posters',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view/download posters
CREATE POLICY "Public can view event posters"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'event-posters');

-- Allow authenticated users to upload posters
CREATE POLICY "Authenticated users can upload event posters"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-posters');

-- Allow authenticated users to update posters
CREATE POLICY "Authenticated users can update event posters"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'event-posters')
  WITH CHECK (bucket_id = 'event-posters');

-- Allow authenticated users to delete posters
CREATE POLICY "Authenticated users can delete event posters"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'event-posters');
