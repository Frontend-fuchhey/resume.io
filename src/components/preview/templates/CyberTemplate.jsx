import { Globe, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { TEMPLATE_BY_ID } from '../../../config/templates'
import { dateRange } from '../../../lib/format'
import { AddBulletButton, Bullet } from '../Bullet'

const BODY = "'Inter', system-ui, sans-serif"
const HEAD = "'Space Grotesk', 'Inter', sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

function Section({ title, accent, children }) {
  return (
    <section className="mt-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-[2px]" style={{ background: accent }} />
        <h2 className="text-[10.5px] font-bold uppercase tracking-[0.22em]" style={{ fontFamily: HEAD }}>
          {title}
        </h2>
        <span className="h-px flex-1" style={{ background: `${accent}44` }} />
      </div>
      {children}
    </section>
  )
}

export default function CyberTemplate({ resume }) {
  const t = TEMPLATE_BY_ID.cyber
  const accent = t.accent
  const { basic, experience, education, skillGroups, projects, certifications, visibility } = resume

  const contact = [
    { Icon: Phone, label: basic.phone },
    { Icon: Mail, label: basic.email },
    { Icon: MapPin, label: basic.location },
    { Icon: Linkedin, label: basic.linkedin },
    { Icon: Globe, label: basic.portfolio },
  ].filter((c) => c.label)

  return (
    <div className="flex flex-col" style={{ color: '#0f172a', fontFamily: BODY, fontSize: '10px', lineHeight: 1.5 }}>
      {/* Gradient header band */}
      <header className="px-9 pb-5 pt-7 text-white" style={{ background: 'linear-gradient(115deg,#164e63 0%,#0e7490 46%,#4338ca 100%)' }}>
        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-cyan-200/90" style={{ fontFamily: HEAD }}>
          {basic.jobTitle || 'Professional Resume'}
        </p>
        <h1 className="mt-1.5 text-[27px] font-bold leading-tight tracking-tight" style={{ fontFamily: HEAD }}>
          {basic.fullName || 'Your Name'}
        </h1>
        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-cyan-50/90">
          {contact.map(({ Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1">
              <Icon size={9.5} /> {label}
            </span>
          ))}
        </div>
      </header>

      <div style={{ padding: '18px 34px 34px' }}>
        {basic.summary && (
          <div className="rounded-lg px-3.5 py-2.5" style={{ background: `${accent}0d`, border: `1px solid ${accent}30` }}>
            <p className="text-justify text-[10px] leading-relaxed">{basic.summary}</p>
          </div>
        )}

        {visibility.experience && experience.some((e) => e.role || e.company || e.bullets.some(Boolean)) && (
          <Section title="Experience" accent={accent}>
            <div className="space-y-3">
              {experience
                .filter((e) => e.role || e.company || e.bullets.some(Boolean))
                .map((exp) => (
                  <div key={exp.id} className="group/exp break-inside-avoid">
                    <div className="flex items-baseline justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold leading-snug">{exp.role || 'Role'}</p>
                        <p className="text-[9.6px] font-semibold" style={{ color: accent }}>
                          {exp.company}
                          {exp.company && exp.location && <span className="font-normal text-slate-500"> · {exp.location}</span>}
                        </p>
                      </div>
                      <span className="shrink-0 whitespace-nowrap text-[8.6px] font-medium tracking-tight text-slate-500" style={{ fontFamily: MONO }}>
                        {dateRange(exp)}
                      </span>
                    </div>
                    <div className="mt-1.5 space-y-[3px]">
                      {exp.bullets.map((b, i) => (
                        <Bullet key={i} expId={exp.id} index={i} text={b} markerClass="text-[8px]"
                          marker="✦" className="gap-1.5" />
                      ))}
                      <AddBulletButton expId={exp.id} className="opacity-0 transition-opacity group-hover/exp:opacity-100" />
                    </div>
                  </div>
                ))}
            </div>
          </Section>
        )}

        {visibility.skills && skillGroups.some((g) => g.items.some((x) => x.trim())) && (
          <Section title="Skills" accent={accent}>
            <div className="space-y-1.5">
              {skillGroups
                .filter((g) => g.items.some((x) => x.trim()))
                .map((g) => (
                  <div key={g.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="w-[104px] shrink-0 text-[8.6px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      {g.label || 'Category'}
                    </span>
                    <span className="flex flex-wrap gap-1">
                      {g.items
                        .filter((x) => x.trim())
                        .map((x, i) => (
                          <span
                            key={i}
                            className="rounded-full px-2 py-[1.5px] text-[8.6px] font-medium"
                            style={{ background: `${accent}12`, border: `1px solid ${accent}38`, color: '#334155' }}
                          >
                            {x}
                          </span>
                        ))}
                    </span>
                  </div>
                ))}
            </div>
          </Section>
        )}

        {visibility.projects && projects.some((p) => p.name || p.description) && (
          <Section title="Projects" accent={accent}>
            <div className="space-y-2">
              {projects
                .filter((p) => p.name || p.description)
                .map((p) => (
                  <div key={p.id} className="break-inside-avoid">
                    <p className="text-[10.5px] font-bold">
                      {p.name}
                      {p.link && (
                        <span className="ml-1.5 font-medium normal-case tracking-normal" style={{ color: accent }}>
                          ↗ {p.link}
                        </span>
                      )}
                    </p>
                    {p.description && <p className="text-justify">{p.description}</p>}
                  </div>
                ))}
            </div>
          </Section>
        )}

        <div className="mt-5 grid grid-cols-2 gap-5">
          {visibility.education && education.some((e) => e.degree || e.school) && (
            <Section title="Education" accent={accent}>
              <div className="space-y-2">
                {education
                  .filter((e) => e.degree || e.school)
                  .map((e) => (
                    <div key={e.id} className="rounded-lg px-3 py-2" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                      <p className="text-[10px] font-bold leading-tight">{e.degree || 'Degree'}</p>
                      <p className="text-[9px]" style={{ color: accent }}>{e.school}</p>
                      <div className="mt-0.5 flex justify-between text-[8.4px] text-slate-500">
                        <span>{e.focus}</span>
                        <span className="font-semibold" style={{ fontFamily: MONO }}>{e.gradYear}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </Section>
          )}
          {visibility.certifications && certifications.some((c) => c.name) && (
            <Section title="Certifications" accent={accent}>
              <div className="space-y-1">
                {certifications
                  .filter((c) => c.name)
                  .map((c) => (
                    <div key={c.id} className="rounded-lg px-3 py-1.5" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                      <p className="text-[9.6px] font-bold leading-tight">{c.name}</p>
                      <p className="text-[8.6px] text-slate-500">{c.issuer}{c.year ? ` · ${c.year}` : ''}</p>
                    </div>
                  ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}
