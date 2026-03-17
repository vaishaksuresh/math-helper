import Link from 'next/link'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { sessions } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { SessionCard } from '@/components/session-card'
import { BookOpen, TrendingUp, Clock, Star } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const cookieStore = await cookies()
  const profileId = cookieStore.get('profile_id')?.value

  const allSessions = profileId
    ? await db.select().from(sessions).where(eq(sessions.profileId, profileId)).orderBy(desc(sessions.lastActiveAt)).limit(20)
    : await db.select().from(sessions).orderBy(desc(sessions.lastActiveAt)).limit(20)

  const activeSessions = allSessions.filter((s) => s.status === 'active')
  const recentSessions = allSessions.filter((s) => s.status !== 'active').slice(0, 5)

  const completedSessions = allSessions.filter((s) => s.status === 'completed')
  const totalScore = completedSessions.reduce((sum, s) => sum + s.score, 0)
  const totalQ = completedSessions.reduce((sum, s) => sum + (s.totalQuestions ?? 0), 0)
  const avgPct = totalQ > 0 ? Math.round((totalScore / totalQ) * 100) : null

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-3xl text-white"
        style={{ background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 60%, #6d28d9 100%)' }}
      >
        {/* Decorative math symbols — behind content */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <span className="absolute top-2 right-4 text-[160px] font-black text-white leading-none" style={{ opacity: 0.07 }}>∑</span>
          <span className="absolute bottom-0 right-32 text-[100px] font-black text-white leading-none" style={{ opacity: 0.05 }}>π</span>
        </div>

        {/* Content */}
        <div className="relative p-10">
          <p className="text-violet-200 text-xs font-bold tracking-[0.2em] uppercase mb-4">AI Math Practice</p>
          <h1 className="text-4xl sm:text-5xl font-black mb-3 leading-[1.1] max-w-xs">
            Level up your<br />math skills.
          </h1>
          <p className="text-violet-100/80 mb-8 text-base max-w-xs leading-relaxed">
            Personalized questions tuned to your grade and difficulty.
          </p>
          <Link href="/setup">
            <Button size="xl" className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold shadow-lg border-0 transition-all hover:shadow-xl hover:-translate-y-0.5">
              Start Practice →
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      {completedSessions.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: BookOpen, label: 'Sessions', value: completedSessions.length },
            { icon: Star, label: 'Questions', value: totalQ },
            { icon: TrendingUp, label: 'Avg Score', value: avgPct != null ? `${avgPct}%` : '—' },
            { icon: Clock, label: 'In Progress', value: activeSessions.length },
          ].map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              className={`rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-up delay-${i + 1}`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">{label}</span>
              </div>
              <p className="text-3xl font-black text-gray-900 dark:text-gray-100">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Active sessions */}
      {activeSessions.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-violet-600" />
            In Progress
          </h2>
          <div className="space-y-3">
            {activeSessions.map((s, i) => (
              <div key={s.id} className={`animate-fade-up delay-${(i % 5) + 1}`}>
                <SessionCard session={s} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent completed */}
      {recentSessions.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Sessions</h2>
            <Link href="/history" className="text-sm font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentSessions.map((s, i) => (
              <div key={s.id} className={`animate-fade-up delay-${(i % 5) + 1}`}>
                <SessionCard session={s} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {allSessions.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" aria-hidden="true" />
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No sessions yet!</p>
          <p className="text-gray-400 dark:text-gray-500 mb-6">Create your first practice session to get started.</p>
          <Link href="/setup">
            <Button size="lg">Start Practicing →</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
