'use client'

import { useRouter } from 'next/navigation'
import { MathOperations, Flask, BookOpenText } from '@phosphor-icons/react/dist/ssr'
import { SUBJECTS, type Subject } from '@/lib/subjects'

// Static maps — full class strings required for Tailwind v4 static analysis
const ICONS: Record<string, React.ReactNode> = {
  math:    <MathOperations size={32} weight="duotone" />,
  science: <Flask          size={32} weight="duotone" />,
  english: <BookOpenText   size={32} weight="duotone" />,
}

// Card wrapper: bg + border (light and dark, written out fully)
const CARD_CLASSES: Record<string, string> = {
  math:    'bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-800',
  science: 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-800',
  english: 'bg-blue-50 border-blue-300 dark:bg-blue-950/30 dark:border-blue-800',
}

// Icon container bg + icon colour (light and dark)
const ICON_CLASSES: Record<string, { bg: string; text: string }> = {
  math:    { bg: 'bg-amber-100 dark:bg-amber-900/50',    text: 'text-amber-700 dark:text-amber-300'   },
  science: { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-300' },
  english: { bg: 'bg-blue-100 dark:bg-blue-900/50',      text: 'text-blue-700 dark:text-blue-300'     },
}

export function SubjectPicker() {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
      {SUBJECTS.map((subject, i) => (
        <button
          key={subject.id}
          onClick={() => router.push(`/setup?subject=${subject.id}`)}
          className={[
            'group relative flex items-center gap-4 rounded-2xl p-5 border text-left',
            'transition-all hover:-translate-y-1 hover:shadow-lg',
            CARD_CLASSES[subject.id],
            i === 2 ? 'sm:col-span-2' : '',  // English spans full width
          ].join(' ')}
        >
          {/* Icon */}
          <div className={`rounded-xl p-2.5 flex-shrink-0 ${ICON_CLASSES[subject.id].bg}`}>
            <span className={ICON_CLASSES[subject.id].text}>
              {ICONS[subject.id]}
            </span>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-xl text-zinc-900 dark:text-zinc-50">
              {subject.label}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
              {subject.description}
            </p>
          </div>

          <span className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors text-lg" aria-hidden>
            →
          </span>

          {/* Decorative bg emoji (topics[0] is always 'Mixed' = 🎲 for all subjects) */}
          <span className="absolute right-4 bottom-2 text-5xl opacity-[0.07] pointer-events-none select-none" aria-hidden>
            {subject.topics[0].icon}
          </span>
        </button>
      ))}
    </div>
  )
}
