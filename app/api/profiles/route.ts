import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { nanoid } from 'nanoid'
import { randomAvatar } from '@/lib/avatars'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const all = await db.select().from(profiles).orderBy(desc(profiles.createdAt))
    return NextResponse.json(all)
  } catch (error) {
    console.error('GET /api/profiles error:', error)
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, gradePreference, difficultyPreference } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const profile = {
      id: nanoid(),
      name: name.trim(),
      avatar: randomAvatar(),
      gradePreference: gradePreference ?? null,
      difficultyPreference: difficultyPreference ?? null,
      theme: 'dark' as const,
      createdAt: new Date(),
    }

    await db.insert(profiles).values(profile)
    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error('POST /api/profiles error:', error)
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
  }
}
