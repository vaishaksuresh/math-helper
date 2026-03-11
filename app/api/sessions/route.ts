import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sessions, questions } from '@/lib/db/schema'
import { generateQuestions } from '@/lib/claude'
import { nanoid } from 'nanoid'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const allSessions = await db
      .select()
      .from(sessions)
      .orderBy(desc(sessions.lastActiveAt))

    return NextResponse.json(allSessions)
  } catch (error) {
    console.error('GET /api/sessions error:', error)
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      studentName,
      gradeLevel,
      difficulty,
      mode,
      totalQuestions,
      timeLimitMinutes,
    } = body

    if (!gradeLevel || !difficulty || !mode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Determine how many questions to generate
    let questionCount = totalQuestions
    if (mode === 'time') {
      // Estimate ~2 min per question for easy, ~3 for medium, ~4 for hard
      const minsPerQ = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4
      questionCount = Math.ceil((timeLimitMinutes ?? 15) / minsPerQ)
      questionCount = Math.max(5, Math.min(questionCount, 30))
    } else {
      questionCount = Math.max(5, Math.min(totalQuestions ?? 10, 50))
    }

    const sessionId = nanoid()
    const now = new Date()
    const nowTs = Math.floor(now.getTime() / 1000)

    // Generate questions via Claude
    const generated = await generateQuestions(gradeLevel, difficulty, questionCount)

    // Insert session
    await db.insert(sessions).values({
      id: sessionId,
      studentName: studentName ?? null,
      gradeLevel,
      difficulty,
      mode,
      totalQuestions: questionCount,
      timeLimitMinutes: mode === 'time' ? timeLimitMinutes : null,
      status: 'active',
      currentQuestionIndex: 0,
      score: 0,
      createdAt: now,
      lastActiveAt: now,
    })

    // Insert questions
    for (let i = 0; i < generated.length; i++) {
      const q = generated[i]
      await db.insert(questions).values({
        id: nanoid(),
        sessionId,
        orderIndex: i,
        questionText: q.questionText,
        questionType: q.questionType,
        requiresPaper: q.requiresPaper,
        choices: JSON.stringify(q.choices),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })
    }

    return NextResponse.json({ id: sessionId, totalQuestions: questionCount }, { status: 201 })
  } catch (error) {
    console.error('POST /api/sessions error:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
