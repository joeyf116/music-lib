import { useEffect, useCallback, useMemo } from 'react'
import { X, ChevronLeft, ChevronRight, Download, Copy } from 'lucide-react'
import type { LibraryEntry, EntryType } from '../types.ts'
import { computeFretboardNotes } from '../utils/musicTheory.ts'
import TabNotation from './TabNotation.tsx'
import FingeringDiagram from './FingeringDiagram.tsx'

const TYPE_COLORS: Record<EntryType, { bg: string; text: string; label: string }> = {
  scale:    { bg: '#1d4ed8', text: '#fff', label: 'Scale' },
  chord:    { bg: '#15803d', text: '#fff', label: 'Chord' },
  arpeggio: { bg: '#7e22ce', text: '#fff', label: 'Arpeggio' },
  etude:    { bg: '#c2410c', text: '#fff', label: 'Etude' },
  lick:     { bg: '#b91c1c', text: '#fff', label: 'Lick' },
}

interface MetaBadgeProps {
  label: string
  value?: string | number
}

function MetaBadge({ label, value }: MetaBadgeProps) {
  if (!value) return null
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs border"
      style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
    >
      <span className="font-medium" style={{ color: 'var(--color-muted)' }}>{label}:</span>
      <span style={{ color: 'var(--color-text)' }}>{value}</span>
    </span>
  )
}

function ActionBtn({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:opacity-80"
      style={{
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        borderColor: 'var(--color-border)',
        minHeight: '40px',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

function copyToClipboard(text: string): void {
  navigator.clipboard?.writeText(text).catch(() => {})
}

function downloadTxt(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

interface DetailViewProps {
  entry: LibraryEntry
  entries: LibraryEntry[]
  onClose: () => void
  onSelect: (entry: LibraryEntry) => void
}

export default function DetailView({ entry, entries, onClose, onSelect }: DetailViewProps) {
  const currentIndex = entries.findIndex((e) => e.id === entry.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < entries.length - 1

  const goPrev = useCallback(() => {
    if (hasPrev) onSelect(entries[currentIndex - 1])
  }, [hasPrev, currentIndex, entries, onSelect])

  const goNext = useCallback(() => {
    if (hasNext) onSelect(entries[currentIndex + 1])
  }, [hasNext, currentIndex, entries, onSelect])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, goPrev, goNext])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Compute full-neck notes for scale/arpeggio entries
  const fullNeckNotes = useMemo(() => {
    if ((entry.type === 'scale' || entry.type === 'arpeggio') && entry.root && entry.formula) {
      return computeFretboardNotes(entry.root, entry.formula)
    }
    return undefined
  }, [entry])

  // Position range for highlighting (from fret_range field)
  const positionRange = useMemo((): [number, number] | null => {
    if (entry.fret_range && entry.fret_range.length === 2) {
      return [entry.fret_range[0], entry.fret_range[1]]
    }
    return null
  }, [entry])

  const typeInfo = TYPE_COLORS[entry.type] ?? { bg: '#374151', text: '#fff', label: entry.type }
  const isScaleOrArp = entry.type === 'scale' || entry.type === 'arpeggio'

  const exportText = [
    entry.name,
    `Type: ${entry.type}`,
    entry.root ? `Root: ${entry.root}` : '',
    `Instrument: ${entry.instrument} ${entry.strings}-string`,
    `Tuning: ${entry.tuning}`,
    entry.formula ? `Formula: ${entry.formula}` : '',
    entry.scale_type ? `Scale: ${entry.scale_type}` : '',
    entry.chord_type ? `Chord: ${entry.chord_type}` : '',
    entry.technique ? `Technique: ${entry.technique}` : '',
    entry.style ? `Style: ${entry.style}` : '',
    entry.bpm ? `BPM: ${entry.bpm}` : '',
    '', 'TAB:', entry.tab ?? '',
  ].filter(Boolean).join('\n')

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — wider on desktop to accommodate the fretboard */}
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-label={entry.name}
      >
        <div
          className="relative w-full max-h-[96dvh] sm:max-h-[92dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl flex flex-col"
          style={{ backgroundColor: 'var(--color-surface)', maxWidth: '900px' }}
        >
          {/* Sticky header */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={goPrev} disabled={!hasPrev}
                className="flex items-center justify-center rounded-lg disabled:opacity-25 transition-opacity"
                style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '40px', minWidth: '40px' }}
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="min-w-0 px-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ backgroundColor: typeInfo.bg, color: typeInfo.text }}
                  >
                    {typeInfo.label}
                  </span>
                  <h2 className="font-bold text-sm sm:text-base leading-tight truncate" style={{ color: 'var(--color-text)' }}>
                    {entry.name}
                  </h2>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                  {currentIndex + 1} of {entries.length}
                </p>
              </div>

              <button
                onClick={goNext} disabled={!hasNext}
                className="flex items-center justify-center rounded-lg disabled:opacity-25 transition-opacity"
                style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '40px', minWidth: '40px' }}
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-lg ml-2 flex-shrink-0"
              style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-muted)', minHeight: '40px', minWidth: '40px' }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-5 p-4 sm:p-5">

            {/* Meta badges */}
            <div className="flex flex-wrap gap-2">
              {entry.root && (
                <span className="px-3 py-1 rounded-full text-sm font-mono font-bold border"
                  style={{ color: '#f97316', borderColor: '#f97316' }}>
                  {entry.root}
                </span>
              )}
              <MetaBadge label="Instrument" value={`${entry.instrument} ${entry.strings}str`} />
              <MetaBadge label="Tuning" value={entry.tuning} />
              <MetaBadge label="Position" value={entry.position} />
              <MetaBadge label="Difficulty" value={entry.difficulty} />
              {entry.bpm && <MetaBadge label="BPM" value={entry.bpm} />}
              {entry.time_signature && <MetaBadge label="Time" value={entry.time_signature} />}
              {entry.technique && <MetaBadge label="Technique" value={entry.technique.replace(/_/g, ' ')} />}
              {entry.style && <MetaBadge label="Style" value={entry.style} />}
            </div>

            {/* Formula */}
            {entry.formula && (
              <div className="rounded-lg px-4 py-2.5 flex items-center gap-3" style={{ backgroundColor: 'var(--color-bg)' }}>
                <span className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>FORMULA</span>
                <span className="font-mono text-sm font-bold" style={{ color: '#f97316' }}>{entry.formula}</span>
              </div>
            )}

            {/* Context (for licks) */}
            {entry.context && (
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{entry.context}</p>
            )}

            {/* ── Fretboard / Diagram ── */}
            {entry.diagram && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold tracking-wider" style={{ color: 'var(--color-muted)' }}>
                    {isScaleOrArp ? 'FULL NECK' : 'DIAGRAM'}
                  </h3>
                  {/* Legend */}
                  {isScaleOrArp && (
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-muted)' }}>
                        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#f97316' }} />
                        Root ({entry.root})
                      </span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-muted)' }}>
                        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#1e40af' }} />
                        Scale tone
                      </span>
                      {positionRange && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-muted)' }}>
                          <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: 'rgba(249,115,22,0.25)' }} />
                          Position
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <FingeringDiagram
                  diagram={entry.diagram}
                  fullNeckNotes={fullNeckNotes}
                  positionRange={positionRange}
                />
              </div>
            )}

            {/* ── Tab Notation ── */}
            {entry.tab && (
              <div>
                <h3 className="text-xs font-bold tracking-wider mb-2" style={{ color: 'var(--color-muted)' }}>
                  TAB NOTATION
                </h3>
                <TabNotation tab={entry.tab} />
              </div>
            )}

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded"
                    style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-muted)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <ActionBtn onClick={() => copyToClipboard(entry.tab ?? '')} icon={<Copy size={13} />} label="Copy Tab" />
              <ActionBtn onClick={() => downloadTxt(`${entry.id}.txt`, exportText)} icon={<Download size={13} />} label="Download TXT" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
