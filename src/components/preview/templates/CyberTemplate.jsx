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
        <span className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: accent }} />
        <h2 className="text-[10.5px] font-bold uppercase tracking-[0.22em]" style={{ fontFamily: HEAD, color: accent }}>
          {title}
        </h2>
        <div className="h-0.5 flex-1" style={{ backgroundColor: accent, opacity: 0.35 }} />
      </div>
      {children}
    </section>
  )
}

export default function CyberTemplate({ resume, theme }) {
  const t = TEMPLATE_BY_ID.cyber
  const accent = theme?.accentColor || resume?.formatting?.accentColor || t?.accent || '#0e7490'
  const {
    basic,
    experience,
    education,
    skillGroups,
    projects,
    certifications,
    languages = [],
    awards = [],
    references = { mode: 'upon_request', text: 'References available upon request', items: [] },
    customSections = [],
    sectionTitles = {},
    visibility = {},
  } = resume

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
                          marker="✦" className="gap-1.5" markerStyle={{ color: accent }} />
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

        {visibility.projects && projects.some((p) => p.title || p.name || p.description) && (
          <Section title="Projects" accent={accent}>
            <div className="space-y-2.5">
              {projects
                .filter((p) => p.title || p.name || p.description)
                .map((p) => (
                  <div key={p.id} className="break-inside-avoid resume-block">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[10.5px] font-bold">
                        {p.title || p.name}
                      </p>
                      {p.link && (
                        <span className="font-mono text-[8.8px] font-medium" style={{ color: accent }}>
                          ↗ {p.link}
                        </span>
                      )}
                    </div>
                    {p.techStack && (
                      <p className="text-[8.8px] font-semibold" style={{ color: accent }}>
                        {p.techStack}
                      </p>
                    )}
                    {p.description && (
                      <p className="text-justify text-[9.5px] whitespace-pre-line leading-relaxed">{p.description}</p>
                    )}
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

        {visibility.languages !== false && languages.some((l) => l.name) && (
          <Section title={sectionTitles.languages || 'Languages'} accent={accent}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {languages
                .filter((l) => l.name)
                .map((l) => (
                  <div key={l.id} className="flex items-center justify-between rounded-lg px-3 py-1.5" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                    <div>
                      <p className="text-[9.4px] font-bold">{l.name}</p>
                      {l.level && <p className="text-[8px] text-slate-500">{l.level}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <span
                          key={dot}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor: (l.rating || 4) >= dot ? accent : '#cbd5e1',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </Section>
        )}

        {visibility.awards !== false && awards.some((a) => a.title || a.issuer) && (
          <Section title={sectionTitles.awards || 'Awards & Honors'} accent={accent}>
            <div className="space-y-2">
              {awards
                .filter((a) => a.title || a.issuer)
                .map((a) => (
                  <div key={a.id} className="rounded-lg px-3 py-2" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[10px] font-bold">{a.title}</p>
                      {a.date && <span className="font-mono text-[8.4px] text-slate-500">{a.date}</span>}
                    </div>
                    {a.issuer && <p className="text-[9px] font-medium" style={{ color: accent }}>{a.issuer}</p>}
                    {a.description && <p className="mt-0.5 text-[8.8px] text-slate-600">{a.description}</p>}
                  </div>
                ))}
            </div>
          </Section>
        )}

        {visibility.customSections !== false &&
          customSections.map((sec) => {
            const validItems = (sec.items || []).filter((item) => item.title || item.subtitle || item.description)
            if (validItems.length === 0) return null
            return (
              <Section key={sec.id} title={sec.title || 'Custom Section'} accent={accent}>
                <div className="space-y-2">
                  {validItems.map((item) => (
                    <div key={item.id} className="rounded-lg px-3 py-2" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                      {(item.title || item.date) && (
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-[10px] font-bold">{item.title}</p>
                          {item.date && <span className="font-mono text-[8.4px] text-slate-500">{item.date}</span>}
                        </div>
                      )}
                      {item.subtitle && <p className="text-[9px] font-medium" style={{ color: accent }}>{item.subtitle}</p>}
                      {item.description && <p className="mt-0.5 whitespace-pre-line text-[8.8px] text-slate-600">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </Section>
            )
          })}

        {visibility.references !== false && (
          <Section title={sectionTitles.references || 'References'} accent={accent}>
            {references.mode === 'upon_request' ? (
              <p className="text-[9.2px] italic text-slate-600">
                {references.text || 'References available upon request.'}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {(references.items || [])
                  .filter((r) => r.name || r.company)
                  .map((ref) => (
                    <div key={ref.id} className="rounded-lg px-3 py-2" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                      <p className="text-[10px] font-bold">{ref.name}</p>
                      {(ref.role || ref.company) && (
                        <p className="text-[8.8px] font-medium" style={{ color: accent }}>
                          {ref.role}
                          {ref.role && ref.company && ' · '}
                          {ref.company}
                        </p>
                      )}
                      {ref.email && <p className="text-[8.2px] text-slate-600">{ref.email}</p>}
                      {ref.phone && <p className="text-[8.2px] text-slate-500">{ref.phone}</p>}
                    </div>
                  ))}
              </div>
            )}
          </Section>
        )}
      </div>
    </div>
  )
}
