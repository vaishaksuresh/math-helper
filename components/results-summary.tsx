import { cn, scoreGrade, difficultyColor } from '@/lib/utils'
import type { Session, Question, Answer } from '@/lib/db/schema'
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react'

type ParsedQuestion = Omit<Question, 'choices'> & { choices: string[] }

interface ResultsSummaryProps {
  session: Session
  questions: ParsedQuestion[]
  answers: Answer[]
}

export function ResultsSummary({ session, questions, answers }: ResultsSummaryProps) {
  const total = session.totalQuestions ?? questions.length
  const score = session.score
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const { label, color } = scoreGrade(pct)
  const answeredMap = new Map(answers.map((a) => [a.questionId, a]))

  return (
    <div className="space-y-6">
      {/* Score card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white text-center shadow-lg">
        <p className={cn('text-5xl font-extrabold mb-1', color.replace('text-', 'text-white '))}>
          {pct}%
        </p>
        <p className="text-3xl font-bold opacity-90 mb-2">{label}</p>
        <p className="text-indigo-200">
          {score} out of {total} correct
        </p>
        <div className="flex justify-center gap-3 mt-4">
          <span className={cn('px-3 py-1 rounded-full text-sm font-semibold bg-white/20')}>
            Grade {session.gradeLevel}
          </span>
          <span className={cn('px-3 py-1 rounded-full text-sm font-semibold bg-white/20 capitalize')}>
            {session.difficulty}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Correct', value: score, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Incorrect', value: answers.filter(a => a.isCorrect === false).length, icon: XCircle, color: 'text-red-500 bg-red-50' },
          { label: 'Skipped', value: answers.filter(a => a.userAnswer === null).length, icon: MinusCircle, color: 'text-gray-500 bg-gray-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={cn('rounded-2xl p-4 text-center', color)}>
            <Icon className="h-6 w-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-semibold opacity-75">{label}</p>
          </div>
        ))}
      </div>

      {/* Question review */}
      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-3">Review Your Answers</h3>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const answer = answeredMap.get(q.id)
            const isCorrect = answer?.isCorrect
            const wasSkipped = !answer || answer.userAnswer === null

            return (
              <details key={q.id} className="group rounded-2xl border border-gray-100 bg-white overflow-hidden">
                <summary className="flex items-center gap-3 p-4 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                  <span className={cn(
                    'shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold',
                    isCorrect ? 'bg-emerald-100 text-emerald-700' :
                    wasSkipped ? 'bg-gray-100 text-gray-500' :
                    'bg-red-100 text-red-600'
                  )}>
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-800 line-clamp-2">
                    {q.questionText}
                  </span>
                  {isCorrect ? <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" /> :
                   wasSkipped ? <MinusCircle className="h-4 w-4 text-gray-400 shrink-0" /> :
                   <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
                </summary>
                <div className="px-4 pb-4 pt-0 space-y-2 text-sm border-t border-gray-50">
                  <div className="grid grid-cols-1 gap-1 mt-2">
                    {q.choices.map((choice) => (
                      <div key={choice} className={cn(
                        'px-3 py-1.5 rounded-lg',
                        choice === q.correctAnswer ? 'bg-emerald-50 text-emerald-800 font-semibold' :
                        choice === answer?.userAnswer ? 'bg-red-50 text-red-700' :
                        'text-gray-600'
                      )}>
                        {choice === q.correctAnswer && '✓ '}{choice}
                        {choice === answer?.userAnswer && choice !== q.correctAnswer && ' ← your answer'}
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-500 italic mt-2">{q.explanation}</p>
                </div>
              </details>
            )
          })}
        </div>
      </div>
    </div>
  )
}
