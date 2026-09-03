import {
  Briefcase,
  Calendar,
  Globe,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Phone,
  Tag,
  User,
} from 'lucide-react'
import { useResumeStore } from '../../../store/useResumeStore'
import { dateRange, cleanUrl, toHref } from '../../../lib/format'
import { EditableText } from '../EditableText'

const FONT_MAP = {
  Poppins: "'Poppins', sans-serif",
  Inter: "'Inter', sans-serif",
  Roboto: "'Roboto', sans-serif",
  Lato: "'Lato', sans-serif",
  Garamond: "'EB Garamond', Garamond, Georgia, serif",
  Courgette: "'Courgette', cursive",
}

const PADDING_MAP = {
  compact: '24px 28px',
  standard: '38px 42px',
  spacious: '52px 56px',
}

export default function AtsStudioTemplate({ resume, theme }) {
  const basic = resume.basic || {}
  const experience = resume.experience || []
  const education = resume.education || []
  const websites = resume.websites || []
  const skillGroups = resume.skillGroups || []
  const hobbies = resume.hobbies || []
  const visibility = resume.visibility || {}
  const formatting = resume.formatting || {}
  const sectionOrder = resume.sectionOrder || ['summary', 'experience', 'education', 'websites', 'skills', 'hobbies']

  const setActiveItem = useResumeStore((s) => s.setActiveItem)
  const setBasic = useResumeStore((s) => s.setBasic)
  const updateItem = useResumeStore((s) => s.updateItem)
  const updateBullet = useResumeStore((s) => s.updateBullet)
  const updateSkill = useResumeStore((s) => s.updateSkill)

  // Typography & design styling from Right Toolbar
  const fontFamily = FONT_MAP[formatting.fontFamily] || "'Poppins', sans-serif"
  const titleFontFamily = formatting.fontFamily === 'Courgette' ? "'Courgette', cursive" : fontFamily
  const fontWeight = formatting.fontWeight || '400'
  const baseFontSize = formatting.fontSize || 10.5
  const accentColor = theme?.accentColor || formatting.accentColor || '#244CEC'
  const textColor = formatting.textColor || '#1A1A1A'
  const textAlign = formatting.textAlign || 'left'
  const lineHeight = (formatting.lineHeight || 140) / 100
  const letterSpacing = `${formatting.letterSpacing || 0}px`
  const canvasPadding = PADDING_MAP[formatting.marginDensity || 'standard'] || '38px 42px'

  const showPhoto = !basic.hidePhotoForAts && (basic.avatar || !basic.fullName)
  const hasContact = basic.email || basic.phone || basic.location || websites.length > 0
  const hasEducation = visibility.education !== false && education.length > 0
  const hasSkills = visibility.skills !== false && skillGroups.length > 0
  const hasHobbies = visibility.hobbies !== false && hobbies.length > 0
  const hasSummary = basic.summary && basic.summary.trim()
  const hasExperience = visibility.experience !== false && experience.length > 0

  // Section renderers
  const renderContactAndWebsites = () => (
    <section key="websites" className="resume-block">
      <h2
        className="text-[10pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        Contact Details
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-1.5 opacity-40" />
      <div className="space-y-2 text-[9pt] text-[#403D39]">
        {(basic.email || basic.email === '') && (
          <div className="flex items-center gap-2">
            <Mail size={12} className="shrink-0" style={{ color: accentColor }} />
            <EditableText
              value={basic.email}
              onChange={(val) => setBasic({ email: val })}
              placeholder="email@example.com"
              className="break-all flex-1"
            />
          </div>
        )}
        {(basic.phone || basic.phone === '') && (
          <div className="flex items-center gap-2">
            <Phone size={12} className="shrink-0" style={{ color: accentColor }} />
            <EditableText
              value={basic.phone}
              onChange={(val) => setBasic({ phone: val })}
              placeholder="+1 (555) 000-0000"
              className="flex-1"
            />
          </div>
        )}
        {(basic.location || basic.location === '') && (
          <div className="flex items-center gap-2">
            <MapPin size={12} className="shrink-0" style={{ color: accentColor }} />
            <EditableText
              value={basic.location}
              onChange={(val) => setBasic({ location: val })}
              placeholder="City, State / Country"
              className="flex-1"
            />
          </div>
        )}
        {websites.map((w) => (
          <div key={w.id} className="flex items-center gap-2">
            <Globe size={12} className="shrink-0" style={{ color: accentColor }} />
            <span className="truncate flex-1">
              {w.label ? <strong className="font-semibold">{w.label}: </strong> : null}
              {w.url ? (
                <a
                  href={toHref(w.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-colors font-mono text-[8.5pt]"
                  style={{ color: accentColor }}
                  title={w.url}
                >
                  {cleanUrl(w.url)}
                </a>
              ) : (
                <span className="text-[#9E988E] italic text-[8.5pt]">link</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  )

  const renderEducation = () => (
    <section key="education" className="resume-block">
      <h2
        className="text-[10pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        Education
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-1.5 opacity-40" />
      <div className="space-y-3">
        {education.map((edu) => (
          <div
            key={edu.id}
            onClick={() => setActiveItem({ list: 'education', id: edu.id })}
            className="resume-block cursor-pointer group rounded p-1 hover:bg-[#FBF9F5] transition-colors"
          >
            <div className="text-[9.5pt] font-bold text-[#1A1A1A] leading-snug">
              <EditableText
                value={edu.degree}
                onChange={(val) => updateItem('education', edu.id, { degree: val })}
                placeholder="Degree Program"
              />
            </div>
            <div className="text-[9pt] font-medium" style={{ color: accentColor }}>
              <EditableText
                value={edu.school}
                onChange={(val) => updateItem('education', edu.id, { school: val })}
                placeholder="University / School"
              />
            </div>
            <div className="text-[8.5pt] text-[#666055] mt-0.5">
              Graduation:{' '}
              <EditableText
                value={edu.gradYear}
                onChange={(val) => updateItem('education', edu.id, { gradYear: val })}
                placeholder="Year"
              />
            </div>
            {(edu.focus || edu.focus === '') && (
              <div className="text-[8.5pt] italic text-[#666055] mt-0.5">
                <EditableText
                  value={edu.focus}
                  onChange={(val) => updateItem('education', edu.id, { focus: val })}
                  placeholder="Focus / Academic Honors"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )

  const renderSkills = () => (
    <section key="skills" className="resume-block">
      <h2
        className="text-[10pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        Skills & Competencies
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-1.5 opacity-40" />
      <div className="space-y-2.5">
        {skillGroups.map((g) => (
          <div key={g.id} className="resume-block">
            {g.label && (
              <div className="text-[8.5pt] font-bold uppercase tracking-wide text-[#666055] mb-1">
                {g.label}
              </div>
            )}
            <div className="flex flex-wrap gap-1">
              {g.items.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-block rounded px-2 py-0.5 text-[8pt] font-medium bg-[#F5F2EC] text-[#1A1A1A]"
                >
                  <EditableText
                    value={item}
                    onChange={(val) => updateSkill(g.id, idx, val)}
                    placeholder="Skill"
                  />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  const renderHobbies = () => (
    <section key="hobbies" className="resume-block">
      <h2
        className="text-[10pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        Hobbies & Interests
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-1.5 opacity-40" />
      <div className="flex flex-wrap gap-1.5">
        {hobbies.map((h) => (
          <span
            key={h.id}
            className="inline-flex items-center gap-1 rounded-full border border-[#E8E4DC] px-2.5 py-0.5 text-[8pt] text-[#403D39]"
          >
            <Heart size={9} style={{ color: accentColor }} />
            <EditableText
              value={h.name}
              onChange={(val) => updateItem('hobbies', h.id, { name: val })}
              placeholder="Hobby"
            />
          </span>
        ))}
      </div>
    </section>
  )

  const renderSummary = () => (
    <section key="summary" className="resume-block">
      <h2
        className="text-[11pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        Profile Summary
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-1.5 opacity-40" />
      <div className="text-[9.5pt] text-[#2D2D2D] leading-relaxed text-justify">
        <EditableText
          multiline
          value={basic.summary}
          onChange={(val) => setBasic({ summary: val })}
          placeholder="Write your professional summary here..."
          className="w-full"
        />
      </div>
    </section>
  )

  const renderExperience = () => (
    <section key="experience" className="resume-block">
      <h2
        className="text-[11pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        Employment History
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-2 opacity-40" />

      <div className="relative pl-4 space-y-5 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E8E4DC]">
        {experience.map((exp) => (
          <div
            key={exp.id}
            onClick={() => setActiveItem({ list: 'experience', id: exp.id })}
            className="resume-block relative cursor-pointer group rounded p-1 hover:bg-[#FBF9F5] transition-colors"
          >
            {/* Timeline Dot */}
            <div
              className="absolute -left-[19px] top-1.5 h-2.5 w-2.5 rounded-full border-2 bg-white"
              style={{ borderColor: accentColor }}
            />

            {/* Role Title & Dates */}
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-[10pt] font-bold text-[#1A1A1A] flex-1">
                <EditableText
                  value={exp.role}
                  onChange={(val) => updateItem('experience', exp.id, { role: val })}
                  placeholder="Role Title"
                />
              </h3>
              <span className="shrink-0 text-[8.5pt] font-semibold text-[#666055]">
                {dateRange(exp)}
              </span>
            </div>

            {/* Company & Location */}
            <div className="text-[9pt] font-semibold flex items-center gap-1.5 flex-wrap" style={{ color: accentColor }}>
              <EditableText
                value={exp.company}
                onChange={(val) => updateItem('experience', exp.id, { company: val })}
                placeholder="Company Name"
              />
              <span className="font-normal text-[#666055]">
                · <EditableText
                  value={exp.location}
                  onChange={(val) => updateItem('experience', exp.id, { location: val })}
                  placeholder="Location"
                />
              </span>
            </div>

            {/* Achievements / Bullets */}
            {exp.bullets && exp.bullets.length > 0 && (
              <ul className="mt-2 space-y-1 text-[9pt] text-[#2D2D2D]">
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx} className="resume-block flex items-start gap-1.5 leading-snug">
                    <span className="mt-1 text-[8pt] select-none shrink-0" style={{ color: accentColor }}>•</span>
                    <EditableText
                      multiline
                      value={bullet}
                      onChange={(val) => updateBullet(exp.id, idx, val)}
                      placeholder="Add achievement with quantified metrics..."
                      className="flex-1"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )

  // Map section keys to their render functions
  const SECTION_MAP = {
    websites: { hasContent: hasContact, render: renderContactAndWebsites, side: 'left' },
    education: { hasContent: hasEducation, render: renderEducation, side: 'left' },
    skills: { hasContent: hasSkills, render: renderSkills, side: 'left' },
    hobbies: { hasContent: hasHobbies, render: renderHobbies, side: 'left' },
    summary: { hasContent: hasSummary || basic.summary === '', render: renderSummary, side: 'right' },
    experience: { hasContent: hasExperience, render: renderExperience, side: 'right' },
  }

  // Sort sections in each column based on sectionOrder
  const leftSections = sectionOrder
    .filter((k) => SECTION_MAP[k]?.side === 'left' && SECTION_MAP[k]?.hasContent)
    .map((k) => SECTION_MAP[k].render())

  const rightSections = sectionOrder
    .filter((k) => SECTION_MAP[k]?.side === 'right' && SECTION_MAP[k]?.hasContent)
    .map((k) => SECTION_MAP[k].render())

  return (
    <div
      className="h-full w-full bg-white text-[#1A1A1A]"
      style={{
        fontFamily,
        color: textColor,
        fontSize: `${baseFontSize}pt`,
        lineHeight,
        letterSpacing,
        textAlign,
        padding: canvasPadding,
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header: Optional Photo Avatar + Large Name + Headline */}
      <header
        className="flex items-center gap-6 pb-6 border-b border-[#E8E4DC] resume-block"
        style={{ borderColor: `${accentColor}30` }}
      >
        {/* Photo Avatar (respects ATS photo hide toggle) */}
        {showPhoto && (
          <div
            className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-[#FBF9F5] shadow-sm"
            style={{ borderColor: accentColor }}
          >
            {basic.avatar ? (
              <img src={basic.avatar} alt={basic.fullName || 'User'} className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-bold" style={{ color: accentColor, fontFamily: titleFontFamily }}>
                {basic.fullName ? basic.fullName.charAt(0).toUpperCase() : <User size={30} className="text-[#9E988E]" />}
              </span>
            )}
          </div>
        )}

        {/* Name & Headline with In-Canvas Editing */}
        <div className="flex-1 min-w-0">
          <h1
            className="text-[28pt] leading-tight tracking-tight font-bold"
            style={{ fontFamily: titleFontFamily, color: textColor }}
          >
            <EditableText
              value={basic.fullName}
              onChange={(val) => setBasic({ fullName: val })}
              placeholder="Your Full Name"
            />
          </h1>
          <p
            className="mt-1 text-[12pt] font-medium tracking-wide uppercase"
            style={{ color: accentColor }}
          >
            <EditableText
              value={basic.jobTitle}
              onChange={(val) => setBasic({ jobTitle: val })}
              placeholder="Senior Software Engineer"
            />
          </p>
        </div>
      </header>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full mt-4 mb-2 opacity-30" />

      {/* Two-Column Dynamic ATS Grid */}
      <div className="mt-6 grid grid-cols-12 gap-8 items-start">
        {/* Left Column: Reordered based on sectionOrder (~40%) */}
        <div className="col-span-5 space-y-6 pr-2 border-r border-[#E8E4DC]/60">
          {leftSections}
        </div>

        {/* Right Column: Reordered based on sectionOrder (~60%) */}
        <div className="col-span-7 space-y-6">
          {rightSections}
        </div>
      </div>
    </div>
  )
}
