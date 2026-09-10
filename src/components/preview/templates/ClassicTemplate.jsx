import { Mail, Phone, MapPin, Linkedin, Globe, Heart } from 'lucide-react'
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
  compact: '28px 34px',
  standard: '44px 50px',
  spacious: '56px 64px',
}

function Head({ title, accent, sectionKey, sectionTitles, onTitleChange, fontFamily }) {
  return (
    <div className="mb-2 mt-4 resume-block">
      <h2
        className="text-[11px] font-bold uppercase tracking-[0.16em]"
        style={{ color: accent, fontFamily }}
      >
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
      <div style={{ backgroundColor: accent }} className="h-0.5 w-full my-1 opacity-70" />
    </div>
  )
}

export default function ClassicTemplate({ resume, theme }) {
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

  const accentColor = theme?.accentColor || formatting?.accentColor || TEMPLATE_BY_ID.classic?.accent || '#1A1A1A'
  const sectionTitles = resume.sectionTitles || {}
  const sectionOrder = resume.sectionOrder || ['summary', 'experience', 'education', 'projects', 'certifications', 'skills', 'hobbies']

  const setBasic = useResumeStore((s) => s.setBasic)
  const updateItem = useResumeStore((s) => s.updateItem)
  const updateSkill = useResumeStore((s) => s.updateSkill)
  const renameSkillGroup = useResumeStore((s) => s.renameSkillGroup)
  const setSectionTitle = useResumeStore((s) => s.setSectionTitle)

  const fontFamily = FONT_MAP[formatting.fontFamily] || "'Inter', system-ui, sans-serif"
  const baseFontSize = formatting.fontSize || 10.3
  const lineHeight = (formatting.lineHeight || 145) / 100
  const letterSpacing = `${formatting.letterSpacing || 0}px`
  const textAlign = formatting.textAlign || 'left'
  const textColor = formatting.textColor || '#111827'
  const canvasPadding = PADDING_MAP[formatting.marginDensity || 'standard'] || '44px 50px'

  const hasSummary = basic.summary && basic.summary.trim()
  const hasExperience = visibility.experience !== false && experience.length > 0
  const hasEducation = visibility.education !== false && education.length > 0
  const hasProjects = visibility.projects !== false && projects.length > 0
  const hasCertifications = visibility.certifications !== false && certifications.length > 0
  const hasSkills = visibility.skills !== false && skillGroups.length > 0
  const hasHobbies = visibility.hobbies !== false && hobbies.length > 0

  const renderSummary = () => (
    <section key="summary" className="resume-block">
      <Head title="Summary" sectionKey="summary" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} accent={accentColor} fontFamily={fontFamily} />
      <div className="text-justify leading-relaxed" style={{ color: textColor }}>
        <EditableText
          multiline
          value={basic.summary}
          onChange={(val) => setBasic({ summary: val })}
          placeholder="Write a brief professional summary..."
          className="w-full"
        />
      </div>
    </section>
  )

  const renderExperience = () => (
    <section key="experience" className="resume-block">
      <Head title="Work Experience" sectionKey="experience" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} accent={accentColor} fontFamily={fontFamily} />
      <div className="space-y-3.5">
        {experience.map((exp) => (
          <div key={exp.id} className="resume-block break-inside-avoid">
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
              <span className="shrink-0 whitespace-nowrap text-[9.6px] font-medium text-slate-500">
                <EditableDate
                  item={exp}
                  onPatch={(patch) => updateItem('experience', exp.id, patch)}
                />
              </span>
            </div>
            <div className="text-[9.6px] italic text-slate-500">
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
  )

  const renderSkills = () => (
    <section key="skills" className="resume-block">
      <Head title="Skills & Tools" sectionKey="skills" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} accent={accentColor} fontFamily={fontFamily} />
      <div className="space-y-1.5">
        {skillGroups.map((g) => (
          <p key={g.id} className="resume-block">
            <span className="font-bold uppercase tracking-wide text-xs">
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
  )

  const renderProjects = () => (
    <section key="projects" className="resume-block">
      <Head title="Projects" sectionKey="projects" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} accent={accentColor} fontFamily={fontFamily} />
      <div className="space-y-3">
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
            {p.techStack && (
              <div className="text-[9.2px] font-semibold tracking-wide" style={{ color: accentColor }}>
                <EditableText
                  value={p.techStack}
                  onChange={(val) => updateItem('projects', p.id, { techStack: val })}
                  placeholder="Tech Stack"
                />
              </div>
            )}
            {p.description && (
              <div className="mt-0.5 text-justify whitespace-pre-line leading-relaxed">
                <EditableText
                  multiline
                  value={p.description}
                  onChange={(val) => updateItem('projects', p.id, { description: val })}
                  placeholder="Project details..."
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )

  const renderEducation = () => (
    <section key="education" className="resume-block">
      <Head title="Education" sectionKey="education" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} accent={accentColor} fontFamily={fontFamily} />
      <div className="space-y-2">
        {education.map((e) => (
          <div key={e.id} className="break-inside-avoid resume-block">
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
              <span className="shrink-0 text-[9.6px] text-slate-500">
                <EditableText
                  value={e.gradYear}
                  onChange={(val) => updateItem('education', e.id, { gradYear: val })}
                  placeholder="Year"
                />
              </span>
            </div>
            {e.focus && (
              <div className="text-[9.6px] italic text-slate-500">
                <EditableText
                  value={e.focus}
                  onChange={(val) => updateItem('education', e.id, { focus: val })}
                  placeholder="Focus / Academic Honors"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )

  const renderCertifications = () => (
    <section key="certifications" className="resume-block">
      <Head title="Certifications" sectionKey="certifications" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} accent={accentColor} fontFamily={fontFamily} />
      <div className="space-y-1">
        {certifications.map((c) => (
          <p key={c.id} className="resume-block">
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
            {c.year && <span className="text-slate-400"> · </span>}
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
  )

  const renderHobbies = () => (
    <section key="hobbies" className="resume-block">
      <Head title="Hobbies & Interests" sectionKey="hobbies" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} accent={accentColor} fontFamily={fontFamily} />
      <div className="flex flex-wrap gap-2 text-[9.5px]">
        {hobbies.map((h) => (
          <span key={h.id} className="inline-flex items-center gap-1 rounded border border-slate-200 px-2 py-0.5 text-slate-700">
            <Heart size={9} style={{ color: accentColor }} />
            <EditableText
              value={h.name}
              onChange={(val) => updateItem('hobbies', h.id, { name: val })}
              placeholder="Hobby"
            />
          </span>
        ))}
      </div>
    </section>
  )

  const SECTION_MAP = {
    summary: { hasContent: hasSummary || basic.summary === '', render: renderSummary },
    experience: { hasContent: hasExperience, render: renderExperience },
    education: { hasContent: hasEducation, render: renderEducation },
    projects: { hasContent: hasProjects, render: renderProjects },
    certifications: { hasContent: hasCertifications, render: renderCertifications },
    skills: { hasContent: hasSkills, render: renderSkills },
    hobbies: { hasContent: hasHobbies, render: renderHobbies },
  }

  const sectionsToRender = sectionOrder
    .filter((k) => SECTION_MAP[k]?.hasContent)
    .map((k) => SECTION_MAP[k].render())

  return (
    <div
      className="flex flex-col min-h-full h-auto w-full bg-white"
      style={{
        padding: canvasPadding,
        color: textColor,
        fontFamily,
        fontSize: `${baseFontSize}pt`,
        lineHeight,
        letterSpacing,
        textAlign,
        boxSizing: 'border-box',
      }}
    >
      {/* Masthead */}
      <header className="text-center resume-block">
        <h1 className="text-[25px] font-bold uppercase tracking-[0.08em]" style={{ fontFamily }}>
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

        {/* Contact coordinates */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[9.5px]">
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
          {websites.map((w) => (
            <span key={w.id} className="inline-flex items-center gap-1 text-slate-600">
              <Globe size={10} strokeWidth={2} style={{ color: accentColor }} />
              <EditableLink
                url={w.url}
                label={w.label}
                accentColor={accentColor}
                onChange={(newUrl) => updateItem('websites', w.id, { url: typeof newUrl === 'string' ? newUrl : newUrl.url })}
                placeholder={w.label || "Link"}
              />
            </span>
          ))}
          {basic.linkedin && !websites.some((w) => (w.url || '').toLowerCase().includes('linkedin')) && (
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
          {basic.portfolio && !websites.some((w) => (w.url || '').toLowerCase().includes('portfolio')) && (
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

      {/* Dynamic Ordered Sections */}
      <div className="space-y-4">
        {sectionsToRender}
      </div>
    </div>
  )
}

