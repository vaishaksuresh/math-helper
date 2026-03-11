import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sessions, questions, answers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await db.select().from(sessions).where(eq(sessions.id, id)).get()

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const sessionQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.sessionId, id))
      .orderBy(questions.orderIndex)

    const sessionAnswers = await db
      .select()
      .from(answers)
      .where(eq(answers.sessionId, id))

    return NextResponse.json({
      session,
      questions: sessionQuestions.map((q) => ({
        ...q,
        choices: JSON.parse(q.choices),
      })),
      answers: sessionAnswers,
    })
  } catch (error) {
    console.error('GET /api/sessions/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const session = await db.select().from(sessions).where(eq(sessions.id, id)).get()
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const updates: Partial<typeof session> = {
      lastActiveAt: new Date(),
    }

    if (body.status !== undefined) updates.status = body.status
    if (body.currentQuestionIndex !== undefined) updates.currentQuestionIndex = body.currentQuestionIndex
    if (body.score !== undefined) updates.score = body.score

    if (body.status === 'completed' || body.status === 'quit') {
      updates.completedAt = new Date()
    }

    await db.update(sessions).set(updates).where(eq(sessions.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PATCH /api/sessions/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
  }
}
