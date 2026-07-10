import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { internApplications } from '@/lib/db/schema/intern_applications';
import { eq, or } from 'drizzle-orm';

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

    // Check for duplicate application credentials
    const duplicateChecks = [];
    if (email) duplicateChecks.push(eq(internApplications.email, email));
    if (phone) duplicateChecks.push(eq(internApplications.phone, phone));
    if (linkedin) duplicateChecks.push(eq(internApplications.linkedinUrl, linkedin));
    if (github) duplicateChecks.push(eq(internApplications.githubUrl, github));
    if (photoUrl) duplicateChecks.push(eq(internApplications.photoUrl, photoUrl));

    if (duplicateChecks.length > 0) {
      const existing = await db
        .select()
        .from(internApplications)
        .where(or(...duplicateChecks));

      if (existing.length > 0) {
        const record = existing[0];
        let message = 'An application with similar credentials has already been submitted.';
        
        if (record.email === email) {
          message = 'An application with this email address has already been submitted.';
        } else if (record.phone === phone) {
          message = 'An application with this phone number has already been submitted.';
        } else if (record.linkedinUrl === linkedin) {
          message = 'An application with this LinkedIn profile has already been submitted.';
        } else if (github && record.githubUrl === github) {
          message = 'An application with this GitHub profile has already been submitted.';
        } else if (photoUrl && record.photoUrl === photoUrl) {
          message = 'An application with this photo has already been submitted.';
        }

        return NextResponse.json(
          { error: { code: 'DUPLICATE_ERROR', message } },
          { status: 400 }
        );
      }
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
