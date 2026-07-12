import HomePage from './HomePage';
import { createClient as createServerSupabase } from '@/lib/supabase/server';

export default async function Page() {
  let events = [];
  let galleryEntries = [];
  let blogs = [];

  try {
    const supabase = await createServerSupabase();

    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: false });

    if (!eventError && eventData) {
      events = eventData.map((event: any) => ({
        ...event,
        id: String(event.id),
        date: event.start_date
          ? new Date(event.start_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '',
        thumbnail: event.cover_image_url || '',
      }));
    }

    const { data: galData, error: galError } = await supabase
      .from('gallery_albums')
      .select('id, title, description, cover_photo, event_date, tags, gallery_photos(id, image_url, display_order)')
      .order('event_date', { ascending: false });

    if (!galError && galData) {
      galleryEntries = galData.map((entry: any) => ({
        id: String(entry.id),
        title: entry.title,
        description: entry.description || '',
        date: entry.event_date
          ? new Date(entry.event_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '',
        photos: (entry.gallery_photos || [])
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .map((photo: any) => photo.image_url),
        tags: entry.tags || [],
      }));
    }

    const { data: blogData, error: blogError } = await supabase
      .from('blogs')
      .select('id, title, slug, category, excerpt, cover_image, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (!blogError && blogData) {
      blogs = blogData.map((post: any) => ({
        ...post,
        id: String(post.id),
        cover: post.cover_image,
        date: post.published_at
          ? new Date(post.published_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '',
        readTime: Math.ceil((post.excerpt?.split(' ').length || 0) / 200) + ' min read',
      }));
    }
  } catch (error) {
    console.error('Error loading homepage data from Supabase:', error);
  }

  return <HomePage events={events} galleryEntries={galleryEntries} blogs={blogs} />;
}
