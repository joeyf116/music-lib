export function parseProgression(raw: string): string[] {
  return raw.split(/[-–—,|]+/).map((s) => s.trim()).filter(Boolean)
}
