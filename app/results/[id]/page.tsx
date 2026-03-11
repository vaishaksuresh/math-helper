import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { sessions, questions, answers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { ResultsSummary } from '@/components/results-summary'
import { Home, RefreshCw } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const session = await db.select().from(sessions).where(eq(sessions.id, id)).get()
  if (!session) notFound()

  const sessionQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.sessionId, id))
    .orderBy(questions.orderIndex)

  const sessionAnswers = await db
    .select()
    .from(answers)
    .where(eq(answers.sessionId, id))

  const parsedQuestions = sessionQuestions.map((q) => ({
    ...q,
    choices: JSON.parse(q.choices) as string[],
  }))

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">Session Results</h1>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-1" /> Home
            </Button>
          </Link>
          <Link
            href={`/setup`}
          >
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-1" /> New Session
            </Button>
          </Link>
        </div>
      </div>

      <ResultsSummary
        session={session}
        questions={parsedQuestions}
        answers={sessionAnswers}
      />
    </div>
  )
}
