const TECHNIQUE_PATTERNS = [
  { pattern: /h/g, className: 'text-yellow-400', title: 'Hammer-on' },
  { pattern: /p/g, className: 'text-yellow-400', title: 'Pull-off' },
  { pattern: /\//g, className: 'text-green-400', title: 'Slide up' },
  { pattern: /\\/g, className: 'text-green-400', title: 'Slide down' },
  { pattern: /b/g, className: 'text-blue-400', title: 'Bend' },
  { pattern: /r/g, className: 'text-blue-400', title: 'Release' },
  { pattern: /~/g, className: 'text-purple-400', title: 'Vibrato' },
  { pattern: /x/g, className: 'text-red-400', title: 'Muted/Dead note' },
]

function highlightLine(line) {
  // Split line into segments, highlighting technique characters
  const parts = []
  let current = ''
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    // Check if this char is a pipe, digit, dash — keep plain
    if (/[0-9\-\|]/.test(char)) {
      current += char
    } else {
      // Check for technique chars after digits only (not in string label portion)
      const isAfterDigit = i > 0 && /[0-9]/.test(line[i - 1])
      const isTechnique = /[hpb/\\r~x]/.test(char)
      if (isTechnique && isAfterDigit) {
        if (current) parts.push({ text: current, type: 'plain' })
        current = ''
        const techClass = TECHNIQUE_PATTERNS.find((t) => t.pattern.source === char.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') || t.pattern.test(char))
        parts.push({ text: char, type: 'technique', className: techClass?.className ?? 'text-yellow-400' })
      } else {
        current += char
      }
    }
  }
  if (current) parts.push({ text: current, type: 'plain' })
  return parts
}

export default function TabNotation({ tab }) {
  if (!tab) return null

  const lines = tab.split('\n')

  return (
    <div
      className="overflow-x-auto rounded-lg p-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <pre
        className="font-mono-tab text-sm leading-6 m-0"
        style={{ color: 'var(--color-text)' }}
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
                )
              )}
            </div>
          )
        })}
      </pre>
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
        {[
          { symbol: 'h', label: 'Hammer-on', color: 'text-yellow-400' },
          { symbol: 'p', label: 'Pull-off', color: 'text-yellow-400' },
          { symbol: 'b', label: 'Bend', color: 'text-blue-400' },
          { symbol: 'r', label: 'Release', color: 'text-blue-400' },
          { symbol: '/', label: 'Slide up', color: 'text-green-400' },
          { symbol: '\\', label: 'Slide down', color: 'text-green-400' },
          { symbol: '~', label: 'Vibrato', color: 'text-purple-400' },
          { symbol: 'x', label: 'Mute', color: 'text-red-400' },
        ].filter(({ symbol }) => tab.includes(symbol)).map(({ symbol, label, color }) => (
          <span key={symbol} className="flex items-center gap-1 text-xs">
            <span className={`font-mono-tab font-bold ${color}`}>{symbol}</span>
            <span style={{ color: 'var(--color-muted)' }}>{label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
