import { Globe, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { TEMPLATE_BY_ID } from '../../../config/templates'
import { dateRange } from '../../../lib/format'
import { AddBulletButton, Bullet } from '../Bullet'
import { useResumeStore } from '../../../store/useResumeStore'
import { EditableText } from '../EditableText'
import { EditableLink } from '../EditableLink'
import { EditableDate } from '../EditableDate'

const SANS = "'Inter', system-ui, sans-serif"
const DISPLAY = "'Space Grotesk', 'Inter', sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

function RailHead({ children, accent, sectionKey, sectionTitles, onTitleChange }) {
  return (
    <div className="mb-2 mt-4 first:mt-0">
      <div className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-[3px] rounded-full" style={{ backgroundColor: accent }} />
        <h2 className="text-[9.5px] font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>
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
      </div>
      <div style={{ backgroundColor: accent }} className="h-0.5 w-full my-1 opacity-40" />
    </div>
  )
}

function MainHead({ children, accent, sectionKey, sectionTitles, onTitleChange }) {
  return (
    <div className="mb-2 mt-4">
      <div className="flex items-center gap-2">
        <h2 className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: accent, fontFamily: DISPLAY }}>
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
        <div className="h-0.5 flex-1" style={{ backgroundColor: accent, opacity: 0.35 }} />
      </div>
    </div>
  )
}

export default function TechTemplate({ resume, theme }) {
  const { basic = {}, experience = [], education = [], skillGroups = [], projects = [], certifications = [], visibility = {}, formatting = {} } = resume
  const accent = theme?.accentColor || formatting?.accentColor || TEMPLATE_BY_ID.tech?.accent || '#244CEC'
  const sectionTitles = resume.sectionTitles || {}

  const setBasic = useResumeStore((s) => s.setBasic)
  const updateItem = useResumeStore((s) => s.updateItem)
  const updateSkill = useResumeStore((s) => s.updateSkill)
  const renameSkillGroup = useResumeStore((s) => s.renameSkillGroup)
  const setSectionTitle = useResumeStore((s) => s.setSectionTitle)

  return (
    <div className="flex flex-col" style={{ padding: '36px 34px 40px', color: '#111827', fontFamily: SANS, fontSize: '9.8px', lineHeight: 1.5 }}>
      {/* Masthead */}
      <header className="flex items-end justify-between gap-4 pb-3">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: DISPLAY }}>
            <EditableText
              value={basic.fullName}
              onChange={(val) => setBasic({ fullName: val })}
              placeholder="Your Name"
            />
          </h1>
          <p className="text-[11px] font-semibold" style={{ color: accent }}>
            <EditableText
              value={basic.jobTitle}
              onChange={(val) => setBasic({ jobTitle: val })}
              placeholder="Job Title"
            />
          </p>
        </div>
        <div className="max-w-[230px] space-y-0.5 text-right text-[8.6px] text-slate-600">
          {(basic.email || basic.email === '') && (
            <p className="flex items-center justify-end gap-1">
              <Mail size={9} className="shrink-0" style={{ color: accent }} />
              <EditableText
                value={basic.email}
                onChange={(val) => setBasic({ email: val })}
                placeholder="email@example.com"
              />
            </p>
          )}
          {(basic.phone || basic.phone === '') && (
            <p className="flex items-center justify-end gap-1">
              <Phone size={9} className="shrink-0" style={{ color: accent }} />
              <EditableText
                value={basic.phone}
                onChange={(val) => setBasic({ phone: val })}
                placeholder="+1 (555) 000-0000"
              />
            </p>
          )}
          {(basic.location || basic.location === '') && (
            <p className="flex items-center justify-end gap-1">
              <MapPin size={9} className="shrink-0" style={{ color: accent }} />
              <EditableText
                value={basic.location}
                onChange={(val) => setBasic({ location: val })}
                placeholder="City, State"
              />
            </p>
          )}
          {basic.linkedin && (
            <p className="flex items-center justify-end gap-1">
              <Linkedin size={9} className="shrink-0" style={{ color: accent }} />
              <EditableLink
                url={basic.linkedin}
                accentColor={accent}
                onChange={(val) => setBasic({ linkedin: typeof val === 'string' ? val : val.url })}
                placeholder="LinkedIn"
              />
            </p>
          )}
          {basic.portfolio && (
            <p className="flex items-center justify-end gap-1">
              <Globe size={9} className="shrink-0" style={{ color: accent }} />
              <EditableLink
                url={basic.portfolio}
                accentColor={accent}
                onChange={(val) => setBasic({ portfolio: typeof val === 'string' ? val : val.url })}
                placeholder="Portfolio"
              />
            </p>
          )}
        </div>
      </header>
      <div style={{ backgroundColor: accent }} className="h-0.5 w-full mt-1 mb-2" />

      {(basic.summary || basic.summary === '') && (
        <div className="mt-3 rounded-md border-l-2 py-0.5 pl-2.5 text-justify text-[9.6px] leading-relaxed" style={{ borderColor: accent }}>
          <EditableText
            multiline
            value={basic.summary}
            onChange={(val) => setBasic({ summary: val })}
            placeholder="Write professional summary..."
            className="w-full"
          />
        </div>
      )}

      <div className="mt-4 flex gap-6">
        {/* Main column */}
        <div className="min-w-0 flex-1">
          {visibility.experience !== false && experience.length > 0 && (
            <section>
              <MainHead accent={accent} sectionKey="experience" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Experience</MainHead>
              <div className="space-y-2.5">
                {experience.map((exp) => (
                  <div key={exp.id} className="group/exp break-inside-avoid">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[10.6px] font-bold">
                        <EditableText
                          value={exp.role}
                          onChange={(val) => updateItem('experience', exp.id, { role: val })}
                          placeholder="Role"
                        />
                      </p>
                      <span className="shrink-0 whitespace-nowrap text-[8.2px] font-medium text-slate-500" style={{ fontFamily: MONO }}>
                        <EditableDate
                          item={exp}
                          onPatch={(patch) => updateItem('experience', exp.id, patch)}
                        />
                      </span>
                    </div>
                    <p className="text-[9.4px] font-semibold" style={{ color: accent }}>
                      <EditableText
                        value={exp.company}
                        onChange={(val) => updateItem('experience', exp.id, { company: val })}
                        placeholder="Company"
                      />
                      <span className="font-normal text-slate-500"> — </span>
                      <EditableText
                        value={exp.location}
                        onChange={(val) => updateItem('experience', exp.id, { location: val })}
                        placeholder="Location"
                        className="font-normal text-slate-500"
                      />
                    </p>
                    <div className="mt-1 space-y-[2.5px]">
                      {(exp.bullets || []).map((b, i) => (
                        <Bullet key={i} expId={exp.id} index={i} text={b} marker="▸" className="gap-1.5" markerClass="text-[7px]" markerStyle={{ color: accent }} />
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
              <MainHead accent={accent} sectionKey="projects" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Projects</MainHead>
              <div className="space-y-2">
                {projects.map((p) => (
                  <div key={p.id} className="break-inside-avoid resume-block">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[10px] font-bold">
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
                        className="font-mono text-[8.4px] font-medium"
                      />
                    </div>
                    <div className="text-[8.6px] font-semibold" style={{ color: accent }}>
                      <EditableText
                        value={p.techStack}
                        onChange={(val) => updateItem('projects', p.id, { techStack: val })}
                        placeholder="Tech Stack"
                      />
                    </div>
                    <div className="text-justify text-[9.4px] whitespace-pre-line leading-relaxed">
                      <EditableText
                        multiline
                        value={p.description}
                        onChange={(val) => updateItem('projects', p.id, { description: val })}
                        placeholder="Project description..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Side rail */}
        <aside className="w-[172px] shrink-0 border-l border-slate-200 pl-4" style={{ borderColor: `${accent}35` }}>
          {visibility.skills !== false && skillGroups.length > 0 && (
            <section>
              <RailHead accent={accent} sectionKey="skills" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Skills</RailHead>
              <div className="space-y-1.5">
                {skillGroups.map((g) => (
                  <div key={g.id}>
                    <p className="text-[8.2px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      <EditableText
                        value={g.label}
                        onChange={(val) => renameSkillGroup(g.id, val)}
                        placeholder="Category"
                      />
                    </p>
                    <div className="mt-0.5 text-[8.6px] leading-relaxed text-slate-700">
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
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {visibility.education !== false && education.length > 0 && (
            <section>
              <RailHead accent={accent} sectionKey="education" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Education</RailHead>
              <div className="space-y-1.5">
                {education.map((e) => (
                  <div key={e.id}>
                    <p className="text-[9px] font-bold leading-tight">
                      <EditableText
                        value={e.degree}
                        onChange={(val) => updateItem('education', e.id, { degree: val })}
                        placeholder="Degree"
                      />
                    </p>
                    <p className="text-[8.8px] text-slate-600">
                      <EditableText
                        value={e.school}
                        onChange={(val) => updateItem('education', e.id, { school: val })}
                        placeholder="School"
                      />
                    </p>
                    <p className="text-[8.2px]" style={{ color: accent, fontFamily: MONO }}>
                      <EditableText
                        value={e.gradYear}
                        onChange={(val) => updateItem('education', e.id, { gradYear: val })}
                        placeholder="Grad Year"
                      />
                    </p>
                    <p className="text-[8.4px] text-slate-500">
                      <EditableText
                        value={e.focus}
                        onChange={(val) => updateItem('education', e.id, { focus: val })}
                        placeholder="Focus"
                      />
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {visibility.certifications !== false && certifications.length > 0 && (
            <section>
              <RailHead accent={accent} sectionKey="certifications" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Certifications</RailHead>
              <div className="space-y-1">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <p className="text-[8.8px] font-semibold leading-tight">
                      <EditableText
                        value={c.name}
                        onChange={(val) => updateItem('certifications', c.id, { name: val })}
                        placeholder="Certification"
                      />
                    </p>
                    <p className="text-[8.2px] text-slate-500">
                      <EditableText
                        value={c.issuer}
                        onChange={(val) => updateItem('certifications', c.id, { issuer: val })}
                        placeholder="Issuer"
                      />
                    </p>
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

