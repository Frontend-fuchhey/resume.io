import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { TEMPLATES } from '../../config/templates'
import { useResumeStore } from '../../store/useResumeStore'
import { cn } from '../../lib/utils'

export function TemplateGrid() {
  const templateId = useResumeStore((s) => s.templateId)
  const setTemplate = useResumeStore((s) => s.setTemplate)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {TEMPLATES.map((t, i) => {
        const active = t.id === templateId
        return (
          <motion.button
            key={t.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTemplate(t.id)}
            className={cn(
              'relative overflow-hidden rounded-xl border-2 p-3.5 text-left transition-all',
              active
                ? 'border-[#FF5E1A] bg-[#FFF3EB]/40 shadow-sm'
                : 'border-[#E8E4DC] bg-white hover:border-[#D6D0C5] hover:shadow-card'
            )}
          >
            <MiniPreview id={t.id} accent={t.accent} />
            <div className="mt-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-[#1A1A1A]">{t.name}</p>
                <p className="text-[10.5px] font-semibold text-[#FF5E1A]">
                  {t.kind}
                </p>
              </div>
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all',
                  active ? 'border-transparent bg-[#FF5E1A] text-white' : 'border-[#E8E4DC] text-transparent'
                )}
              >
                <Check size={12} strokeWidth={3} />
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#666055]">{t.description}</p>
          </motion.button>
        )
      })}
    </div>
  )
}

export function MiniPreview({ id, accent = '#FF5E1A' }) {
  const bars = SKELETONS[id] || SKELETONS.classic
  return (
    <div className="relative flex h-[86px] items-start overflow-hidden rounded-lg bg-white p-2.5 shadow-inner ring-1 ring-[#E8E4DC]">
      <span className="absolute -right-3 -top-4 h-12 w-12 rounded-full opacity-15 blur-md" style={{ backgroundColor: accent }} />
      {bars.map((b, i) => (
        <span
          key={i}
          className="absolute block rounded-[2px]"
          style={{
            left: b.left,
            top: b.top,
            width: b.width,
            height: b.height,
            backgroundColor: b.accent ? accent : '#E8E4DC',
          }}
        />
      ))}
      {id === 'tech' && <span className="absolute bottom-0 right-0 top-0 w-[34%] bg-[#F5F2EC]" />}
    </div>
  )
}

const SKELETONS = {
  'ats-studio': [
    { left: '8%', top: 8, width: 24, height: 24, accent: true },
    { left: '38%', top: 10, width: '48%', height: 7, accent: true },
    { left: '38%', top: 21, width: '32%', height: 4 },
    { left: '8%', top: 38, width: '28%', height: 4 },
    { left: '8%', top: 46, width: '24%', height: 3 },
    { left: '8%', top: 58, width: '28%', height: 4 },
    { left: '42%', top: 38, width: '50%', height: 5 },
    { left: '42%', top: 48, width: '52%', height: 3.5 },
    { left: '42%', top: 56, width: '48%', height: 3.5 },
    { left: '42%', top: 68, width: '50%', height: 5 },
  ],
  classic: [
    { left: '30%', top: 7, width: '40%', height: 7 },
    { left: '16%', top: 22, width: '68%', height: 4 },
    { left: '16%', top: 30, width: '68%', height: 4 },
    { left: '16%', top: 46, width: '36%', height: 5 },
    { left: '16%', top: 54, width: '66%', height: 3.5 },
    { left: '16%', top: 61, width: '60%', height: 3.5 },
    { left: '16%', top: 77, width: '36%', height: 5 },
  ],
  tech: [
    { left: '5%', top: 8, width: '42%', height: 8, accent: true },
    { left: '5%', top: 22, width: '34%', height: 4 },
    { left: '5%', top: 34, width: '52%', height: 5 },
    { left: '5%', top: 43, width: '58%', height: 3.5 },
    { left: '5%', top: 51, width: '46%', height: 3.5 },
  ],
  exec: [
    { left: '24%', top: 8, width: '52%', height: 8, accent: true },
    { left: '32%', top: 21, width: '36%', height: 4 },
    { left: '12%', top: 44, width: '24%', height: 5 },
    { left: '12%', top: 54, width: '76%', height: 3.5 },
  ],
}
