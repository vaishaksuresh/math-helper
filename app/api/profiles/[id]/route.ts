import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { profiles, type NewProfile } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const profile = await db.select().from(profiles).where(eq(profiles.id, id)).get()
    if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(profile)
  } catch (error) {
    console.error('GET /api/profiles/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const allowed = ['theme', 'gradePreference', 'difficultyPreference', 'name'] as const
    const updates: Partial<Pick<NewProfile, typeof allowed[number]>> = {}
    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }
    await db.update(profiles).set(updates).where(eq(profiles.id, id))
    const updated = await db.select().from(profiles).where(eq(profiles.id, id)).get()
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('PATCH /api/profiles/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
