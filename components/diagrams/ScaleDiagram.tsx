'use client'

import type { Diagram, DiagramPosition } from '@/types'

// Layout constants — generous spacing so multiple dots per string never crowd
const SW  = 38   // string column width
const FH  = 36   // fret row height
const PL  = 30   // left pad (fret numbers)
const PT  = 24   // top pad (string names)
const PR  = 10   // right pad
const PB  = 4    // bottom pad
const DR  = 8    // dot radius
const N   = 6    // number of strings
const ROWS = 4   // visible fret rows

interface ScaleDiagramProps {
  diagram: Diagram
  leftHanded?: boolean
}

export default function ScaleDiagram({ diagram, leftHanded = false }: ScaleDiagramProps) {
  const { positions = [], position_marker, tuning } = diagram
  const isOpen = position_marker === 0
  const startFret = isOpen ? 0 : position_marker

  const gridW = (N - 1) * SW
  const svgW  = PL + gridW + PR
  const svgH  = PT + ROWS * FH + PB

  // Map string index to x-coordinate, respecting handedness
  function sx(stringIdx: number): number {
    const col = leftHanded ? stringIdx : (N - 1 - stringIdx)
    return PL + col * SW
  }

  const stringLabels = leftHanded
    ? [...(tuning ?? ['E','A','D','G','B','e'])].reverse()
    : tuning ?? ['E','A','D','G','B','e']

  // Separate open-string notes (fret 0) from fretted notes
  const openNotes  = positions.filter(p => p.fret === 0)
  const frettedPos = positions.filter(p => p.fret > 0)

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      aria-label="Scale diagram"
      style={{ display: 'block' }}
    >
      {/* String name labels */}
      {stringLabels.map((label, i) => (
        <text
          key={i}
          x={PL + i * SW}
          y={PT - 8}
          textAnchor="middle"
          fontSize="9"
          fontFamily="sans-serif"
          fontWeight="600"
          fill="var(--color-muted)"
        >
          {label}
        </text>
      ))}

      {/* Nut bar — only for open position */}
      {isOpen && (
        <rect
          x={PL}
          y={PT}
          width={gridW}
          height={4}
          rx={1}
          fill="var(--color-text)"
        />
      )}

      {/* Fret grid lines */}
      {Array.from({ length: ROWS + 1 }, (_, i) => (
        <line
          key={i}
          x1={PL}
          y1={PT + i * FH}
          x2={PL + gridW}
          y2={PT + i * FH}
          stroke="var(--color-border)"
          strokeWidth={i === 0 ? 1.5 : 1}
        />
      ))}

      {/* String lines */}
      {Array.from({ length: N }, (_, i) => (
        <line
          key={i}
          x1={PL + i * SW}
          y1={PT}
          x2={PL + i * SW}
          y2={PT + ROWS * FH}
          stroke="var(--color-border-strong)"
          strokeWidth={1}
        />
      ))}

      {/* Fret number labels */}
      {Array.from({ length: ROWS }, (_, i) => {
        const fretNum = isOpen ? i + 1 : startFret + i
        return (
          <text
            key={i}
            x={PL - 6}
            y={PT + i * FH + FH / 2 + 4}
            textAnchor="end"
            fontSize="9"
            fontFamily="sans-serif"
            fill="var(--color-muted)"
          >
            {fretNum}
          </text>
        )
      })}

      {/* Open-string note circles (above nut for open position) */}
      {openNotes.map((pos: DiagramPosition, idx: number) => (
        <circle
          key={`open-${idx}`}
          cx={sx(pos.string)}
          cy={PT - 10}
          r={6}
          fill={pos.role === 'root' ? 'var(--color-accent)' : 'none'}
          stroke={pos.role === 'root' ? 'var(--color-accent)' : 'var(--color-border-strong)'}
          strokeWidth={1.5}
        />
      ))}

      {/* Fretted note dots — no finger numbers, root distinguished by accent fill */}
      {frettedPos.map((pos: DiagramPosition, idx: number) => {
        const rowIdx = pos.fret - (isOpen ? 1 : startFret)
        if (rowIdx < 0 || rowIdx >= ROWS) return null
        const x  = sx(pos.string)
        const cy = PT + rowIdx * FH + FH / 2
        const isRoot = pos.role === 'root'
        return (
          <circle
            key={idx}
            cx={x}
            cy={cy}
            r={DR}
            fill={isRoot ? 'var(--color-accent)' : 'var(--color-text)'}
          />
        )
      })}
    </svg>
  )
}
