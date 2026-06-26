'use client'

import type { Diagram, DiagramPosition } from '@/types'

const C_STRINGS = 6
const C_ROWS = 4
const CW = 34
const CH = 34
const CL = 28
const CT = 32
const CDR = 11

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
  const svgH = CT + C_ROWS * CH + 22

  function sx(stringIdx: number): number {
    const idx = leftHanded ? stringIdx : C_STRINGS - 1 - stringIdx
    return CL + idx * CW
  }

  const tuningDisplay = leftHanded ? [...(tuning ?? [])].reverse() : tuning

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      aria-label="Chord diagram"
      style={{ display: 'block' }}
    >
      {/* Fretboard background */}
      <rect
        x={CL}
        y={CT}
        width={(C_STRINGS - 1) * CW}
        height={C_ROWS * CH}
        fill="var(--color-surface)"
      />

      {/* Fret position label */}
      {!isOpen && (
        <text
          x={CL - 6}
          y={CT + CH / 2 + 4}
          textAnchor="end"
          fontSize="10"
          fontFamily="monospace"
          fill="var(--color-muted)"
        >
          {startFret}fr
        </text>
      )}

      {/* Nut bar (open position) */}
      {isOpen && (
        <rect
          x={CL}
          y={CT - 4}
          width={(C_STRINGS - 1) * CW}
          height={4}
          fill="var(--color-text)"
        />
      )}

      {/* Fret lines */}
      {Array.from({ length: C_ROWS + 1 }, (_, i) => (
        <line
          key={i}
          x1={CL}
          y1={CT + i * CH}
          x2={CL + (C_STRINGS - 1) * CW}
          y2={CT + i * CH}
          stroke="var(--color-border)"
          strokeWidth={i === 0 ? 1.5 : 1}
        />
      ))}

      {/* String lines — uniform thin lines */}
      {Array.from({ length: C_STRINGS }, (_, s) => (
        <line
          key={s}
          x1={CL + s * CW}
          y1={CT}
          x2={CL + s * CW}
          y2={CT + C_ROWS * CH}
          stroke="var(--color-border-strong)"
          strokeWidth={1}
        />
      ))}

      {/* Barre chord bar */}
      {barre && (
        <rect
          x={sx(barre.to_string) - CDR}
          y={CT + (barre.fret - startFret) * CH + CH / 2 - CDR}
          width={(barre.to_string - barre.from_string) * CW + CDR * 2}
          height={CDR * 2}
          rx={CDR}
          fill="var(--color-accent)"
        />
      )}

      {/* Note positions */}
      {positions.map((pos: DiagramPosition, idx: number) => {
        const x = sx(pos.string)
        if (pos.fret === -1)
          return (
            <text
              key={idx}
              x={x}
              y={CT - 10}
              textAnchor="middle"
              fontSize="13"
              fill="var(--color-muted)"
            >
              ×
            </text>
          )
        if (pos.fret === 0)
          return (
            <circle
              key={idx}
              cx={x}
              cy={CT - 12}
              r={5}
              fill="none"
              stroke={pos.role === 'root' ? 'var(--color-accent)' : 'var(--color-muted)'}
              strokeWidth={1.5}
            />
          )
        const fy = CT + (pos.fret - startFret) * CH + CH / 2
        const isRoot = pos.role === 'root'
        return (
          <g key={idx}>
            <circle
              cx={x}
              cy={fy}
              r={CDR}
              fill={isRoot ? 'var(--color-accent)' : 'var(--color-text)'}
            />
            {pos.finger > 0 && (
              <text
                x={x}
                y={fy + 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fontFamily="monospace"
                fill={isRoot ? '#ffffff' : 'var(--color-bg)'}
              >
                {pos.finger}
              </text>
            )}
          </g>
        )
      })}

      {/* Tuning labels */}
      {tuningDisplay?.map((note, i) => (
        <text
          key={i}
          x={CL + i * CW}
          y={svgH - 4}
          textAnchor="middle"
          fontSize="8"
          fontFamily="monospace"
          fill="var(--color-muted)"
        >
          {note}
        </text>
      ))}
    </svg>
  )
}
