import { Globe, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { TEMPLATE_BY_ID } from '../../../config/templates'
import { dateRange } from '../../../lib/format'
import { AddBulletButton, Bullet } from '../Bullet'

const SANS = "'Inter', system-ui, sans-serif"
const DISPLAY = "'Space Grotesk', 'Inter', sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

function RailHead({ children, accent }) {
  return (
    <div className="mb-2 mt-4 first:mt-0">
      <div className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-[3px] rounded-full" style={{ backgroundColor: accent }} />
        <h2 className="text-[9.5px] font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>
          {children}
        </h2>
      </div>
      <div style={{ backgroundColor: accent }} className="h-0.5 w-full my-1 opacity-40" />
    </div>
  )
}

function MainHead({ children, accent }) {
  return (
    <div className="mb-2 mt-4">
      <div className="flex items-center gap-2">
        <h2 className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: accent, fontFamily: DISPLAY }}>
          {children}
        </h2>
        <div className="h-0.5 flex-1" style={{ backgroundColor: accent, opacity: 0.35 }} />
      </div>
    </div>
  )
}

export default function TechTemplate({ resume, theme }) {
  const { basic, experience, education, skillGroups, projects, certifications, visibility, formatting } = resume
  const accent = theme?.accentColor || formatting?.accentColor || TEMPLATE_BY_ID.tech?.accent || '#244CEC'
  const contact = [
    { Icon: Mail, label: basic.email },
    { Icon: Phone, label: basic.phone },
    { Icon: MapPin, label: basic.location },
    { Icon: Linkedin, label: basic.linkedin },
    { Icon: Globe, label: basic.portfolio },
  ].filter((c) => c.label)

  return (
    <div className="flex flex-col" style={{ padding: '36px 34px 40px', color: '#111827', fontFamily: SANS, fontSize: '9.8px', lineHeight: 1.5 }}>
      {/* Masthead */}
      <header className="flex items-end justify-between gap-4 pb-3">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: DISPLAY }}>
            {basic.fullName || 'Your Name'}
          </h1>
          <p className="text-[11px] font-semibold" style={{ color: accent }}>
            {basic.jobTitle}
          </p>
        </div>
        <div className="max-w-[230px] space-y-0.5 text-right text-[8.6px] text-slate-600">
          {contact.map(({ Icon, label }) => (
            <p key={label} className="flex items-center justify-end gap-1">
              <Icon size={9} className="shrink-0" style={{ color: accent }} />
              <span className="truncate">{label}</span>
            </p>
          ))}
        </div>
      </header>
      <div style={{ backgroundColor: accent }} className="h-0.5 w-full mt-1 mb-2" />

      {basic.summary && (
        <p className="mt-3 rounded-md border-l-2 py-0.5 pl-2.5 text-justify text-[9.6px] leading-relaxed" style={{ borderColor: accent }}>
          {basic.summary}
        </p>
      )}

      <div className="mt-4 flex gap-6">
        {/* Main column */}
        <div className="min-w-0 flex-1">
          {visibility.experience && experience.some((e) => e.role || e.company || e.bullets.some(Boolean)) && (
            <section>
              <MainHead accent={accent}>Experience</MainHead>
              <div className="space-y-2.5">
                {experience
                  .filter((e) => e.role || e.company || e.bullets.some(Boolean))
                  .map((exp) => (
                    <div key={exp.id} className="group/exp break-inside-avoid">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-[10.6px] font-bold">{exp.role || 'Role'}</p>
                        <span className="shrink-0 whitespace-nowrap text-[8.2px] font-medium text-slate-500" style={{ fontFamily: MONO }}>
                          {dateRange(exp)}
                        </span>
                      </div>
                      <p className="text-[9.4px] font-semibold" style={{ color: accent }}>
                        {exp.company}
                        {exp.company && exp.location && <span className="font-normal text-slate-500"> — {exp.location}</span>}
                      </p>
                      <div className="mt-1 space-y-[2.5px]">
                        {exp.bullets.map((b, i) => (
                          <Bullet key={i} expId={exp.id} index={i} text={b} marker="▸" className="gap-1.5" markerClass="text-[7px]" markerStyle={{ color: accent }} />
                        ))}
                        <AddBulletButton expId={exp.id} className="opacity-0 transition-opacity group-hover/exp:opacity-100" />
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {visibility.projects && projects.some((p) => p.name || p.description) && (
            <section>
              <MainHead accent={accent}>Projects</MainHead>
              <div className="space-y-1.5">
                {projects
                  .filter((p) => p.name || p.description)
                  .map((p) => (
                    <div key={p.id} className="break-inside-avoid">
                      <p className="text-[10px] font-bold">
                        {p.name}
                        {p.link && <span className="ml-1 font-normal text-[8.8px]" style={{ color: accent }}>{p.link}</span>}
                      </p>
                      {p.description && <p className="text-justify text-[9.4px]">{p.description}</p>}
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Side rail */}
        <aside className="w-[172px] shrink-0 border-l border-slate-200 pl-4" style={{ borderColor: `${accent}35` }}>
          {visibility.skills && skillGroups.some((g) => g.items.some((x) => x.trim())) && (
            <section>
              <RailHead accent={accent}>Skills</RailHead>
              <div className="space-y-1.5">
                {skillGroups
                  .filter((g) => g.items.some((x) => x.trim()))
                  .map((g) => {
                    const joined = g.items
                      .filter((x) => x.trim())
                      .join(', ')
                    return (
                      <div key={g.id}>
                        <p className="text-[8.2px] font-bold uppercase tracking-[0.12em] text-slate-500">{g.label || 'Category'}</p>
                        <p className="mt-0.5 text-[8.6px] leading-relaxed text-slate-700">{joined}</p>
                      </div>
                    )
                  })}
              </div>
            </section>
          )}

          {visibility.education && education.some((e) => e.degree || e.school) && (
            <section>
              <RailHead accent={accent}>Education</RailHead>
              <div className="space-y-1.5">
                {education
                  .filter((e) => e.degree || e.school)
                  .map((e) => (
                    <div key={e.id}>
                      <p className="text-[9px] font-bold leading-tight">{e.degree || 'Degree'}</p>
                      <p className="text-[8.8px] text-slate-600">{e.school}</p>
                      <p className="text-[8.2px]" style={{ color: accent, fontFamily: MONO }}>
                        {e.gradYear ? `Class of ${e.gradYear}` : ''}
                      </p>
                      {e.focus && <p className="text-[8.4px] text-slate-500">{e.focus}</p>}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {visibility.certifications && certifications.some((c) => c.name) && (
            <section>
              <RailHead accent={accent}>Certifications</RailHead>
              <div className="space-y-1">
                {certifications
                  .filter((c) => c.name)
                  .map((c) => (
                    <div key={c.id}>
                      <p className="text-[8.8px] font-semibold leading-tight">{c.name}</p>
                      <p className="text-[8.2px] text-slate-500">{c.issuer}</p>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}
