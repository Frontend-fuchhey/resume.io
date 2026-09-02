import { motion } from 'framer-motion'
import { ArrowRight, FileDown, Layers, LayoutTemplate, PenTool, ShieldCheck, Sparkles, Wand2 } from 'lucide-react'
import { Brand } from '../brand'
import { Button } from '../ui/primitives'
import { TEMPLATES } from '../../config/templates'
import { MiniPreview } from '../wizard/TemplateGrid'
import { hasResumeData, useResumeStore } from '../../store/useResumeStore'

const FEATURES = [
  {
    icon: Wand2,
    title: 'Guided Studio Setup',
    body: 'A focused, human-centered flow collects details without blank-page anxiety. No dummy text prefilled.',
  },
  {
    icon: PenTool,
    title: '3-Pane Live Studio',
    body: 'Edit bullets, tweak formatting, adjust line height, and toggle layouts with immediate real-time rendering.',
  },
  {
    icon: FileDown,
    title: 'Vector-Text ATS PDF',
    body: 'Selectable vector text layers strictly named [User_Name]-resume.pdf, guaranteed to pass robotic screeners.',
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

export function Landing({ onStart, onContinue, onSample }) {
  const hasData = useResumeStore((s) => hasResumeData(s))

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 pb-16">
      <header className="flex items-center justify-between py-6">
        <Brand size={32} />
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center pt-8 text-center sm:pt-14">
        <motion.div
          {...fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-[#E8E4DC] bg-white px-3.5 py-1 text-xs font-medium text-[#666055] shadow-xs"
        >
          <Sparkles size={13} className="text-[#FF5E1A]" />
          Human-Centered ATS Resume Studio · Vector Text Engine
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ delay: 0.05 }}
          className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-tight text-[#1A1A1A] sm:text-6xl"
        >
          Craft your resume with{' '}
          <span className="font-display italic text-[#FF5E1A] font-normal">studio precision</span>.
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ delay: 0.1 }}
          className="mt-5 max-w-xl text-base leading-relaxed text-[#666055] sm:text-lg"
        >
          A high-end 3-pane live canvas editor designed with Impeccable spatial rhythm.
          Zero dummy clutter, instantaneous formatting controls, and strict vector PDF exports.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.16 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" onClick={onStart} className="!bg-[#FF5E1A] hover:!bg-[#E04D0E] !text-white shadow-md">
            <Wand2 size={16} />
            Launch Resume Studio
          </Button>
          {hasData ? (
            <Button variant="ghost" size="lg" onClick={onContinue}>
              Continue Editing <ArrowRight size={15} />
            </Button>
          ) : (
            <Button variant="ghost" size="lg" onClick={onSample}>
              Load Sample Profile
            </Button>
          )}
        </motion.div>

        {/* Stat strip */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.22 }}
          className="mt-12 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { icon: Wand2, k: '7', v: 'Core Sections' },
            { icon: LayoutTemplate, k: '4', v: 'Curated Layouts' },
            { icon: PenTool, k: '3-Pane', v: 'Live Canvas' },
            { icon: ShieldCheck, k: '100%', v: 'ATS Text Layers' },
          ].map((s) => (
            <div
              key={s.v}
              className="flex flex-col items-center gap-1 rounded-xl border border-[#E8E4DC] bg-white px-3 py-4 shadow-card"
            >
              <s.icon size={16} className="text-[#FF5E1A]" />
              <span className="text-xl font-bold text-[#1A1A1A]">{s.k}</span>
              <span className="text-[11px] font-medium text-[#666055]">{s.v}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="mt-16 grid gap-4 md:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-[#E8E4DC] bg-white p-5 shadow-card hover:border-[#D6D0C5] transition-all"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF3EB] text-[#FF5E1A]">
              <f.icon size={18} />
            </span>
            <h3 className="mt-4 text-sm font-bold text-[#1A1A1A]">{f.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#666055]">{f.body}</p>
          </motion.div>
        ))}
      </section>

      {/* Template Gallery */}
      <section className="mt-16">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF5E1A]">Layout Selection</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#1A1A1A]">
              Professional ATS Templates
            </h2>
          </div>
          <span className="hidden items-center gap-1.5 text-xs font-medium text-[#666055] sm:inline-flex">
            <Layers size={13} /> lossless data switching
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={onStart}
              className="flex flex-col text-left rounded-xl border border-[#E8E4DC] bg-white p-3.5 shadow-card hover:-translate-y-1 hover:border-[#FF5E1A]/60 transition-all"
            >
              <MiniPreview id={t.id} accentClass={t.grad} />
              <div className="mt-3">
                <p className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A]">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.accent }} />
                  {t.name}
                </p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#666055]">
                  {t.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-[#E8E4DC] bg-white p-8 text-center shadow-card sm:p-12">
        <h2 className="max-w-md text-2xl font-extrabold text-[#1A1A1A] sm:text-3xl">
          Build a resume that passes the human & robot test.
        </h2>
        <p className="max-w-md text-xs leading-relaxed text-[#666055]">
          Your data is stored locally in your browser. Vector PDF downloads follow the strict [User_Name]-resume.pdf naming standard.
        </p>
        <Button size="lg" onClick={onStart} className="!bg-[#FF5E1A] hover:!bg-[#E04D0E] !text-white">
          Open Live Studio <ArrowRight size={15} />
        </Button>
      </section>

      <footer className="mt-12 text-center text-xs text-[#666055]">
        <p>resume.io — High-End ATS Resume Studio. Powered by Impeccable Design Principles.</p>
      </footer>
    </div>
  )
}
