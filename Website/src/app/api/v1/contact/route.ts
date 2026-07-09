import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactQueries } from '@/lib/db/schema/contact_queries';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message, role } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Name, email, and message are required' } },
        { status: 400 }
      );
    }

    // Map phone and role context into the subject field required by the database schema
    const subject = `${role || 'General'} Inquiry (${phone || 'No phone'})`;

    const [newQuery] = await db.insert(contactQueries).values({
      name,
      email,
      subject,
      message,
      status: 'pending'
    }).returning();

    return NextResponse.json(
      { success: true, data: newQuery },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Failed to save contact query:', err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: err.message || 'Failed to submit contact query' } },
      { status: 500 }
    );
  }
}
