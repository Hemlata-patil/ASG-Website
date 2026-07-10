import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { internApplications } from '@/lib/db/schema/intern_applications';
<<<<<<< HEAD
=======
import { interns } from '@/lib/db/schema/interns';

>>>>>>> origin/main
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

<<<<<<< HEAD
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

    // 1. Check for existing duplicates in intern_applications
    const conditions = [
      eq(internApplications.email, email),
      eq(internApplications.phone, phone),
      eq(internApplications.linkedinUrl, linkedin),
    ];

    if (github && github.trim() !== '') {
      conditions.push(eq(internApplications.githubUrl, github));
    }

    const existingApp = await db
      .select()
      .from(internApplications)
      .where(or(...conditions))
      .limit(1);

    if (existingApp.length > 0) {
      const record = existingApp[0];
      let duplicateField = 'application details';
      if (record.email.toLowerCase() === email.toLowerCase()) duplicateField = 'Email Address';
      else if (record.phone === phone) duplicateField = 'Phone Number';
      else if (record.linkedinUrl?.toLowerCase() === linkedin.toLowerCase()) duplicateField = 'LinkedIn Profile';
      else if (record.githubUrl && github && record.githubUrl.toLowerCase() === github.toLowerCase()) duplicateField = 'GitHub Link';

      return NextResponse.json(
        { error: { code: 'DUPLICATE_ERROR', message: `An internship application with this ${duplicateField} already exists.` } },
        { status: 400 }
      );
    }

    // 2. Check for duplicates in active/completed interns
    const internConditions = [
      eq(interns.email, email),
      eq(interns.phone, phone),
      eq(interns.linkedinUrl, linkedin),
    ];

    if (github && github.trim() !== '') {
      internConditions.push(eq(interns.githubUrl, github));
    }

    const existingIntern = await db
      .select()
      .from(interns)
      .where(or(...internConditions))
      .limit(1);

    if (existingIntern.length > 0) {
      const record = existingIntern[0];
      let duplicateField = 'intern details';
      if (record.email && record.email.toLowerCase() === email.toLowerCase()) duplicateField = 'Email Address';
      else if (record.phone && record.phone === phone) duplicateField = 'Phone Number';
      else if (record.linkedinUrl && record.linkedinUrl.toLowerCase() === linkedin.toLowerCase()) duplicateField = 'LinkedIn Profile';
      else if (record.githubUrl && github && record.githubUrl.toLowerCase() === github.toLowerCase()) duplicateField = 'GitHub Link';

      return NextResponse.json(
        { error: { code: 'DUPLICATE_ERROR', message: `An active or completed intern with this ${duplicateField} is already registered.` } },
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
