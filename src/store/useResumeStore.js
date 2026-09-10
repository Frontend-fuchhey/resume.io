import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  blankResume,
  freshBasic,
  freshCertification,
  freshEducation,
  freshExperience,
  freshFormatting,
  freshHobby,
  freshProject,
  freshSkillGroup,
  freshWebsite,
  freshLanguage,
  freshAward,
  freshReference,
  freshCustomSection,
  freshCustomItem,
  defaultSectionOrder,
  defaultSectionTitles,
  blankVisibility,
} from '../lib/factory'
import { sampleData } from '../lib/sample'
import {
  getActiveResumeId,
  setActiveResumeId,
  saveResumeRecord,
  createResumeRecord,
  getResumeById,
  generateResumeTitle,
  getResumeHistory,
} from '../lib/resumeHistory'

let historyDebounceTimer = null
function debouncedPushHistory(get) {
  if (!historyDebounceTimer) {
    get().pushHistory()
  }
  clearTimeout(historyDebounceTimer)
  historyDebounceTimer = setTimeout(() => {
    historyDebounceTimer = null
  }, 1000)
}

function shiftBy(arr, from, dir) {
  const j = from + dir
  if (j < 0 || j >= arr.length) return arr
  const next = [...arr]
  const [a] = next.splice(from, 1)
  next.splice(j, 0, a)
  return next
}

/** Which factory to use per list name. */
const FACTORY = {
  experience: freshExperience,
  education: freshEducation,
  websites: freshWebsite,
  hobbies: freshHobby,
  projects: freshProject,
  certifications: freshCertification,
  languages: freshLanguage,
  awards: freshAward,
}

const patchItem = (arr, id, patch) => arr.map((it) => (it.id === id ? { ...it, ...patch } : it))

/** Extract core data payload to push to history / storage */
export function snapshotState(state) {
  return {
    basic: JSON.parse(JSON.stringify(state.basic || freshBasic())),
    experience: JSON.parse(JSON.stringify(state.experience || [])),
    education: JSON.parse(JSON.stringify(state.education || [])),
    websites: JSON.parse(JSON.stringify(state.websites || [])),
    skillGroups: JSON.parse(JSON.stringify(state.skillGroups || [])),
    hobbies: JSON.parse(JSON.stringify(state.hobbies || [])),
    projects: JSON.parse(JSON.stringify(state.projects || [])),
    certifications: JSON.parse(JSON.stringify(state.certifications || [])),
    languages: JSON.parse(JSON.stringify(state.languages || [])),
    awards: JSON.parse(JSON.stringify(state.awards || [])),
    references: JSON.parse(JSON.stringify(state.references || { mode: 'upon_request', text: 'References available upon request', items: [] })),
    customSections: JSON.parse(JSON.stringify(state.customSections || [])),
    visibility: JSON.parse(JSON.stringify(state.visibility || blankVisibility())),
    sectionOrder: JSON.parse(JSON.stringify(state.sectionOrder || defaultSectionOrder())),
    sectionTitles: JSON.parse(JSON.stringify(state.sectionTitles || defaultSectionTitles())),
    templateId: state.templateId || 'ats-studio',
    formatting: JSON.parse(JSON.stringify(state.formatting || freshFormatting())),
  }
}

export const useResumeStore = create(
  persist(
    (set, get) => ({
      ...blankResume(),

      // Active resume metadata for multi-resume management
      activeResumeId: null,
      resumeTitle: 'Untitled Resume',
      isSaving: false,
      lastSavedAt: null,

      // History stacks for Undo / Redo
      history: [],
      future: [],
      activeItem: null, // { list, id } for floating action box

      setResumeTitle: (title) => {
        set({ resumeTitle: title })
      },

      setActiveResumeId: (id) => {
        setActiveResumeId(id)
        set({ activeResumeId: id })
      },

      loadResumeData: (record) => {
        const data = record.data || record
        const id = record.id || get().activeResumeId
        const title = record.title || generateResumeTitle(data)
        if (id) setActiveResumeId(id)
        set({
          activeResumeId: id,
          resumeTitle: title,
          basic: { ...freshBasic(), ...(data.basic || {}) },
          experience: data.experience || [],
          education: data.education || [],
          websites: data.websites || [],
          skillGroups: data.skillGroups || [],
          hobbies: data.hobbies || [],
          projects: data.projects || [],
          certifications: data.certifications || [],
          languages: data.languages || [],
          awards: data.awards || [],
          references: data.references || { mode: 'upon_request', text: 'References available upon request', items: [] },
          customSections: data.customSections || [],
          visibility: { ...blankVisibility(), ...(data.visibility || {}) },
          sectionOrder: data.sectionOrder || defaultSectionOrder(),
          sectionTitles: { ...defaultSectionTitles(), ...(data.sectionTitles || {}) },
          templateId: data.templateId || 'ats-studio',
          formatting: { ...freshFormatting(), ...(data.formatting || {}) },
          history: [],
          future: [],
          activeItem: null,
        })
      },

      newResume: (templateId = 'ats-studio') => {
        const blank = blankResume()
        blank.templateId = templateId
        const record = createResumeRecord(blank, 'Untitled Resume')
        set({
          ...blank,
          sectionTitles: defaultSectionTitles(),
          activeResumeId: record.id,
          resumeTitle: record.title,
          history: [],
          future: [],
          activeItem: null,
        })
        return record
      },

      pushHistory: () => {
        const current = snapshotState(get())
        set((s) => ({
          history: [...s.history.slice(-25), current],
          future: [],
        }))
      },

      undo: () => {
        const { history, future } = get()
        if (!history.length) return
        const previous = history[history.length - 1]
        const current = snapshotState(get())
        set({
          ...previous,
          history: history.slice(0, -1),
          future: [current, ...future],
        })
      },

      redo: () => {
        const { history, future } = get()
        if (!future.length) return
        const next = future[0]
        const current = snapshotState(get())
        set({
          ...next,
          history: [...history, current],
          future: future.slice(1),
        })
      },

      setActiveItem: (item) => set({ activeItem: item }),

      // ---- basic info ------------------------------------------------
      setBasic: (patch) => {
        debouncedPushHistory(get)
        set((s) => ({ basic: { ...s.basic, ...patch } }))
      },

      // ---- section titles ---------------------------------------------
      setSectionTitle: (key, title) => {
        debouncedPushHistory(get)
        set((s) => ({
          sectionTitles: {
            ...(s.sectionTitles || defaultSectionTitles()),
            [key]: title,
          },
        }))
      },

      // ---- formatting panel controls ----------------------------------
      setFormatting: (patch) => {
        get().pushHistory()
        set((s) => ({ formatting: { ...(s.formatting || freshFormatting()), ...patch } }))
      },

      // ---- generic collections ----------------------------------------
      addItem: (list) => {
        get().pushHistory()
        const newItem = (FACTORY[list] || freshExperience)()
        set((s) => ({
          [list]: [...(s[list] || []), newItem],
          activeItem: { list, id: newItem.id },
        }))
        return newItem.id
      },

      duplicateItem: (list, id) => {
        get().pushHistory()
        const items = get()[list] || []
        const target = items.find((it) => it.id === id)
        if (!target) return
        const clone = {
          ...JSON.parse(JSON.stringify(target)),
          id: 'copy_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
        }
        const index = items.findIndex((it) => it.id === id)
        const next = [...items]
        next.splice(index + 1, 0, clone)
        set({ [list]: next, activeItem: { list, id: clone.id } })
      },

      updateItem: (list, id, patch) => {
        debouncedPushHistory(get)
        let finalPatch = patch
        if (list === 'projects') {
          if (patch.title !== undefined && patch.name === undefined) {
            finalPatch = { ...patch, name: patch.title }
          } else if (patch.name !== undefined && patch.title === undefined) {
            finalPatch = { ...patch, title: patch.name }
          }
        }
        set((s) => ({ [list]: patchItem(s[list] || [], id, finalPatch) }))
      },

      removeItem: (list, id) => {
        get().pushHistory()
        set((s) => ({
          [list]: (s[list] || []).filter((it) => it.id !== id),
          activeItem: s.activeItem?.id === id ? null : s.activeItem,
        }))
      },

      moveItem: (list, id, dir) => {
        get().pushHistory()
        set((s) => {
          const listItems = s[list] || []
          const i = listItems.findIndex((it) => it.id === id)
          return { [list]: shiftBy(listItems, i, dir) }
        })
      },

      reorderList: (list, next) => set({ [list]: next }),

      // ---- experience bullets -----------------------------------------
      addBullet: (expId) => {
        get().pushHistory()
        set((s) => ({
          experience: s.experience.map((it) =>
            it.id === expId ? { ...it, bullets: [...it.bullets, ''] } : it
          ),
        }))
      },

      setBullets: (expId, bullets) =>
        set((s) => ({
          experience: s.experience.map((it) => (it.id === expId ? { ...it, bullets } : it)),
        })),

      updateBullet: (expId, index, text) => {
        debouncedPushHistory(get)
        set((s) => ({
          experience: s.experience.map((it) => {
            if (it.id !== expId) return it
            const bullets = [...it.bullets]
            bullets[index] = text
            return { ...it, bullets }
          }),
        }))
      },

      removeBullet: (expId, index) => {
        get().pushHistory()
        set((s) => ({
          experience: s.experience.map((it) =>
            it.id === expId ? { ...it, bullets: it.bullets.filter((_, i) => i !== index) } : it
          ),
        }))
      },

      // ---- categorized skills ------------------------------------------
      addSkillGroup: () => {
        get().pushHistory()
        const newGroup = freshSkillGroup()
        set((s) => ({
          skillGroups: [...s.skillGroups, newGroup],
          activeItem: { list: 'skillGroups', id: newGroup.id },
        }))
      },

      removeSkillGroup: (gid) => {
        get().pushHistory()
        set((s) => ({ skillGroups: s.skillGroups.filter((g) => g.id !== gid) }))
      },

      renameSkillGroup: (gid, label) =>
        set((s) => ({ skillGroups: s.skillGroups.map((g) => (g.id === gid ? { ...g, label } : g)) })),

      addSkill: (gid) =>
        set((s) => ({
          skillGroups: s.skillGroups.map((g) => (g.id === gid ? { ...g, items: [...g.items, ''] } : g)),
        })),

      updateSkill: (gid, index, text) => {
        debouncedPushHistory(get)
        set((s) => ({
          skillGroups: s.skillGroups.map((g) => {
            if (g.id !== gid) return g
            const items = [...g.items]
            items[index] = text
            return { ...g, items }
          }),
        }))
      },

      removeSkill: (gid, index) =>
        set((s) => ({
          skillGroups: s.skillGroups.map((g) =>
            g.id === gid ? { ...g, items: g.items.filter((_, i) => i !== index) } : g
          ),
        })),

      // ---- section ordering ---------------------------------------------
      reorderSections: (nextOrder) => {
        get().pushHistory()
        set({ sectionOrder: nextOrder })
      },

      moveSection: (key, dir) => {
        get().pushHistory()
        set((s) => {
          const currentOrder = s.sectionOrder || defaultSectionOrder()
          const i = currentOrder.indexOf(key)
          if (i === -1) return s
          return { sectionOrder: shiftBy(currentOrder, i, dir) }
        })
      },

      // ---- references ---------------------------------------------------
      updateReferencesConfig: (patch) => {
        debouncedPushHistory(get)
        set((s) => ({
          references: {
            ...(s.references || { mode: 'upon_request', text: 'References available upon request', items: [] }),
            ...patch,
          },
        }))
      },

      addReference: () => {
        get().pushHistory()
        const newRef = freshReference()
        set((s) => ({
          references: {
            ...(s.references || { mode: 'upon_request', text: 'References available upon request', items: [] }),
            items: [...(s.references?.items || []), newRef],
          },
        }))
      },

      updateReference: (id, patch) => {
        debouncedPushHistory(get)
        set((s) => ({
          references: {
            ...(s.references || { mode: 'upon_request', text: 'References available upon request', items: [] }),
            items: (s.references?.items || []).map((it) => (it.id === id ? { ...it, ...patch } : it)),
          },
        }))
      },

      removeReference: (id) => {
        get().pushHistory()
        set((s) => ({
          references: {
            ...(s.references || { mode: 'upon_request', text: 'References available upon request', items: [] }),
            items: (s.references?.items || []).filter((it) => it.id !== id),
          },
        }))
      },

      // ---- custom sections ----------------------------------------------
      addCustomSection: (title = 'Custom Section') => {
        get().pushHistory()
        const sec = freshCustomSection(title)
        set((s) => ({
          customSections: [...(s.customSections || []), sec],
          sectionOrder: [...(s.sectionOrder || defaultSectionOrder()), `custom_${sec.id}`],
          sectionTitles: { ...(s.sectionTitles || defaultSectionTitles()), [`custom_${sec.id}`]: title },
        }))
        return sec.id
      },

      removeCustomSection: (secId) => {
        get().pushHistory()
        set((s) => ({
          customSections: (s.customSections || []).filter((cs) => cs.id !== secId),
          sectionOrder: (s.sectionOrder || defaultSectionOrder()).filter((k) => k !== `custom_${secId}` && k !== secId),
        }))
      },

      updateCustomSection: (secId, patch) => {
        debouncedPushHistory(get)
        set((s) => ({
          customSections: (s.customSections || []).map((cs) =>
            cs.id === secId ? { ...cs, ...patch } : cs
          ),
          sectionTitles: patch.title
            ? { ...(s.sectionTitles || {}), [`custom_${secId}`]: patch.title }
            : s.sectionTitles,
        }))
      },

      addCustomItem: (secId) => {
        get().pushHistory()
        const item = freshCustomItem()
        set((s) => ({
          customSections: (s.customSections || []).map((cs) =>
            cs.id === secId ? { ...cs, items: [...(cs.items || []), item] } : cs
          ),
        }))
      },

      updateCustomItem: (secId, itemId, patch) => {
        debouncedPushHistory(get)
        set((s) => ({
          customSections: (s.customSections || []).map((cs) =>
            cs.id === secId
              ? {
                  ...cs,
                  items: (cs.items || []).map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
                }
              : cs
          ),
        }))
      },

      removeCustomItem: (secId, itemId) => {
        get().pushHistory()
        set((s) => ({
          customSections: (s.customSections || []).map((cs) =>
            cs.id === secId
              ? {
                  ...cs,
                  items: (cs.items || []).filter((it) => it.id !== itemId),
                }
              : cs
          ),
        }))
      },

      // ---- import & backup ----------------------------------------------
      importResume: (data, customTitle) => {
        get().pushHistory()
        const merged = {
          basic: { ...freshBasic(), ...(data.basic || {}) },
          experience: data.experience || [],
          education: data.education || [],
          websites: data.websites || [],
          skillGroups: data.skillGroups || [],
          hobbies: data.hobbies || [],
          projects: data.projects || [],
          certifications: data.certifications || [],
          languages: data.languages || [],
          awards: data.awards || [],
          references: data.references || { mode: 'upon_request', text: 'References available upon request', items: [] },
          customSections: data.customSections || [],
          visibility: { ...blankVisibility(), ...(data.visibility || {}) },
          sectionOrder: data.sectionOrder || defaultSectionOrder(),
          sectionTitles: { ...defaultSectionTitles(), ...(data.sectionTitles || {}) },
          templateId: data.templateId || 'ats-studio',
          formatting: { ...freshFormatting(), ...(data.formatting || {}) },
        }
        const title = customTitle || generateResumeTitle(merged, 'Imported Resume')
        const record = createResumeRecord(merged, title)
        setActiveResumeId(record.id)
        set({
          ...merged,
          activeResumeId: record.id,
          resumeTitle: record.title,
          history: [],
          future: [],
          activeItem: null,
        })
        return record
      },

      // ---- meta ---------------------------------------------------------
      setTemplate: (templateId) => set({ templateId }),
      toggleSection: (key) =>
        set((s) => ({ visibility: { ...s.visibility, [key]: !s.visibility[key] } })),

      resetAll: () => {
        const blank = blankResume()
        const record = createResumeRecord(blank, 'Blank Resume')
        set(() => ({
          ...blank,
          sectionTitles: defaultSectionTitles(),
          activeResumeId: record.id,
          resumeTitle: record.title,
          history: [],
          future: [],
        }))
        return record
      },

      loadSample: () => {
        const sample = sampleData()
        const initial = { ...sample, sectionOrder: defaultSectionOrder(), sectionTitles: defaultSectionTitles() }
        const title = generateResumeTitle(initial, 'Sample Resume')
        const record = createResumeRecord(initial, title)
        set(() => ({
          ...initial,
          activeResumeId: record.id,
          resumeTitle: title,
          history: [],
          future: [],
        }))
        return record
      },
    }),
    {
      name: 'resume-io-studio-v2',
      partialize: (state) => {
        const { history, future, activeItem, isSaving, ...rest } = state
        return rest
      },
    }
  )
)

export const hasResumeData = (state) =>
  Boolean(state?.basic?.fullName?.trim() || state?.experience?.length || state?.education?.length || state?.projects?.length)

// --- Auto-Save synchronization layer with localStorage ---
let debounceTimer = null

export function syncResumeToStorage(state) {
  if (typeof window === 'undefined') return
  let activeId = state.activeResumeId || getActiveResumeId()
  const snapshot = snapshotState(state)

  // Avoid creating records if completely empty blank initial mount
  if (!activeId && !hasResumeData(state)) return

  const title = state.resumeTitle?.trim() || generateResumeTitle(snapshot)

  if (!activeId) {
    const newRec = createResumeRecord(snapshot, title)
    useResumeStore.setState({ activeResumeId: newRec.id, resumeTitle: newRec.title })
    return newRec
  }

  return saveResumeRecord({
    id: activeId,
    title,
    data: snapshot,
  })
}

// Auto-seed/migrate existing state into resume history if history is currently empty
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const history = getResumeHistory()
    const current = useResumeStore.getState()
    if (history.length === 0 && hasResumeData(current)) {
      const initialRecord = createResumeRecord(snapshotState(current), current.resumeTitle || generateResumeTitle(current))
      useResumeStore.setState({ activeResumeId: initialRecord.id, resumeTitle: initialRecord.title })
    } else if (history.length > 0) {
      const activeId = getActiveResumeId()
      if (activeId) {
        const rec = getResumeById(activeId)
        if (rec && !current.activeResumeId) {
          useResumeStore.getState().loadResumeData(rec)
        }
      }
    }
  }, 100)
}

// Subscribe to store updates to auto-save to history with debouncing
useResumeStore.subscribe((state, prevState) => {
  // Only auto-save if meaningful resume content changed
  if (state.isSaving !== prevState.isSaving) return

  // Check if core data or title changed
  const dataChanged =
    state.basic !== prevState.basic ||
    state.experience !== prevState.experience ||
    state.education !== prevState.education ||
    state.websites !== prevState.websites ||
    state.skillGroups !== prevState.skillGroups ||
    state.hobbies !== prevState.hobbies ||
    state.projects !== prevState.projects ||
    state.certifications !== prevState.certifications ||
    state.visibility !== prevState.visibility ||
    state.sectionOrder !== prevState.sectionOrder ||
    state.sectionTitles !== prevState.sectionTitles ||
    state.templateId !== prevState.templateId ||
    state.formatting !== prevState.formatting ||
    state.resumeTitle !== prevState.resumeTitle

  if (!dataChanged) return

  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const currentState = useResumeStore.getState()
    syncResumeToStorage(currentState)
    useResumeStore.setState({ isSaving: false, lastSavedAt: Date.now() })
  }, 400)
})
