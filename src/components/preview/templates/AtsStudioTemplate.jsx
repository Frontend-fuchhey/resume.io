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
import { dateRange } from '../../../lib/format'

export default function AtsStudioTemplate({ resume }) {
  const basic = resume.basic || {}
  const experience = resume.experience || []
  const education = resume.education || []
  const websites = resume.websites || []
  const skillGroups = resume.skillGroups || []
  const hobbies = resume.hobbies || []
  const visibility = resume.visibility || {}
  const formatting = resume.formatting || {}

  const setActiveItem = useResumeStore((s) => s.setActiveItem)

  // Typography & design styling from Right Toolbar
  const fontFamily = formatting.fontFamily === 'Courgette' ? 'Courgette, cursive' : "'Poppins', sans-serif"
  const titleFontFamily = formatting.fontFamily === 'Courgette' ? 'Courgette, cursive' : "'Poppins', sans-serif"
  const fontWeight = formatting.fontWeight || '400'
  const baseFontSize = formatting.fontSize || 10.5
  const accentColor = formatting.accentColor || '#244CEC'
  const textColor = formatting.textColor || '#1A1A1A'
  const textAlign = formatting.textAlign || 'left'
  const lineHeight = (formatting.lineHeight || 140) / 100
  const letterSpacing = `${formatting.letterSpacing || 0}px`

  const hasContact = basic.email || basic.phone || basic.location || websites.length > 0
  const hasEducation = visibility.education !== false && education.length > 0
  const hasSkills = visibility.skills !== false && skillGroups.length > 0
  const hasHobbies = visibility.hobbies !== false && hobbies.length > 0
  const hasSummary = basic.summary && basic.summary.trim()
  const hasExperience = visibility.experience !== false && experience.length > 0

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
        padding: '38px 42px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header: Photo Avatar + Large Name + Headline */}
      <header
        className="flex items-center gap-6 pb-6 border-b border-[#E8E4DC]"
        style={{ borderColor: `${accentColor}30` }}
      >
        {/* Photo Avatar */}
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

        {/* Name & Headline */}
        <div className="flex-1 min-w-0">
          <h1
            className="text-[28pt] leading-tight tracking-tight font-bold"
            style={{ fontFamily: titleFontFamily, color: textColor }}
          >
            {basic.fullName || 'David St. Peter'}
          </h1>
          <p
            className="mt-1 text-[12pt] font-medium tracking-wide uppercase"
            style={{ color: accentColor }}
          >
            {basic.jobTitle || 'Senior Software Engineer'}
          </p>
        </div>
      </header>

      {/* Two-Column ATS Grid */}
      <div className="mt-6 grid grid-cols-12 gap-8 items-start">
        {/* Left Column: Education & Contact Coordinates, Websites, Skills, Hobbies (~38%) */}
        <div className="col-span-5 space-y-6 pr-2 border-r border-[#E8E4DC]/60">
          {/* Contact Coordinates */}
          {hasContact && (
            <section>
              <h2
                className="text-[10pt] font-bold uppercase tracking-wider pb-1.5 mb-2.5 border-b"
                style={{ color: accentColor, borderColor: `${accentColor}40` }}
              >
                Contact Details
              </h2>
              <div className="space-y-2 text-[9pt] text-[#403D39]">
                {basic.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="shrink-0" style={{ color: accentColor }} />
                    <span className="break-all">{basic.email}</span>
                  </div>
                )}
                {basic.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="shrink-0" style={{ color: accentColor }} />
                    <span>{basic.phone}</span>
                  </div>
                )}
                {basic.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={12} className="shrink-0" style={{ color: accentColor }} />
                    <span>{basic.location}</span>
                  </div>
                )}
                {websites.map((w) => (
                  <div key={w.id} className="flex items-center gap-2">
                    <Globe size={12} className="shrink-0" style={{ color: accentColor }} />
                    <span className="truncate">
                      {w.label ? <strong className="font-semibold">{w.label}: </strong> : null}
                      <span className="text-[#666055]">{w.url}</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {hasEducation && (
            <section>
              <h2
                className="text-[10pt] font-bold uppercase tracking-wider pb-1.5 mb-2.5 border-b"
                style={{ color: accentColor, borderColor: `${accentColor}40` }}
              >
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    onClick={() => setActiveItem({ list: 'education', id: edu.id })}
                    className="cursor-pointer group rounded p-1 hover:bg-[#FBF9F5] transition-colors"
                  >
                    <div className="text-[9.5pt] font-bold text-[#1A1A1A] leading-snug">
                      {edu.degree || 'Degree Program'}
                    </div>
                    <div className="text-[9pt] font-medium" style={{ color: accentColor }}>
                      {edu.school || 'University'}
                    </div>
                    {edu.gradYear && (
                      <div className="text-[8.5pt] text-[#666055] mt-0.5">
                        Graduation: {edu.gradYear}
                      </div>
                    )}
                    {edu.focus && (
                      <div className="text-[8.5pt] italic text-[#666055] mt-0.5">
                        {edu.focus}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {hasSkills && (
            <section>
              <h2
                className="text-[10pt] font-bold uppercase tracking-wider pb-1.5 mb-2.5 border-b"
                style={{ color: accentColor, borderColor: `${accentColor}40` }}
              >
                Skills & Competencies
              </h2>
              <div className="space-y-2.5">
                {skillGroups.map((g) => (
                  <div key={g.id}>
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
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hobbies */}
          {hasHobbies && (
            <section>
              <h2
                className="text-[10pt] font-bold uppercase tracking-wider pb-1.5 mb-2.5 border-b"
                style={{ color: accentColor, borderColor: `${accentColor}40` }}
              >
                Hobbies & Interests
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {hobbies.map((h) => (
                  <span
                    key={h.id}
                    className="inline-flex items-center gap-1 rounded-full border border-[#E8E4DC] px-2.5 py-0.5 text-[8pt] text-[#403D39]"
                  >
                    <Heart size={9} style={{ color: accentColor }} />
                    {h.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Profile Summary & Experience Timeline (~62%) */}
        <div className="col-span-7 space-y-6">
          {/* Professional Profile / Summary */}
          {hasSummary && (
            <section>
              <h2
                className="text-[11pt] font-bold uppercase tracking-wider pb-1.5 mb-2 border-b"
                style={{ color: accentColor, borderColor: `${accentColor}40` }}
              >
                Profile Summary
              </h2>
              <p className="text-[9.5pt] text-[#2D2D2D] leading-relaxed text-justify">
                {basic.summary}
              </p>
            </section>
          )}

          {/* Experience Timeline */}
          {hasExperience && (
            <section>
              <h2
                className="text-[11pt] font-bold uppercase tracking-wider pb-1.5 mb-3.5 border-b"
                style={{ color: accentColor, borderColor: `${accentColor}40` }}
              >
                Employment History
              </h2>

              <div className="relative pl-4 space-y-5 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E8E4DC]">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => setActiveItem({ list: 'experience', id: exp.id })}
                    className="relative cursor-pointer group rounded p-1 hover:bg-[#FBF9F5] transition-colors"
                  >
                    {/* Timeline Dot */}
                    <div
                      className="absolute -left-[19px] top-1.5 h-2.5 w-2.5 rounded-full border-2 bg-white"
                      style={{ borderColor: accentColor }}
                    />

                    {/* Role Title & Dates */}
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-[10pt] font-bold text-[#1A1A1A]">
                        {exp.role || 'Role Title'}
                      </h3>
                      <span className="shrink-0 text-[8.5pt] font-semibold text-[#666055]">
                        {dateRange(exp)}
                      </span>
                    </div>

                    {/* Company & Location */}
                    <div className="text-[9pt] font-semibold" style={{ color: accentColor }}>
                      {exp.company || 'Company'}
                      {exp.location ? <span className="font-normal text-[#666055]"> · {exp.location}</span> : null}
                    </div>

                    {/* Achievements / Bullets */}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1 text-[9pt] text-[#2D2D2D]">
                        {exp.bullets.filter(Boolean).map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-snug">
                            <span className="mt-1 text-[8pt] text-[#666055] select-none">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
