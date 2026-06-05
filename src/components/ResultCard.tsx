import type { LibraryEntry, EntryType, Diagram, DiagramPosition } from '../types.ts'

const TYPE_COLORS: Record<EntryType, { bg: string; text: string; label: string }> = {
  scale:    { bg: '#1d4ed8', text: '#fff', label: 'Scale' },
  chord:    { bg: '#15803d', text: '#fff', label: 'Chord' },
  arpeggio: { bg: '#7e22ce', text: '#fff', label: 'Arpeggio' },
  etude:    { bg: '#c2410c', text: '#fff', label: 'Etude' },
  lick:     { bg: '#b91c1c', text: '#fff', label: 'Lick' },
}

const STR_LABELS_TOP_TO_BOT = ['e', 'B', 'G', 'D', 'A', 'E']

// ── Mini fretboard (horizontal) for scale/arpeggio cards ──────────────────────
function MiniNeck({ positions }: { positions: DiagramPosition[] }) {
  const validPos = positions.filter((p) => p.fret >= 0)
  if (validPos.length === 0) return null

  const frets = validPos.map((p) => p.fret)
  const minF = Math.max(0, Math.min(...frets))
  const maxF = Math.max(...frets)
  const span = Math.max(maxF - minF, 3)

  const FW = 18   // fret width
  const SH = 8    // string height
  const L = 0
  const T = 2
  const W = span * FW + FW
  const H = 5 * SH + 4

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" style={{ display: 'block' }}>
      {/* Fretboard body */}
      <rect x={L} y={T} width={W} height={5 * SH} fill="#0e0a04" rx="2" />

      {/* Fret lines */}
      {Array.from({ length: span + 2 }, (_, i) => (
        <line key={i} x1={L + i * FW} y1={T} x2={L + i * FW} y2={T + 5 * SH}
          stroke="#4a4540" strokeWidth={i === 0 && minF === 0 ? 2 : 0.5} />
      ))}

      {/* Strings */}
      {Array.from({ length: 6 }, (_, s) => (
        <line key={s} x1={L} y1={T + s * SH} x2={L + W} y2={T + s * SH}
          stroke="#8a8070" strokeWidth={[0.8, 1.0, 1.3, 1.6, 2.0, 2.5][s]} />
      ))}

      {/* Note dots */}
      {validPos.map((pos, idx) => {
        const cx = L + (pos.fret - minF + 0.5) * FW
        const cy = T + (5 - pos.string) * SH
        return (
          <circle key={idx} cx={cx} cy={cy} r={4}
            fill={pos.role === 'root' ? '#f97316' : '#1e40af'} />
        )
      })}
    </svg>
  )
}

// ── Mini chord box (vertical) ─────────────────────────────────────────────────
function MiniChordBox({ positions, position_marker }: { positions: DiagramPosition[]; position_marker: number }) {
  const isOpen = position_marker === 0
  const frettedPos = positions.filter((p) => p.fret > 0)
  const startFret = frettedPos.length > 0 ? Math.min(...frettedPos.map((p) => p.fret)) : 1

  const CELL = 10
  const L = 4
  const T = 10
  const W = 5 * CELL + L * 2
  const H = 4 * CELL + T + 6

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" style={{ display: 'block' }}>
      <rect x={L} y={T} width={5 * CELL} height={3 * CELL} fill="#0e0a04" rx="1" />

      {/* Nut or position label */}
      {isOpen
        ? <rect x={L} y={T - 2} width={5 * CELL} height={2.5} fill="#e8e0d0" rx="0.5" />
        : <text x={L - 2} y={T + CELL + 2} textAnchor="end" fontSize="6" fill="#8a8070" fontFamily="monospace">{startFret}fr</text>
      }

      {/* Frets */}
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={L} y1={T + i * CELL} x2={L + 5 * CELL} y2={T + i * CELL}
          stroke="#4a4540" strokeWidth={0.5} />
      ))}

      {/* Strings */}
      {[0, 1, 2, 3, 4, 5].map((s) => (
        <line key={s} x1={L + s * CELL} y1={T} x2={L + s * CELL} y2={T + 3 * CELL}
          stroke="#8a8070" strokeWidth={0.5} />
      ))}

      {/* Dots */}
      {positions.map((pos, idx) => {
        const sx = L + (5 - pos.string) * CELL
        if (pos.fret === -1) return <text key={idx} x={sx} y={T - 4} textAnchor="middle" fontSize="7" fill="#8a8070">×</text>
        if (pos.fret === 0) return <circle key={idx} cx={sx} cy={T - 5} r={3} fill="none"
          stroke={pos.role === 'root' ? '#f97316' : '#8a8070'} strokeWidth={0.8} />
        const fy = T + (pos.fret - startFret) * CELL + CELL / 2
        return <circle key={idx} cx={sx} cy={fy} r={4}
          fill={pos.role === 'root' ? '#f97316' : '#1e40af'} />
      })}
    </svg>
  )
}

interface MiniDiagramProps {
  diagram?: Diagram
}

function MiniDiagram({ diagram }: MiniDiagramProps) {
  if (!diagram?.positions?.length) return null
  const positions = diagram.positions.slice(0, 16)

  if (diagram.type === 'chord') {
    return <MiniChordBox positions={positions} position_marker={diagram.position_marker} />
  }
  return <MiniNeck positions={positions} />
}

// ── Card ──────────────────────────────────────────────────────────────────────

interface ResultCardProps {
  entry: LibraryEntry
  onSelect: (entry: LibraryEntry) => void
}

export default function ResultCard({ entry, onSelect }: ResultCardProps) {
  const typeInfo = TYPE_COLORS[entry.type] ?? { bg: '#374151', text: '#fff', label: entry.type }

  return (
    <button
      onClick={() => onSelect(entry)}
      className="w-full text-left rounded-xl border p-3 transition-all hover:scale-[1.015] active:scale-[0.99] flex flex-col gap-2.5 group"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span
              className="inline-block px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: typeInfo.bg, color: typeInfo.text }}
            >
              {typeInfo.label}
            </span>
            {entry.root && (
              <span className="text-xs font-mono font-bold" style={{ color: '#f97316' }}>
                {entry.root}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-sm leading-snug" style={{ color: 'var(--color-text)' }}>
            {entry.name}
          </h3>
        </div>
        <div className="flex-shrink-0 mt-0.5">
          <MiniDiagram diagram={entry.diagram} />
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-xs capitalize" style={{ color: 'var(--color-muted)' }}>
          {entry.instrument} {entry.strings}str
        </span>
        <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
          {entry.tuning}
        </span>
        {entry.position && (
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
            {entry.position} pos
          </span>
        )}
        {entry.difficulty && (
          <span className="text-xs capitalize px-1.5 py-0.5 rounded border"
            style={{ color: 'var(--color-muted)', borderColor: 'var(--color-border)' }}>
            {entry.difficulty}
          </span>
        )}
        {entry.bpm && (
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>♩{entry.bpm}</span>
        )}
      </div>

      {/* Formula preview for scales */}
      {entry.formula && (
        <p className="text-xs font-mono truncate" style={{ color: 'var(--color-muted)' }}>
          {entry.formula}
        </p>
      )}

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {entry.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-1.5 py-0.5 rounded"
              style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-muted)' }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}
