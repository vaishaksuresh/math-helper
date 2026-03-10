'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, PenLine, ChevronRight, SkipForward } from 'lucide-react'
import type { Question } from '@/lib/db/schema'

type ParsedQuestion = Omit<Question, 'choices'> & { choices: string[] }

interface QuestionCardProps {
  question: ParsedQuestion
  questionNumber: number
  totalQuestions: number
  onAnswer: (answer: string | null) => Promise<{ isCorrect: boolean; correctAnswer: string; explanation: string; sessionComplete: boolean }>
  onNext: () => void
}

type State = 'unanswered' | 'answered'

export function QuestionCard({ question, questionNumber, totalQuestions, onAnswer, onNext }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [state, setState] = useState<State>('unanswered')
  const [result, setResult] = useState<{ isCorrect: boolean; correctAnswer: string; explanation: string; sessionComplete: boolean } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(answer: string | null) {
    if (state === 'answered' || loading) return
    setLoading(true)
    try {
      const r = await onAnswer(answer)
      setResult(r)
      setState('answered')
    } finally {
      setLoading(false)
    }
  }

  const choiceLabels = ['A', 'B', 'C', 'D']

  return (
    <div className="space-y-4">
      {/* Question */}
      <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-white to-indigo-50">
        <div className="flex items-start gap-3">
          {question.requiresPaper && (
            <Badge variant="warning" className="shrink-0 mt-0.5">
              <PenLine className="h-3 w-3 mr-1" />
              Scratch paper helpful
            </Badge>
          )}
        </div>
        <p className="text-xl font-medium text-gray-900 mt-3 leading-relaxed">
          {question.questionText}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="secondary" className="capitalize text-xs">
            {question.questionType.replace('_', ' ')}
          </Badge>
        </div>
      </Card>

      {/* Answer choices */}
      <div className="grid grid-cols-1 gap-3">
        {question.choices.map((choice, i) => {
          const label = choiceLabels[i]
          const isSelected = selected === choice
          const isCorrect = result?.correctAnswer === choice
          const isWrong = state === 'answered' && isSelected && !isCorrect

          return (
            <button
              key={choice}
              onClick={() => {
                if (state === 'unanswered') {
                  setSelected(choice)
                }
              }}
              disabled={state === 'answered'}
              className={cn(
                'w-full p-4 rounded-2xl border-2 text-left transition-all duration-150 flex items-center gap-4',
                state === 'unanswered' && !isSelected && 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer',
                state === 'unanswered' && isSelected && 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200',
                isCorrect && state === 'answered' && 'border-emerald-500 bg-emerald-50',
                isWrong && 'border-red-400 bg-red-50',
                state === 'answered' && !isCorrect && !isSelected && 'border-gray-100 bg-gray-50 opacity-60',
              )}
            >
              <span className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                state === 'unanswered' && isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600',
                isCorrect && state === 'answered' ? 'bg-emerald-600 text-white' : '',
                isWrong ? 'bg-red-500 text-white' : '',
              )}>
                {label}
              </span>
              <span className="flex-1 font-medium text-gray-800">{choice}</span>
              {isCorrect && state === 'answered' && <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />}
              {isWrong && <XCircle className="h-5 w-5 text-red-500 shrink-0" />}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {state === 'answered' && result && (
        <Card className={cn(
          'p-4 border-0',
          result.isCorrect ? 'bg-emerald-50' : 'bg-amber-50'
        )}>
          <div className="flex items-start gap-3">
            {result.isCorrect ? (
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className={cn('font-semibold', result.isCorrect ? 'text-emerald-800' : 'text-amber-800')}>
                {result.isCorrect ? 'Correct! 🎉' : `Not quite. The answer is: ${result.correctAnswer}`}
              </p>
              <p className="text-sm text-gray-600 mt-1">{result.explanation}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        {state === 'unanswered' && (
          <>
            <Button
              variant="ghost"
              className="flex-none text-gray-400 hover:text-gray-600"
              onClick={() => handleSubmit(null)}
              disabled={loading}
            >
              <SkipForward className="h-4 w-4 mr-1" /> Skip
            </Button>
            <Button
              className="flex-1"
              size="lg"
              onClick={() => handleSubmit(selected)}
              disabled={!selected || loading}
            >
              Submit Answer
            </Button>
          </>
        )}
        {state === 'answered' && (
          <Button className="w-full" size="lg" onClick={onNext}>
            {result?.sessionComplete ? 'See Results 🎉' : (
              <>Next Question <ChevronRight className="h-4 w-4" /></>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
