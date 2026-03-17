import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type Session } from '@/lib/db/schema'
import { cn, difficultyColor, formatDate, formatTime } from '@/lib/utils'
import { BookOpen, CheckCircle, Clock, XCircle, Play } from 'lucide-react'
import { SUBJECTS, type Subject } from '@/lib/subjects'

interface SessionCardProps {
  session: Session
  compact?: boolean
}

// Subject badge — colours per subject, static strings for Tailwind v4 scanner
const subjectBadgeClasses: Record<string, string> = {
  math:    'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300',
  science: 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300',
  english: 'bg-blue-50 border-blue-300 text-blue-800 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300',
}

// Default math subject used when session.subject is missing or unrecognised
const DEFAULT_SUBJECT = SUBJECTS[0]

export function SessionCard({ session, compact = false }: SessionCardProps) {
  const subject: Subject = SUBJECTS.find(s => s.id === session.subject) ?? DEFAULT_SUBJECT

  const pct = session.totalQuestions
    ? Math.round((session.score / session.totalQuestions) * 100)
    : 0

  const statusIcon = {
    active: <Play className="h-4 w-4 text-indigo-500" />,
    completed: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    quit: <XCircle className="h-4 w-4 text-gray-400" />,
  }[session.status]

  const actionHref =
    session.status === 'active'
      ? `/session/${session.id}`
      : `/results/${session.id}`

  const actionLabel = session.status === 'active' ? 'Resume' : 'View Results'
  const actionVariant = session.status === 'active' ? 'default' : 'outline'

  const accentBorder = {
    active: 'border-l-4 border-l-violet-600',
    completed: 'border-l-4 border-l-emerald-500',
    quit: 'border-l-4 border-l-gray-300 dark:border-l-gray-600',
  }[session.status]

  return (
    <Card className={cn('hover:shadow-md hover:-translate-y-0.5 transition-all', accentBorder, compact && 'shadow-none')}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {statusIcon}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {session.studentName ?? `${subject.label} Session`}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${subjectBadgeClasses[subject.id] ?? subjectBadgeClasses.math}`}>
                {subject.label}
              </span>
              <Badge variant="secondary">
                <BookOpen className="h-3 w-3 mr-1" />
                Grade {session.gradeLevel}
              </Badge>
              <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', difficultyColor(session.difficulty))}>
                {session.difficulty}
              </span>
              {session.mode === 'time' && (
                <Badge variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  {session.timeLimitMinutes}min
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {session.status !== 'active' && (
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Score: {session.score}/{session.totalQuestions} ({pct}%)
                </span>
              )}
              {session.status === 'active' && (
                <span>
                  Progress: {session.currentQuestionIndex}/{session.totalQuestions}
                </span>
              )}
              <span>{formatDate(session.createdAt)}</span>
              <span>{formatTime(session.createdAt)}</span>
            </div>
          </div>

          <Link href={actionHref}>
            <Button variant={actionVariant as 'default' | 'outline'} size="sm">
              {actionLabel}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
