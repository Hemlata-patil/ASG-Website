import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { galleryAlbums } from './gallery_albums';

export const eventStatusEnum = pgEnum('event_status', ['draft', 'upcoming', 'past']);

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  scheduledDate: timestamp('scheduled_date', { withTimezone: true }).notNull(),
  venue: text('venue').notNull(),
  status: eventStatusEnum('status').default('draft').notNull(),
  tags: text('tags').array(), // Text array for tags
  thumbnailUrl: text('thumbnail_url').notNull(),
  description: text('description').notNull(),
  galleryAlbumId: uuid('gallery_album_id').references(() => galleryAlbums.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
