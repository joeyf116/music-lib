import { NavLink } from 'react-router-dom'
import { Home, Music2, BookOpen, ListMusic, Play, Sun, Moon, FlipHorizontal } from 'lucide-react'
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
      className="hidden lg:flex flex-col w-52 flex-shrink-0 sticky top-0 h-screen"
      style={{
        backgroundColor: '#0d0d0d',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      {/* Logo */}
      <div className="px-4 pt-5 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            <Music2 size={14} color="#fff" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.2px', color: 'var(--color-text)' }}>
            Practice Atlas
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5" aria-label="Main navigation">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-all relative"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-text)' : 'var(--color-muted)',
              backgroundColor: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    className="absolute left-0 inset-y-1 w-0.5 rounded-r"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  />
                )}
                <Icon size={15} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom controls */}
      <div className="px-2 py-3" style={{ borderTop: '1px solid var(--color-border)' }}>
        <button
          onClick={() => updatePrefs({ theme: prefs.theme === 'dark' ? 'light' : 'dark' })}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-sm transition-colors"
          style={{ color: 'var(--color-muted)' }}
        >
          {prefs.theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          {prefs.theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <button
          onClick={() => updatePrefs({ leftHanded: !prefs.leftHanded })}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-sm transition-colors"
          style={{ color: 'var(--color-muted)' }}
        >
          <FlipHorizontal size={14} />
          {prefs.leftHanded ? 'Right-handed' : 'Left-handed'}
        </button>
      </div>
    </aside>
  )
}
