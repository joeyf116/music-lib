interface Part {
  text: string
  type: 'plain' | 'technique'
  className?: string
  title?: string
}

const TECHNIQUE_MAP: Record<string, { className: string; title: string }> = {
  h: { className: 'text-yellow-400', title: 'Hammer-on' },
  p: { className: 'text-yellow-400', title: 'Pull-off' },
  '/': { className: 'text-green-400', title: 'Slide up' },
  '\\': { className: 'text-green-400', title: 'Slide down' },
  b: { className: 'text-blue-400', title: 'Bend' },
  r: { className: 'text-blue-400', title: 'Release' },
  '~': { className: 'text-purple-400', title: 'Vibrato' },
  x: { className: 'text-red-400', title: 'Muted/Dead note' },
}

function highlightLine(line: string): Part[] {
  const parts: Part[] = []
  let current = ''
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (/[0-9\-|]/.test(char)) {
      current += char
    } else {
      const isAfterDigit = i > 0 && /[0-9]/.test(line[i - 1])
      const tech = TECHNIQUE_MAP[char]
      if (tech && isAfterDigit) {
        if (current) parts.push({ text: current, type: 'plain' })
        current = ''
        parts.push({ text: char, type: 'technique', className: tech.className, title: tech.title })
      } else {
        current += char
      }
    }
  }
  if (current) parts.push({ text: current, type: 'plain' })
  return parts
}

interface TabNotationProps {
  tab: string
}

export default function TabNotation({ tab }: TabNotationProps) {
  if (!tab) return null

  const lines = tab.split('\n')

  return (
    <div className="overflow-x-auto rounded-lg p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <pre
        className="font-mono-tab text-sm leading-6 m-0"
        style={{ color: 'var(--color-text)' }}
        aria-label="Tab notation"
      >
        {lines.map((line, idx) => {
          const parts = highlightLine(line)
          return (
            <div key={idx}>
              {parts.map((part, pIdx) =>
                part.type === 'technique' ? (
                  <span key={pIdx} className={part.className} title={part.title}>
                    {part.text}
                  </span>
                ) : (
                  <span key={pIdx}>{part.text}</span>
                ),
              )}
            </div>
          )
        })}
      </pre>
      <div
        className="flex flex-wrap gap-3 mt-3 pt-3 border-t"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {[
          { symbol: 'h', label: 'Hammer-on', color: 'text-yellow-400' },
          { symbol: 'p', label: 'Pull-off', color: 'text-yellow-400' },
          { symbol: 'b', label: 'Bend', color: 'text-blue-400' },
          { symbol: 'r', label: 'Release', color: 'text-blue-400' },
          { symbol: '/', label: 'Slide up', color: 'text-green-400' },
          { symbol: '\\', label: 'Slide down', color: 'text-green-400' },
          { symbol: '~', label: 'Vibrato', color: 'text-purple-400' },
          { symbol: 'x', label: 'Mute', color: 'text-red-400' },
        ]
          .filter(({ symbol }) => tab.includes(symbol))
          .map(({ symbol, label, color }) => (
            <span key={symbol} className="flex items-center gap-1 text-xs">
              <span className={`font-mono-tab font-bold ${color}`}>{symbol}</span>
              <span style={{ color: 'var(--color-muted)' }}>{label}</span>
            </span>
          ))}
      </div>
    </div>
  )
}
