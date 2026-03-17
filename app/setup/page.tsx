import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { SetupWizard } from '@/components/setup-wizard'

export default async function SetupPage() {
  const cookieStore = await cookies()
  const profileId = cookieStore.get('profile_id')?.value
  let profileName: string | null = null
  let gradePreference: number | null = null
  let difficultyPreference: string | null = null

  if (profileId) {
    const profile = await db.select().from(profiles).where(eq(profiles.id, profileId)).get()
    profileName = profile?.name ?? null
    gradePreference = profile?.gradePreference ?? null
    difficultyPreference = profile?.difficultyPreference ?? null
  }

  return (
    <div className="max-w-xl mx-auto animate-slide-in">
      <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
        <SetupWizard
          profileName={profileName}
          gradePreference={gradePreference}
          difficultyPreference={difficultyPreference}
        />
      </Suspense>
    </div>
  )
}
