import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | number | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'number' ? new Date(date * 1000) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTime(date: Date | number | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'number' ? new Date(date * 1000) : date
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

export function gradeLabel(grade: number): string {
  return `Grade ${grade}`
}

export function difficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'text-emerald-600 bg-emerald-50'
    case 'medium': return 'text-amber-600 bg-amber-50'
    case 'hard': return 'text-red-600 bg-red-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

export function scoreGrade(pct: number): { label: string; color: string } {
  if (pct >= 90) return { label: 'Excellent!', color: 'text-emerald-600' }
  if (pct >= 80) return { label: 'Great Job!', color: 'text-blue-600' }
  if (pct >= 70) return { label: 'Good Work!', color: 'text-indigo-600' }
  if (pct >= 60) return { label: 'Keep Trying!', color: 'text-amber-600' }
  return { label: 'Keep Practicing!', color: 'text-red-600' }
}
