import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communityMemberApplications } from '@/lib/db/schema/community_member_applications';
import { eq, or } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const {
      name,
      email,
      phone,
      role, // 'founders' | 'mentors' | 'investors' | 'service-providers' | 'other'
      company,
      companyWebsite,
      socialLinks, // string[]
      description, // maps to expertise
      photoUrl,
      otherRoleDetails
    } = body;

    // Server-side validation
    if (!name || !email || !phone || !company || !role || !description) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Map dropdown role to database applicantType enum
    let applicantType: 'founder' | 'mentor' | 'investor' | 'service_provider' | 'partner' = 'partner';
    if (role === 'founders') applicantType = 'founder';
    else if (role === 'mentors') applicantType = 'mentor';
    else if (role === 'investors') applicantType = 'investor';
    else if (role === 'service-providers') applicantType = 'service_provider';

    // Map designation
    const designation = otherRoleDetails || 
      (role === 'founders' ? 'Founder' : 
       role === 'mentors' ? 'Mentor' : 
       role === 'investors' ? 'Investor' : 
       role === 'service-providers' ? 'Service Provider' : 'Ecosystem Member');

    // Find LinkedIn URL in social links
    const linkedinUrl = socialLinks?.find((link: string) => link.toLowerCase().includes('linkedin.com')) || socialLinks?.[0] || null;

    // Check for duplicate credentials in database
    const duplicateChecks = [];
    if (email) duplicateChecks.push(eq(communityMemberApplications.email, email));
    if (phone) duplicateChecks.push(eq(communityMemberApplications.phone, phone));
    if (linkedinUrl) duplicateChecks.push(eq(communityMemberApplications.linkedinUrl, linkedinUrl));
    if (photoUrl) duplicateChecks.push(eq(communityMemberApplications.photoUrl, photoUrl));

    if (duplicateChecks.length > 0) {
      const existing = await db
        .select()
        .from(communityMemberApplications)
        .where(or(...duplicateChecks));

      if (existing.length > 0) {
        const record = existing[0];
        let message = 'An application with similar credentials has already been submitted.';
        
        if (record.email === email) {
          message = 'An application with this email address has already been submitted.';
        } else if (record.phone === phone) {
          message = 'An application with this phone number has already been submitted.';
        } else if (record.linkedinUrl === linkedinUrl && linkedinUrl) {
          message = 'An application with this LinkedIn profile link has already been submitted.';
        } else if (record.photoUrl === photoUrl && photoUrl) {
          message = 'An application with this profile photo has already been submitted.';
        }

        return NextResponse.json(
          { error: { code: 'DUPLICATE_ERROR', message } },
          { status: 400 }
        );
      }
    }

    // Insert into database
    const [newApplication] = await db.insert(communityMemberApplications).values({
      fullName: name,
      email,
      phone,
      company,
      designation,
      applicantType,
      websiteUrl: companyWebsite || null,
      linkedinUrl,
      expertise: description,
      motivation: otherRoleDetails || 'Apply for listing on ASG directory',
      photoUrl: photoUrl || null,
      status: 'pending',
    }).returning();

    return NextResponse.json(
      { success: true, data: newApplication },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Failed to create community application:', err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: err.message || 'Failed to submit application' } },
      { status: 500 }
    );
  }
}
