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
