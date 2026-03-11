import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { UserMenu } from '@/components/user-menu'
import { Nunito, Bricolage_Grotesque } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Math Helper — Practice Makes Perfect',
  description: 'AI-powered math practice for grades 3-8',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const profileId = cookieStore.get('profile_id')?.value
  const themeCookie = cookieStore.get('profile_theme')?.value ?? 'dark'

  let profile = null
  if (profileId) {
    profile = await db.select().from(profiles).where(eq(profiles.id, profileId)).get() ?? null
  }

  const isDark = (profile?.theme ?? themeCookie) === 'dark'

  return (
    <html lang="en" className={[isDark ? 'dark' : '', nunito.variable, bricolage.variable].filter(Boolean).join(' ')}>
      <body className="antialiased min-h-screen transition-colors">
        <header className="border-b border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1.5 font-black text-xl text-gray-900 dark:text-gray-100 hover:opacity-80 transition-opacity">
              <span className="text-teal-500 font-black text-2xl leading-none">#</span>
              Math Helper
            </Link>
            <nav className="flex items-center gap-1">
              <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                Home
              </Link>
              <Link href="/history" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                History
              </Link>
              <Link href="/setup" className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-600 dark:bg-teal-500 text-white hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                New Session
              </Link>
              {profile && <UserMenu profile={profile} />}
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
