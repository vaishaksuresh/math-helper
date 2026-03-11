'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Moon, Sun } from 'lucide-react'
import type { Profile } from '@/lib/db/schema'

interface UserMenuProps {
  profile: Profile
}

export function UserMenu({ profile }: UserMenuProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(profile.theme)

  async function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    await fetch(`/api/profiles/${profile.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ theme: next }),
    })
    document.cookie = `profile_theme=${next};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
  }

  function switchProfile() {
    document.cookie = 'profile_id=;path=/;max-age=0'
    document.cookie = 'profile_theme=;path=/;max-age=0'
    router.push('/profile-picker')
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="text-2xl">{profile.avatar}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
          {profile.name}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-40 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="text-3xl mb-1">{profile.avatar}</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{profile.name}</div>
            </div>
            <div className="p-2 space-y-1">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'dark'
                  ? <><Sun className="h-4 w-4" /> Light mode</>
                  : <><Moon className="h-4 w-4" /> Dark mode</>
                }
              </button>
              <button
                onClick={switchProfile}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Switch Profile
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
