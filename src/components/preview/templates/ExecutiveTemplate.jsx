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
  compact: '32px 38px',
  standard: '48px 56px',
  spacious: '60px 68px',
}

const SERIF = "'Playfair Display', Georgia, serif"

function Head({ children, accent, sectionKey, sectionTitles, onTitleChange, fontFamily }) {
  return (
    <div className="mb-2.5 mt-5 text-center resume-block">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.34em]" style={{ fontFamily: fontFamily || SERIF, color: accent || '#0f172a' }}>
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
  const {
    basic = {},
    experience = [],
    education = [],
    skillGroups = [],
    projects = [],
    certifications = [],
    languages = [],
    awards = [],
    references = { mode: 'upon_request', text: 'References available upon request', items: [] },
    customSections = [],
    websites = [],
    hobbies = [],
    visibility = {},
    formatting = {},
  } = resume

  const accent = theme?.accentColor || formatting?.accentColor || TEMPLATE_BY_ID.exec?.accent || '#FF5E1A'
  const sectionTitles = resume.sectionTitles || {}
  const sectionOrder = resume.sectionOrder || defaultSectionOrder()

  const setBasic = useResumeStore((s) => s.setBasic)
  const updateItem = useResumeStore((s) => s.updateItem)
  const updateSkill = useResumeStore((s) => s.updateSkill)
  const renameSkillGroup = useResumeStore((s) => s.renameSkillGroup)
  const setSectionTitle = useResumeStore((s) => s.setSectionTitle)
  const updateCustomSection = useResumeStore((s) => s.updateCustomSection)
  const updateCustomItem = useResumeStore((s) => s.updateCustomItem)

  const fontFamily = FONT_MAP[formatting.fontFamily] || "'Inter', system-ui, sans-serif"
  const baseFontSize = formatting.fontSize || 10.2
  const lineHeight = (formatting.lineHeight || 155) / 100
  const letterSpacing = `${formatting.letterSpacing || 0}px`
  const canvasPadding = PADDING_MAP[formatting.marginDensity || 'standard'] || '48px 56px'
  const textColor = formatting.textColor || '#1e293b'

  const hasSummary = basic.summary && basic.summary.trim()
  const hasExperience = visibility.experience !== false && experience.length > 0
  const hasProjects = visibility.projects !== false && projects.length > 0
  const hasEducation = visibility.education !== false && education.length > 0
  const hasCertifications = visibility.certifications !== false && certifications.length > 0
  const hasLanguages = visibility.languages !== false && languages.length > 0
  const hasAwards = visibility.awards !== false && awards.length > 0
  const hasReferences = visibility.references !== false && (
    (references.mode === 'upon_request' && references.text?.trim()) ||
    (references.mode === 'structured' && (references.items || []).length > 0)
  )
  const hasCustomSections = visibility.customSections !== false && customSections.length > 0
  const hasSkills = visibility.skills !== false && skillGroups.length > 0
  const hasHobbies = visibility.hobbies !== false && hobbies.length > 0

  const renderSummary = () => (
    <section key="summary" className="resume-block">
      <Head accent={accent} sectionKey="summary" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} fontFamily={SERIF}>Profile</Head>
      <div className="text-justify italic leading-relaxed text-[10pt]" style={{ fontFamily: SERIF, color: textColor }}>
        <EditableText
          multiline
          value={basic.summary}
          onChange={(val) => setBasic({ summary: val })}
          placeholder="Executive profile summary..."
          className="w-full"
        />
      </div>
    </section>
  )

  const renderExperience = () => (
    <section key="experience" className="resume-block">
      <Head accent={accent} sectionKey="experience" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} fontFamily={SERIF}>Professional Experience</Head>
      <div className="space-y-4">
        {experience.map((exp) => (
          <div key={exp.id} className="group/exp break-inside-avoid resume-block">
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
              <AddBulletButton expId={exp.id} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  const renderProjects = () => (
    <section key="projects" className="resume-block">
      <Head accent={accent} sectionKey="projects" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} fontFamily={SERIF}>Selected Projects</Head>
      <div className="space-y-3">
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
            {p.techStack && (
              <div className="text-[9.2px] font-semibold" style={{ color: accent }}>
                <EditableText
                  value={p.techStack}
                  onChange={(val) => updateItem('projects', p.id, { techStack: val })}
                  placeholder="Tech Stack / Methodology"
                />
              </div>
            )}
            {p.description && (
              <div className="text-justify text-[9.6px] whitespace-pre-line leading-relaxed">
                <EditableText
                  multiline
                  value={p.description}
                  onChange={(val) => updateItem('projects', p.id, { description: val })}
                  placeholder="Project achievements and scope..."
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
      <Head accent={accent} sectionKey="education" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} fontFamily={SERIF}>Education</Head>
      <div className="space-y-2.5 text-center">
        {education.map((e) => (
          <div key={e.id} className="break-inside-avoid resume-block">
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
            {e.focus && (
              <div className="text-[9px] italic text-slate-400">
                <EditableText
                  value={e.focus}
                  onChange={(val) => updateItem('education', e.id, { focus: val })}
                  placeholder="Honors / Focus"
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
      <Head accent={accent} sectionKey="certifications" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} fontFamily={SERIF}>Certifications</Head>
      <div className="space-y-1.5 text-center">
        {certifications.map((c) => (
          <p key={c.id} className="text-[9.8px] resume-block">
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

  const renderSkills = () => (
    <section key="skills" className="resume-block">
      <Head accent={accent} sectionKey="skills" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} fontFamily={SERIF}>Core Competencies</Head>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {skillGroups.map((g) => (
          <div key={g.id} className="flex items-baseline gap-2 resume-block">
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
  )

  const renderHobbies = () => (
    <section key="hobbies" className="resume-block">
      <Head accent={accent} sectionKey="hobbies" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} fontFamily={SERIF}>Interests & Engagements</Head>
      <div className="flex flex-wrap justify-center gap-2 text-[9.5px]">
        {hobbies.map((h) => (
          <span key={h.id} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-0.5 text-slate-700">
            <Heart size={9} style={{ color: accent }} />
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

  const renderLanguages = () => (
    <section key="languages" className="resume-block">
      <Head accent={accent} sectionKey="languages" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} fontFamily={SERIF}>Languages</Head>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[9.5pt]">
        {languages.map((l) => (
          <div key={l.id} className="flex items-center justify-between gap-2 border-b border-slate-200 pb-1.5">
            <div>
              <p className="font-bold text-[#0f172a]" style={{ fontFamily: SERIF }}>
                <EditableText
                  value={l.name}
                  onChange={(val) => updateItem('languages', l.id, { name: val })}
                  placeholder="Language"
                />
              </p>
              {l.level && <p className="text-[8.5pt] italic text-slate-500">{l.level}</p>}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {[1, 2, 3, 4, 5].map((dot) => (
                <span
                  key={dot}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: (l.rating || 4) >= dot ? accent : '#e2e8f0',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  const renderAwards = () => (
    <section key="awards" className="resume-block">
      <Head accent={accent} sectionKey="awards" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} fontFamily={SERIF}>Awards & Honors</Head>
      <div className="space-y-3">
        {awards.map((a) => (
          <div key={a.id} className="resume-block">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-bold text-[10pt] text-[#0f172a]" style={{ fontFamily: SERIF }}>
                <EditableText
                  value={a.title}
                  onChange={(val) => updateItem('awards', a.id, { title: val })}
                  placeholder="Award Title"
                />
              </span>
              {a.date && (
                <span className="text-[9pt] font-medium text-slate-500">
                  <EditableText
                    value={a.date}
                    onChange={(val) => updateItem('awards', a.id, { date: val })}
                    placeholder="Year"
                  />
                </span>
              )}
            </div>
            {a.issuer && (
              <p className="text-[9pt] font-semibold" style={{ color: accent }}>
                <EditableText
                  value={a.issuer}
                  onChange={(val) => updateItem('awards', a.id, { issuer: val })}
                  placeholder="Issuer"
                />
              </p>
            )}
            {a.description && (
              <p className="mt-1 text-[9pt] text-slate-600 leading-relaxed whitespace-pre-line">{a.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )

  const renderReferences = () => (
    <section key="references" className="resume-block">
      <Head accent={accent} sectionKey="references" sectionTitles={sectionTitles} onTitleChange={setSectionTitle} fontFamily={SERIF}>References</Head>
      {references.mode === 'upon_request' ? (
        <p className="italic text-center text-[9.5pt] text-slate-600 py-1" style={{ fontFamily: SERIF }}>
          {references.text || 'References available upon request'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[9pt]">
          {(references.items || []).map((r) => (
            <div key={r.id} className="border border-slate-200/80 p-2.5 rounded space-y-0.5">
              <p className="font-bold text-[#0f172a]" style={{ fontFamily: SERIF }}>{r.name}</p>
              <p className="text-slate-600">{r.role}{r.company ? ` · ${r.company}` : ''}</p>
              {r.email && <p className="text-slate-500">{r.email}</p>}
              {r.phone && <p className="text-slate-500">{r.phone}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )

  const renderCustomSections = () => (
    <div key="customSections" className="space-y-4">
      {customSections.map((cs) => (
        <section key={cs.id} className="resume-block">
          <Head
            accent={accent}
            sectionKey={`custom_${cs.id}`}
            sectionTitles={{ [`custom_${cs.id}`]: cs.title }}
            onTitleChange={(_, v) => updateCustomSection(cs.id, { title: v })}
            fontFamily={SERIF}
          >
            {cs.title}
          </Head>
          <div className="space-y-3">
            {(cs.items || []).map((item) => (
              <div key={item.id} className="resume-block">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-bold text-[10pt] text-[#0f172a]" style={{ fontFamily: SERIF }}>
                    <EditableText
                      value={item.title}
                      onChange={(val) => updateCustomItem(cs.id, item.id, { title: val })}
                      placeholder="Title"
                    />
                  </span>
                  {item.date && (
                    <span className="text-[9pt] font-medium text-slate-500">
                      <EditableText
                        value={item.date}
                        onChange={(val) => updateCustomItem(cs.id, item.id, { date: val })}
                        placeholder="Date"
                      />
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <p className="text-[9pt] font-semibold" style={{ color: accent }}>
                    <EditableText
                      value={item.subtitle}
                      onChange={(val) => updateCustomItem(cs.id, item.id, { subtitle: val })}
                      placeholder="Subtitle"
                    />
                  </p>
                )}
                {item.description && (
                  <p className="mt-1 text-[9pt] text-slate-600 leading-relaxed whitespace-pre-line">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )

  const SECTION_MAP = {
    summary: { hasContent: hasSummary || basic.summary === '', render: renderSummary },
    experience: { hasContent: hasExperience, render: renderExperience },
    projects: { hasContent: hasProjects, render: renderProjects },
    education: { hasContent: hasEducation, render: renderEducation },
    certifications: { hasContent: hasCertifications, render: renderCertifications },
    skills: { hasContent: hasSkills, render: renderSkills },
    languages: { hasContent: hasLanguages, render: renderLanguages },
    awards: { hasContent: hasAwards, render: renderAwards },
    hobbies: { hasContent: hasHobbies, render: renderHobbies },
    references: { hasContent: hasReferences, render: renderReferences },
    customSections: { hasContent: hasCustomSections, render: renderCustomSections },
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
        boxSizing: 'border-box',
      }}
    >
      {/* Masthead */}
      <header className="text-center resume-block">
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
          {websites.map((w) => (
            <span key={w.id} className="inline-flex items-center gap-1.5">
              <Globe size={10} style={{ color: accent }} />
              <EditableLink
                url={w.url}
                label={w.label}
                accentColor={accent}
                onChange={(newUrl) => updateItem('websites', w.id, { url: typeof newUrl === 'string' ? newUrl : newUrl.url })}
                placeholder={w.label || "Link"}
              />
            </span>
          ))}
          {basic.linkedin && !websites.some((w) => (w.url || '').toLowerCase().includes('linkedin')) && (
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
          {basic.portfolio && !websites.some((w) => (w.url || '').toLowerCase().includes('portfolio')) && (
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

      {/* Dynamic Ordered Sections */}
      <div className="space-y-3">
        {sectionsToRender}
      </div>
    </div>
  )
}


