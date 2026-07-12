import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactQueries } from '@/lib/db/schema/contact_queries';
import { desc } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'You must be logged in to view queries' } },
        { status: 401 }
      );
    }

    const queries = await db
      .select()
      .from(contactQueries)
      .orderBy(desc(contactQueries.createdAt));

    return NextResponse.json({
      data: queries,
    });
  } catch (err: any) {
    console.error('Failed to fetch contact queries for admin:', err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: err.message || 'Failed to fetch contact queries' } },
      { status: 500 }
    );
  }
}
