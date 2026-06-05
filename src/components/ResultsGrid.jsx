import ResultCard from './ResultCard.jsx'

export default function ResultsGrid({ entries, onSelect, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Count header */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Showing <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{entries.length}</span> result{entries.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Grid */}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="text-4xl">🎸</div>
          <p className="text-base font-medium" style={{ color: 'var(--color-muted)' }}>
            No entries match these filters
          </p>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            Try adjusting your search or clearing filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {entries.map((entry) => (
            <ResultCard key={entry.id} entry={entry} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}
