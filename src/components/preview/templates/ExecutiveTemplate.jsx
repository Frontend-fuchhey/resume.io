import { Globe, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { TEMPLATE_BY_ID } from '../../../config/templates'
import { dateRange } from '../../../lib/format'
import { AddBulletButton, Bullet } from '../Bullet'
import { useResumeStore } from '../../../store/useResumeStore'
import { EditableText } from '../EditableText'
import { EditableLink } from '../EditableLink'
import { EditableDate } from '../EditableDate'

const SERIF = "'Playfair Display', Georgia, serif"
const SANS = "'Inter', system-ui, sans-serif"

function Head({ children, accent, sectionKey, sectionTitles, onTitleChange }) {
  return (
    <div className="mb-2.5 mt-5 text-center">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.34em]" style={{ fontFamily: SERIF, color: accent || '#0f172a' }}>
        {sectionKey && onTitleChange ? (
          <EditableText
            value={sectionTitles?.[sectionKey] || children}
            onChange={(val) => onTitleChange(sectionKey, val)}
            placeholder={children}
          />
        ) : (
          children
        )}
      </h2>
      <div className="mx-auto my-1 h-0.5 w-14" style={{ backgroundColor: accent }} />
    </div>
  )
}

export default function ExecutiveTemplate({ resume, theme }) {
  const { basic = {}, experience = [], education = [], skillGroups = [], projects = [], certifications = [], visibility = {}, formatting = {} } = resume
  const accent = theme?.accentColor || formatting?.accentColor || TEMPLATE_BY_ID.exec?.accent || '#FF5E1A'
  const sectionTitles = resume.sectionTitles || {}

  const setBasic = useResumeStore((s) => s.setBasic)
  const updateItem = useResumeStore((s) => s.updateItem)
  const updateSkill = useResumeStore((s) => s.updateSkill)
  const renameSkillGroup = useResumeStore((s) => s.renameSkillGroup)
  const setSectionTitle = useResumeStore((s) => s.setSectionTitle)

  return (
    <div className="flex flex-col text-slate-800" style={{ padding: '52px 62px 60px', fontFamily: SANS, fontSize: '10.2px', lineHeight: 1.55 }}>
      {/* Masthead */}
      <header className="text-center">
        <h1 className="text-[30px] font-bold tracking-wide" style={{ fontFamily: SERIF, color: '#0f172a' }}>
          <EditableText
            value={basic.fullName}
            onChange={(val) => setBasic({ fullName: val })}
            placeholder="Your Name"
          />
        </h1>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.42em]" style={{ color: accent }}>
          <EditableText
            value={basic.jobTitle}
            onChange={(val) => setBasic({ jobTitle: val })}
            placeholder="Executive Title"
          />
        </p>
        <div className="mx-auto mt-4 h-0.5 w-full opacity-30" style={{ backgroundColor: accent }} />
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[9.2px] uppercase tracking-[0.14em] text-slate-500">
          {(basic.phone || basic.phone === '') && (
            <span className="inline-flex items-center gap-1.5">
              <Phone size={10} style={{ color: accent }} />
              <EditableText
                value={basic.phone}
                onChange={(val) => setBasic({ phone: val })}
                placeholder="+1 (555) 000-0000"
              />
            </span>
          )}
          {(basic.email || basic.email === '') && (
            <span className="inline-flex items-center gap-1.5">
              <Mail size={10} style={{ color: accent }} />
              <EditableText
                value={basic.email}
                onChange={(val) => setBasic({ email: val })}
                placeholder="email@example.com"
              />
            </span>
          )}
          {(basic.location || basic.location === '') && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={10} style={{ color: accent }} />
              <EditableText
                value={basic.location}
                onChange={(val) => setBasic({ location: val })}
                placeholder="City, State"
              />
            </span>
          )}
          {basic.linkedin && (
            <span className="inline-flex items-center gap-1.5">
              <Linkedin size={10} style={{ color: accent }} />
              <EditableLink
                url={basic.linkedin}
                accentColor={accent}
                onChange={(val) => setBasic({ linkedin: typeof val === 'string' ? val : val.url })}
                placeholder="LinkedIn"
              />
            </span>
          )}
          {basic.portfolio && (
            <span className="inline-flex items-center gap-1.5">
              <Globe size={10} style={{ color: accent }} />
              <EditableLink
                url={basic.portfolio}
                accentColor={accent}
                onChange={(val) => setBasic({ portfolio: typeof val === 'string' ? val : val.url })}
                placeholder="Portfolio"
              />
            </span>
          )}
        </div>
        <div className="mx-auto mt-4 h-0.5 w-full opacity-30" style={{ backgroundColor: accent }} />
      </header>

      {(basic.summary || basic.summary === '') && (
        <section>
          <Head accent={accent} sectionKey="summary" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Profile</Head>
          <div className="text-center text-justify italic leading-relaxed" style={{ fontFamily: SERIF }}>
            <EditableText
              multiline
              value={basic.summary}
              onChange={(val) => setBasic({ summary: val })}
              placeholder="Executive profile summary..."
              className="w-full"
            />
          </div>
        </section>
      )}

      {visibility.experience !== false && experience.length > 0 && (
        <section>
          <Head accent={accent} sectionKey="experience" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Professional Experience</Head>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id} className="group/exp break-inside-avoid">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold" style={{ fontFamily: SERIF }}>
                      <EditableText
                        value={exp.role}
                        onChange={(val) => updateItem('experience', exp.id, { role: val })}
                        placeholder="Role"
                      />
                      <span className="font-medium" style={{ color: accent }}> · </span>
                      <EditableText
                        value={exp.company}
                        onChange={(val) => updateItem('experience', exp.id, { company: val })}
                        placeholder="Company"
                        className="font-medium"
                        style={{ color: accent }}
                      />
                    </p>
                    <div className="text-[9px] uppercase tracking-[0.16em] text-slate-400">
                      <EditableText
                        value={exp.location}
                        onChange={(val) => updateItem('experience', exp.id, { location: val })}
                        placeholder="Location"
                      />
                    </div>
                  </div>
                  <span className="shrink-0 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    <EditableDate
                      item={exp}
                      onPatch={(patch) => updateItem('experience', exp.id, patch)}
                    />
                  </span>
                </div>
                <div className="mt-1.5 space-y-[3px]">
                  {(exp.bullets || []).map((b, i) => (
                    <Bullet key={i} expId={exp.id} index={i} text={b} marker="—" className="gap-2" markerClass="text-[7px] translate-y-[1px]" markerStyle={{ color: accent }} />
                  ))}
                  <AddBulletButton expId={exp.id} className="opacity-0 transition-opacity group-hover/exp:opacity-100" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {visibility.projects !== false && projects.length > 0 && (
        <section className="resume-block">
          <Head accent={accent} sectionKey="projects" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Selected Projects</Head>
          <div className="space-y-2.5">
            {projects.map((p) => (
              <div key={p.id} className="break-inside-avoid resume-block">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[11px] font-bold" style={{ fontFamily: SERIF }}>
                    <EditableText
                      value={p.title || p.name}
                      onChange={(val) => updateItem('projects', p.id, { title: val, name: val })}
                      placeholder="Project Title"
                    />
                  </p>
                  <EditableLink
                    url={p.link}
                    accentColor={accent}
                    onChange={(newUrl) => updateItem('projects', p.id, { link: typeof newUrl === 'string' ? newUrl : newUrl.url })}
                    onDelete={() => updateItem('projects', p.id, { link: '' })}
                    placeholder="Add link..."
                    className="font-mono text-[9px] font-medium"
                  />
                </div>
                <div className="text-[9.2px] font-semibold" style={{ color: accent }}>
                  <EditableText
                    value={p.techStack}
                    onChange={(val) => updateItem('projects', p.id, { techStack: val })}
                    placeholder="Tech Stack / Methodology"
                  />
                </div>
                <div className="text-justify text-[9.6px] whitespace-pre-line leading-relaxed">
                  <EditableText
                    multiline
                    value={p.description}
                    onChange={(val) => updateItem('projects', p.id, { description: val })}
                    placeholder="Project achievements and scope..."
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {visibility.education !== false && education.length > 0 && (
          <section>
            <Head accent={accent} sectionKey="education" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Education</Head>
            <div className="space-y-2">
              {education.map((e) => (
                <div key={e.id} className="text-center">
                  <p className="text-[11px] font-bold" style={{ fontFamily: SERIF }}>
                    <EditableText
                      value={e.degree}
                      onChange={(val) => updateItem('education', e.id, { degree: val })}
                      placeholder="Degree"
                    />
                  </p>
                  <p className="text-[9.6px] font-medium text-slate-500">
                    <EditableText
                      value={e.school}
                      onChange={(val) => updateItem('education', e.id, { school: val })}
                      placeholder="Institution"
                    />
                    <span> · </span>
                    <EditableText
                      value={e.gradYear}
                      onChange={(val) => updateItem('education', e.id, { gradYear: val })}
                      placeholder="Year"
                    />
                  </p>
                  <div className="text-[9px] italic text-slate-400">
                    <EditableText
                      value={e.focus}
                      onChange={(val) => updateItem('education', e.id, { focus: val })}
                      placeholder="Honors / Focus"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {visibility.certifications !== false && certifications.length > 0 && (
          <section>
            <Head accent={accent} sectionKey="certifications" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Certifications</Head>
            <div className="space-y-1 text-center">
              {certifications.map((c) => (
                <p key={c.id} className="text-[9.8px]">
                  <span className="font-semibold">
                    <EditableText
                      value={c.name}
                      onChange={(val) => updateItem('certifications', c.id, { name: val })}
                      placeholder="Certification"
                    />
                  </span>
                  <span className="text-slate-500"> — </span>
                  <EditableText
                    value={c.issuer}
                    onChange={(val) => updateItem('certifications', c.id, { issuer: val })}
                    placeholder="Authority"
                    className="text-slate-500"
                  />
                </p>
              ))}
            </div>
          </section>
        )}
      </div>

      {visibility.skills !== false && skillGroups.length > 0 && (
        <section>
          <Head accent={accent} sectionKey="skills" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Core Competencies</Head>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
            {skillGroups.map((g) => (
              <div key={g.id} className="flex items-baseline gap-2">
                <span className="w-[120px] shrink-0 text-right text-[8.8px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  <EditableText
                    value={g.label}
                    onChange={(val) => renameSkillGroup(g.id, val)}
                    placeholder="Domain"
                  />
                </span>
                <span className="text-[9.6px]">
                  {g.items.map((item, idx) => (
                    <span key={idx} className="inline-block mr-1">
                      <EditableText
                        value={item}
                        onChange={(val) => updateSkill(g.id, idx, val)}
                        placeholder="Skill"
                      />
                      {idx < g.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

