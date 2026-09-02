/**
 * Template registry — single source of truth used by the studio, template bar,
 * and the vector PDF export engine.
 */
export const TEMPLATES = [
  {
    id: 'ats-studio',
    name: 'ATS Studio Two-Column',
    kind: 'Two-Column Studio',
    accent: '#244CEC',
    grad: 'from-[#FF5E1A] to-[#244CEC]',
    description: 'Premier studio layout with photo avatar, left education/contact column, and right timeline narrative.',
    tagline: 'High-end studio standard',
    tips: ['Designed for optimal recruiter scanning and ATS text-layer parsing.', 'Clean hierarchy with timeline milestones.'],
  },
  {
    id: 'classic',
    name: 'Classic ATS',
    kind: 'Single-Column',
    accent: '#1A1A1A',
    grad: 'from-[#1A1A1A] to-[#403D39]',
    description: 'Timeless one-column layout, uppercase rule headings and scannable bullets — the safest pass through any ATS parser.',
    tagline: 'Best parser compatibility',
    tips: ['Uses one column and simple tables — ideal for legacy ATS parsers.', 'Standard heading order recruiters expect.'],
  },
  {
    id: 'tech',
    name: 'Tech Developer Standard',
    kind: 'Two-Column',
    accent: '#244CEC',
    grad: 'from-[#244CEC] to-[#1B3BBF]',
    description: 'Side rail for skills, education and certifications; main column for a quantified, achievement-first experience story.',
    tagline: 'Built for engineers',
    tips: ['Right rail mirrors recruiter keyword search targets.', 'Achievement bullets start with action verbs and metrics.'],
  },
  {
    id: 'exec',
    name: 'Executive Professional',
    kind: 'Editorial Serif',
    accent: '#FF5E1A',
    grad: 'from-[#FF5E1A] to-[#E04D0E]',
    description: 'Refined typography, letter-spaced small-caps headings and a centered masthead for senior leadership profiles.',
    tagline: 'Polished & executive',
    tips: ['Headline pairs with clean sans details while staying machine-readable.', 'Summary-first structure surfaces your story instantly.'],
  },
]

export const TEMPLATE_BY_ID = Object.fromEntries(TEMPLATES.map((t) => [t.id, t]))
export const DEFAULT_TEMPLATE = 'ats-studio'
