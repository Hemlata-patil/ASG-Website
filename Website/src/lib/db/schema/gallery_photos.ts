import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { galleryAlbums } from './gallery_albums';

export const galleryPhotos = pgTable('gallery_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  albumId: uuid('album_id').references(() => galleryAlbums.id, { onDelete: 'cascade' }).notNull(),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),
  displayOrder: integer('display_order').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
