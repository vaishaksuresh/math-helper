import Link from 'next/link'
import { db } from '@/lib/db'
import { sessions } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { SessionCard } from '@/components/session-card'
import { BookOpen, TrendingUp, Clock, Star } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const allSessions = await db
    .select()
    .from(sessions)
    .orderBy(desc(sessions.lastActiveAt))
    .limit(20)

  const activeSessions = allSessions.filter((s) => s.status === 'active')
  const recentSessions = allSessions.filter((s) => s.status !== 'active').slice(0, 5)

  const completedSessions = allSessions.filter((s) => s.status === 'completed')
  const totalScore = completedSessions.reduce((sum, s) => sum + s.score, 0)
  const totalQ = completedSessions.reduce((sum, s) => sum + (s.totalQuestions ?? 0), 0)
  const avgPct = totalQ > 0 ? Math.round((totalScore / totalQ) * 100) : null

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white">
        <h1 className="text-3xl font-extrabold mb-2">Ready to practice math? 🧮</h1>
        <p className="text-indigo-200 mb-6 text-lg">
          AI-powered questions tailored to your grade level and difficulty
        </p>
        <Link href="/setup">
          <Button size="xl" className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold shadow-lg">
            Start New Session 🚀
          </Button>
        </Link>
      </div>

      {/* Stats */}
      {completedSessions.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: BookOpen, label: 'Sessions', value: completedSessions.length, color: 'text-indigo-600 bg-indigo-50' },
            { icon: Star, label: 'Questions', value: totalQ, color: 'text-purple-600 bg-purple-50' },
            { icon: TrendingUp, label: 'Avg Score', value: avgPct != null ? `${avgPct}%` : '—', color: 'text-emerald-600 bg-emerald-50' },
            { icon: Clock, label: 'In Progress', value: activeSessions.length, color: 'text-amber-600 bg-amber-50' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className={`rounded-2xl p-4 ${color}`}>
              <Icon className="h-5 w-5 mb-2 opacity-70" />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs font-semibold opacity-70 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Active sessions */}
      {activeSessions.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" />
            In Progress
          </h2>
          <div className="space-y-3">
            {activeSessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        </section>
      )}

      {/* Recent completed */}
      {recentSessions.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Sessions</h2>
            <Link href="/history" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentSessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {allSessions.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <span className="text-6xl block mb-4">📖</span>
          <p className="text-xl font-semibold text-gray-600 mb-2">No sessions yet!</p>
          <p className="text-gray-400 mb-6">Start your first math practice session above.</p>
        </div>
      )}
    </div>
  )
}
