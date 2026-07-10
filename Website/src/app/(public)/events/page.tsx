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
      .select('id, title, scheduled_date, venue, status, tags, thumbnail_url, description, recap_url')
      .order('scheduled_date', { ascending: false });

    if (!evtErr && evtData) {
      events = evtData.map((event) => ({
        ...event,
        date: event.scheduled_date ? new Date(event.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
        thumbnail: event.thumbnail_url,
      }));
    }

    const { data: galData, error: galErr } = await supabase
      .from('gallery_albums')
      .select('id, title, description, cover_photo, event_date, gallery_photos(id, image_url, display_order)')
      .eq('status', 'published')
      .order('event_date', { ascending: false });

    if (!galErr && galData) {
      galleryEntries = galData.map((entry) => ({
        ...entry,
        photos: (entry.gallery_photos || [])
          .sort((a, b) => a.display_order - b.display_order)
          .map((photo) => photo.image_url),
        coverPhoto: entry.cover_photo,
        date: entry.event_date ? new Date(entry.event_date).toISOString() : null,
      }));
    }
  } catch (e) {
    console.error('Error fetching events/gallery from Supabase:', e);
  }

  return <EventsList events={events} galleryEntries={galleryEntries} />;
}
