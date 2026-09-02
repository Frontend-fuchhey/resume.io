import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'
import { TEMPLATE_BY_ID } from '../../../config/templates'
import { dateRange } from '../../../lib/format'
import { AddBulletButton, Bullet } from '../Bullet'

const INK = '#111827'
const MUTED = '#4b5563'
const F = "'Inter', system-ui, sans-serif"

function Head({ title }) {
  const { accent } = TEMPLATE_BY_ID.classic
  return (
    <h2 className="mb-2 mt-4 border-b-2 pb-1 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: INK, borderColor: accent, fontFamily: F }}>
      {title}
    </h2>
  )
}

export default function ClassicTemplate({ resume }) {
  const { basic, experience, education, skillGroups, projects, certifications, visibility } = resume
  const contact = [
    basic.email && { Icon: Mail, label: basic.email },
    basic.phone && { Icon: Phone, label: basic.phone },
    basic.location && { Icon: MapPin, label: basic.location },
    basic.linkedin && { Icon: Linkedin, label: basic.linkedin },
    basic.portfolio && { Icon: Globe, label: basic.portfolio },
  ].filter(Boolean)

  return (
    <div className="flex flex-col" style={{ padding: '46px 52px 52px', color: INK, fontFamily: F, fontSize: '10.3px', lineHeight: 1.5 }}>
      {/* Masthead */}
      <header className="text-center">
        <h1 className="text-[25px] font-bold uppercase tracking-[0.08em]" style={{ fontFamily: F }}>
          {basic.fullName || 'Your Name'}
        </h1>
        {basic.jobTitle && (
          <p className="mt-0.5 text-[11.5px] font-medium tracking-[0.04em]" style={{ color: MUTED }}>
            {basic.jobTitle}
          </p>
        )}
        {contact.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[9.5px]">
            {contact.map(({ Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1 text-slate-600">
                <Icon size={10} strokeWidth={2} /> {label}
              </span>
            ))}
          </div>
        )}
      </header>

      {basic.summary && (
        <section>
          <Head title="Summary" />
          <p className="text-justify" style={{ color: INK }}>{basic.summary}</p>
        </section>
      )}

      {visibility.experience && experience.some((e) => e.role || e.company || e.bullets.some(Boolean)) && (
        <section>
          <Head title="Work Experience" />
          <div className="space-y-3">
            {experience.map((exp) => {
              const show = exp.role || exp.company || exp.bullets.some(Boolean)
              if (!show) return null
              return (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[11.2px] font-bold">
                      {exp.role}
                      {exp.role && exp.company && <span className="font-normal">, </span>}
                      {exp.company && <span className="font-semibold italic">{exp.company}</span>}
                    </p>
                    <span className="shrink-0 whitespace-nowrap text-[9.6px] font-medium" style={{ color: MUTED }}>
                      {dateRange(exp)}
                    </span>
                  </div>
                  {exp.location && <p className="text-[9.6px] italic" style={{ color: MUTED }}>{exp.location}</p>}
                  <div className="mt-1 space-y-[3px]">
                    {exp.bullets.map((b, i) => (
                      <Bullet key={i} expId={exp.id} index={i} text={b} className="text-[10.1px]" />
                    ))}
                    <AddBulletButton expId={exp.id} className="opacity-100" />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {visibility.skills && skillGroups.some((g) => g.label.trim() && g.items.some((t) => t.trim())) && (
        <section>
          <Head title="Skills & Tools" />
          <div className="space-y-1">
            {skillGroups
              .filter((g) => g.label.trim() && g.items.some((t) => t.trim()))
              .map((g) => (
                <p key={g.id}>
                  <span className="font-bold uppercase tracking-wide">{g.label}</span>
                  <span className="text-slate-500">: </span>
                  {g.items.filter((t) => t.trim()).join(', ')}
                </p>
              ))}
          </div>
        </section>
      )}

      {visibility.projects && projects.some((p) => p.name || p.description) && (
        <section>
          <Head title="Projects" />
          <div className="space-y-2">
            {projects
              .filter((p) => p.name || p.description)
              .map((p) => (
                <div key={p.id} className="break-inside-avoid">
                  <p className="text-[10.8px] font-bold">
                    {p.name}
                    {p.link && (
                      <span className="ml-1.5 font-medium normal-case tracking-normal" style={{ color: '#2563eb' }}>
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

      {visibility.education && education.some((e) => e.degree || e.school) && (
        <section>
          <Head title="Education" />
          <div className="space-y-1.5">
            {education
              .filter((e) => e.degree || e.school)
              .map((e) => (
                <div key={e.id} className="break-inside-avoid">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[10.8px] font-bold">
                      {e.degree}
                      {e.degree && e.school && <span className="font-normal"> — </span>}
                      {e.school && <span className="font-medium italic">{e.school}</span>}
                    </p>
                    {e.gradYear && <span className="shrink-0 text-[9.6px]" style={{ color: MUTED }}>{e.gradYear}</span>}
                  </div>
                  {e.focus && <p className="text-[9.6px] italic" style={{ color: MUTED }}>{e.focus}</p>}
                </div>
              ))}
          </div>
        </section>
      )}

      {visibility.certifications && certifications.some((c) => c.name) && (
        <section>
          <Head title="Certifications" />
          <div className="space-y-0.5">
            {certifications
              .filter((c) => c.name)
              .map((c) => (
                <p key={c.id}>
                  <span className="font-semibold">{c.name}</span>
                  {c.issuer && <span className="text-slate-500"> · {c.issuer}</span>}
                  {c.year && <span className="text-slate-400"> · {c.year}</span>}
                </p>
              ))}
          </div>
        </section>
      )}
    </div>
  )
}
