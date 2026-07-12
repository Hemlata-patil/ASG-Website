import React from 'react';
import EventsList from './EventsList';
import { createClient as createServerSupabase } from '@/lib/supabase/server';

// Server component: fetch events and gallery entries from Supabase
export default async function EventsPage() {
  let events = [];
  let galleryEntries = [];

  try {
    const supabase = await createServerSupabase();

    const { data: evtData, error: evtErr } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: false });

    if (!evtErr && evtData) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      events = evtData.map((e: any) => {
        let computedStatus = e.status || 'upcoming';
        if (e.start_date) {
          const eventDate = new Date(e.start_date);
          eventDate.setHours(0, 0, 0, 0);
          if (eventDate < today) {
            computedStatus = 'past';
          } else if (eventDate.getTime() === today.getTime()) {
            computedStatus = 'upcoming';
          } else {
            computedStatus = 'upcoming';
          }
        }
        if (e.status === 'completed') computedStatus = 'past';

        return {
          id: e.id,
          title: e.title,
          type: e.type || 'Meetup',
          status: computedStatus,
          date: e.start_date ? e.start_date.slice(0, 10) : '',
          venue: e.location || '',
          description: e.description || '',
          tags: e.tags || [],
          thumbnail: e.cover_image_url || '',
          registrationUrl: null,
          recapUrl: null,
        };
      });
    }

    const { data: galData, error: galErr } = await supabase
      .from('gallery_albums')
      .select('id, title, description, cover_photo, event_date, gallery_photos(id, image_url, display_order)')
      .order('event_date', { ascending: false });

    if (!galErr && galData) {
      galleryEntries = galData.map((entry) => ({
        id: entry.id,
        title: entry.title,
        description: entry.description,
        photos: (entry.gallery_photos || [])
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .map((photo: any) => photo.image_url),
        coverPhoto: entry.cover_photo,
        date: entry.event_date ? String(entry.event_date).slice(0, 10) : null,
        year: entry.event_date ? String(entry.event_date).slice(0, 4) : '2026',
        event_id: entry.event_id || null
      }));
    }
  } catch (e) {
    console.error('Error fetching events/gallery from Supabase:', e);
  }

  return <EventsList events={events} galleryEntries={galleryEntries} />;
}
