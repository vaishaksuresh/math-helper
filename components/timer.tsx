'use client'

import { useState, useEffect, useCallback } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimerProps {
  totalMinutes: number
  onExpire: () => void
  sessionStartedAt: Date
}

export function Timer({ totalMinutes, onExpire, sessionStartedAt }: TimerProps) {
  const totalSeconds = totalMinutes * 60

  const getElapsed = useCallback(() => {
    return Math.floor((Date.now() - sessionStartedAt.getTime()) / 1000)
  }, [sessionStartedAt])

  const [remaining, setRemaining] = useState(() => Math.max(0, totalSeconds - getElapsed()))
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (expired) return
    const interval = setInterval(() => {
      const elapsed = getElapsed()
      const rem = Math.max(0, totalSeconds - elapsed)
      setRemaining(rem)
      if (rem === 0 && !expired) {
        setExpired(true)
        onExpire()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [expired, getElapsed, totalSeconds, onExpire])

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const pct = (remaining / totalSeconds) * 100
  const warning = remaining <= 120 && remaining > 0 // 2 min warning

  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-2 rounded-full font-mono font-semibold text-sm transition-colors',
      expired ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400' :
      warning ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 animate-pulse' :
      'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    )}>
      <Clock className="h-4 w-4" />
      <span>
        {expired ? 'Time Up!' : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
      </span>
    </div>
  )
}
