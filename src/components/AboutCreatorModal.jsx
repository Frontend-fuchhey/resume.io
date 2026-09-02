import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Mail,
  ExternalLink,
  Sparkles,
  Code2,
  Shield,
} from 'lucide-react'

const SOCIALS = [
  { label: 'GitHub', icon: Github, href: 'https://github.com/shrawankarki', color: '#1A1A1A' },
  { label: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/in/shrawankarki', color: '#0A66C2' },
  { label: 'Twitter / X', icon: Twitter, href: 'https://twitter.com/shrawankarki', color: '#000000' },
  { label: 'Facebook', icon: Facebook, href: 'https://facebook.com/shrawankarki', color: '#1877F2' },
  { label: 'Instagram', icon: Instagram, href: 'https://instagram.com/shrawankarki', color: '#E1306C' },
  { label: 'Email', icon: Mail, href: 'mailto:hello@shrawankarki.com.np', color: '#FF5E1A' },
]

const HIGHLIGHTS = [
  { icon: Code2, text: 'Full-Stack Developer' },
  { icon: Shield, text: 'Security Enthusiast' },
  { icon: Sparkles, text: 'Tech Creator' },
]

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.93, y: 18 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', damping: 24, stiffness: 320 },
  },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.18, ease: 'easeIn' } },
}

export function AboutCreatorModal({ open, onClose }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          key="about-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={(e) => e.target === overlayRef.current && onClose()}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6"
          style={{ backgroundColor: 'rgba(26,26,26,0.45)', backdropFilter: 'blur(6px)' }}
          aria-modal="true"
          role="dialog"
          aria-label="About Creator"
        >
          <motion.div
            key="about-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-[480px] overflow-hidden rounded-[18px] bg-white shadow-[0_32px_80px_rgba(26,26,26,0.18)] border border-[#E8E4DC]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#FF5E1A 0%,#FF8C5A 100%)' }} />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close about creator dialog"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E2DC] bg-[#FBF9F5] text-[#666055] transition-all hover:border-[#FF5E1A] hover:text-[#FF5E1A] hover:bg-[#FFF3EB]"
            >
              <X size={16} />
            </button>

            <div className="max-h-[80vh] overflow-y-auto px-7 pb-7 pt-6">

              <div className="flex items-center gap-4 mb-5">
                <div
                  className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-2xl text-white text-xl font-bold shadow-md"
                  style={{ background: 'linear-gradient(135deg,#FF5E1A 0%,#FF8C5A 100%)' }}
                >
                  SK
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD9C9] bg-[#FFF3EB] px-2.5 py-0.5 text-[11px] font-semibold text-[#FF5E1A] mb-1">
                    <Sparkles size={11} />
                    Solo Creator & Developer
                  </span>
                  <p className="text-[11px] text-[#9E988E] font-medium">
                    resume.io — ATS Resume Studio
                  </p>
                </div>
              </div>

              <h2
                style={{ fontFamily: "'Courgette', cursive", color: '#1A1A1A' }}
                className="text-[26px] leading-tight mb-1"
              >
                Crafted by{' '}
                <span style={{ color: '#FF5E1A' }}>Shrawan Karki</span>
              </h2>

              <p className="text-[13px] font-medium text-[#666055] mb-4">
                Developer, Security Enthusiast & Tech Creator
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                  <span
                    key={text}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E2DC] bg-[#FBF9F5] px-3 py-1 text-[11px] font-semibold text-[#666055]"
                  >
                    <Icon size={11} className="text-[#FF5E1A]" />
                    {text}
                  </span>
                ))}
              </div>

              <div className="mb-5 h-px bg-[#F0EDE8]" />

              <div className="mb-5 rounded-xl border border-[#F0EDE8] bg-[#FBF9F5] p-4">
                <p className="text-[13px] leading-relaxed text-[#4A4640]">
                  <strong className="font-semibold text-[#1A1A1A]">Shrawan Karki</strong> is the
                  sole creator and developer behind this{' '}
                  <span className="font-semibold text-[#FF5E1A]">ATS Resume Builder</span> — built
                  to eliminate the layout friction that causes resumes to fail automated screeners.
                </p>
                <p className="mt-2.5 text-[13px] leading-relaxed text-[#4A4640]">
                  This studio delivers a clean single-column structure, real-time 3-pane canvas
                  editing, strict vector-text PDF export, and a human-centered setup wizard — all
                  powered by the philosophy that{' '}
                  <em className="italic text-[#1A1A1A]">great tooling should feel invisible.</em>
                </p>
              </div>

              <a
                href="https://shrawankarki.com.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="group mb-5 flex w-full items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-[0_8px_24px_rgba(255,94,26,0.38)] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg,#FF5E1A 0%,#FF7A40 100%)' }}
              >
                <ExternalLink size={15} className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
                Visit Live Portfolio
              </a>

              <div className="mb-4 h-px bg-[#F0EDE8]" />

              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9E988E]">
                Connect
              </p>
              <div className="grid grid-cols-3 gap-2">
                {SOCIALS.map(({ label, icon: Icon, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    title={label}
                    className="group flex flex-col items-center gap-1.5 rounded-xl border border-[#E5E2DC] bg-[#FBF9F5] p-3 text-center transition-all hover:border-[#FF5E1A]/40 hover:bg-[#FFF3EB] hover:shadow-sm active:scale-[0.97]"
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${color}14` }}
                    >
                      <Icon size={15} style={{ color }} />
                    </span>
                    <span className="text-[10px] font-semibold text-[#666055]">{label}</span>
                  </a>
                ))}
              </div>

              <p className="mt-5 text-center text-[10px] text-[#B8B2A9]">
                Built with ? in Nepal · resume.io v1.0
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
