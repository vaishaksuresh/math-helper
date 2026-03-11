'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { BookOpen, Zap, Target, AlarmClock, Hash, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'

const GRADES = [3, 4, 5, 6, 7, 8]

const DIFFICULTIES = [
  {
    value: 'easy',
    label: 'Easy',
    description: 'Single-step problems, small numbers',
    color: 'border-emerald-300 bg-emerald-50 text-emerald-700',
    activeColor: 'border-emerald-500 bg-emerald-100 ring-2 ring-emerald-400',
    icon: '🌱',
  },
  {
    value: 'medium',
    label: 'Medium',
    description: '2-3 step problems, fractions & decimals',
    color: 'border-amber-300 bg-amber-50 text-amber-700',
    activeColor: 'border-amber-500 bg-amber-100 ring-2 ring-amber-400',
    icon: '⚡',
  },
  {
    value: 'hard',
    label: 'Hard',
    description: 'Complex multi-step, may need scratch paper',
    color: 'border-red-300 bg-red-50 text-red-700',
    activeColor: 'border-red-500 bg-red-100 ring-2 ring-red-400',
    icon: '🔥',
  },
]

const QUESTION_COUNTS = [5, 10, 15, 20, 30]
const TIME_OPTIONS = [5, 10, 15, 20, 30]

export function SetupWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [gradeLevel, setGradeLevel] = useState<number>(5)
  const [difficulty, setDifficulty] = useState<string>('medium')
  const [mode, setMode] = useState<'count' | 'time'>('count')
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15)
  const [studentName, setStudentName] = useState('')

  const steps = ['Grade', 'Difficulty', 'Session', 'Start']

  async function handleStart() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentName.trim() || null,
          gradeLevel,
          difficulty,
          mode,
          totalQuestions: mode === 'count' ? totalQuestions : null,
          timeLimitMinutes: mode === 'time' ? timeLimitMinutes : null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to create session')
      }

      const { id } = await res.json()
      router.push(`/session/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
              i < step ? 'bg-indigo-600 text-white' : i === step ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-gray-100 text-gray-400'
            )}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={cn('text-sm font-medium hidden sm:block', i === step ? 'text-indigo-600' : 'text-gray-400')}>
              {s}
            </span>
            {i < steps.length - 1 && <div className={cn('w-8 h-0.5', i < step ? 'bg-indigo-600' : 'bg-gray-200')} />}
          </div>
        ))}
      </div>

      {/* Step 0: Grade */}
      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-900">What grade are you in?</h2>
          <p className="text-center text-gray-500">Choose your grade level to get the right questions</p>
          <div className="grid grid-cols-3 gap-3 mt-6">
            {GRADES.map((g) => (
              <button
                key={g}
                onClick={() => setGradeLevel(g)}
                className={cn(
                  'p-5 rounded-2xl border-2 font-bold text-2xl transition-all duration-150 hover:scale-105',
                  gradeLevel === g
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200 scale-105'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300'
                )}
              >
                <div className="text-3xl mb-1">📚</div>
                <div>Grade {g}</div>
              </button>
            ))}
          </div>
          <Button className="w-full mt-4" size="lg" onClick={() => setStep(1)}>
            Continue <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 1: Difficulty */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-900">How challenging?</h2>
          <p className="text-center text-gray-500">Pick a difficulty that matches your skill level</p>
          <div className="space-y-3 mt-6">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className={cn(
                  'w-full p-4 rounded-2xl border-2 text-left transition-all duration-150',
                  difficulty === d.value ? d.activeColor : `${d.color} hover:opacity-80`
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{d.icon}</span>
                  <div>
                    <div className="font-bold text-lg">{d.label}</div>
                    <div className="text-sm opacity-80">{d.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" size="lg" onClick={() => setStep(0)}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <Button className="flex-1" size="lg" onClick={() => setStep(2)}>
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Session mode */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-900">How do you want to practice?</h2>
          <p className="text-center text-gray-500">Choose by number of questions or a time limit</p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => setMode('count')}
              className={cn(
                'p-5 rounded-2xl border-2 text-center transition-all duration-150',
                mode === 'count'
                  ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                  : 'border-gray-200 bg-white hover:border-indigo-300'
              )}
            >
              <Hash className={cn('h-8 w-8 mx-auto mb-2', mode === 'count' ? 'text-indigo-600' : 'text-gray-400')} />
              <div className="font-bold text-gray-900">By Questions</div>
              <div className="text-sm text-gray-500 mt-1">Choose how many</div>
            </button>
            <button
              onClick={() => setMode('time')}
              className={cn(
                'p-5 rounded-2xl border-2 text-center transition-all duration-150',
                mode === 'time'
                  ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                  : 'border-gray-200 bg-white hover:border-indigo-300'
              )}
            >
              <AlarmClock className={cn('h-8 w-8 mx-auto mb-2', mode === 'time' ? 'text-indigo-600' : 'text-gray-400')} />
              <div className="font-bold text-gray-900">By Time</div>
              <div className="text-sm text-gray-500 mt-1">Set a time limit</div>
            </button>
          </div>

          {mode === 'count' && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Number of questions:</p>
              <div className="flex flex-wrap gap-2">
                {QUESTION_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setTotalQuestions(n)}
                    className={cn(
                      'px-5 py-2.5 rounded-xl font-semibold border-2 transition-all',
                      totalQuestions === n
                        ? 'border-indigo-500 bg-indigo-600 text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300'
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'time' && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Time limit:</p>
              <div className="flex flex-wrap gap-2">
                {TIME_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeLimitMinutes(t)}
                    className={cn(
                      'px-5 py-2.5 rounded-xl font-semibold border-2 transition-all',
                      timeLimitMinutes === t
                        ? 'border-indigo-500 bg-indigo-600 text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300'
                    )}
                  >
                    {t} min
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" size="lg" onClick={() => setStep(1)}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <Button className="flex-1" size="lg" onClick={() => setStep(3)}>
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Name + Start */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-900">Ready to start!</h2>
          <p className="text-center text-gray-500">Enter your name (optional) to personalize your session</p>

          <Card className="p-5 bg-indigo-50 border-indigo-100">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <span className="text-gray-600">Grade:</span>
                <span className="font-semibold text-gray-900">{gradeLevel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-500" />
                <span className="text-gray-600">Difficulty:</span>
                <span className="font-semibold capitalize text-gray-900">{difficulty}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <Target className="h-4 w-4 text-indigo-500" />
                <span className="text-gray-600">
                  {mode === 'count' ? `${totalQuestions} questions` : `${timeLimitMinutes} minute session`}
                </span>
              </div>
            </div>
          </Card>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your name (optional)</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors"
              maxLength={50}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" size="lg" onClick={() => setStep(2)} disabled={loading}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <Button className="flex-1" size="xl" onClick={handleStart} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating questions...
                </>
              ) : (
                <>Let&apos;s Go! 🚀</>
              )}
            </Button>
          </div>
          {loading && (
            <p className="text-center text-sm text-gray-500">
              Claude is creating your personalized questions... this may take a moment.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
