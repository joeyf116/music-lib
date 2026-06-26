import { NavLink } from 'react-router-dom'
import { Home, Music2, BookOpen, ListMusic, Play } from 'lucide-react'

const NAV = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/chords', icon: Music2, label: 'Chords' },
  { to: '/songs', icon: BookOpen, label: 'Songs' },
  { to: '/playlists', icon: ListMusic, label: 'Playlists' },
  { to: '/practice', icon: Play, label: 'Practice' },
]

export default function MobileBottomNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex border-t"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      aria-label="Main navigation"
    >
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
              isActive ? 'text-orange-500' : ''
            }`
          }
          style={({ isActive }) => ({ color: isActive ? 'var(--color-accent)' : 'var(--color-muted)' })}
          aria-label={label}
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
