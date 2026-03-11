import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type Session } from '@/lib/db/schema'
import { cn, difficultyColor, formatDate, formatTime } from '@/lib/utils'
import { BookOpen, CheckCircle, Clock, XCircle, Play } from 'lucide-react'

interface SessionCardProps {
  session: Session
  compact?: boolean
}

export function SessionCard({ session, compact = false }: SessionCardProps) {
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
    active: 'border-l-4 border-l-teal-500',
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
                {session.studentName ? `${session.studentName}'s Session` : 'Math Session'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
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
