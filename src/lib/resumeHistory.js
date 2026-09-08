const HISTORY_STORAGE_KEY = 'ats_resume_history_v1'
const ACTIVE_RESUME_ID_KEY = 'ats_active_resume_id_v1'

/** Safe JSON parser */
function safeParse(jsonString, fallback) {
  if (!jsonString) return fallback
  try {
    return JSON.parse(jsonString)
  } catch (err) {
    console.warn('Failed to parse JSON from localStorage', err)
    return fallback
  }
}

/**
 * Generates an automatic title from resume state data
 */
export function generateResumeTitle(data, defaultTitle = 'Untitled Resume') {
  const name = data?.basic?.fullName?.trim()
  const role = data?.basic?.jobTitle?.trim()

  if (name && role) return `${name} - ${role}`
  if (name) return `${name}'s Resume`
  if (role) return `${role} Resume`
  return defaultTitle
}

/**
 * Retrieve all saved resumes, sorted by updatedAt (newest first)
 */
export function getResumeHistory() {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
  const list = safeParse(raw, [])
  if (!Array.isArray(list)) return []

  return list.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
}

/**
 * Get active resume ID
 */
export function getActiveResumeId() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ACTIVE_RESUME_ID_KEY) || null
}

/**
 * Set active resume ID
 */
export function setActiveResumeId(id) {
  if (typeof window === 'undefined') return
  if (id) {
    window.localStorage.setItem(ACTIVE_RESUME_ID_KEY, id)
  } else {
    window.localStorage.removeItem(ACTIVE_RESUME_ID_KEY)
  }
}

/**
 * Get a specific resume record by ID
 */
export function getResumeById(id) {
  const history = getResumeHistory()
  return history.find((r) => r.id === id) || null
}

/**
 * Save or update a resume record in localStorage
 */
export function saveResumeRecord(record) {
  if (typeof window === 'undefined' || !record || !record.id) return null

  const history = getResumeHistory()
  const existingIdx = history.findIndex((r) => r.id === record.id)
  const now = new Date().toISOString()

  const updatedRecord = {
    ...record,
    createdAt: record.createdAt || now,
    updatedAt: now,
    title: record.title?.trim() || generateResumeTitle(record.data),
  }

  let nextHistory
  if (existingIdx >= 0) {
    nextHistory = [...history]
    nextHistory[existingIdx] = updatedRecord
  } else {
    nextHistory = [updatedRecord, ...history]
  }

  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory))
  return updatedRecord
}

/**
 * Create a new resume record and save it to history
 */
export function createResumeRecord(data, customTitle) {
  const id = 'res_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7)
  const now = new Date().toISOString()
  const title = customTitle || generateResumeTitle(data, 'New Resume')

  const newRecord = {
    id,
    title,
    createdAt: now,
    updatedAt: now,
    data,
  }

  saveResumeRecord(newRecord)
  setActiveResumeId(id)
  return newRecord
}

/**
 * Duplicate an existing resume
 */
export function duplicateResumeRecord(id) {
  const target = getResumeById(id)
  if (!target) return null

  const cloneId = 'res_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7)
  const now = new Date().toISOString()
  const clonedTitle = `${target.title || 'Resume'} (Copy)`

  const clonedRecord = {
    id: cloneId,
    title: clonedTitle,
    createdAt: now,
    updatedAt: now,
    data: JSON.parse(JSON.stringify(target.data)),
  }

  const history = getResumeHistory()
  const targetIdx = history.findIndex((r) => r.id === id)
  const nextHistory = [...history]
  if (targetIdx >= 0) {
    nextHistory.splice(targetIdx + 1, 0, clonedRecord)
  } else {
    nextHistory.unshift(clonedRecord)
  }

  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory))
  return clonedRecord
}

/**
 * Delete a resume record by ID.
 * Returns { remainingHistory, nextActiveId }
 */
export function deleteResumeRecord(id) {
  const history = getResumeHistory()
  const nextHistory = history.filter((r) => r.id !== id)
  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory))

  let currentActive = getActiveResumeId()
  let nextActiveId = currentActive

  if (currentActive === id) {
    nextActiveId = nextHistory.length > 0 ? nextHistory[0].id : null
    setActiveResumeId(nextActiveId)
  }

  return {
    remainingHistory: nextHistory,
    nextActiveId,
  }
}
