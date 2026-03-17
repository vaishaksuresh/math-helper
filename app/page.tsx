import { cookies } from 'next/headers'
import Link from 'next/link'
import { MathOperations, Flask, BookOpenText } from '@phosphor-icons/react/ssr'

// Force dynamic rendering — this page reads a cookie at request time
export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const cookieStore = await cookies()
  const isLoggedIn = !!cookieStore.get('profile_id')

  return (
    <main className="min-h-screen bg-[#f8f7f4] dark:bg-[#0f1117]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1d27]">
        <span className="font-heading font-bold text-xl text-zinc-900 dark:text-zinc-50">
          ✏ <span className="text-violet-600 dark:text-violet-400">Learn</span>Loop
        </span>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link href="/subjects" className="text-sm text-violet-600 dark:text-violet-400 font-medium hover:underline">
              Go to practice →
            </Link>
          ) : (
            <Link href="/profile-picker" className="text-sm text-violet-600 dark:text-violet-400 font-medium hover:underline">
              Sign in
            </Link>
          )}
        </div>
      </nav>

      {/* Hero — split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-65px)]">

        {/* Left: headline + CTA */}
        <div className="flex flex-col justify-center px-10 py-16 lg:px-16">
          <div className="inline-block text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-full px-3 py-1 w-fit mb-6">
            AI-powered practice
          </div>
          <h1 className="font-heading text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-4">
            Master any subject,<br />your way.
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-10 leading-relaxed max-w-md">
            Personalised questions for Math, Science & English — tuned to your grade and difficulty. Grades 5–12.
          </p>
          <Link
            href={isLoggedIn ? '/subjects' : '/profile-picker'}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white font-heading font-bold text-xl px-8 py-4 rounded-2xl transition-colors w-fit shadow-lg"
          >
            {isLoggedIn ? 'Continue Practising →' : 'Get Started →'}
          </Link>
          <p className="text-xs text-zinc-400 mt-4">Free · No account required to try</p>
        </div>

        {/* Right: subject quick-pick — clicking routes through profile if needed */}
        <div className="flex flex-col justify-center gap-4 px-8 py-12 bg-zinc-50 dark:bg-zinc-900/40 border-l border-zinc-200 dark:border-zinc-800">
          <p className="font-heading text-lg text-zinc-500 dark:text-zinc-400 mb-2">Pick a subject to begin:</p>

          {/* Math */}
          <Link
            href={isLoggedIn ? '/setup?subject=math' : '/profile-picker?subject=math'}
            className="group flex items-center gap-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            <div className="bg-amber-100 dark:bg-amber-900/50 rounded-xl p-2.5 flex-shrink-0">
              <MathOperations size={28} weight="duotone" className="text-amber-700 dark:text-amber-300" />
            </div>
            <div>
              <p className="font-heading font-bold text-lg text-zinc-900 dark:text-zinc-50">Math</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Algebra · Geometry · Stats · and more</p>
            </div>
            <span className="ml-auto text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" aria-hidden>›</span>
          </Link>

          {/* Science */}
          <Link
            href={isLoggedIn ? '/setup?subject=science' : '/profile-picker?subject=science'}
            className="group flex items-center gap-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            <div className="bg-emerald-100 dark:bg-emerald-900/50 rounded-xl p-2.5 flex-shrink-0">
              <Flask size={28} weight="duotone" className="text-emerald-700 dark:text-emerald-300" />
            </div>
            <div>
              <p className="font-heading font-bold text-lg text-zinc-900 dark:text-zinc-50">Science</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Biology · Chemistry · Physics · Earth Science</p>
            </div>
            <span className="ml-auto text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" aria-hidden>›</span>
          </Link>

          {/* English */}
          <Link
            href={isLoggedIn ? '/setup?subject=english' : '/profile-picker?subject=english'}
            className="group flex items-center gap-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            <div className="bg-blue-100 dark:bg-blue-900/50 rounded-xl p-2.5 flex-shrink-0">
              <BookOpenText size={28} weight="duotone" className="text-blue-700 dark:text-blue-300" />
            </div>
            <div>
              <p className="font-heading font-bold text-lg text-zinc-900 dark:text-zinc-50">English</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Grammar · Vocabulary · Reading · Writing</p>
            </div>
            <span className="ml-auto text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" aria-hidden>›</span>
          </Link>

          <p className="text-xs text-zinc-400 dark:text-zinc-600 text-center mt-2">Grades 5–12 · AI-generated questions</p>
        </div>
      </div>
    </main>
  )
}
