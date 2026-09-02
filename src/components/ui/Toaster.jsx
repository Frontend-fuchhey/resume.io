import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'

const ICONS = {
  success: { icon: CheckCircle2, cls: 'text-[#1E7E34]' },
  error: { icon: AlertCircle, cls: 'text-rose-600' },
  info: { icon: Info, cls: 'text-[#FF5E1A]' },
}

export function Toaster() {
  const toasts = useUIStore((s) => s.toasts || [])
  const dismiss = useUIStore((s) => s.dismissToast)

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex w-[min(92vw,360px)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const meta = ICONS[t.kind] || ICONS.success
          const Icon = meta.icon
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.92 }}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-[#E8E4DC] bg-white px-4 py-3 shadow-toolbar"
            >
              <Icon size={16} className={`mt-0.5 shrink-0 ${meta.cls}`} />
              <p className="flex-1 text-xs font-medium text-[#1A1A1A]">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded p-0.5 text-[#B5AFA6] hover:text-[#1A1A1A]"
              >
                <X size={13} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
