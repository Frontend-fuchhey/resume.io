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
  badge,
  actions,
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="overflow-hidden rounded-xl border border-[#E8E4DC] bg-white shadow-xs transition-all hover:border-[#D6D0C5]">
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center justify-between px-3.5 py-3 select-none hover:bg-[#FBF9F5] transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFF3EB] text-[#FF5E1A]">
              <Icon size={14} className={iconColor} />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-xs font-bold text-[#1A1A1A]">{title}</h3>
              {badge !== undefined && badge !== null && (
                <span className="rounded-full bg-[#F5F2EC] px-1.5 py-0.2 text-[9.5px] font-semibold text-[#666055]">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="truncate text-[10.5px] text-[#8C857B]">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {actions}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Collapse section' : 'Expand section'}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-lg border border-[#E8E4DC] bg-white text-[#666055] transition-all duration-200 hover:border-[#FF5E1A] hover:text-[#FF5E1A]',
              open ? 'rotate-180 bg-[#FBF9F5] text-[#1A1A1A]' : 'rotate-0'
            )}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
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
