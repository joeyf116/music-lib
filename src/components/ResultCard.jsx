const TYPE_COLORS = {
  scale: { bg: '#1d4ed8', text: '#fff', label: 'Scale' },
  chord: { bg: '#15803d', text: '#fff', label: 'Chord' },
  arpeggio: { bg: '#7e22ce', text: '#fff', label: 'Arpeggio' },
  etude: { bg: '#c2410c', text: '#fff', label: 'Etude' },
  lick: { bg: '#b91c1c', text: '#fff', label: 'Lick' },
}

function MiniDiagram({ diagram }) {
  if (!diagram || !diagram.positions) return null
  const positions = diagram.positions.slice(0, 12)
  const isChord = diagram.type === 'chord'

  if (isChord) {
    const frettedPositions = positions.filter((p) => p.fret > 0)
    const startFret = frettedPositions.length > 0 ? Math.min(...frettedPositions.map((p) => p.fret)) : 1
    const isOpen = diagram.position_marker === 0
    const W = 52
    const H = 44
    const CELL = 9
    const LEFT = 6
    const TOP = 10

    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {isOpen && (
          <rect x={LEFT} y={TOP - 3} width={5 * CELL} height={3} fill="var(--color-muted)" />
        )}
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={i} x1={LEFT} y1={TOP + i * CELL} x2={LEFT + 5 * CELL} y2={TOP + i * CELL}
            stroke="var(--color-border)" strokeWidth={0.5} />
        ))}
        {Array.from({ length: 6 }).map((_, s) => (
          <line key={s} x1={LEFT + s * CELL} y1={TOP} x2={LEFT + s * CELL} y2={TOP + 3 * CELL}
            stroke="var(--color-border)" strokeWidth={0.5} />
        ))}
        {positions.map((pos, idx) => {
          const sx = LEFT + (5 - pos.string) * CELL
          if (pos.fret === -1) return (
            <text key={idx} x={sx} y={TOP - 4} textAnchor="middle" fontSize="7" fill="var(--color-muted)">×</text>
          )
          if (pos.fret === 0) return (
            <circle key={idx} cx={sx} cy={TOP - 5} r={3} fill="none"
              stroke={pos.role === 'root' ? 'var(--color-accent)' : 'var(--color-muted)'} strokeWidth={0.8} />
          )
          const fy = TOP + (pos.fret - startFret) * CELL + CELL / 2
          return (
            <circle key={idx} cx={sx} cy={fy} r={3.5}
              fill={pos.role === 'root' ? 'var(--color-accent)' : 'var(--color-text)'} />
          )
        })}
      </svg>
    )
  }

  // Scale / Arpeggio mini preview
  const frets = positions.map((p) => p.fret)
  const minF = Math.min(...frets)
  const maxF = Math.max(...frets)
  const span = Math.max(maxF - minF, 3)
  const W = 72
  const H = 44
  const CW = W / (span + 1)
  const CH = 7

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {Array.from({ length: 6 }).map((_, s) => (
        <line key={s} x1={0} y1={4 + s * CH} x2={W} y2={4 + s * CH}
          stroke="var(--color-border)" strokeWidth={0.5} />
      ))}
      {positions.map((pos, idx) => {
        const cx = (pos.fret - minF + 0.5) * CW
        const cy = 4 + (5 - pos.string) * CH
        return (
          <circle key={idx} cx={cx} cy={cy} r={3}
            fill={pos.role === 'root' ? 'var(--color-accent)' : 'var(--color-text)'} />
        )
      })}
    </svg>
  )
}

export default function ResultCard({ entry, onSelect }) {
  const typeInfo = TYPE_COLORS[entry.type] ?? { bg: '#374151', text: '#fff', label: entry.type }

  return (
    <button
      onClick={() => onSelect(entry)}
      className="w-full text-left rounded-xl border p-4 transition-all hover:scale-[1.02] active:scale-[0.99] flex flex-col gap-3"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        minHeight: '44px',
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-tight truncate" style={{ color: 'var(--color-text)' }}>
            {entry.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: typeInfo.bg, color: typeInfo.text }}
            >
              {typeInfo.label}
            </span>
            {entry.root && (
              <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-accent)' }}>
                {entry.root}
              </span>
            )}
          </div>
        </div>
        <MiniDiagram diagram={entry.diagram} />
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs capitalize" style={{ color: 'var(--color-muted)' }}>
          {entry.instrument} {entry.strings}str · {entry.tuning}
        </span>
        {entry.difficulty && (
          <span
            className="text-xs capitalize px-1.5 py-0.5 rounded border"
            style={{
              color: 'var(--color-muted)',
              borderColor: 'var(--color-border)',
            }}
          >
            {entry.difficulty}
          </span>
        )}
        {entry.bpm && (
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
            ♩{entry.bpm}bpm
          </span>
        )}
      </div>

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {entry.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-muted)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}
