'use client'

import type { Diagram, DiagramPosition } from '@/types'

const C_STRINGS = 6
const C_ROWS = 4
const CW = 36
const CH = 36
const CL = 32
const CT = 36
const CDR = 13

interface ChordBoxProps {
  diagram: Diagram
  leftHanded?: boolean
}

export default function ChordBox({ diagram, leftHanded = false }: ChordBoxProps) {
  const { positions = [], barre, position_marker, tuning } = diagram
  const isOpen = position_marker === 0

  const frettedPos = positions.filter((p) => p.fret > 0)
  const minFret = frettedPos.length > 0 ? Math.min(...frettedPos.map((p) => p.fret)) : 1
  const startFret = isOpen ? 1 : minFret

  const svgW = CL + (C_STRINGS - 1) * CW + CL
  const svgH = CT + C_ROWS * CH + 24

  function sx(stringIdx: number): number {
    const idx = leftHanded ? stringIdx : C_STRINGS - 1 - stringIdx
    return CL + idx * CW
  }

  const tuningDisplay = leftHanded ? [...(tuning ?? [])].reverse() : tuning

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} aria-label="Chord diagram" style={{ display: 'block' }}>
      <rect x={CL} y={CT} width={(C_STRINGS - 1) * CW} height={C_ROWS * CH} fill="#0e0a04" rx="2" />
      {!isOpen && (
        <text x={CL - 8} y={CT + CH / 2 + 4} textAnchor="end" fontSize="11" fontFamily="monospace" fill="#8a8070">
          {startFret}fr
        </text>
      )}
      {isOpen && <rect x={CL} y={CT - 5} width={(C_STRINGS - 1) * CW} height={5} fill="#e8e0d0" rx="1" />}
      {Array.from({ length: C_ROWS + 1 }, (_, i) => (
        <line key={i} x1={CL} y1={CT + i * CH} x2={CL + (C_STRINGS - 1) * CW} y2={CT + i * CH} stroke="#4a4540" strokeWidth={1} />
      ))}
      {Array.from({ length: C_STRINGS }, (_, s) => (
        <line key={s} x1={CL + s * CW} y1={CT} x2={CL + s * CW} y2={CT + C_ROWS * CH}
          stroke="#8a8070" strokeWidth={[2.8, 2.2, 1.8, 1.4, 1.1, 0.8][leftHanded ? s : C_STRINGS - 1 - s]} />
      ))}
      {barre && (
        <rect
          x={sx(barre.to_string) - CDR} y={CT + (barre.fret - startFret) * CH + CH / 2 - CDR}
          width={(barre.to_string - barre.from_string) * CW + CDR * 2} height={CDR * 2}
          rx={CDR} fill="#f97316" opacity={0.9}
        />
      )}
      {positions.map((pos: DiagramPosition, idx: number) => {
        const x = sx(pos.string)
        if (pos.fret === -1) return <text key={idx} x={x} y={CT - 12} textAnchor="middle" fontSize="16" fill="#8a8070">×</text>
        if (pos.fret === 0) return (
          <circle key={idx} cx={x} cy={CT - 13} r={6} fill="none"
            stroke={pos.role === 'root' ? '#f97316' : '#8a8070'} strokeWidth={1.5} />
        )
        const fy = CT + (pos.fret - startFret) * CH + CH / 2
        return (
          <g key={idx}>
            <circle cx={x} cy={fy} r={CDR} fill={pos.role === 'root' ? '#f97316' : '#1e40af'} />
            {pos.finger > 0 && (
              <text x={x} y={fy + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="monospace" fill="#ffffff">
                {pos.finger}
              </text>
            )}
          </g>
        )
      })}
      {tuningDisplay?.map((note, i) => (
        <text key={i} x={CL + i * CW} y={svgH - 4} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#8a8070">
          {note}
        </text>
      ))}
    </svg>
  )
}
