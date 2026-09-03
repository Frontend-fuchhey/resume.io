import { Globe, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { TEMPLATE_BY_ID } from '../../../config/templates'
import { dateRange } from '../../../lib/format'
import { AddBulletButton, Bullet } from '../Bullet'

const SERIF = "'Playfair Display', Georgia, serif"
const SANS = "'Inter', system-ui, sans-serif"

function Head({ children, accent }) {
  return (
    <div className="mb-2.5 mt-5 text-center">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.34em]" style={{ fontFamily: SERIF, color: accent || '#0f172a' }}>
        {children}
      </h2>
      <div className="mx-auto my-1 h-0.5 w-14" style={{ backgroundColor: accent }} />
    </div>
  )
}

export default function ExecutiveTemplate({ resume, theme }) {
  const { basic, experience, education, skillGroups, projects, certifications, visibility, formatting } = resume
  const accent = theme?.accentColor || formatting?.accentColor || TEMPLATE_BY_ID.exec?.accent || '#FF5E1A'
  const contact = [
    { Icon: Phone, label: basic.phone },
    { Icon: Mail, label: basic.email },
    { Icon: MapPin, label: basic.location },
    { Icon: Linkedin, label: basic.linkedin },
    { Icon: Globe, label: basic.portfolio },
  ].filter((c) => c.label)

  return (
    <div className="flex flex-col text-slate-800" style={{ padding: '52px 62px 60px', fontFamily: SANS, fontSize: '10.2px', lineHeight: 1.55 }}>
      {/* Masthead */}
      <header className="text-center">
        <h1 className="text-[30px] font-bold tracking-wide" style={{ fontFamily: SERIF, color: '#0f172a' }}>
          {basic.fullName || 'Your Name'}
        </h1>
        {basic.jobTitle && (
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.42em]" style={{ color: accent }}>
            {basic.jobTitle}
          </p>
        )}
        <div className="mx-auto mt-4 h-0.5 w-full opacity-30" style={{ backgroundColor: accent }} />
        {contact.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[9.2px] uppercase tracking-[0.14em] text-slate-500">
            {contact.map(({ Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <Icon size={10} style={{ color: accent }} />
                {label}
              </span>
            ))}
          </div>
        )}
        <div className="mx-auto mt-4 h-0.5 w-full opacity-30" style={{ backgroundColor: accent }} />
      </header>

      {basic.summary && (
        <section>
          <Head accent={accent}>Profile</Head>
          <p className="text-center text-justify italic leading-relaxed" style={{ fontFamily: SERIF }}>
            {basic.summary}
          </p>
        </section>
      )}

      {visibility.experience && experience.some((e) => e.role || e.company || e.bullets.some(Boolean)) && (
        <section>
          <Head accent={accent}>Professional Experience</Head>
          <div className="space-y-3.5">
            {experience
              .filter((e) => e.role || e.company || e.bullets.some(Boolean))
              .map((exp) => (
                <div key={exp.id} className="group/exp break-inside-avoid">
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold" style={{ fontFamily: SERIF }}>
                        {exp.role || 'Role'}
                        {exp.company && <span className="font-medium" style={{ color: accent }}> · {exp.company}</span>}
                      </p>
                      {exp.location && <p className="text-[9px] uppercase tracking-[0.16em] text-slate-400">{exp.location}</p>}
                    </div>
                    <span className="shrink-0 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      {dateRange(exp)}
                    </span>
                  </div>
                  <div className="mt-1.5 space-y-[3px]">
                    {exp.bullets.map((b, i) => (
                      <Bullet key={i} expId={exp.id} index={i} text={b} marker="—" className="gap-2" markerClass="text-[7px] translate-y-[1px]" markerStyle={{ color: accent }} />
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
          <Head accent={accent}>Selected Projects</Head>
          <div className="space-y-2">
            {projects
              .filter((p) => p.name || p.description)
              .map((p) => (
                <div key={p.id} className="break-inside-avoid">
                  <p className="text-[11px] font-bold" style={{ fontFamily: SERIF }}>
                    {p.name}
                    {p.link && (
                      <span className="ml-1 font-normal normal-case tracking-normal" style={{ color: accent }}>
                        {p.link}
                      </span>
                    )}
                  </p>
                  {p.description && <p className="text-justify">{p.description}</p>}
                </div>
              ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {visibility.education && education.some((e) => e.degree || e.school) && (
          <section>
            <Head accent={accent}>Education</Head>
            <div className="space-y-2">
              {education
                .filter((e) => e.degree || e.school)
                .map((e) => (
                  <div key={e.id} className="text-center">
                    <p className="text-[11px] font-bold" style={{ fontFamily: SERIF }}>
                      {e.degree || 'Degree'}
                    </p>
                    <p className="text-[9.6px] font-medium text-slate-500">
                      {e.school}
                      {e.gradYear && ` · ${e.gradYear}`}
                    </p>
                    {e.focus && <p className="text-[9px] italic text-slate-400">{e.focus}</p>}
                  </div>
                ))}
            </div>
          </section>
        )}
        {visibility.certifications && certifications.some((c) => c.name) && (
          <section>
            <Head accent={accent}>Certifications</Head>
            <div className="space-y-1 text-center">
              {certifications
                .filter((c) => c.name)
                .map((c) => (
                  <p key={c.id} className="text-[9.8px]">
                    <span className="font-semibold">{c.name}</span>
                    {c.issuer && <span className="text-slate-500"> — {c.issuer}</span>}
                  </p>
                ))}
            </div>
          </section>
        )}
      </div>

      {visibility.skills && skillGroups.some((g) => g.items.some((x) => x.trim())) && (
        <section>
          <Head accent={accent}>Core Competencies</Head>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
            {skillGroups
              .filter((g) => g.items.some((x) => x.trim()))
              .map((g) => (
                <div key={g.id} className="flex items-baseline gap-2">
                  <span className="w-[120px] shrink-0 text-right text-[8.8px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    {g.label || 'Category'}
                  </span>
                  <span className="text-[9.6px]">
                    {g.items.filter((x) => x.trim()).join(', ')}
                  </span>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  )
}
