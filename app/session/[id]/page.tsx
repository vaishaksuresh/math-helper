'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { QuestionCard } from '@/components/question-card'
import { Timer } from '@/components/timer'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { difficultyColor, cn } from '@/lib/utils'
import type { Session, Question } from '@/lib/db/schema'
import { BookOpen, XCircle, Loader2 } from 'lucide-react'

type ParsedQuestion = Omit<Question, 'choices'> & { choices: string[] }

interface SessionData {
  session: Session
  questions: ParsedQuestion[]
  answers: { questionId: string; userAnswer: string | null; isCorrect: boolean | null }[]
}

export default function SessionPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [quitDialogOpen, setQuitDialogOpen] = useState(false)
  const [quitting, setQuitting] = useState(false)

  useEffect(() => {
    fetch(`/api/sessions/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleAnswer = useCallback(async (answer: string | null, flags: { hintUsed: boolean; solveUsed: boolean }) => {
    if (!data) throw new Error('No session data')
    const currentQ = data.questions[data.session.currentQuestionIndex]

    const res = await fetch(`/api/sessions/${id}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: currentQ.id,
        userAnswer: answer,
        hintUsed: flags.hintUsed,
        solveUsed: flags.solveUsed,
      }),
    })

    if (!res.ok) throw new Error('Failed to submit answer')
    return res.json()
  }, [data, id])

  const handleNext = useCallback(() => {
    if (!data) return
    const nextIndex = data.session.currentQuestionIndex + 1
    const total = data.session.totalQuestions ?? data.questions.length

    if (nextIndex >= total) {
      router.push(`/results/${id}`)
      return
    }

    setData((prev) => prev ? {
      ...prev,
      session: { ...prev.session, currentQuestionIndex: nextIndex },
    } : prev)
  }, [data, id, router])

  const handleTimeUp = useCallback(async () => {
    await fetch(`/api/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    })
    router.push(`/results/${id}`)
  }, [id, router])

  const handleQuit = useCallback(async () => {
    setQuitting(true)
    await fetch(`/api/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'quit' }),
    })
    router.push(`/results/${id}`)
  }, [id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    )
  }

  if (!data || !data.session) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Session not found.</p>
        <Button onClick={() => router.push('/')} className="mt-4">Go Home</Button>
      </div>
    )
  }

  const { session, questions } = data
  const currentIndex = session.currentQuestionIndex
  const total = session.totalQuestions ?? questions.length
  const currentQ = questions[currentIndex]
  const progress = Math.round((currentIndex / total) * 100)

  if (!currentQ || session.status !== 'active') {
    router.push(`/results/${id}`)
    return null
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary">
            <BookOpen className="h-3 w-3 mr-1" />
            Grade {session.gradeLevel}
          </Badge>
          <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize', difficultyColor(session.difficulty))}>
            {session.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {session.mode === 'time' && session.timeLimitMinutes && (
            <Timer
              totalMinutes={session.timeLimitMinutes}
              onExpire={handleTimeUp}
              sessionStartedAt={new Date((session.createdAt as unknown as number) * 1000)}
            />
          )}
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500" onClick={() => setQuitDialogOpen(true)}>
            <XCircle className="h-4 w-4 mr-1" /> Quit
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-gray-500">Question {currentIndex + 1} of {total}</span>
          {currentIndex > 0 ? (
            <span className={cn(
              'font-semibold',
              Math.round((session.score / currentIndex) * 100) >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
              Math.round((session.score / currentIndex) * 100) >= 60 ? 'text-amber-600 dark:text-amber-400' :
              'text-red-500 dark:text-red-400'
            )}>
              {Math.round((session.score / currentIndex) * 100)}% accuracy
            </span>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>
        <Progress value={progress} />
      </div>

      {/* Question */}
      <QuestionCard
        key={currentQ.id}
        question={currentQ}
        questionNumber={currentIndex + 1}
        totalQuestions={total}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />

      {/* Quit dialog */}
      <Dialog open={quitDialogOpen} onOpenChange={setQuitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quit this session?</DialogTitle>
            <DialogDescription>
              Your progress will be saved. You can view your results so far, but you won&apos;t be able to resume this session.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setQuitDialogOpen(false)} disabled={quitting}>
              Keep Going
            </Button>
            <Button variant="destructive" onClick={handleQuit} disabled={quitting}>
              {quitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Quit Session'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
