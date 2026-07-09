import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { internApplications } from '@/lib/db/schema/intern_applications';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Server-side extraction and normalization
    const {
      name,
      email,
      phone,
      college,
      degree,
      year,
      aiToolsUsed,
      linkedin,
      github,
      project,
      notes,
      photoUrl
    } = body;

    // Simple server-side validation
    if (!name || !email || !phone || !college || !degree || !year || !linkedin || !photoUrl) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Insert into Supabase database via Drizzle ORM
    const [newApplication] = await db.insert(internApplications).values({
      fullName: name,
      email,
      phone,
      college,
      branch: degree,
      year,
      skills: aiToolsUsed || '',
      linkedinUrl: linkedin,
      githubUrl: github || null,
      portfolioUrl: null, // Optional for AAL
      resumeUrl: null, // Optional for AAL
      photoUrl: photoUrl || null,
      preferredDomain: project || 'General',
      motivation: notes || '',
      status: 'pending',
    }).returning();

    return NextResponse.json(
      { success: true, data: newApplication },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Failed to create application:', err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: err.message || 'Failed to submit application' } },
      { status: 500 }
    );
  }
}
