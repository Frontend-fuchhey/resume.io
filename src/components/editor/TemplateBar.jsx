import { TEMPLATES } from '../../config/templates'
import { useResumeStore } from '../../store/useResumeStore'
import { cn } from '../../lib/utils'

/** Horizontal template switcher above the canvas — instant, data-preserving. */
export function TemplateBar() {
  const templateId = useResumeStore((s) => s.templateId)
  const setTemplate = useResumeStore((s) => s.setTemplate)

  return (
    <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-slate-200/70 px-3 py-2 no-scrollbar dark:border-white/[0.06]">
      <span className="mr-1 hidden shrink-0 items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:inline-flex dark:text-slate-500">
        Templates
      </span>
      {TEMPLATES.map((t) => {
        const active = t.id === templateId
        return (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={cn(
              'group flex shrink-0 items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all',
              active
                ? 'border-transparent bg-gradient-to-r from-cyan-500/15 to-violet-500/15 text-slate-800 ring-1 ring-cyan-400/50 dark:text-white'
                : 'border-slate-200/80 bg-white/40 text-slate-500 hover:border-cyan-300/60 hover:text-slate-700 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-400 dark:hover:text-slate-200'
            )}
            title={t.description}
          >
            <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r shadow-sm', t.grad, active && 'ring-2 ring-white/60 dark:ring-white/30')} />
            <span>{t.name}</span>
            <span className={cn('hidden text-[10px] font-medium lg:inline', active ? 'text-cyan-600 dark:text-cyan-300' : 'text-slate-400 group-hover:text-slate-500 dark:text-slate-600')}>
              {t.kind}
            </span>
          </button>
        )
      })}
    </div>
  )
}
