import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  blankResume,
  freshCertification,
  freshEducation,
  freshExperience,
  freshFormatting,
  freshHobby,
  freshProject,
  freshSkillGroup,
  freshWebsite,
  defaultSectionOrder,
} from '../lib/factory'
import { sampleData } from '../lib/sample'

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
}

const patchItem = (arr, id, patch) => arr.map((it) => (it.id === id ? { ...it, ...patch } : it))

/** Extract core data payload to push to history */
function snapshotState(state) {
  return {
    basic: JSON.parse(JSON.stringify(state.basic)),
    experience: JSON.parse(JSON.stringify(state.experience)),
    education: JSON.parse(JSON.stringify(state.education)),
    websites: JSON.parse(JSON.stringify(state.websites || [])),
    skillGroups: JSON.parse(JSON.stringify(state.skillGroups)),
    hobbies: JSON.parse(JSON.stringify(state.hobbies || [])),
    projects: JSON.parse(JSON.stringify(state.projects)),
    certifications: JSON.parse(JSON.stringify(state.certifications)),
    visibility: JSON.parse(JSON.stringify(state.visibility)),
    sectionOrder: JSON.parse(JSON.stringify(state.sectionOrder || defaultSectionOrder())),
    templateId: state.templateId,
    formatting: JSON.parse(JSON.stringify(state.formatting || freshFormatting())),
  }
}

export const useResumeStore = create(
  persist(
    (set, get) => ({
      ...blankResume(),

      // History stacks for Undo / Redo
      history: [],
      future: [],
      activeItem: null, // { list, id } for floating action box

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
        get().pushHistory()
        set((s) => ({ basic: { ...s.basic, ...patch } }))
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
        set((s) => ({ [list]: patchItem(s[list] || [], id, patch) }))
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

      updateBullet: (expId, index, text) =>
        set((s) => ({
          experience: s.experience.map((it) => {
            if (it.id !== expId) return it
            const bullets = [...it.bullets]
            bullets[index] = text
            return { ...it, bullets }
          }),
        })),

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

      updateSkill: (gid, index, text) =>
        set((s) => ({
          skillGroups: s.skillGroups.map((g) => {
            if (g.id !== gid) return g
            const items = [...g.items]
            items[index] = text
            return { ...g, items }
          }),
        })),

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

      // ---- import & backup ----------------------------------------------
      importResume: (data) => {
        get().pushHistory()
        set({
          basic: { ...freshBasic(), ...(data.basic || {}) },
          experience: data.experience || [],
          education: data.education || [],
          websites: data.websites || [],
          skillGroups: data.skillGroups || [],
          hobbies: data.hobbies || [],
          projects: data.projects || [],
          certifications: data.certifications || [],
          visibility: { ...blankVisibility(), ...(data.visibility || {}) },
          sectionOrder: data.sectionOrder || defaultSectionOrder(),
          templateId: data.templateId || 'ats-studio',
          formatting: { ...freshFormatting(), ...(data.formatting || {}) },
        })
      },

      // ---- meta ---------------------------------------------------------
      setTemplate: (templateId) => set({ templateId }),
      toggleSection: (key) =>
        set((s) => ({ visibility: { ...s.visibility, [key]: !s.visibility[key] } })),

      resetAll: () => set(() => ({ ...blankResume(), history: [], future: [] })),
      loadSample: () => set(() => ({ ...sampleData(), sectionOrder: defaultSectionOrder(), history: [], future: [] })),
    }),
    {
      name: 'resume-io-studio-v2',
      partialize: (state) => {
        const { history, future, activeItem, ...rest } = state
        return rest
      },
    }
  )
)

export const hasResumeData = (state) =>
  Boolean(state.basic.fullName.trim() || state.experience?.length || state.education?.length)
