import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  Award,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Circle,
  FolderGit2,
  GraduationCap,
  Sparkles,
  User,
  Wrench,
  X,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useResumeStore } from '../../store/useResumeStore'

const ACTION_VERBS_RE = /\b(led|built|developed|architected|designed|engineered|created|managed|shipped|implemented|reduced|increased|improved|launched|automated|optimized|accelerated|spearheaded|scaled|delivered|drove|cut|mentored|authored|established|resolved|transformed|streamlined|partnered|introduced)\b/i

/** Live ATS readiness heuristics — with action verbs, critical contact check & conventions. */
export function useAtsAnalysis(state) {
  return useMemo(() => {
    const basic = state.basic || {}
    const experience = state.experience || []
    const education = state.education || []
    const skillGroups = state.skillGroups || []
    const bullets = experience.flatMap((e) => (e.bullets || []).filter((b) => b && b.trim()))

    const hasEmail = Boolean(basic.email && basic.email.trim())
    const hasPhone = Boolean(basic.phone && basic.phone.trim())
    const actionVerbsCount = bullets.filter((b) => ACTION_VERBS_RE.test(b)).length
    const totalSkills = skillGroups.flatMap((g) => g.items || []).filter((x) => x && x.trim()).length

    const checks = [
      {
        id: 'name',
        label: 'Candidate Name',
        ok: Boolean(basic.fullName && basic.fullName.trim().length > 1),
        tip: 'ATS parsers index your profile under your legal name.',
        critical: true,
      },
      {
        id: 'contact_email',
        label: 'Contact Email Address',
        ok: hasEmail,
        tip: 'Critical: Recruiters and automated screeners require a direct email.',
        critical: true,
      },
      {
        id: 'contact_phone',
        label: 'Contact Phone Number',
        ok: hasPhone,
        tip: 'Critical: Required for initial recruiter outreach and screening calls.',
        critical: true,
      },
      {
        id: 'action_verbs',
        label: 'Strong Action Verbs in Bullets',
        ok: bullets.length > 0 && actionVerbsCount >= Math.min(2, bullets.length),
        tip: 'Action verbs (e.g., Led, Built, Automated, Shipped) rank higher in semantic parsers.',
        critical: false,
      },
      {
        id: 'metrics',
        label: 'Quantified Metrics (% / Numbers)',
        ok: bullets.some((b) => /\d/.test(b)),
        tip: 'Numbers (% growth, users, latency, revenue) demonstrate tangible business impact.',
        critical: false,
      },
      {
        id: 'summary',
        label: 'Summary (18+ words)',
        ok: Boolean(basic.summary && basic.summary.trim().split(/\s+/).length >= 18),
        tip: 'A keyword-dense executive summary sets the contextual baseline for ATS parsing.',
        critical: false,
      },
      {
        id: 'experience',
        label: 'Employment History Entries',
        ok: experience.length >= 1 && bullets.length >= 2,
        tip: 'At least one detailed role with achievements is needed for work history ranking.',
        critical: true,
      },
      {
        id: 'education',
        label: 'Education Listed',
        ok: education.length > 0 && education.some((e) => e.degree || e.school),
        tip: 'Standard educational credential required to meet minimum screening criteria.',
        critical: false,
      },
      {
        id: 'skills',
        label: 'Skill Keywords (5+ tags)',
        ok: totalSkills >= 5,
        tip: 'Keyword density in skills directly matches job description qualification criteria.',
        critical: false,
      },
      {
        id: 'photo_guard',
        label: 'ATS Photo Safe',
        ok: Boolean(basic.hidePhotoForAts || !basic.avatar),
        tip: 'US/EU ATS screeners prefer resumes without photos to comply with blind hiring laws.',
        critical: false,
      },
    ]

    const passed = checks.filter((c) => c.ok).length
    const score = Math.round((passed / checks.length) * 100)

    const warnings = checks.filter((c) => !c.ok)

    return { score, passed, total: checks.length, checks, warnings }
  }, [state])
}

/** Floating Header Badge for Real-time ATS Score */
export function AtsScoreBadge() {
  const state = useResumeStore()
  const { score, passed, total, checks, warnings } = useAtsAnalysis(state)
  const [open, setOpen] = useState(false)

  // Color gradient based on ATS readiness tier
  const isGreat = score >= 80
  const isFair = score >= 50 && score < 80

  const badgeColor = isGreat
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
    : isFair
    ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
    : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'

  const dotColor = isGreat ? 'bg-emerald-500' : isFair ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title="View live ATS readiness analysis"
        className={cn(
          'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer shadow-xs',
          badgeColor
        )}
      >
        <span className={cn('h-2 w-2 rounded-full', dotColor)} />
        <span>ATS Score: {score}/100</span>
        <ChevronDown size={11} className={cn('transition-transform', open ? 'rotate-180' : '')} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full z-50 mt-2 w-80 rounded-xl border border-[#E8E4DC] bg-white p-3.5 shadow-xl select-none"
            >
              <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FFF3EB] text-[#FF5E1A]">
                    <Sparkles size={13} />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">ATS Readiness Analyzer</h4>
                    <p className="text-[10px] text-[#666055]">{passed} of {total} checks satisfied</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded p-1 text-[#8C857B] hover:bg-[#F5F2EC] hover:text-[#1A1A1A]"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-[#F5F2EC]">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    isGreat ? 'bg-emerald-500' : isFair ? 'bg-amber-500' : 'bg-rose-500'
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>

              {/* Warnings / Actionable flags */}
              {warnings.length > 0 && (
                <div className="mb-2.5 space-y-1 rounded-lg border border-amber-200 bg-amber-50/70 p-2 text-[10.5px]">
                  <div className="flex items-center gap-1 font-semibold text-amber-800">
                    <AlertTriangle size={12} className="text-amber-600 shrink-0" />
                    <span>Suggestions to Boost ATS Parsing:</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-amber-900">
                    {warnings.slice(0, 3).map((w) => (
                      <li key={w.id} className="text-[10px] leading-tight">{w.tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Checklist */}
              <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                {checks.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start gap-1.5 text-[11px] leading-snug"
                    title={c.tip}
                  >
                    {c.ok ? (
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-600" />
                    ) : (
                      <Circle size={13} className={cn('mt-0.5 shrink-0', c.critical ? 'text-rose-400' : 'text-slate-300')} />
                    )}
                    <span className={cn(c.ok ? 'text-[#1A1A1A]' : c.critical ? 'font-medium text-rose-700' : 'text-[#8C857B]')}>
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
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
          <li key={c.id} className="flex items-start gap-1.5 text-[10.5px]" title={c.tip}>
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
