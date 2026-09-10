import {
  Briefcase,
  Calendar,
  Globe,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Phone,
  Tag,
  User,
  Award,
} from 'lucide-react'
import { useResumeStore } from '../../../store/useResumeStore'
import { dateRange, cleanUrl, toHref } from '../../../lib/format'
import { EditableText } from '../EditableText'
import { EditableLink } from '../EditableLink'
import { EditableDate } from '../EditableDate'
import { Bullet, AddBulletButton } from '../Bullet'

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
  standard: '38px 42px',
  spacious: '52px 56px',
}

export default function AtsStudioTemplate({ resume, theme }) {
  const basic = resume.basic || {}
  const experience = resume.experience || []
  const education = resume.education || []
  const websites = resume.websites || []
  const skillGroups = resume.skillGroups || []
  const hobbies = resume.hobbies || []
  const projects = resume.projects || []
  const certifications = resume.certifications || []
  const languages = resume.languages || []
  const awards = resume.awards || []
  const references = resume.references || { mode: 'upon_request', text: 'References available upon request', items: [] }
  const customSections = resume.customSections || []
  const visibility = resume.visibility || {}
  const formatting = resume.formatting || {}
  const sectionOrder = resume.sectionOrder || defaultSectionOrder()
  const sectionTitles = resume.sectionTitles || {}

  const setActiveItem = useResumeStore((s) => s.setActiveItem)
  const setBasic = useResumeStore((s) => s.setBasic)
  const updateItem = useResumeStore((s) => s.updateItem)
  const updateBullet = useResumeStore((s) => s.updateBullet)
  const updateSkill = useResumeStore((s) => s.updateSkill)
  const renameSkillGroup = useResumeStore((s) => s.renameSkillGroup)
  const setSectionTitle = useResumeStore((s) => s.setSectionTitle)
  const updateCustomSection = useResumeStore((s) => s.updateCustomSection)
  const updateCustomItem = useResumeStore((s) => s.updateCustomItem)

  // Typography & design styling from Right Toolbar
  const fontFamily = FONT_MAP[formatting.fontFamily] || "'Poppins', sans-serif"
  const titleFontFamily = formatting.fontFamily === 'Courgette' ? "'Courgette', cursive" : fontFamily
  const fontWeight = formatting.fontWeight || '400'
  const baseFontSize = formatting.fontSize || 10.5
  const accentColor = theme?.accentColor || formatting.accentColor || '#244CEC'
  const textColor = formatting.textColor || '#1A1A1A'
  const textAlign = formatting.textAlign || 'left'
  const lineHeight = (formatting.lineHeight || 140) / 100
  const letterSpacing = `${formatting.letterSpacing || 0}px`
  const canvasPadding = PADDING_MAP[formatting.marginDensity || 'standard'] || '38px 42px'

  const showPhoto = !basic.hidePhotoForAts && (basic.avatar || !basic.fullName)
  const hasContact = basic.email || basic.phone || basic.location || websites.length > 0
  const hasEducation = visibility.education !== false && education.length > 0
  const hasSkills = visibility.skills !== false && skillGroups.length > 0
  const hasHobbies = visibility.hobbies !== false && hobbies.length > 0
  const hasCertifications = visibility.certifications !== false && certifications.length > 0
  const hasLanguages = visibility.languages !== false && languages.length > 0
  const hasAwards = visibility.awards !== false && awards.length > 0
  const hasReferences = visibility.references !== false && (
    (references.mode === 'upon_request' && references.text?.trim()) ||
    (references.mode === 'structured' && (references.items || []).length > 0)
  )
  const hasCustomSections = visibility.customSections !== false && customSections.length > 0
  const hasSummary = basic.summary && basic.summary.trim()
  const hasExperience = visibility.experience !== false && experience.length > 0
  const hasProjects = visibility.projects !== false && projects.length > 0

  // Section renderers
  const renderContactAndWebsites = () => (
    <section key="websites" className="resume-block">
      <h2
        className="text-[10pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        <EditableText
          value={sectionTitles.websites || 'Contact Details'}
          onChange={(val) => setSectionTitle('websites', val)}
          placeholder="Contact Details"
        />
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-1.5 opacity-40" />
      <div className="space-y-2 text-[9pt] text-[#403D39]">
        {(basic.email || basic.email === '') && (
          <div className="flex items-center gap-2">
            <Mail size={12} className="shrink-0" style={{ color: accentColor }} />
            <EditableText
              value={basic.email}
              onChange={(val) => setBasic({ email: val })}
              placeholder="email@example.com"
              className="break-all flex-1"
            />
          </div>
        )}
        {(basic.phone || basic.phone === '') && (
          <div className="flex items-center gap-2">
            <Phone size={12} className="shrink-0" style={{ color: accentColor }} />
            <EditableText
              value={basic.phone}
              onChange={(val) => setBasic({ phone: val })}
              placeholder="+1 (555) 000-0000"
              className="flex-1"
            />
          </div>
        )}
        {(basic.location || basic.location === '') && (
          <div className="flex items-center gap-2">
            <MapPin size={12} className="shrink-0" style={{ color: accentColor }} />
            <EditableText
              value={basic.location}
              onChange={(val) => setBasic({ location: val })}
              placeholder="City, State / Country"
              className="flex-1"
            />
          </div>
        )}
        {websites.map((w) => (
          <div key={w.id} className="flex items-center gap-2">
            <Globe size={12} className="shrink-0" style={{ color: accentColor }} />
            <div className="flex items-baseline gap-1 truncate flex-1 min-w-0">
              <EditableText
                value={w.label}
                onChange={(val) => updateItem('websites', w.id, { label: val })}
                placeholder="Platform"
                className="font-semibold shrink-0"
              />
              <span className="shrink-0 font-semibold">:</span>
              <EditableLink
                url={w.url}
                label={w.label}
                accentColor={accentColor}
                onChange={(newUrl) => updateItem('websites', w.id, { url: typeof newUrl === 'string' ? newUrl : newUrl.url })}
                onDelete={() => useResumeStore.getState().removeItem('websites', w.id)}
                placeholder="Add URL..."
                className="text-[8.5pt]"
              />
            </div>
          </div>
        ))}
        {basic.linkedin && !websites.some((w) => (w.url || '').toLowerCase().includes('linkedin')) && (
          <div className="flex items-center gap-2">
            <Globe size={12} className="shrink-0" style={{ color: accentColor }} />
            <div className="flex items-baseline gap-1 truncate flex-1 min-w-0">
              <strong className="font-semibold shrink-0">LinkedIn:</strong>
              <EditableLink
                url={basic.linkedin}
                accentColor={accentColor}
                onChange={(newUrl) => setBasic({ linkedin: typeof newUrl === 'string' ? newUrl : newUrl.url })}
                placeholder="Add LinkedIn URL..."
                className="text-[8.5pt]"
              />
            </div>
          </div>
        )}
        {basic.portfolio && !websites.some((w) => (w.url || '').toLowerCase().includes('portfolio')) && (
          <div className="flex items-center gap-2">
            <Globe size={12} className="shrink-0" style={{ color: accentColor }} />
            <div className="flex items-baseline gap-1 truncate flex-1 min-w-0">
              <strong className="font-semibold shrink-0">Portfolio:</strong>
              <EditableLink
                url={basic.portfolio}
                accentColor={accentColor}
                onChange={(newUrl) => setBasic({ portfolio: typeof newUrl === 'string' ? newUrl : newUrl.url })}
                placeholder="Add Portfolio URL..."
                className="text-[8.5pt]"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )

  const renderEducation = () => (
    <section key="education" className="resume-block">
      <h2
        className="text-[10pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        <EditableText
          value={sectionTitles.education || 'Education'}
          onChange={(val) => setSectionTitle('education', val)}
          placeholder="Education"
        />
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-1.5 opacity-40" />
      <div className="space-y-3">
        {education.map((edu) => (
          <div
            key={edu.id}
            onClick={() => setActiveItem({ list: 'education', id: edu.id })}
            className="resume-block cursor-pointer group rounded p-1 hover:bg-[#FBF9F5] transition-colors"
          >
            <div className="text-[9.5pt] font-bold text-[#1A1A1A] leading-snug">
              <EditableText
                value={edu.degree}
                onChange={(val) => updateItem('education', edu.id, { degree: val })}
                placeholder="Degree Program"
              />
            </div>
            <div className="text-[9pt] font-medium" style={{ color: accentColor }}>
              <EditableText
                value={edu.school}
                onChange={(val) => updateItem('education', edu.id, { school: val })}
                placeholder="University / School"
              />
            </div>
            <div className="text-[8.5pt] text-[#666055] mt-0.5">
              Graduation:{' '}
              <EditableText
                value={edu.gradYear}
                onChange={(val) => updateItem('education', edu.id, { gradYear: val })}
                placeholder="Year"
              />
            </div>
            {(edu.focus || edu.focus === '') && (
              <div className="text-[8.5pt] italic text-[#666055] mt-0.5">
                <EditableText
                  value={edu.focus}
                  onChange={(val) => updateItem('education', edu.id, { focus: val })}
                  placeholder="Focus / Academic Honors"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )

  const renderSkills = () => (
    <section key="skills" className="resume-block">
      <h2
        className="text-[10pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        <EditableText
          value={sectionTitles.skills || 'Skills & Competencies'}
          onChange={(val) => setSectionTitle('skills', val)}
          placeholder="Skills & Competencies"
        />
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-1.5 opacity-40" />
      <div className="space-y-2.5">
        {skillGroups.map((g) => (
          <div key={g.id} className="resume-block">
            <div className="text-[8.5pt] font-bold uppercase tracking-wide text-[#666055] mb-1">
              <EditableText
                value={g.label}
                onChange={(val) => renameSkillGroup(g.id, val)}
                placeholder="Skill Category"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {g.items.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-block rounded px-2 py-0.5 text-[8pt] font-medium bg-[#F5F2EC] text-[#1A1A1A]"
                >
                  <EditableText
                    value={item}
                    onChange={(val) => updateSkill(g.id, idx, val)}
                    placeholder="Skill"
                  />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  const renderHobbies = () => (
    <section key="hobbies" className="resume-block">
      <h2
        className="text-[10pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        <EditableText
          value={sectionTitles.hobbies || 'Hobbies & Interests'}
          onChange={(val) => setSectionTitle('hobbies', val)}
          placeholder="Hobbies & Interests"
        />
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-1.5 opacity-40" />
      <div className="flex flex-wrap gap-1.5">
        {hobbies.map((h) => (
          <span
            key={h.id}
            className="inline-flex items-center gap-1 rounded-full border border-[#E8E4DC] px-2.5 py-0.5 text-[8pt] text-[#403D39]"
          >
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

  const renderSummary = () => (
    <section key="summary" className="resume-block">
      <h2
        className="text-[11pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        <EditableText
          value={sectionTitles.summary || 'Profile Summary'}
          onChange={(val) => setSectionTitle('summary', val)}
          placeholder="Profile Summary"
        />
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-1.5 opacity-40" />
      <div className="text-[9.5pt] text-[#2D2D2D] leading-relaxed text-justify">
        <EditableText
          multiline
          value={basic.summary}
          onChange={(val) => setBasic({ summary: val })}
          placeholder="Write your professional summary here..."
          className="w-full"
        />
      </div>
    </section>
  )

  const renderExperience = () => (
    <section key="experience" className="resume-block">
      <h2
        className="text-[11pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        <EditableText
          value={sectionTitles.experience || 'Employment History'}
          onChange={(val) => setSectionTitle('experience', val)}
          placeholder="Employment History"
        />
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-2 opacity-40" />

      <div className="relative pl-4 space-y-5 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E8E4DC]">
        {experience.map((exp) => (
          <div
            key={exp.id}
            onClick={() => setActiveItem({ list: 'experience', id: exp.id })}
            className="resume-block relative cursor-pointer group rounded p-1 hover:bg-[#FBF9F5] transition-colors"
          >
            {/* Timeline Dot */}
            <div
              className="absolute -left-[19px] top-1.5 h-2.5 w-2.5 rounded-full border-2 bg-white"
              style={{ borderColor: accentColor }}
            />

            {/* Role Title & Dates */}
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-[10pt] font-bold text-[#1A1A1A] flex-1">
                <EditableText
                  value={exp.role}
                  onChange={(val) => updateItem('experience', exp.id, { role: val })}
                  placeholder="Role Title"
                />
              </h3>
              <span className="shrink-0 text-[8.5pt] font-semibold text-[#666055]">
                <EditableDate
                  item={exp}
                  onPatch={(patch) => updateItem('experience', exp.id, patch)}
                />
              </span>
            </div>

            {/* Company & Location */}
            <div className="text-[9pt] font-semibold flex items-center gap-1.5 flex-wrap" style={{ color: accentColor }}>
              <EditableText
                value={exp.company}
                onChange={(val) => updateItem('experience', exp.id, { company: val })}
                placeholder="Company Name"
              />
              <span className="font-normal text-[#666055]">
                · <EditableText
                  value={exp.location}
                  onChange={(val) => updateItem('experience', exp.id, { location: val })}
                  placeholder="Location"
                />
              </span>
            </div>

            {/* Achievements / Bullets */}
            <div className="mt-2 space-y-1 text-[9pt] text-[#2D2D2D]">
              {(exp.bullets || []).map((bullet, idx) => (
                <Bullet
                  key={idx}
                  expId={exp.id}
                  index={idx}
                  text={bullet}
                  marker="•"
                  markerStyle={{ color: accentColor }}
                />
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
      <h2
        className="text-[11pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        <EditableText
          value={sectionTitles.projects || 'Projects'}
          onChange={(val) => setSectionTitle('projects', val)}
          placeholder="Projects"
        />
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-2 opacity-40" />

      <div className="space-y-4">
        {projects.map((proj) => {
          const title = proj.title || proj.name
          if (!title && !proj.description && !proj.techStack) return null
          return (
            <div
              key={proj.id}
              onClick={() => setActiveItem({ list: 'projects', id: proj.id })}
              className="resume-block relative cursor-pointer group rounded p-1 hover:bg-[#FBF9F5] transition-colors"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-[10pt] font-bold text-[#1A1A1A] flex-1">
                  <EditableText
                    value={title}
                    onChange={(val) => updateItem('projects', proj.id, { title: val, name: val })}
                    placeholder="Project Title"
                  />
                </h3>
                <EditableLink
                  url={proj.link}
                  accentColor={accentColor}
                  onChange={(newUrl) => updateItem('projects', proj.id, { link: typeof newUrl === 'string' ? newUrl : newUrl.url })}
                  onDelete={() => updateItem('projects', proj.id, { link: '' })}
                  placeholder="Add link..."
                  className="shrink-0 text-[8pt] font-medium"
                />
              </div>

              {proj.techStack && (
                <div className="mt-0.5 text-[8.5pt] font-medium" style={{ color: accentColor }}>
                  <EditableText
                    value={proj.techStack}
                    onChange={(val) => updateItem('projects', proj.id, { techStack: val })}
                    placeholder="Tools / Key Skills Used"
                  />
                </div>
              )}

              {proj.description && (
                <div className="mt-1 text-[9pt] text-[#2D2D2D] leading-relaxed whitespace-pre-line text-justify">
                  <EditableText
                    multiline
                    value={proj.description}
                    onChange={(val) => updateItem('projects', proj.id, { description: val })}
                    placeholder="Project details and achievements..."
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )

  const renderCertifications = () => (
    <section key="certifications" className="resume-block">
      <h2
        className="text-[10pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        <EditableText
          value={sectionTitles.certifications || 'Certifications'}
          onChange={(val) => setSectionTitle('certifications', val)}
          placeholder="Certifications"
        />
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-1.5 opacity-40" />
      <div className="space-y-2">
        {certifications.map((c) => (
          <div key={c.id} className="resume-block text-[8.5pt]">
            <div className="font-bold text-[#1A1A1A]">
              <EditableText
                value={c.name}
                onChange={(val) => updateItem('certifications', c.id, { name: val })}
                placeholder="Certification Name"
              />
            </div>
            <div className="text-[#666055] flex items-center gap-1.5">
              <EditableText
                value={c.issuer}
                onChange={(val) => updateItem('certifications', c.id, { issuer: val })}
                placeholder="Issuer"
              />
              {c.year && <span>·</span>}
              <EditableText
                value={c.year}
                onChange={(val) => updateItem('certifications', c.id, { year: val })}
                placeholder="Year"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  const renderLanguages = () => (
    <section key="languages" className="resume-block">
      <h2
        className="text-[10pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        <EditableText
          value={sectionTitles.languages || 'Languages'}
          onChange={(val) => setSectionTitle('languages', val)}
          placeholder="Languages"
        />
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-1.5 opacity-40" />
      <div className="space-y-2">
        {languages.map((l) => (
          <div key={l.id} className="resume-block text-[8.5pt]">
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-[#1A1A1A]">
                <EditableText
                  value={l.name}
                  onChange={(val) => updateItem('languages', l.id, { name: val })}
                  placeholder="Language"
                />
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <span
                    key={dot}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: (l.rating || 4) >= dot ? accentColor : '#E8E4DC',
                    }}
                  />
                ))}
              </div>
            </div>
            {l.level && (
              <p className="text-[8pt] text-[#666055]">{l.level}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )

  const renderAwards = () => (
    <section key="awards" className="resume-block">
      <h2
        className="text-[11pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        <EditableText
          value={sectionTitles.awards || 'Awards & Honors'}
          onChange={(val) => setSectionTitle('awards', val)}
          placeholder="Awards & Honors"
        />
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-2 opacity-40" />
      <div className="space-y-3">
        {awards.map((a) => (
          <div key={a.id} className="resume-block text-[9pt]">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-bold text-[#1A1A1A]">
                <EditableText
                  value={a.title}
                  onChange={(val) => updateItem('awards', a.id, { title: val })}
                  placeholder="Award Title"
                />
              </span>
              {a.date && (
                <span className="text-[8.5pt] font-semibold text-[#666055]">
                  <EditableText
                    value={a.date}
                    onChange={(val) => updateItem('awards', a.id, { date: val })}
                    placeholder="Year"
                  />
                </span>
              )}
            </div>
            {a.issuer && (
              <div className="text-[8.5pt] font-medium" style={{ color: accentColor }}>
                <EditableText
                  value={a.issuer}
                  onChange={(val) => updateItem('awards', a.id, { issuer: val })}
                  placeholder="Issuer"
                />
              </div>
            )}
            {a.description && (
              <p className="mt-1 text-[8.5pt] text-[#403D39] leading-relaxed whitespace-pre-line">{a.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )

  const renderReferences = () => (
    <section key="references" className="resume-block">
      <h2
        className="text-[11pt] font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        <EditableText
          value={sectionTitles.references || 'References'}
          onChange={(val) => setSectionTitle('references', val)}
          placeholder="References"
        />
      </h2>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-2 opacity-40" />
      {references.mode === 'upon_request' ? (
        <p className="italic text-[9pt] text-[#666055]">
          {references.text || 'References available upon request'}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(references.items || []).map((r) => (
            <div key={r.id} className="resume-block rounded-md border border-[#E8E4DC]/80 bg-[#FBF9F5]/50 p-2 text-[8.5pt]">
              <p className="font-bold text-[#1A1A1A]">{r.name}</p>
              <p className="text-[8pt] text-[#666055]">{r.role}{r.company ? ` · ${r.company}` : ''}</p>
              {r.email && <p className="text-[8pt] text-[#403D39] mt-0.5">{r.email}</p>}
              {r.phone && <p className="text-[8pt] text-[#403D39]">{r.phone}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )

  const renderCustomSections = () => (
    <div key="customSections" className="space-y-5">
      {customSections.map((cs) => (
        <section key={cs.id} className="resume-block">
          <h2
            className="text-[11pt] font-bold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            <EditableText
              value={cs.title}
              onChange={(val) => updateCustomSection(cs.id, { title: val })}
              placeholder="Section Heading"
            />
          </h2>
          <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full my-2 opacity-40" />
          <div className="space-y-3">
            {(cs.items || []).map((item) => (
              <div key={item.id} className="resume-block text-[9pt]">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-bold text-[#1A1A1A]">
                    <EditableText
                      value={item.title}
                      onChange={(val) => updateCustomItem(cs.id, item.id, { title: val })}
                      placeholder="Title"
                    />
                  </span>
                  {item.date && (
                    <span className="text-[8.5pt] font-semibold text-[#666055]">
                      <EditableText
                        value={item.date}
                        onChange={(val) => updateCustomItem(cs.id, item.id, { date: val })}
                        placeholder="Date"
                      />
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <p className="text-[8.5pt] font-medium" style={{ color: accentColor }}>
                    <EditableText
                      value={item.subtitle}
                      onChange={(val) => updateCustomItem(cs.id, item.id, { subtitle: val })}
                      placeholder="Subtitle / Organization"
                    />
                  </p>
                )}
                {item.description && (
                  <p className="mt-1 text-[8.5pt] text-[#403D39] leading-relaxed whitespace-pre-line">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )

  // Map section keys to their render functions
  const SECTION_MAP = {
    websites: { hasContent: hasContact, render: renderContactAndWebsites, side: 'left' },
    education: { hasContent: hasEducation, render: renderEducation, side: 'left' },
    skills: { hasContent: hasSkills, render: renderSkills, side: 'left' },
    certifications: { hasContent: hasCertifications, render: renderCertifications, side: 'left' },
    languages: { hasContent: hasLanguages, render: renderLanguages, side: 'left' },
    hobbies: { hasContent: hasHobbies, render: renderHobbies, side: 'left' },
    summary: { hasContent: hasSummary || basic.summary === '', render: renderSummary, side: 'right' },
    experience: { hasContent: hasExperience, render: renderExperience, side: 'right' },
    projects: { hasContent: hasProjects, render: renderProjects, side: 'right' },
    awards: { hasContent: hasAwards, render: renderAwards, side: 'right' },
    references: { hasContent: hasReferences, render: renderReferences, side: 'right' },
    customSections: { hasContent: hasCustomSections, render: renderCustomSections, side: 'right' },
  }

  // Sort sections in each column based on sectionOrder
  const leftSections = sectionOrder
    .filter((k) => SECTION_MAP[k]?.side === 'left' && SECTION_MAP[k]?.hasContent)
    .map((k) => SECTION_MAP[k].render())

  const rightSections = sectionOrder
    .filter((k) => SECTION_MAP[k]?.side === 'right' && SECTION_MAP[k]?.hasContent)
    .map((k) => SECTION_MAP[k].render())

  return (
    <div
      className="min-h-full h-auto w-full bg-white text-[#1A1A1A]"
      style={{
        fontFamily,
        color: textColor,
        fontSize: `${baseFontSize}pt`,
        lineHeight,
        letterSpacing,
        textAlign,
        padding: canvasPadding,
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header: Optional Photo Avatar + Large Name + Headline */}
      <header
        className="flex items-center gap-6 pb-6 border-b border-[#E8E4DC] resume-block"
        style={{ borderColor: `${accentColor}30` }}
      >
        {/* Photo Avatar (respects ATS photo hide toggle) */}
        {showPhoto && (
          <div
            className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-[#FBF9F5] shadow-sm"
            style={{ borderColor: accentColor }}
          >
            {basic.avatar ? (
              <img src={basic.avatar} alt={basic.fullName || 'User'} className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-bold" style={{ color: accentColor, fontFamily: titleFontFamily }}>
                {basic.fullName ? basic.fullName.charAt(0).toUpperCase() : <User size={30} className="text-[#9E988E]" />}
              </span>
            )}
          </div>
        )}

        {/* Name & Headline with In-Canvas Editing */}
        <div className="flex-1 min-w-0">
          <h1
            className="text-[28pt] leading-tight tracking-tight font-bold"
            style={{ fontFamily: titleFontFamily, color: textColor }}
          >
            <EditableText
              value={basic.fullName}
              onChange={(val) => setBasic({ fullName: val })}
              placeholder="Your Full Name"
            />
          </h1>
          <p
            className="mt-1 text-[12pt] font-medium tracking-wide uppercase"
            style={{ color: accentColor }}
          >
            <EditableText
              value={basic.jobTitle}
              onChange={(val) => setBasic({ jobTitle: val })}
              placeholder="Senior Software Engineer"
            />
          </p>
        </div>
      </header>
      <div style={{ backgroundColor: accentColor }} className="h-0.5 w-full mt-4 mb-2 opacity-30" />

      {/* Two-Column Dynamic ATS Grid */}
      <div className="mt-6 grid grid-cols-12 gap-8 items-start">
        {/* Left Column: Reordered based on sectionOrder (~40%) */}
        <div className="col-span-5 space-y-6 pr-2 border-r border-[#E8E4DC]/60">
          {leftSections}
        </div>

        {/* Right Column: Reordered based on sectionOrder (~60%) */}
        <div className="col-span-7 space-y-6">
          {rightSections}
        </div>
      </div>
    </div>
  )
}
