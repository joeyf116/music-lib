import type { Diagram, DiagramPosition } from '../types.ts'

const STRING_COUNT = 6
const CHORD_FRET_ROWS = 4
const CELL_W = 36
const CELL_H = 36
const LEFT_MARGIN = 28
const TOP_MARGIN = 32
const DOT_R = 12

interface ChordDiagramProps {
  diagram: Diagram
}

function ChordDiagram({ diagram }: ChordDiagramProps) {
  const { positions = [], barre, position_marker, tuning } = diagram
  const isOpen = position_marker === 0

  const svgWidth = LEFT_MARGIN + (STRING_COUNT - 1) * CELL_W + LEFT_MARGIN
  const svgHeight = TOP_MARGIN + CHORD_FRET_ROWS * CELL_H + 20

  const frettedPositions = positions.filter((p) => p.fret > 0)
  const minFret = frettedPositions.length > 0 ? Math.min(...frettedPositions.map((p) => p.fret)) : 1
  const startFret = isOpen ? 1 : minFret

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      aria-label="Chord diagram"
    >
      {!isOpen && (
        <text
          x={LEFT_MARGIN - 6}
          y={TOP_MARGIN + CELL_H / 2 + 4}
          textAnchor="end"
          fontSize="11"
          fill="var(--color-muted)"
        >
          {startFret}fr
        </text>
      )}

      {isOpen && (
        <rect
          x={LEFT_MARGIN}
          y={TOP_MARGIN - 5}
          width={(STRING_COUNT - 1) * CELL_W}
          height={5}
          fill="var(--color-text)"
          rx="1"
        />
      )}

      {Array.from({ length: CHORD_FRET_ROWS + 1 }).map((_, i) => (
        <line
          key={i}
          x1={LEFT_MARGIN}
          y1={TOP_MARGIN + i * CELL_H}
          x2={LEFT_MARGIN + (STRING_COUNT - 1) * CELL_W}
          y2={TOP_MARGIN + i * CELL_H}
          stroke="var(--color-border)"
          strokeWidth={1}
        />
      ))}

      {Array.from({ length: STRING_COUNT }).map((_, s) => (
        <line
          key={s}
          x1={LEFT_MARGIN + s * CELL_W}
          y1={TOP_MARGIN}
          x2={LEFT_MARGIN + s * CELL_W}
          y2={TOP_MARGIN + CHORD_FRET_ROWS * CELL_H}
          stroke="var(--color-border)"
          strokeWidth={1}
        />
      ))}

      {barre && (
        <rect
          x={LEFT_MARGIN + (STRING_COUNT - 1 - barre.to_string) * CELL_W - DOT_R}
          y={TOP_MARGIN + (barre.fret - startFret) * CELL_H + CELL_H / 2 - DOT_R}
          width={(barre.to_string - barre.from_string) * CELL_W + DOT_R * 2}
          height={DOT_R * 2}
          rx={DOT_R}
          fill="var(--color-accent)"
          opacity={0.9}
        />
      )}

      {positions.map((pos: DiagramPosition, idx: number) => {
        const sx = LEFT_MARGIN + (STRING_COUNT - 1 - pos.string) * CELL_W
        if (pos.fret === -1) {
          return (
            <text
              key={idx}
              x={sx}
              y={TOP_MARGIN - 10}
              textAnchor="middle"
              fontSize="14"
              fill="var(--color-muted)"
            >
              ×
            </text>
          )
        }
        if (pos.fret === 0) {
          return (
            <circle
              key={idx}
              cx={sx}
              cy={TOP_MARGIN - 12}
              r={6}
              fill="none"
              stroke={pos.role === 'root' ? 'var(--color-accent)' : 'var(--color-muted)'}
              strokeWidth={1.5}
            />
          )
        }
        const fy = TOP_MARGIN + (pos.fret - startFret) * CELL_H + CELL_H / 2
        const fill = pos.role === 'root' ? 'var(--color-accent)' : 'var(--color-text)'
        return (
          <g key={idx}>
            <circle cx={sx} cy={fy} r={DOT_R} fill={fill} />
            {pos.finger > 0 && (
              <text
                x={sx}
                y={fy + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill={pos.role === 'root' ? '#fff' : 'var(--color-bg)'}
              >
                {pos.finger}
              </text>
            )}
          </g>
        )
      })}

      {tuning &&
        tuning.map((note, i) => (
          <text
            key={i}
            x={LEFT_MARGIN + i * CELL_W}
            y={svgHeight - 4}
            textAnchor="middle"
            fontSize="9"
            fill="var(--color-muted)"
          >
            {note}
          </text>
        ))}
    </svg>
  )
}

interface ScaleDiagramProps {
  diagram: Diagram
}

function ScaleDiagram({ diagram }: ScaleDiagramProps) {
  const { positions = [], tuning } = diagram

  if (!positions.length) return null

  const frets = positions.map((p) => p.fret)
  const minFret = Math.max(0, Math.min(...frets))
  const maxFret = Math.max(...frets)
  const fretSpan = Math.max(maxFret - minFret, 3)

  const SCALE_CELL_W = 44
  const SCALE_CELL_H = 28
  const SCALE_LEFT = 36
  const SCALE_TOP = 20
  const numFrets = fretSpan + 1

  const svgWidth = SCALE_LEFT + numFrets * SCALE_CELL_W + 20
  const svgHeight = SCALE_TOP + (STRING_COUNT - 1) * SCALE_CELL_H + 24

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      aria-label="Scale diagram"
    >
      {Array.from({ length: numFrets + 1 }).map((_, f) => {
        const fretNum = minFret + f
        return (
          <text
            key={f}
            x={SCALE_LEFT + f * SCALE_CELL_W}
            y={SCALE_TOP - 6}
            textAnchor="middle"
            fontSize="10"
            fill="var(--color-muted)"
          >
            {fretNum === 0 ? 'O' : fretNum}
          </text>
        )
      })}

      {minFret === 0 && (
        <rect
          x={SCALE_LEFT - 3}
          y={SCALE_TOP}
          width={4}
          height={(STRING_COUNT - 1) * SCALE_CELL_H}
          fill="var(--color-text)"
          rx="1"
        />
      )}

      {Array.from({ length: numFrets + 1 }).map((_, f) => (
        <line
          key={f}
          x1={SCALE_LEFT + f * SCALE_CELL_W}
          y1={SCALE_TOP}
          x2={SCALE_LEFT + f * SCALE_CELL_W}
          y2={SCALE_TOP + (STRING_COUNT - 1) * SCALE_CELL_H}
          stroke="var(--color-border)"
          strokeWidth={1}
        />
      ))}

      {Array.from({ length: STRING_COUNT }).map((_, s) => (
        <line
          key={s}
          x1={SCALE_LEFT}
          y1={SCALE_TOP + s * SCALE_CELL_H}
          x2={SCALE_LEFT + numFrets * SCALE_CELL_W}
          y2={SCALE_TOP + s * SCALE_CELL_H}
          stroke="var(--color-border)"
          strokeWidth={s === 0 || s === STRING_COUNT - 1 ? 1.5 : 1}
        />
      ))}

      {positions.map((pos: DiagramPosition, idx: number) => {
        const cx =
          pos.fret === 0
            ? SCALE_LEFT - SCALE_CELL_W * 0.3
            : SCALE_LEFT + (pos.fret - minFret) * SCALE_CELL_W - SCALE_CELL_W / 2
        const sy = SCALE_TOP + (STRING_COUNT - 1 - pos.string) * SCALE_CELL_H
        const fill = pos.role === 'root' ? 'var(--color-accent)' : 'var(--color-text)'
        const textFill = pos.role === 'root' ? '#fff' : 'var(--color-bg)'
        return (
          <g key={idx}>
            <circle cx={cx} cy={sy} r={10} fill={fill} />
            {pos.finger > 0 && (
              <text
                x={cx}
                y={sy + 4}
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill={textFill}
              >
                {pos.finger}
              </text>
            )}
          </g>
        )
      })}

      {tuning &&
        [...tuning].reverse().map((note, i) => (
          <text
            key={i}
            x={SCALE_LEFT - 8}
            y={SCALE_TOP + i * SCALE_CELL_H + 4}
            textAnchor="end"
            fontSize="9"
            fill="var(--color-muted)"
          >
            {note}
          </text>
        ))}
    </svg>
  )
}

interface FingeringDiagramProps {
  diagram: Diagram
}

export default function FingeringDiagram({ diagram }: FingeringDiagramProps) {
  if (!diagram) return null

  return (
    <div className="rounded-lg p-4 overflow-x-auto" style={{ backgroundColor: 'var(--color-bg)' }}>
      {diagram.type === 'chord' ? (
        <ChordDiagram diagram={diagram} />
      ) : (
        <ScaleDiagram diagram={diagram} />
      )}
    </div>
  )
}
