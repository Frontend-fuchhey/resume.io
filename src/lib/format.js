import { uid } from './utils'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Accepts "YYYY-MM" or "YYYY" or a Date-like value; returns e.g. "Mar 2021". */
export function prettyDate(value) {
  if (!value) return ''
  const text = String(value)
  if (/^\d{4}$/.test(text)) return text
  if (/^\d{4}-\d{2}/.test(text)) {
    const [y, m] = text.split('-').map(Number)
    if (m >= 1 && m <= 12) return `${MONTHS[m - 1]} ${y}`
    return String(y)
  }
  const d = new Date(value)
  if (!Number.isNaN(d.getTime())) {
    return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
  }
  return text
}

export function dateRange(item, endLabel = 'Present') {
  const start = prettyDate(item.startDate)
  const end = item.current ? endLabel : prettyDate(item.endDate)
  if (start && end) return `${start} — ${end}`
  return start || end
}

/**
 * Cleans a URL for clean display text:
 * Trims https://, http://, www., and trailing slashes.
 * e.g., "https://github.com/shrawankarki/" -> "github.com/shrawankarki"
 */
export function cleanUrl(raw = '') {
  if (!raw) return ''
  return String(raw)
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '')
}

/**
 * Ensures URL has protocol for clickable href attributes.
 */
export function toHref(raw = '') {
  if (!raw) return '#'
  const trimmed = String(raw).trim()
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed) || /^tel:/i.test(trimmed)) {
    return trimmed
  }
  return `https://${trimmed}`
}

