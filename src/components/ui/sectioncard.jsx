import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, Plus } from 'lucide-react'
import { cn } from '../../lib/utils'

/** Studio Accordion Card with + expansion icon */
export function SectionCard({
  icon: Icon,
  iconColor = 'text-[#FF5E1A]',
  title,
  subtitle,
  actions,
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="overflow-hidden rounded-xl border border-[#E8E4DC] bg-white shadow-card transition-all">
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center justify-between px-3.5 py-3 select-none hover:bg-[#FBF9F5] transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F5F2EC] text-[#1A1A1A]">
              <Icon size={14} className={iconColor} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-xs font-semibold text-[#1A1A1A]">{title}</h3>
            {subtitle && <p className="truncate text-[10.5px] text-[#666055]">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {actions}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Collapse section' : 'Expand section'}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full border border-[#E8E4DC] bg-white text-[#666055] transition-transform duration-200 hover:border-[#FF5E1A] hover:text-[#FF5E1A]',
              open ? 'rotate-45 bg-[#FFF3EB] border-[#FF5E1A]/40 text-[#FF5E1A]' : 'rotate-0'
            )}
          >
            <Plus size={13} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="border-t border-[#E8E4DC]/80"
          >
            <div className="p-3.5 bg-[#FBF9F5]/30">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Visibility eye toggle for sections */
export function VisibilityToggle({ visible, onToggle, label = 'Show on resume' }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={visible ? `Hide ${label}` : `Show ${label}`}
      className={cn(
        'flex h-6 w-6 items-center justify-center rounded-lg border transition-colors',
        visible
          ? 'border-[#D1EED5] bg-[#EBF7EE] text-[#1E7E34]'
          : 'border-[#E8E4DC] bg-white text-[#8C857B] hover:text-[#1A1A1A]'
      )}
    >
      {visible ? <Eye size={13} /> : <EyeOff size={13} />}
    </button>
  )
}
