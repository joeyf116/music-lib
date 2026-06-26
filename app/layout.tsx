import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/contexts/AppContext'
import DesktopSidebar from '@/components/layout/DesktopSidebar'
import MobileBottomNav from '@/components/layout/MobileBottomNav'

export const metadata: Metadata = {
  title: 'Practice Atlas',
  description: 'Guitar and bass practice reference — chords, songs, playlists, and practice mode.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Practice Atlas' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
            <DesktopSidebar />
            <div className="flex-1 flex flex-col min-h-screen pb-16 lg:pb-0">
              <main className="flex-1">
                {children}
              </main>
            </div>
            <MobileBottomNav />
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
