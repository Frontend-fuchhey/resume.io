import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Award, Briefcase, CheckCircle2, Circle, FolderGit2, GraduationCap, Sparkles, User, Wrench } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useResumeStore } from '../../store/useResumeStore'

/** Live ATS readiness heuristics — the same signals parsers and screeners scan for. */
export function useAtsAnalysis(state) {
  return useMemo(() => {
    const basic = state.basic
    const bullets = state.experience.flatMap((e) => e.bullets.filter((b) => b.trim()))
    const contact = basic.phone.trim() || basic.email.trim()

    const checks = [
      { label: 'Name present', ok: basic.fullName.trim().length > 1, tip: 'ATS files the resume under this name.' },
      { label: 'Email or phone reachable', ok: Boolean(contact), tip: 'A missing way to reach you is an instant screen-out.' },
      { label: 'Location listed', ok: Boolean(basic.location.trim()), tip: 'Helps location-based filtering and relocation screens.' },
      { label: 'LinkedIn or portfolio link', ok: Boolean(basic.linkedin.trim() || basic.portfolio.trim()), tip: 'Recruiters click through 70% of the time.' },
      { label: 'Summary is 18+ words', ok: basic.summary.trim().split(/\s+/).length >= 18, tip: 'A crisp keyword-rich summary beats an empty one.' },
      { label: '2+ roles with 4+ achievements', ok: state.experience.length >= 2 && bullets.length >= 4, tip: 'Recent history is what ATS ranks most heavily.' },
      { label: 'Metrics inside bullets', ok: bullets.some((b) => /\d/.test(b)), tip: 'Numbers (% growth, users, revenue) parse reliably.' },
      { label: '8+ skill keywords', ok: state.skillGroups.flatMap((g) => g.items).filter((x) => x.trim()).length >= 8, tip: 'Mirror the exact keywords from the job posting.' },
    ]
    const passed = checks.filter((c) => c.ok).length
    return { score: Math.round((passed / checks.length) * 100), passed, total: checks.length, checks }
  }, [state])
}

export function AtsCard() {
  const state = useResumeStore()
  const { score, passed, total, checks } = useAtsAnalysis(state)

  return (
    <div className="rounded-xl border border-emerald-300/30 bg-gradient-to-br from-emerald-400/[0.07] to-cyan-400/[0.07] p-3.5 dark:border-emerald-400/15">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <Sparkles size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">ATS Readiness</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">{passed}/{total} checks passed</p>
        </div>
        <span className="font-mono text-lg font-bold text-emerald-500 dark:text-emerald-400">{score}%</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
          initial={false}
          animate={{ width: `${score}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        />
      </div>

      <ul className="mt-2.5 space-y-1">
        {checks.map((c) => (
          <li key={c.label} className="flex items-start gap-1.5 text-[10.5px]" title={c.tip}>
            {c.ok ? (
              <CheckCircle2 size={11} className="mt-0.5 shrink-0 text-emerald-500" />
            ) : (
              <Circle size={11} className="mt-0.5 shrink-0 text-slate-300 dark:text-slate-600" />
            )}
            <span className={cn(c.ok ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500')}>{c.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const SECTION_ICONS = {
  basic: { icon: User, grad: 'from-slate-500 to-slate-700' },
  experience: { icon: Briefcase, grad: 'from-cyan-500 to-sky-600' },
  education: { icon: GraduationCap, grad: 'from-sky-500 to-indigo-600' },
  skills: { icon: Wrench, grad: 'from-violet-500 to-fuchsia-500' },
  projects: { icon: FolderGit2, grad: 'from-emerald-500 to-teal-600' },
  certifications: { icon: Award, grad: 'from-amber-500 to-orange-500' },
}
