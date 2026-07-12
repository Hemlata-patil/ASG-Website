import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Disable prefetch as recommended for serverless environments / poolers like Supabase connection pooler
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
