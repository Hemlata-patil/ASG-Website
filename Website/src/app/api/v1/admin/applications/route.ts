import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { internApplications } from '@/lib/db/schema/intern_applications';
import { desc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    // Fetch all intern applications, newest first
    const applications = await db
      .select()
      .from(internApplications)
      .orderBy(desc(internApplications.createdAt));

    // Return the response directly
    return NextResponse.json({
      data: applications,
    });
  } catch (err: any) {
    console.error('Failed to fetch applications for admin:', err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: err.message || 'Failed to fetch applications' } },
      { status: 500 }
    );
  }
}
