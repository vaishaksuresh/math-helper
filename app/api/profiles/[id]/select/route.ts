import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const profile = await db.select().from(profiles).where(eq(profiles.id, id)).get()
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const res = NextResponse.json({ ok: true, theme: profile.theme })
  const cookieOpts = {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax' as const,
  }
  res.cookies.set('profile_id', id, cookieOpts)
  res.cookies.set('profile_theme', profile.theme, cookieOpts)
  return res
}
