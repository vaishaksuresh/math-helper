import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Math Helper — Practice Makes Perfect',
  description: 'AI-powered math practice for grades 3-8',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <header className="border-b border-gray-100 bg-white sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-indigo-600 hover:text-indigo-700 transition-colors">
              <span className="text-2xl">🧮</span>
              Math Helper
            </Link>
            <nav className="flex items-center gap-1">
              <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="/history" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                History
              </Link>
              <Link href="/setup" className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                New Session
              </Link>
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
