import GalleryPage from './GalleryPage';
import { createClient as createServerSupabase } from '@/lib/supabase/server';

export default async function Page() {
  let entries = [];

  try {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from('gallery_albums')
      .select('id, title, description, cover_photo, event_date, gallery_photos(id, image_url, display_order)')
      .order('event_date', { ascending: false });

    if (!error && data) {
      entries = data.map((entry: any) => ({
        id: String(entry.id),
        title: entry.title,
        description: entry.description || '',
        coverPhoto: entry.cover_photo,
        eventDate: entry.event_date ? String(entry.event_date).slice(0, 10) : (entry.created_at ? String(entry.created_at).slice(0, 10) : ''),
        tags: entry.tags || [],
        photos: (entry.gallery_photos || [])
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .map((photo: any) => photo.image_url),
      }));
    }
  } catch (error) {
    console.error('Error loading gallery entries from Supabase:', error);
  }

  return <GalleryPage entries={entries} />;
}
