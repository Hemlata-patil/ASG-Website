import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interns } from '@/lib/db/schema/interns';
import { desc, eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'You must be logged in to view interns' } },
        { status: 401 }
      );
    }

    const allInterns = await db
      .select()
      .from(interns)
      .orderBy(desc(interns.createdAt));

    return NextResponse.json({
      data: allInterns,
    });
  } catch (err: any) {
    console.error('Failed to fetch interns for admin:', err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: err.message || 'Failed to fetch interns' } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'You must be logged in to manage interns' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      name,
      photo,
      college,
      domain,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      email,
      phone
    } = body;

    if (!name || !college || !domain) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Name, college, and domain are required' } },
        { status: 400 }
      );
    }

    // Insert new intern profile
    const [newIntern] = await db.insert(interns).values({
      name,
      photo: photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      college,
      domain,
      cohortNumber: 1, // default cohort
      linkedinUrl: linkedinUrl || null,
      githubUrl: githubUrl || null,
      portfolioUrl: portfolioUrl || null,
      email: email || null,
      phone: phone || null,
      status: 'active',
      displayOrder: 0
    }).returning();

    return NextResponse.json({
      success: true,
      data: newIntern
    }, { status: 201 });
  } catch (err: any) {
    console.error('Failed to save intern profile:', err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: err.message || 'Failed to save intern' } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'You must be logged in to manage interns' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Missing ID parameter' } },
        { status: 400 }
      );
    }

    await db.delete(interns).where(eq(interns.id, id));

    return NextResponse.json({
      success: true,
      message: 'Intern deleted successfully'
    });
  } catch (err: any) {
    console.error('Failed to delete intern:', err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: err.message || 'Failed to delete intern' } },
      { status: 500 }
    );
  }
}
