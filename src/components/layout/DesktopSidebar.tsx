import { NavLink } from 'react-router-dom'
import { Home, Music2, BookOpen, ListMusic, Play, Settings } from 'lucide-react'
import { useApp } from '../../contexts/AppContext.tsx'

const NAV = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/chords', icon: Music2, label: 'Chords' },
  { to: '/songs', icon: BookOpen, label: 'Songs' },
  { to: '/playlists', icon: ListMusic, label: 'Playlists' },
  { to: '/practice', icon: Play, label: 'Practice' },
]

export default function DesktopSidebar() {
  const { prefs, updatePrefs } = useApp()

  return (
    <aside
      className="hidden lg:flex flex-col w-56 border-r flex-shrink-0 sticky top-0 h-screen"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
          Practice Atlas
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Main navigation">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-accent-subtle)' : 'transparent',
              color: isActive ? 'var(--color-accent)' : 'var(--color-muted)',
            })}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => updatePrefs({ theme: prefs.theme === 'dark' ? 'light' : 'dark' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-colors"
          style={{ color: 'var(--color-muted)' }}
        >
          <Settings size={18} />
          {prefs.theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <button
          onClick={() => updatePrefs({ leftHanded: !prefs.leftHanded })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-colors"
          style={{ color: 'var(--color-muted)' }}
        >
          <Music2 size={18} />
          {prefs.leftHanded ? 'Right-handed' : 'Left-handed'}
        </button>
      </div>
    </aside>
  )
}
