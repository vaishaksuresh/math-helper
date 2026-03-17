import Link from 'next/link'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { sessions } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { SessionCard } from '@/components/session-card'
import { Button } from '@/components/ui/button'
import { ChartBar } from '@phosphor-icons/react/ssr'

export const dynamic = 'force-dynamic'

export default async function HistoryPage() {
  const cookieStore = await cookies()
  const profileId = cookieStore.get('profile_id')?.value

  const allSessions = profileId
    ? await db.select().from(sessions).where(eq(sessions.profileId, profileId)).orderBy(desc(sessions.lastActiveAt))
    : await db.select().from(sessions).orderBy(desc(sessions.lastActiveAt))

  const completed = allSessions.filter((s) => s.status === 'completed')
  const active = allSessions.filter((s) => s.status === 'active')
  const quit = allSessions.filter((s) => s.status === 'quit')

  const totalScore = completed.reduce((sum, s) => sum + s.score, 0)
  const totalQ = completed.reduce((sum, s) => sum + (s.totalQuestions ?? 0), 0)
  const avgPct = totalQ > 0 ? Math.round((totalScore / totalQ) * 100) : null

  return (
    <div className="space-y-8 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Session History</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {allSessions.length} session{allSessions.length !== 1 ? 's' : ''} total
            {avgPct != null && ` · ${avgPct}% average score`}
          </p>
        </div>
        <Link href="/subjects">
          <Button>New Session</Button>
        </Link>
      </div>

      {allSessions.length === 0 && (
        <div className="text-center py-16">
          <ChartBar size={56} weight="duotone" className="mx-auto mb-4 text-zinc-300 dark:text-zinc-600" />
          <p className="text-gray-500 dark:text-gray-400">No sessions yet. Start practising to see your history here!</p>
          <Link href="/subjects" className="mt-4 inline-block">
            <Button>Get Started</Button>
          </Link>
        </div>
      )}

      {active.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">In Progress ({active.length})</h2>
          <div className="space-y-3">
            {active.map((s) => <SessionCard key={s.id} session={s} />)}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">Completed ({completed.length})</h2>
          <div className="space-y-3">
            {completed.map((s) => <SessionCard key={s.id} session={s} />)}
          </div>
        </section>
      )}

      {quit.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">Quit Early ({quit.length})</h2>
          <div className="space-y-3">
            {quit.map((s) => <SessionCard key={s.id} session={s} />)}
          </div>
        </section>
      )}
    </div>
  )
}
