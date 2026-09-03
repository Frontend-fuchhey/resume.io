import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Briefcase, FileText, Globe, GraduationCap, Heart, LayoutTemplate, Tag } from 'lucide-react'
import resumeIoLogo from '@/assets/resume-io.png'
import { Button } from '../ui/primitives'
import { toast } from '../../store/useUIStore'
import { useResumeStore } from '../../store/useResumeStore'
import { BasicForm, EMAIL_RE } from '../forms/BasicForm'
import { SummaryForm } from '../forms/SummaryForm'
import { ExperienceManager } from '../forms/ExperienceManager'
import { EducationManager } from '../forms/EducationManager'
import { WebsitesManager } from '../forms/WebsitesManager'
import { SkillsManager } from '../forms/SkillsManager'
import { HobbiesManager } from '../forms/HobbiesManager'
import { TemplateGrid } from './TemplateGrid'
import { cn } from '../../lib/utils'

const STEPS = [
  { id: 'basic', label: 'Personal Details', icon: FileText, blurb: 'Name, professional headline and contact info — drives the PDF filename.' },
  { id: 'summary', label: 'Summary', icon: FileText, blurb: 'Brief executive bio highlighting your domain and strongest achievements.' },
  { id: 'experience', label: 'Experience', icon: Briefcase, blurb: 'Chronological roles and key milestones.' },
  { id: 'education', label: 'Education', icon: GraduationCap, blurb: 'Degrees, schools and graduation credentials.' },
  { id: 'websites', label: 'Social & Links', icon: Globe, blurb: 'Portfolio, LinkedIn, GitHub and online profiles.' },
  { id: 'skills', label: 'Skills', icon: Tag, blurb: 'Categorized keywords recruiters and ATS screeners target.' },
  { id: 'hobbies', label: 'Hobbies', icon: Heart, blurb: 'Personal passions and activities.' },
  { id: 'template', label: 'Template', icon: LayoutTemplate, blurb: 'Choose a starting template — switch anytime in the 3-pane studio.' },
]

export function Wizard({ onFinish, onExit }) {
  const basic = useResumeStore((s) => s.basic)
  const [idx, setIdx] = useState(0)
  const [attempted, setAttempted] = useState(false)

  const errors = []
  if (!basic.fullName?.trim()) errors.push('Full name is required')
  if (basic.email?.trim() && !EMAIL_RE.test(basic.email.trim())) errors.push('Email address format is invalid')

  const step = STEPS[idx]
  const StepIcon = step.icon
  const currentStep = idx + 1
  const totalSteps = STEPS.length

  const next = () => {
    if (idx === 0) {
      if (errors.length) {
        setAttempted(true)
        toast('Please enter your full name first', 'error')
        return
      }
    }
    if (idx === STEPS.length - 1) {
      finish()
      return
    }
    setIdx((i) => i + 1)
  }

  const finish = () => {
    if (errors.length) {
      setIdx(0)
      setAttempted(true)
      toast('Please enter your full name to generate the resume file', 'error')
      return
    }
    toast('Profile setup complete — welcome to the 3-pane Live Studio ✨')
    onFinish()
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FBF9F5] text-[#1A1A1A]">
      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-4xl items-center gap-3 px-5 py-5">
        <button onClick={onExit} className="text-sm font-semibold transition-opacity hover:opacity-80" aria-label="Leave wizard">
          <img
            src={resumeIoLogo}
            alt="resume.io"
            className="h-8 w-auto object-contain"
          />
        </button>
      </header>

      {/* Progress pills */}
      <div className="mx-auto flex w-full max-w-4xl items-center gap-1.5 px-5">
        {STEPS.map((s, i) => {
          const done = i < idx
          const active = i === idx
          const Icon = s.icon
          return (
            <div key={s.id} className="flex flex-1 flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => (i < idx ? setIdx(i) : undefined)}
                disabled={i > idx}
                className={cn(
                  'relative flex h-8 w-8 items-center justify-center rounded-full border transition-all',
                  done && 'border-[#D1EED5] bg-[#EBF7EE] text-[#1E7E34]',
                  active && 'border-[#FF5E1A] bg-[#FF5E1A] text-white shadow-[0_2px_8px_rgba(255,94,26,0.35)]',
                  !done && !active && 'border-[#E8E4DC] bg-white text-[#B0A99F]'
                )}
                title={s.label}
              >
                <Icon size={14} strokeWidth={2.2} />
              </button>
              <span className="hidden text-[10px] font-semibold sm:block" style={{ color: active ? '#FF5E1A' : done ? '#1E7E34' : '#8C857B' }}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Form card */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-6">
        <div className="rounded-2xl border border-[#E8E4DC] bg-white p-5 shadow-card sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-50 rounded-xl text-[#FF5E1A]">
                <StepIcon size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{step.label}</h2>
                <p className="text-xs text-gray-500">
                  {step.blurb}
                </p>
              </div>
            </div>

            {/* Relocated Step Badge */}
            <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          {attempted && idx === 0 && errors.length > 0 && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-medium text-rose-700">
              {errors.map((e) => (
                <p key={e}>• {e}</p>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <StepBody idx={idx} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => (idx === 0 ? onExit() : setIdx((i) => i - 1))}
            className={cn(idx === 0 && 'border-transparent bg-transparent text-[#666055]')}
          >
            ← {idx === 0 ? 'Back to Home' : 'Back'}
          </Button>
          <Button
            onClick={next}
            size="lg"
            className="min-w-[190px] !bg-[#FF5E1A] hover:!bg-[#E04D0E] !text-white"
          >
            {idx === STEPS.length - 1 ? 'Open Live Studio →' : idx === STEPS.length - 2 ? 'Almost done →' : 'Continue →'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function StepBody({ idx }) {
  if (idx === 0) return <BasicForm />
  if (idx === 1) return <SummaryForm />
  if (idx === 2) return <ExperienceManager />
  if (idx === 3) return <EducationManager />
  if (idx === 4) return <WebsitesManager />
  if (idx === 5) return <SkillsManager />
  if (idx === 6) return <HobbiesManager />
  return <TemplateGrid />
}
