import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'
import { TEMPLATE_BY_ID } from '../../../config/templates'
import { dateRange } from '../../../lib/format'
import { AddBulletButton, Bullet } from '../Bullet'
import { useResumeStore } from '../../../store/useResumeStore'
import { EditableText } from '../EditableText'
import { EditableLink } from '../EditableLink'
import { EditableDate } from '../EditableDate'

const INK = '#111827'
const MUTED = '#4b5563'
const F = "'Inter', system-ui, sans-serif"

function Head({ title, accent, sectionKey, sectionTitles, onTitleChange }) {
  return (
    <div className="mb-2 mt-4">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: accent || INK, fontFamily: F }}>
        {sectionKey && onTitleChange ? (
          <EditableText
            value={sectionTitles?.[sectionKey] || title}
            onChange={(val) => onTitleChange(sectionKey, val)}
            placeholder={title}
          />
        ) : (
          title
        )}
      </h2>
      <div style={{ backgroundColor: accent || INK }} className="h-0.5 w-full my-1" />
    </div>
  )
}

export default function ClassicTemplate({ resume, theme }) {
  const { basic = {}, experience = [], education = [], skillGroups = [], projects = [], certifications = [], visibility = {}, formatting = {} } = resume
  const accentColor = theme?.accentColor || formatting?.accentColor || TEMPLATE_BY_ID.classic?.accent || '#1A1A1A'
  const sectionTitles = resume.sectionTitles || {}

  const setBasic = useResumeStore((s) => s.setBasic)
  const updateItem = useResumeStore((s) => s.updateItem)
  const updateSkill = useResumeStore((s) => s.updateSkill)
  const renameSkillGroup = useResumeStore((s) => s.renameSkillGroup)
  const setSectionTitle = useResumeStore((s) => s.setSectionTitle)

  return (
    <div className="flex flex-col" style={{ padding: '46px 52px 52px', color: INK, fontFamily: F, fontSize: '10.3px', lineHeight: 1.5 }}>
      {/* Masthead */}
      <header className="text-center">
        <h1 className="text-[25px] font-bold uppercase tracking-[0.08em]" style={{ fontFamily: F }}>
          <EditableText
            value={basic.fullName}
            onChange={(val) => setBasic({ fullName: val })}
            placeholder="Your Name"
          />
        </h1>
        <p className="mt-0.5 text-[11.5px] font-medium tracking-[0.04em]" style={{ color: accentColor }}>
          <EditableText
            value={basic.jobTitle}
            onChange={(val) => setBasic({ jobTitle: val })}
            placeholder="Job Title"
          />
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[9.5px]">
          {(basic.email || basic.email === '') && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Mail size={10} strokeWidth={2} style={{ color: accentColor }} />
              <EditableText
                value={basic.email}
                onChange={(val) => setBasic({ email: val })}
                placeholder="email@example.com"
              />
            </span>
          )}
          {(basic.phone || basic.phone === '') && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Phone size={10} strokeWidth={2} style={{ color: accentColor }} />
              <EditableText
                value={basic.phone}
                onChange={(val) => setBasic({ phone: val })}
                placeholder="+1 (555) 000-0000"
              />
            </span>
          )}
          {(basic.location || basic.location === '') && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <MapPin size={10} strokeWidth={2} style={{ color: accentColor }} />
              <EditableText
                value={basic.location}
                onChange={(val) => setBasic({ location: val })}
                placeholder="City, State"
              />
            </span>
          )}
          {basic.linkedin && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Linkedin size={10} strokeWidth={2} style={{ color: accentColor }} />
              <EditableLink
                url={basic.linkedin}
                accentColor={accentColor}
                onChange={(val) => setBasic({ linkedin: typeof val === 'string' ? val : val.url })}
                placeholder="linkedin.com/in/..."
              />
            </span>
          )}
          {basic.portfolio && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Globe size={10} strokeWidth={2} style={{ color: accentColor }} />
              <EditableLink
                url={basic.portfolio}
                accentColor={accentColor}
                onChange={(val) => setBasic({ portfolio: typeof val === 'string' ? val : val.url })}
                placeholder="portfolio.com"
              />
            </span>
          )}
        </div>
        <div style={{ backgroundColor: accentColor }} className="mx-auto mt-3 h-0.5 w-full opacity-25" />
      </header>

      {/* Summary */}
      {(basic.summary || basic.summary === '') && (
        <section>
          <Head title="Summary" sectionKey="summary" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} accent={accentColor} />
          <div className="text-justify" style={{ color: INK }}>
            <EditableText
              multiline
              value={basic.summary}
              onChange={(val) => setBasic({ summary: val })}
              placeholder="Write a brief professional summary..."
              className="w-full"
            />
          </div>
        </section>
      )}

      {/* Experience */}
      {visibility.experience !== false && experience.length > 0 && (
        <section>
          <Head title="Work Experience" sectionKey="experience" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} accent={accentColor} />
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[11.2px] font-bold">
                    <EditableText
                      value={exp.role}
                      onChange={(val) => updateItem('experience', exp.id, { role: val })}
                      placeholder="Role Title"
                    />
                    <span className="font-normal text-slate-400">, </span>
                    <EditableText
                      value={exp.company}
                      onChange={(val) => updateItem('experience', exp.id, { company: val })}
                      placeholder="Company"
                      className="italic font-semibold"
                    />
                  </p>
                  <span className="shrink-0 whitespace-nowrap text-[9.6px] font-medium" style={{ color: MUTED }}>
                    <EditableDate
                      item={exp}
                      onPatch={(patch) => updateItem('experience', exp.id, patch)}
                    />
                  </span>
                </div>
                <div className="text-[9.6px] italic" style={{ color: MUTED }}>
                  <EditableText
                    value={exp.location}
                    onChange={(val) => updateItem('experience', exp.id, { location: val })}
                    placeholder="Location"
                  />
                </div>
                <div className="mt-1 space-y-[3px]">
                  {(exp.bullets || []).map((b, i) => (
                    <Bullet key={i} expId={exp.id} index={i} text={b} className="text-[10.1px]" markerStyle={{ color: accentColor }} />
                  ))}
                  <AddBulletButton expId={exp.id} className="opacity-100" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {visibility.skills !== false && skillGroups.length > 0 && (
        <section>
          <Head title="Skills & Tools" sectionKey="skills" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} accent={accentColor} />
          <div className="space-y-1">
            {skillGroups.map((g) => (
              <p key={g.id}>
                <span className="font-bold uppercase tracking-wide">
                  <EditableText
                    value={g.label}
                    onChange={(val) => renameSkillGroup(g.id, val)}
                    placeholder="Category"
                  />
                </span>
                <span className="text-slate-500">: </span>
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
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {visibility.projects !== false && projects.length > 0 && (
        <section className="resume-block">
          <Head title="Projects" sectionKey="projects" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} accent={accentColor} />
          <div className="space-y-2.5">
            {projects.map((p) => (
              <div key={p.id} className="break-inside-avoid resume-block">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[10.8px] font-bold">
                    <EditableText
                      value={p.title || p.name}
                      onChange={(val) => updateItem('projects', p.id, { title: val, name: val })}
                      placeholder="Project Title"
                    />
                  </p>
                  <EditableLink
                    url={p.link}
                    accentColor={accentColor}
                    onChange={(newUrl) => updateItem('projects', p.id, { link: typeof newUrl === 'string' ? newUrl : newUrl.url })}
                    onDelete={() => updateItem('projects', p.id, { link: '' })}
                    placeholder="Add link..."
                    className="font-mono text-[9px] font-medium"
                  />
                </div>
                <div className="text-[9.2px] font-semibold tracking-wide" style={{ color: accentColor }}>
                  <EditableText
                    value={p.techStack}
                    onChange={(val) => updateItem('projects', p.id, { techStack: val })}
                    placeholder="Tech Stack"
                  />
                </div>
                <div className="mt-0.5 text-justify whitespace-pre-line leading-relaxed">
                  <EditableText
                    multiline
                    value={p.description}
                    onChange={(val) => updateItem('projects', p.id, { description: val })}
                    placeholder="Project details..."
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {visibility.education !== false && education.length > 0 && (
        <section>
          <Head title="Education" sectionKey="education" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} accent={accentColor} />
          <div className="space-y-1.5">
            {education.map((e) => (
              <div key={e.id} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[10.8px] font-bold">
                    <EditableText
                      value={e.degree}
                      onChange={(val) => updateItem('education', e.id, { degree: val })}
                      placeholder="Degree"
                    />
                    <span className="font-normal"> — </span>
                    <EditableText
                      value={e.school}
                      onChange={(val) => updateItem('education', e.id, { school: val })}
                      placeholder="School"
                      className="font-medium italic"
                    />
                  </p>
                  <span className="shrink-0 text-[9.6px]" style={{ color: MUTED }}>
                    <EditableText
                      value={e.gradYear}
                      onChange={(val) => updateItem('education', e.id, { gradYear: val })}
                      placeholder="Year"
                    />
                  </span>
                </div>
                <div className="text-[9.6px] italic" style={{ color: MUTED }}>
                  <EditableText
                    value={e.focus}
                    onChange={(val) => updateItem('education', e.id, { focus: val })}
                    placeholder="Focus / Academic Honors"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {visibility.certifications !== false && certifications.length > 0 && (
        <section>
          <Head title="Certifications" sectionKey="certifications" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} accent={accentColor} />
          <div className="space-y-0.5">
            {certifications.map((c) => (
              <p key={c.id}>
                <span className="font-semibold">
                  <EditableText
                    value={c.name}
                    onChange={(val) => updateItem('certifications', c.id, { name: val })}
                    placeholder="Certification Name"
                  />
                </span>
                <span className="text-slate-500"> · </span>
                <EditableText
                  value={c.issuer}
                  onChange={(val) => updateItem('certifications', c.id, { issuer: val })}
                  placeholder="Issuer"
                  className="text-slate-500"
                />
                <span className="text-slate-400"> · </span>
                <EditableText
                  value={c.year}
                  onChange={(val) => updateItem('certifications', c.id, { year: val })}
                  placeholder="Year"
                  className="text-slate-400"
                />
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

