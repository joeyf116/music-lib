import { X } from 'lucide-react'

const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const CONTENT_TYPES = ['scale', 'chord', 'arpeggio', 'etude', 'lick']
const SCALE_TYPES = [
  { value: 'minor_pentatonic', label: 'Minor Pentatonic' },
  { value: 'major_pentatonic', label: 'Major Pentatonic' },
  { value: 'major', label: 'Major' },
  { value: 'natural_minor', label: 'Natural Minor' },
  { value: 'blues', label: 'Blues' },
  { value: 'dorian', label: 'Dorian' },
  { value: 'mixolydian', label: 'Mixolydian' },
  { value: 'phrygian', label: 'Phrygian' },
  { value: 'lydian', label: 'Lydian' },
]
const CHORD_TYPES = [
  { value: 'major', label: 'Major' },
  { value: 'minor', label: 'Minor' },
  { value: 'dominant7', label: 'Dominant 7' },
  { value: 'maj7', label: 'Maj7' },
  { value: 'minor7', label: 'Minor 7' },
  { value: 'diminished', label: 'Diminished' },
  { value: 'augmented', label: 'Augmented' },
]
const POSITIONS = ['Open', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '12th']
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']
const STYLES = ['blues', 'jazz', 'rock', 'funk', 'country', 'classical']

function Chip({ label, onRemove }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
    >
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label} filter`}>
        <X size={10} />
      </button>
    </span>
  )
}

function SelectFilter({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-muted)' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
        style={{
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text)',
          borderColor: 'var(--color-border)',
          minHeight: '44px',
        }}
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function FilterPanel({ filters, onSetFilter, onClearFilters, activeFilterCount }) {
  const showScaleType = !filters.contentType || filters.contentType === 'scale' || filters.contentType === 'arpeggio' || filters.contentType === 'etude'
  const showChordType = !filters.contentType || filters.contentType === 'chord' || filters.contentType === 'arpeggio'
  const showStyle = !filters.contentType || filters.contentType === 'lick'
  const showDifficulty = !filters.contentType || filters.contentType === 'etude'

  const activeChips = []
  if (filters.instrument && filters.instrument !== 'guitar') activeChips.push({ key: 'instrument', label: filters.instrument })
  if (filters.strings) activeChips.push({ key: 'strings', label: `${filters.strings}-string` })
  if (filters.tuning) activeChips.push({ key: 'tuning', label: filters.tuning })
  if (filters.contentType) activeChips.push({ key: 'contentType', label: filters.contentType })
  if (filters.root) activeChips.push({ key: 'root', label: `Root: ${filters.root}` })
  if (filters.scaleType) activeChips.push({ key: 'scaleType', label: filters.scaleType.replace(/_/g, ' ') })
  if (filters.chordType) activeChips.push({ key: 'chordType', label: filters.chordType })
  if (filters.position) activeChips.push({ key: 'position', label: `${filters.position} pos` })
  if (filters.difficulty) activeChips.push({ key: 'difficulty', label: filters.difficulty })
  if (filters.style) activeChips.push({ key: 'style', label: filters.style })

  return (
    <aside
      className="flex flex-col gap-5 p-4 overflow-y-auto"
      style={{ color: 'var(--color-text)' }}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm" style={{ color: 'var(--color-muted)' }}>
          FILTERS
        </h2>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs font-medium"
            style={{ color: 'var(--color-accent)' }}
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {activeChips.map((chip) => (
            <Chip
              key={chip.key}
              label={chip.label}
              onRemove={() => onSetFilter(chip.key, '')}
            />
          ))}
        </div>
      )}

      {/* Instrument */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>
          INSTRUMENT
        </label>
        <div className="flex gap-2">
          {['guitar', 'bass'].map((inst) => (
            <button
              key={inst}
              onClick={() => onSetFilter('instrument', inst)}
              className="flex-1 py-2 rounded-lg text-sm font-medium capitalize border transition-colors"
              style={{
                minHeight: '44px',
                backgroundColor: filters.instrument === inst ? 'var(--color-accent)' : 'var(--color-bg)',
                color: filters.instrument === inst ? '#fff' : 'var(--color-text)',
                borderColor: filters.instrument === inst ? 'var(--color-accent)' : 'var(--color-border)',
              }}
            >
              {inst}
            </button>
          ))}
        </div>
      </div>

      {/* Content type */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>
          TYPE
        </label>
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => onSetFilter('contentType', filters.contentType === t ? '' : t)}
              className="px-3 py-1 rounded-full text-xs font-medium capitalize border transition-colors"
              style={{
                minHeight: '36px',
                backgroundColor: filters.contentType === t ? 'var(--color-accent)' : 'var(--color-bg)',
                color: filters.contentType === t ? '#fff' : 'var(--color-text)',
                borderColor: filters.contentType === t ? 'var(--color-accent)' : 'var(--color-border)',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Root / Key */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>
          ROOT / KEY
        </label>
        <div className="flex flex-wrap gap-1">
          {ROOTS.map((r) => (
            <button
              key={r}
              onClick={() => onSetFilter('root', filters.root === r ? '' : r)}
              className="w-9 h-9 rounded-lg text-xs font-mono font-semibold border transition-colors"
              style={{
                backgroundColor: filters.root === r ? 'var(--color-accent)' : 'var(--color-bg)',
                color: filters.root === r ? '#fff' : 'var(--color-text)',
                borderColor: filters.root === r ? 'var(--color-accent)' : 'var(--color-border)',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Scale type */}
      {showScaleType && (
        <SelectFilter
          label="SCALE TYPE"
          value={filters.scaleType}
          options={SCALE_TYPES}
          onChange={(v) => onSetFilter('scaleType', v)}
        />
      )}

      {/* Chord type */}
      {showChordType && (
        <SelectFilter
          label="CHORD TYPE"
          value={filters.chordType}
          options={CHORD_TYPES}
          onChange={(v) => onSetFilter('chordType', v)}
        />
      )}

      {/* Position */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>
          POSITION
        </label>
        <div className="flex flex-wrap gap-1">
          {POSITIONS.map((pos) => (
            <button
              key={pos}
              onClick={() => onSetFilter('position', filters.position === pos ? '' : pos)}
              className="px-2 py-1 rounded-lg text-xs font-medium border transition-colors"
              style={{
                minHeight: '36px',
                backgroundColor: filters.position === pos ? 'var(--color-accent)' : 'var(--color-bg)',
                color: filters.position === pos ? '#fff' : 'var(--color-text)',
                borderColor: filters.position === pos ? 'var(--color-accent)' : 'var(--color-border)',
              }}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      {showDifficulty && (
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>
            DIFFICULTY
          </label>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => onSetFilter('difficulty', filters.difficulty === d ? '' : d)}
                className="flex-1 py-2 rounded-lg text-xs font-medium capitalize border transition-colors"
                style={{
                  minHeight: '40px',
                  backgroundColor: filters.difficulty === d ? 'var(--color-accent)' : 'var(--color-bg)',
                  color: filters.difficulty === d ? '#fff' : 'var(--color-text)',
                  borderColor: filters.difficulty === d ? 'var(--color-accent)' : 'var(--color-border)',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Style (for licks) */}
      {showStyle && (
        <SelectFilter
          label="STYLE"
          value={filters.style}
          options={STYLES}
          onChange={(v) => onSetFilter('style', v)}
        />
      )}

      {/* Tuning */}
      <SelectFilter
        label="TUNING"
        value={filters.tuning}
        options={[
          { value: 'standard', label: 'Standard (EADGBe)' },
          { value: 'drop_d', label: 'Drop D' },
          { value: 'open_g', label: 'Open G' },
        ]}
        onChange={(v) => onSetFilter('tuning', v)}
      />
    </aside>
  )
}
