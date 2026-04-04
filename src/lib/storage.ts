import { supabase } from './supabase';

const BUCKET_NAME = 'event-posters';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadEventPoster(file: File, eventSlug: string): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be less than 5MB');
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPG, PNG, and WebP images are allowed');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${eventSlug}-${Date.now()}.${fileExt}`;
  const filePath = `posters/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteEventPoster(posterUrl: string): Promise<void> {
  try {
    const urlParts = posterUrl.split(`/${BUCKET_NAME}/`);
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];

    await supabase.storage.from(BUCKET_NAME).remove([filePath]);
  } catch (error) {
    console.error('Error deleting poster:', error);
  }
}
