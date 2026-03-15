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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create a New Session</h1>
        <p className="text-gray-500">Answer a few quick questions to set up your practice</p>
      </div>
      <SetupWizard
        profileName={profileName}
        gradePreference={gradePreference}
        difficultyPreference={difficultyPreference}
      />
    </div>
  )
}
