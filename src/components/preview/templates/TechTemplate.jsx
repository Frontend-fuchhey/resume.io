import { Globe, Heart, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { TEMPLATE_BY_ID } from '../../../config/templates'
import { AddBulletButton, Bullet } from '../Bullet'
import { useResumeStore } from '../../../store/useResumeStore'
import { EditableText } from '../EditableText'
import { EditableLink } from '../EditableLink'
import { EditableDate } from '../EditableDate'

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
  standard: '36px 38px',
  spacious: '48px 52px',
}

const DISPLAY = "'Space Grotesk', 'Inter', sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

function RailHead({ children, accent, sectionKey, sectionTitles, onTitleChange }) {
  return (
    <div className="mb-2 mt-4 first:mt-0 resume-block">
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
    <div className="mb-2 mt-4 resume-block">
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
  const {
    basic = {},
    experience = [],
    education = [],
    skillGroups = [],
    projects = [],
    certifications = [],
    websites = [],
    hobbies = [],
    visibility = {},
    formatting = {},
  } = resume

  const accent = theme?.accentColor || formatting?.accentColor || TEMPLATE_BY_ID.tech?.accent || '#244CEC'
  const sectionTitles = resume.sectionTitles || {}

  const setBasic = useResumeStore((s) => s.setBasic)
  const updateItem = useResumeStore((s) => s.updateItem)
  const updateSkill = useResumeStore((s) => s.updateSkill)
  const renameSkillGroup = useResumeStore((s) => s.renameSkillGroup)
  const setSectionTitle = useResumeStore((s) => s.setSectionTitle)

  const fontFamily = FONT_MAP[formatting.fontFamily] || "'Inter', system-ui, sans-serif"
  const baseFontSize = formatting.fontSize || 9.8
  const lineHeight = (formatting.lineHeight || 140) / 100
  const letterSpacing = `${formatting.letterSpacing || 0}px`
  const canvasPadding = PADDING_MAP[formatting.marginDensity || 'standard'] || '36px 38px'

  return (
    <div
      className="flex flex-col min-h-full h-auto w-full bg-white"
      style={{
        padding: canvasPadding,
        color: formatting.textColor || '#111827',
        fontFamily,
        fontSize: `${baseFontSize}pt`,
        lineHeight,
        letterSpacing,
        boxSizing: 'border-box',
      }}
    >
      {/* Masthead */}
      <header className="flex items-end justify-between gap-4 pb-3 resume-block">
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
        <div className="max-w-[260px] space-y-0.5 text-right text-[8.6px] text-slate-600">
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
          {websites.map((w) => (
            <p key={w.id} className="flex items-center justify-end gap-1">
              <Globe size={9} className="shrink-0" style={{ color: accent }} />
              <EditableLink
                url={w.url}
                label={w.label}
                accentColor={accent}
                onChange={(newUrl) => updateItem('websites', w.id, { url: typeof newUrl === 'string' ? newUrl : newUrl.url })}
                placeholder={w.label || "Link"}
              />
            </p>
          ))}
          {basic.linkedin && !websites.some((w) => (w.url || '').toLowerCase().includes('linkedin')) && (
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
          {basic.portfolio && !websites.some((w) => (w.url || '').toLowerCase().includes('portfolio')) && (
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
        <div className="resume-block mt-3 rounded-md border-l-2 py-0.5 pl-2.5 text-justify text-[9.6px] leading-relaxed" style={{ borderColor: accent }}>
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
        <div className="min-w-0 flex-1 space-y-4">
          {visibility.experience !== false && experience.length > 0 && (
            <section className="resume-block">
              <MainHead accent={accent} sectionKey="experience" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Experience</MainHead>
              <div className="space-y-3">
                {experience.map((exp) => (
                  <div key={exp.id} className="group/exp break-inside-avoid resume-block">
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
                      <AddBulletButton expId={exp.id} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {visibility.projects !== false && projects.length > 0 && (
            <section className="resume-block">
              <MainHead accent={accent} sectionKey="projects" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Projects</MainHead>
              <div className="space-y-2.5">
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
                    {p.techStack && (
                      <div className="text-[8.6px] font-semibold" style={{ color: accent }}>
                        <EditableText
                          value={p.techStack}
                          onChange={(val) => updateItem('projects', p.id, { techStack: val })}
                          placeholder="Tech Stack"
                        />
                      </div>
                    )}
                    {p.description && (
                      <div className="text-justify text-[9.4px] whitespace-pre-line leading-relaxed">
                        <EditableText
                          multiline
                          value={p.description}
                          onChange={(val) => updateItem('projects', p.id, { description: val })}
                          placeholder="Project description..."
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Side rail */}
        <aside className="w-[185px] shrink-0 border-l border-slate-200 pl-4 space-y-4" style={{ borderColor: `${accent}35` }}>
          {visibility.skills !== false && skillGroups.length > 0 && (
            <section className="resume-block">
              <RailHead accent={accent} sectionKey="skills" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Skills</RailHead>
              <div className="space-y-2">
                {skillGroups.map((g) => (
                  <div key={g.id} className="resume-block">
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
            <section className="resume-block">
              <RailHead accent={accent} sectionKey="education" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Education</RailHead>
              <div className="space-y-2">
                {education.map((e) => (
                  <div key={e.id} className="resume-block">
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
                    {e.focus && (
                      <p className="text-[8.4px] text-slate-500">
                        <EditableText
                          value={e.focus}
                          onChange={(val) => updateItem('education', e.id, { focus: val })}
                          placeholder="Focus"
                        />
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {visibility.certifications !== false && certifications.length > 0 && (
            <section className="resume-block">
              <RailHead accent={accent} sectionKey="certifications" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Certifications</RailHead>
              <div className="space-y-1.5">
                {certifications.map((c) => (
                  <div key={c.id} className="resume-block">
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
                      {c.year && <span> · </span>}
                      <EditableText
                        value={c.year}
                        onChange={(val) => updateItem('certifications', c.id, { year: val })}
                        placeholder="Year"
                      />
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {visibility.hobbies !== false && hobbies.length > 0 && (
            <section className="resume-block">
              <RailHead accent={accent} sectionKey="hobbies" sectionTitles={sectionTitles} onTitleChange={setSectionTitle}>Hobbies</RailHead>
              <div className="flex flex-wrap gap-1 text-[8.2px]">
                {hobbies.map((h) => (
                  <span key={h.id} className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-slate-700">
                    <Heart size={8} style={{ color: accent }} />
                    <EditableText
                      value={h.name}
                      onChange={(val) => updateItem('hobbies', h.id, { name: val })}
                      placeholder="Hobby"
                    />
                  </span>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}


