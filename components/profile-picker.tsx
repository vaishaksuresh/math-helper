'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Student } from '@phosphor-icons/react'
import type { Profile } from '@/lib/db/schema'

export function ProfilePicker() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/profiles')
      .then(r => r.json())
      .then(setProfiles)
      .finally(() => setLoading(false))
  }, [])

  async function selectProfile(id: string) {
    await fetch(`/api/profiles/${id}/select`, { method: 'POST' })
    router.push('/subjects')
    router.refresh()
  }

  async function createProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      })
      const profile: Profile = await res.json()
      await selectProfile(profile.id)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Student size={52} weight="duotone" className="mx-auto text-violet-400 dark:text-violet-500" />
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse mx-auto" />
          <div className="h-4 w-36 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-6 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 animate-pulse h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <Student size={52} weight="duotone" className="mx-auto text-violet-500 dark:text-violet-400" />
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Who&apos;s practising today?
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Pick your profile to get started</p>
      </div>

      {profiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {profiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => selectProfile(profile.id)}
              className="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-md active:scale-[0.97] transition-all text-center space-y-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <div className="text-5xl">{profile.avatar}</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                {profile.name}
              </div>
            </button>
          ))}
        </div>
      )}

      {!creating ? (
        <div className="text-center">
          <Button variant="outline" onClick={() => setCreating(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Profile
          </Button>
        </div>
      ) : (
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <form onSubmit={createProfile} className="space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Create new profile</h2>
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Your name..."
              maxLength={30}
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-400 dark:focus:border-violet-600"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A cute avatar will be randomly assigned 🎲
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => { setCreating(false); setNewName('') }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!newName.trim() || submitting} className="flex-1">
                {submitting ? 'Creating...' : 'Create Profile'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}
