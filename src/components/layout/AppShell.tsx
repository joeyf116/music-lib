import { Outlet } from 'react-router-dom'
import MobileBottomNav from './MobileBottomNav.tsx'
import DesktopSidebar from './DesktopSidebar.tsx'

export default function AppShell() {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <DesktopSidebar />
      <div className="flex-1 flex flex-col min-h-screen pb-16 lg:pb-0">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}
