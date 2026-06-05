import { Sun, Moon, Music } from 'lucide-react'

interface HeaderProps {
  theme: string
  onToggleTheme: () => void
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-4 py-3 border-b"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          <Music size={20} color="#fff" />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-none" style={{ color: 'var(--color-text)' }}>
            GuitarRef
          </h1>
          <p className="text-xs leading-tight" style={{ color: 'var(--color-muted)' }}>
            Guitar &amp; Bass Reference
          </p>
        </div>
      </div>

      <button
        onClick={onToggleTheme}
        className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
        style={{
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-muted)',
          minHeight: '44px',
          minWidth: '44px',
        }}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  )
}
