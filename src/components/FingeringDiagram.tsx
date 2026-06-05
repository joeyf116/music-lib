import type { Diagram, DiagramPosition } from '../types.ts'
import type { FretNote } from '../utils/musicTheory.ts'
import FretboardNeck from './FretboardNeck.tsx'

// ─── Chord box ────────────────────────────────────────────────────────────────

const C_STRINGS = 6
const C_ROWS = 4
const CW = 36
const CH = 36
const CL = 32
const CT = 36
const CDR = 13

interface ChordDiagramProps {
  diagram: Diagram
}

function ChordDiagram({ diagram }: ChordDiagramProps) {
  const { positions = [], barre, position_marker, tuning } = diagram
  const isOpen = position_marker === 0

  const frettedPos = positions.filter((p) => p.fret > 0)
  const minFret = frettedPos.length > 0 ? Math.min(...frettedPos.map((p) => p.fret)) : 1
  const startFret = isOpen ? 1 : minFret

  const svgW = CL + (C_STRINGS - 1) * CW + CL
  const svgH = CT + C_ROWS * CH + 24

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} aria-label="Chord diagram" style={{ display: 'block' }}>
      {/* Background */}
      <rect x={CL} y={CT} width={(C_STRINGS - 1) * CW} height={C_ROWS * CH} fill="#0e0a04" rx="2" />

      {/* Position marker */}
      {!isOpen && (
        <text x={CL - 8} y={CT + CH / 2 + 4} textAnchor="end" fontSize="11" fontFamily="monospace" fill="#8a8070">
          {startFret}fr
        </text>
      )}

      {/* Nut */}
      {isOpen && (
        <rect x={CL} y={CT - 5} width={(C_STRINGS - 1) * CW} height={5} fill="#e8e0d0" rx="1" />
      )}

      {/* Fret lines */}
      {Array.from({ length: C_ROWS + 1 }, (_, i) => (
        <line key={i} x1={CL} y1={CT + i * CH} x2={CL + (C_STRINGS - 1) * CW} y2={CT + i * CH}
          stroke="#4a4540" strokeWidth={1} />
      ))}

      {/* String lines (varying thickness) */}
      {Array.from({ length: C_STRINGS }, (_, s) => (
        <line key={s}
          x1={CL + s * CW} y1={CT}
          x2={CL + s * CW} y2={CT + C_ROWS * CH}
          stroke="#8a8070"
          strokeWidth={[2.8, 2.2, 1.8, 1.4, 1.1, 0.8][C_STRINGS - 1 - s]}
        />
      ))}

      {/* Barre */}
      {barre && (
        <rect
          x={CL + (C_STRINGS - 1 - barre.to_string) * CW - CDR}
          y={CT + (barre.fret - startFret) * CH + CH / 2 - CDR}
          width={(barre.to_string - barre.from_string) * CW + CDR * 2}
          height={CDR * 2}
          rx={CDR}
          fill="#f97316"
          opacity={0.9}
        />
      )}

      {/* Finger dots */}
      {positions.map((pos: DiagramPosition, idx: number) => {
        const sx = CL + (C_STRINGS - 1 - pos.string) * CW
        if (pos.fret === -1) {
          return (
            <text key={idx} x={sx} y={CT - 12} textAnchor="middle" fontSize="16" fill="#8a8070">×</text>
          )
        }
        if (pos.fret === 0) {
          return (
            <circle key={idx} cx={sx} cy={CT - 13} r={6}
              fill="none"
              stroke={pos.role === 'root' ? '#f97316' : '#8a8070'}
              strokeWidth={1.5}
            />
          )
        }
        const fy = CT + (pos.fret - startFret) * CH + CH / 2
        const fill = pos.role === 'root' ? '#f97316' : '#1e40af'
        const textFill = '#ffffff'
        return (
          <g key={idx}>
            <circle cx={sx} cy={fy} r={CDR} fill={fill} />
            {pos.finger > 0 && (
              <text x={sx} y={fy + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="monospace" fill={textFill}>
                {pos.finger}
              </text>
            )}
          </g>
        )
      })}

      {/* String/tuning labels at bottom */}
      {tuning?.map((note, i) => (
        <text key={i} x={CL + i * CW} y={svgH - 4}
          textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#8a8070">
          {note}
        </text>
      ))}
    </svg>
  )
}

// ─── Public component ─────────────────────────────────────────────────────────

interface FingeringDiagramProps {
  diagram: Diagram
  /** Pre-computed full-neck notes for scale/arpeggio view */
  fullNeckNotes?: FretNote[]
  positionRange?: [number, number] | null
}

export default function FingeringDiagram({ diagram, fullNeckNotes, positionRange }: FingeringDiagramProps) {
  if (!diagram) return null

  if (diagram.type === 'chord') {
    return (
      <div className="overflow-x-auto rounded-xl p-4" style={{ backgroundColor: '#0e0a04' }}>
        <ChordDiagram diagram={diagram} />
      </div>
    )
  }

  // Scale / arpeggio: use full-neck view if available, otherwise fall back to position-only
  if (fullNeckNotes && fullNeckNotes.length > 0) {
    return (
      <div className="overflow-x-auto rounded-xl p-3" style={{ backgroundColor: '#0e0a04' }}>
        <FretboardNeck
          notes={fullNeckNotes}
          startFret={0}
          endFret={14}
          showNoteNames={true}
          positionRange={positionRange}
        />
      </div>
    )
  }

  // Fallback: build notes from diagram.positions
  const fallbackNotes: FretNote[] = (diagram.positions ?? []).map((p) => ({
    string: p.string,
    fret: p.fret,
    noteName: '',
    isRoot: p.role === 'root',
    semitone: 0,
  }))

  const frets = fallbackNotes.map((n) => n.fret).filter((f) => f >= 0)
  const minF = frets.length ? Math.max(0, Math.min(...frets)) : 0
  const maxF = frets.length ? Math.max(...frets) : 5

  return (
    <div className="overflow-x-auto rounded-xl p-3" style={{ backgroundColor: '#0e0a04' }}>
      <FretboardNeck
        notes={fallbackNotes}
        startFret={minF}
        endFret={maxF + 1}
        showNoteNames={false}
      />
    </div>
  )
}
