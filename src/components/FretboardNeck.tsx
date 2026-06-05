import type { FretNote } from '../utils/musicTheory.ts'

// Layout constants
const FRET_W = 54     // pixels per fret cell
const STR_H = 28      // pixels between strings
const LEFT = 28       // left margin (string labels)
const TOP = 18        // top margin (fret numbers)
const BOT = 4         // bottom padding
const DOT_R = 11      // note circle radius
const NUT_W = 5       // nut bar width
const NUM_STRINGS = 6

// Standard guitar string thicknesses, index 0 = low E (thickest)
const STR_WIDTHS = [2.8, 2.2, 1.8, 1.4, 1.1, 0.8]
const STR_LABELS = ['E', 'A', 'D', 'G', 'B', 'e']

// Inlay (fret marker) positions
const SINGLE_INLAYS = new Set([3, 5, 7, 9])
const DOUBLE_INLAYS = new Set([12])

// Colors — fixed dark palette so fretboard always looks like a guitar neck
const FBOARD_BG = '#0e0a04'
const FRET_COLOR = '#4a4540'
const STRING_COLOR = '#8a8070'
const NUT_COLOR = '#e8e0d0'
const INLAY_COLOR = '#2e2820'
const ROOT_FILL = '#f97316'
const ROOT_TEXT = '#ffffff'
const NOTE_FILL = '#1e40af'
const NOTE_TEXT = '#e0e8ff'
const HIGHLIGHT_BG = 'rgba(249,115,22,0.10)'

function svgStringY(stringIdx: number, top: number): number {
  // string 5 (high e) at top, string 0 (low E) at bottom
  return top + (NUM_STRINGS - 1 - stringIdx) * STR_H
}

function svgFretX(fret: number, left: number, fretW: number): number {
  // fret 0 = open → just left of the nut
  if (fret === 0) return left - fretW * 0.38
  return left + (fret - 0.5) * fretW
}

interface FretboardNeckProps {
  notes: FretNote[]
  startFret?: number
  endFret?: number
  showNoteNames?: boolean
  /** Highlight a fret range as the "current position" */
  positionRange?: [number, number] | null
  compact?: boolean
}

export default function FretboardNeck({
  notes,
  startFret = 0,
  endFret = 14,
  showNoteNames = true,
  positionRange = null,
  compact = false,
}: FretboardNeckProps) {
  const fretW = compact ? 38 : FRET_W
  const strH = compact ? 20 : STR_H
  const dotR = compact ? 8 : DOT_R
  const fontSize = compact ? 7 : 10
  const labelFontSize = compact ? 7 : 9
  const topPad = compact ? 14 : TOP
  const nutW = compact ? 4 : NUT_W

  const numFrets = endFret - startFret
  const svgW = LEFT + numFrets * fretW + 12
  const svgH = topPad + (NUM_STRINGS - 1) * strH + BOT + (compact ? 10 : 18)

  // Filter notes to visible range
  const visibleNotes = notes.filter((n) => n.fret >= startFret && n.fret <= endFret)

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ display: 'block', maxWidth: '100%' }}
      role="img"
      aria-label="Guitar fretboard diagram"
    >
      {/* Fretboard body */}
      <rect x={LEFT} y={topPad} width={numFrets * fretW} height={(NUM_STRINGS - 1) * strH} fill={FBOARD_BG} rx="2" />

      {/* Position highlight band */}
      {positionRange && (
        <rect
          x={LEFT + (positionRange[0] - startFret - 0.5) * fretW}
          y={topPad}
          width={fretW * (positionRange[1] - positionRange[0] + 1)}
          height={(NUM_STRINGS - 1) * strH}
          fill={HIGHLIGHT_BG}
        />
      )}

      {/* Inlay dots */}
      {Array.from({ length: numFrets }, (_, i) => {
        const f = startFret + i + 1
        const cx = LEFT + (i + 0.5) * fretW
        const midY = topPad + ((NUM_STRINGS - 1) * strH) / 2
        if (SINGLE_INLAYS.has(f)) {
          return <circle key={f} cx={cx} cy={midY} r={compact ? 3 : 5} fill={INLAY_COLOR} />
        }
        if (DOUBLE_INLAYS.has(f)) {
          const qY = topPad + ((NUM_STRINGS - 1) * strH) * 0.25
          const tY = topPad + ((NUM_STRINGS - 1) * strH) * 0.75
          return (
            <g key={f}>
              <circle cx={cx} cy={qY} r={compact ? 3 : 5} fill={INLAY_COLOR} />
              <circle cx={cx} cy={tY} r={compact ? 3 : 5} fill={INLAY_COLOR} />
            </g>
          )
        }
        return null
      })}

      {/* Fret lines */}
      {Array.from({ length: numFrets + 1 }, (_, i) => {
        const isNut = startFret === 0 && i === 0
        const x = LEFT + i * fretW
        return (
          <rect
            key={i}
            x={x - (isNut ? nutW / 2 : 0.5)}
            y={topPad}
            width={isNut ? nutW : 1}
            height={(NUM_STRINGS - 1) * strH}
            fill={isNut ? NUT_COLOR : FRET_COLOR}
            rx={isNut ? 1 : 0}
          />
        )
      })}

      {/* Strings */}
      {Array.from({ length: NUM_STRINGS }, (_, s) => {
        const y = svgStringY(s, topPad)
        return (
          <line
            key={s}
            x1={LEFT}
            y1={y}
            x2={LEFT + numFrets * fretW}
            y2={y}
            stroke={STRING_COLOR}
            strokeWidth={STR_WIDTHS[s]}
          />
        )
      })}

      {/* String labels */}
      {STR_LABELS.map((label, s) => (
        <text
          key={s}
          x={LEFT - 6}
          y={svgStringY(s, topPad) + labelFontSize * 0.38}
          textAnchor="end"
          fontSize={labelFontSize}
          fontFamily="monospace"
          fill={STRING_COLOR}
        >
          {label}
        </text>
      ))}

      {/* Fret numbers */}
      {Array.from({ length: numFrets + 1 }, (_, i) => {
        const f = startFret + i
        if (f === 0) return null
        return (
          <text
            key={f}
            x={LEFT + (i - 0.5) * fretW}
            y={topPad - 4}
            textAnchor="middle"
            fontSize={labelFontSize}
            fontFamily="monospace"
            fill={FRET_COLOR}
          >
            {f}
          </text>
        )
      })}

      {/* Note circles */}
      {visibleNotes.map((note, idx) => {
        const cx = svgFretX(note.fret, LEFT + (startFret > 0 ? -startFret * fretW : 0), fretW)
        const adjustedCx = note.fret === 0
          ? LEFT - fretW * 0.38
          : LEFT + (note.fret - startFret - 0.5) * fretW
        const cy = svgStringY(note.string, topPad)
        const fill = note.isRoot ? ROOT_FILL : NOTE_FILL
        const textFill = note.isRoot ? ROOT_TEXT : NOTE_TEXT
        return (
          <g key={idx}>
            <circle cx={adjustedCx} cy={cy} r={dotR} fill={fill} />
            {showNoteNames && (
              <text
                x={adjustedCx}
                y={cy + fontSize * 0.38}
                textAnchor="middle"
                fontSize={fontSize}
                fontWeight="700"
                fontFamily="monospace"
                fill={textFill}
                style={{ userSelect: 'none' }}
              >
                {note.noteName}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
