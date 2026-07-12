import GalleryPage from './GalleryPage';
import { createClient as createServerSupabase } from '@/lib/supabase/server';

export default async function Page() {
  let entries = [];

  try {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from('gallery_albums')
      .select('id, title, description, cover_photo, event_date, tags, gallery_photos(id, image_url, display_order)')
      .eq('status', 'published')
      .order('event_date', { ascending: false });

    if (!error && data) {
      entries = data.map((entry) => ({
        id: String(entry.id),
        title: entry.title,
        description: entry.description,
        coverPhoto: entry.cover_photo,
        eventDate: entry.event_date ? new Date(entry.event_date).toISOString() : '',
        tags: entry.tags || [],
        photos: (entry.gallery_photos || [])
          .sort((a, b) => a.display_order - b.display_order)
          .map((photo) => photo.image_url),
      }));
    }
  } catch (error) {
    console.error('Error loading gallery entries from Supabase:', error);
  }

  return <GalleryPage entries={entries} />;
}
