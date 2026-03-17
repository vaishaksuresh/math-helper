'use client'

import { useRouter } from 'next/navigation'
import { MathOperations, Flask, BookOpenText } from '@phosphor-icons/react/ssr'
import { SUBJECTS, type SubjectId } from '@/lib/subjects'

// Static map — full class strings required for Tailwind v4 static analysis
const ICONS: Record<SubjectId, React.ReactNode> = {
  math:    <MathOperations size={32} weight="duotone" />,
  science: <Flask          size={32} weight="duotone" />,
  english: <BookOpenText   size={32} weight="duotone" />,
}

export function SubjectPicker() {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
      {SUBJECTS.map((subject) => (
        <button
          key={subject.id}
          onClick={() => router.push(`/setup?subject=${subject.id}`)}
          className={[
            'group relative flex items-center gap-4 rounded-2xl p-5 border text-left',
            'transition-all hover:-translate-y-1 hover:shadow-lg active:scale-[0.97] active:translate-y-0 cursor-pointer',
            subject.cardClasses.card,
            subject.id === 'english' ? 'sm:col-span-2' : '',
          ].join(' ')}
        >
          {/* Icon */}
          <div className={`rounded-xl p-2.5 flex-shrink-0 ${subject.cardClasses.iconBg}`}>
            <span className={subject.cardClasses.iconText}>
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
