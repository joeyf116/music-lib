import { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Download, Copy } from 'lucide-react'
import type { LibraryEntry, EntryType } from '../types.ts'
import TabNotation from './TabNotation.tsx'
import FingeringDiagram from './FingeringDiagram.tsx'

const TYPE_COLORS: Record<EntryType, { bg: string; text: string; label: string }> = {
  scale: { bg: '#1d4ed8', text: '#fff', label: 'Scale' },
  chord: { bg: '#15803d', text: '#fff', label: 'Chord' },
  arpeggio: { bg: '#7e22ce', text: '#fff', label: 'Arpeggio' },
  etude: { bg: '#c2410c', text: '#fff', label: 'Etude' },
  lick: { bg: '#b91c1c', text: '#fff', label: 'Lick' },
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
      <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
        {label}:
      </span>
      <span style={{ color: 'var(--color-text)' }}>{value}</span>
    </span>
  )
}

function copyToClipboard(text: string): void {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {})
  }
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

function generateSVGFromDiagram(entry: LibraryEntry): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60">
  <rect width="200" height="60" fill="#1f2937"/>
  <text x="100" y="35" text-anchor="middle" fill="#f9fafb" font-family="monospace" font-size="12">${entry.name}</text>
</svg>`
}

interface DetailViewProps {
  entry: LibraryEntry
  entries: LibraryEntry[]
  onClose: () => void
  onSelect: (entry: LibraryEntry) => void
}

export default function DetailView({ entry, entries, onClose, onSelect }: DetailViewProps) {
  const currentIndex = entries ? entries.findIndex((e) => e.id === entry.id) : -1
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
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const typeInfo = TYPE_COLORS[entry.type] ?? { bg: '#374151', text: '#fff', label: entry.type }

  const metaText = [
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
    '',
    'TAB:',
    entry.tab ?? '',
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-label={entry.name}
      >
        <div
          className="relative w-full sm:max-w-2xl max-h-[95dvh] sm:max-h-[90dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl flex flex-col"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          {/* Header */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={goPrev}
                disabled={!hasPrev}
                className="p-2 rounded-lg disabled:opacity-30 transition-opacity"
                style={{
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  minHeight: '44px',
                  minWidth: '44px',
                }}
                aria-label="Previous entry"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="min-w-0">
                <h2
                  className="font-bold text-base leading-tight truncate"
                  style={{ color: 'var(--color-text)' }}
                >
                  {entry.name}
                </h2>
                {entries && (
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                    {currentIndex + 1} / {entries.length}
                  </p>
                )}
              </div>
              <button
                onClick={goNext}
                disabled={!hasNext}
                className="p-2 rounded-lg disabled:opacity-30 transition-opacity"
                style={{
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  minHeight: '44px',
                  minWidth: '44px',
                }}
                aria-label="Next entry"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg ml-2"
              style={{
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-muted)',
                minHeight: '44px',
                minWidth: '44px',
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-6 p-5">
            <div className="flex flex-wrap gap-2">
              <span
                className="px-3 py-1 rounded-full text-sm font-semibold"
                style={{ backgroundColor: typeInfo.bg, color: typeInfo.text }}
              >
                {typeInfo.label}
              </span>
              {entry.root && (
                <span
                  className="px-3 py-1 rounded-full text-sm font-mono font-bold border"
                  style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}
                >
                  {entry.root}
                </span>
              )}
              <MetaBadge label="Instrument" value={`${entry.instrument} ${entry.strings}-string`} />
              <MetaBadge label="Tuning" value={entry.tuning} />
              <MetaBadge label="Position" value={entry.position} />
              <MetaBadge label="Difficulty" value={entry.difficulty} />
              {entry.bpm && <MetaBadge label="BPM" value={entry.bpm} />}
              {entry.time_signature && <MetaBadge label="Time" value={entry.time_signature} />}
              {entry.technique && (
                <MetaBadge label="Technique" value={entry.technique.replace(/_/g, ' ')} />
              )}
              {entry.style && <MetaBadge label="Style" value={entry.style} />}
            </div>

            {(entry.formula || entry.context) && (
              <div className="rounded-lg px-4 py-3" style={{ backgroundColor: 'var(--color-bg)' }}>
                {entry.formula && (
                  <p className="text-sm font-mono" style={{ color: 'var(--color-text)' }}>
                    <span className="font-semibold" style={{ color: 'var(--color-muted)' }}>
                      Formula:{' '}
                    </span>
                    <span style={{ color: 'var(--color-accent)' }}>{entry.formula}</span>
                  </p>
                )}
                {entry.context && (
                  <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
                    {entry.context}
                  </p>
                )}
              </div>
            )}

            {entry.diagram && (
              <div>
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: 'var(--color-muted)' }}
                >
                  DIAGRAM
                </h3>
                <FingeringDiagram diagram={entry.diagram} />
              </div>
            )}

            {entry.tab && (
              <div>
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: 'var(--color-muted)' }}
                >
                  TAB NOTATION
                </h3>
                <TabNotation tab={entry.tab} />
              </div>
            )}

            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded"
                    style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-muted)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div
              className="flex flex-wrap gap-2 pt-3 border-t"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <button
                onClick={() => copyToClipboard(entry.tab ?? '')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                style={{
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                  minHeight: '44px',
                }}
              >
                <Copy size={14} />
                Copy Tab
              </button>
              <button
                onClick={() => copyToClipboard(generateSVGFromDiagram(entry))}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                style={{
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                  minHeight: '44px',
                }}
              >
                <Copy size={14} />
                Copy SVG
              </button>
              <button
                onClick={() => downloadTxt(`${entry.id}.txt`, metaText)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                style={{
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                  minHeight: '44px',
                }}
              >
                <Download size={14} />
                Download TXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
