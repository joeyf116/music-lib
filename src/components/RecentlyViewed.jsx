const TYPE_COLORS = {
  scale: '#1d4ed8',
  chord: '#15803d',
  arpeggio: '#7e22ce',
  etude: '#c2410c',
  lick: '#b91c1c',
}

export default function RecentlyViewed({ entries, onSelect }) {
  if (!entries || entries.length === 0) return null

  return (
    <div
      className="border-t py-3"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="px-4 mb-2">
        <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
          RECENTLY VIEWED
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-1">
        {entries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry)}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors hover:border-orange-500"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              minHeight: '44px',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: TYPE_COLORS[entry.type] ?? '#374151' }}
            />
            <span
              className="whitespace-nowrap text-xs font-medium"
              style={{ color: 'var(--color-text)' }}
            >
              {entry.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
