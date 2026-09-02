import { Check, Sparkles } from 'lucide-react'
import { TEMPLATES } from '../../config/templates'
import { useResumeStore } from '../../store/useResumeStore'
import { toast } from '../../store/useUIStore'

export function TemplateGallery() {
  const currentId = useResumeStore((s) => s.templateId)
  const setTemplate = useResumeStore((s) => s.setTemplate)

  const handleSelect = (id, name) => {
    setTemplate(id)
    toast(`Switched layout to ${name}`)
  }

  return (
    <div className="space-y-3 pb-8">
      <div className="rounded-lg bg-[#F5F2EC] p-3 text-xs text-[#666055]">
        <div className="flex items-center gap-1.5 font-semibold text-[#1A1A1A] mb-1">
          <Sparkles size={13} className="text-[#FF5E1A]" />
          <span>Lossless Layout Switching</span>
        </div>
        Switch between templates anytime — all your data, timeline entries, and keywords are preserved.
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {TEMPLATES.map((t) => {
          const active = currentId === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleSelect(t.id, t.name)}
              className={`flex flex-col text-left rounded-xl border p-3 transition-all ${
                active
                  ? 'border-[#FF5E1A] bg-[#FFF3EB]/40 shadow-sm'
                  : 'border-[#E8E4DC] bg-white hover:border-[#D6D0C5] hover:bg-[#FBF9F5]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full border border-white/80 shadow-xs"
                    style={{ backgroundColor: t.accent }}
                  />
                  <span className="text-xs font-bold text-[#1A1A1A]">{t.name}</span>
                </div>
                {active && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5E1A] text-white">
                    <Check size={11} strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[11px] text-[#666055] leading-relaxed">
                {t.description}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded bg-[#F5F2EC] px-2 py-0.5 text-[9.5px] font-medium text-[#403D39]">
                  {t.kind}
                </span>
                <span className="text-[10px] font-medium text-[#FF5E1A]">{t.tagline}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
