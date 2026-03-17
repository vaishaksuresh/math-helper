import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SubjectPicker } from '@/components/subject-picker'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function SubjectsPage() {
  const cookieStore = await cookies()
  const profileId = cookieStore.get('profile_id')?.value
  if (!profileId) redirect('/profile-picker')

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, profileId),
  })

  return (
    <main className="min-h-screen bg-[#f8f7f4] dark:bg-[#0f1117]">
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <h1 className="font-heading text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 text-center">
          What are we practising today?
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-center">
          Pick a subject to get started.
        </p>

        <SubjectPicker />

        {/* Profile banner */}
        {profile && (
          <div className="mt-10 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5">
            <span className="text-lg" aria-hidden>{profile.avatar}</span>
            <span>Practising as <span className="font-semibold text-zinc-800 dark:text-zinc-200">{profile.name}</span></span>
            <Link href="/profile-picker" className="ml-2 text-xs text-violet-600 dark:text-violet-400 hover:underline">
              Switch
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
