import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from '../lib/utils'

/**
 * App-chrome state: dark/light theme + toast queue.
 * Resume content lives separately in useResumeStore.
 */
export const useUIStore = create(
  (set, get) => ({
    toasts: [],
    pushToast: (message, kind = 'success') => {
      const id = uid()
      set((s) => ({ toasts: [...s.toasts.slice(-3), { id, message, kind }] }))
      setTimeout(() => get().dismissToast(id), 3800)
    },
    dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  })
)

/** Imperative helper: `toast('Saved')` / `toast('Oops', 'error')`. */
export const toast = (message, kind = 'success') => useUIStore.getState().pushToast(message, kind)
