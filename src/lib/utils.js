/** Small DOM/util helpers shared across the app. */

export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

export const noop = () => {}

export function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID().slice(0, 8)
  return Math.random().toString(36).slice(2, 10)
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

export const isBlank = (v) => typeof v !== 'string' || !v.trim()

export function splitLines(text) {
  return String(text || '')
    .split('\n')
    .filter(Boolean)
}
