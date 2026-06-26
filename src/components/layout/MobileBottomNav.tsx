import { NavLink } from 'react-router-dom'
import { Home, Music2, BookOpen, ListMusic, Play } from 'lucide-react'

const NAV = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/chords', icon: Music2, label: 'Chords' },
  { to: '/songs', icon: BookOpen, label: 'Songs' },
  { to: '/playlists', icon: ListMusic, label: 'Lists' },
  { to: '/practice', icon: Play, label: 'Practice' },
]

export default function MobileBottomNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex"
      style={{
        backgroundColor: '#0d0d0d',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-label="Main navigation"
    >
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors"
          style={({ isActive }) => ({
            color: isActive ? 'var(--color-accent)' : 'var(--color-muted)',
          })}
          aria-label={label}
        >
          <Icon size={18} strokeWidth={1.75} />
          <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.02em' }}>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
