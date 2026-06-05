import { useRef } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar({ onSearch, query }) {
  const inputRef = useRef(null)

  function handleChange(e) {
    onSearch(e.target.value)
  }

  function handleClear() {
    onSearch('')
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
    }
  }

  return (
    <div className="relative flex items-center">
      <Search
        size={16}
        className="absolute left-3 pointer-events-none"
        style={{ color: 'var(--color-muted)' }}
      />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search scales, chords, licks…"
        onChange={handleChange}
        defaultValue={query}
        className="w-full pl-9 pr-9 py-2 rounded-lg text-sm outline-none border"
        style={{
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text)',
          borderColor: 'var(--color-border)',
          minHeight: '44px',
        }}
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3"
          aria-label="Clear search"
          style={{ color: 'var(--color-muted)', minHeight: '44px', minWidth: '24px' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
