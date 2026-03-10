import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sessions, questions, answers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { questionId, userAnswer, timeSpentSeconds } = body

    if (!questionId) {
      return NextResponse.json({ error: 'Missing questionId' }, { status: 400 })
    }

    const session = await db.select().from(sessions).where(eq(sessions.id, id)).get()
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const question = await db.select().from(questions).where(eq(questions.id, questionId)).get()
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const isCorrect = userAnswer != null ? userAnswer === question.correctAnswer : null

    await db.insert(answers).values({
      id: nanoid(),
      sessionId: id,
      questionId,
      userAnswer: userAnswer ?? null,
      isCorrect,
      answeredAt: new Date(),
      timeSpentSeconds: timeSpentSeconds ?? null,
    })

    // Update session score and progress
    const newScore = isCorrect ? session.score + 1 : session.score
    const newIndex = session.currentQuestionIndex + 1
    const totalQ = session.totalQuestions ?? 0

    const isLast = newIndex >= totalQ
    const updates: Record<string, unknown> = {
      currentQuestionIndex: newIndex,
      score: newScore,
      lastActiveAt: new Date(),
    }

    if (isLast) {
      updates.status = 'completed'
      updates.completedAt = new Date()
    }

    await db.update(sessions).set(updates).where(eq(sessions.id, id))

    return NextResponse.json({
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      sessionComplete: isLast,
    })
  } catch (error) {
    console.error('POST /api/sessions/[id]/answers error:', error)
    return NextResponse.json({ error: 'Failed to submit answer' }, { status: 500 })
  }
}
