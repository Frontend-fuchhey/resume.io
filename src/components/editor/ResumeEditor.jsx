import { Reorder, useDragControls } from 'framer-motion'
import {
  Award,
  BookmarkPlus,
  Briefcase,
  ChevronDown,
  ChevronUp,
  FileText,
  FolderGit2,
  Globe,
  GraduationCap,
  GripVertical,
  Heart,
  Languages,
  Tag,
  Trophy,
  User,
  Users,
} from 'lucide-react'
import { BasicForm } from '../forms/BasicForm'
import { SummaryForm } from '../forms/SummaryForm'
import { ExperienceManager } from '../forms/ExperienceManager'
import { ProjectsManager } from '../forms/ProjectsManager'
import { EducationManager } from '../forms/EducationManager'
import { WebsitesManager } from '../forms/WebsitesManager'
import { SkillsManager } from '../forms/SkillsManager'
import { HobbiesManager } from '../forms/HobbiesManager'
import { CertsManager } from '../forms/ProjectsCertsManager'
import { LanguagesManager } from '../forms/LanguagesManager'
import { AwardsManager } from '../forms/AwardsManager'
import { ReferencesManager } from '../forms/ReferencesManager'
import { CustomSectionsManager } from '../forms/CustomSectionsManager'
import { SectionCard, VisibilityToggle } from '../ui/sectioncard'
import { useResumeStore } from '../../store/useResumeStore'
import { defaultSectionOrder } from '../../lib/factory'

const SECTION_CONFIGS = {
  summary: {
    icon: FileText,
    title: 'Professional Summary',
    subtitle: 'Executive bio and primary value proposition',
    defaultOpen: true,
    Component: SummaryForm,
    hasVisibility: false,
    getBadge: (s) => (s.basic?.summary?.trim() ? '1' : null),
  },
  experience: {
    icon: Briefcase,
    title: 'Employment History',
    subtitle: 'Chronological career milestones & quantified wins',
    defaultOpen: true,
    Component: ExperienceManager,
    hasVisibility: true,
    getBadge: (s) => (s.experience?.length ? `${s.experience.length}` : null),
  },
  education: {
    icon: GraduationCap,
    title: 'Education',
    subtitle: 'Academic credentials, schools & achievements',
    defaultOpen: false,
    Component: EducationManager,
    hasVisibility: true,
    getBadge: (s) => (s.education?.length ? `${s.education.length}` : null),
  },
  projects: {
    icon: FolderGit2,
    title: 'Projects',
    subtitle: 'Key initiatives, portfolio highlights & accomplishments',
    defaultOpen: false,
    Component: ProjectsManager,
    hasVisibility: true,
    getBadge: (s) => (s.projects?.length ? `${s.projects.length}` : null),
  },
  certifications: {
    icon: Award,
    title: 'Certifications',
    subtitle: 'Licenses, credentials & specialized certificates',
    defaultOpen: false,
    Component: CertsManager,
    hasVisibility: true,
    getBadge: (s) => (s.certifications?.length ? `${s.certifications.length}` : null),
  },
  skills: {
    icon: Tag,
    title: 'Skills',
    subtitle: 'Categorized keywords and domain competencies',
    defaultOpen: false,
    Component: SkillsManager,
    hasVisibility: true,
    getBadge: (s) => {
      const count = (s.skillGroups || []).reduce((acc, g) => acc + (g.items?.length || 0), 0)
      return count ? `${count}` : null
    },
  },
  languages: {
    icon: Languages,
    title: 'Languages',
    subtitle: 'Language proficiencies & CEFR ratings',
    defaultOpen: false,
    Component: LanguagesManager,
    hasVisibility: true,
    getBadge: (s) => (s.languages?.length ? `${s.languages.length}` : null),
  },
  awards: {
    icon: Trophy,
    title: 'Awards & Honors',
    subtitle: 'Scholarships, hackathons & recognitions',
    defaultOpen: false,
    Component: AwardsManager,
    hasVisibility: true,
    getBadge: (s) => (s.awards?.length ? `${s.awards.length}` : null),
  },
  websites: {
    icon: Globe,
    title: 'Websites & Social Links',
    subtitle: 'Portfolio, GitHub, LinkedIn & professional profiles',
    defaultOpen: false,
    Component: WebsitesManager,
    hasVisibility: true,
    getBadge: (s) => (s.websites?.length ? `${s.websites.length}` : null),
  },
  hobbies: {
    icon: Heart,
    title: 'Hobbies',
    subtitle: 'Personal pursuits, extracurriculars & community',
    defaultOpen: false,
    Component: HobbiesManager,
    hasVisibility: true,
    getBadge: (s) => (s.hobbies?.length ? `${s.hobbies.length}` : null),
  },
  references: {
    icon: Users,
    title: 'References',
    subtitle: 'Referees & professional endorsements',
    defaultOpen: false,
    Component: ReferencesManager,
    hasVisibility: true,
    getBadge: (s) =>
      s.references?.mode === 'upon_request'
        ? 'Request'
        : s.references?.items?.length
        ? `${s.references.items.length}`
        : null,
  },
  customSections: {
    icon: BookmarkPlus,
    title: 'Custom Sections',
    subtitle: 'Publications, volunteering, patents & extra activities',
    defaultOpen: false,
    Component: CustomSectionsManager,
    hasVisibility: true,
    getBadge: (s) => (s.customSections?.length ? `${s.customSections.length}` : null),
  },
}

function ReorderableSectionItem({
  secKey,
  index,
  total,
  config,
  visibility,
  badge,
  toggle,
  moveSection,
}) {
  const controls = useDragControls()
  const { icon: Icon, title, subtitle, defaultOpen, Component, hasVisibility } = config

  return (
    <Reorder.Item
      value={secKey}
      dragListener={false}
      dragControls={controls}
      className="relative select-none"
    >
      <SectionCard
        icon={Icon}
        title={title}
        subtitle={subtitle}
        badge={badge}
        defaultOpen={defaultOpen}
        actions={
          <div className="flex items-center gap-0.5">
            {/* Drag Handle */}
            <button
              type="button"
              onPointerDown={(e) => controls.start(e)}
              title="Drag to reorder section"
              aria-label="Drag to reorder section"
              className="flex h-6 w-5 cursor-grab items-center justify-center text-[#B5AFA6] hover:text-[#1A1A1A] active:cursor-grabbing transition-colors"
            >
              <GripVertical size={13} />
            </button>

            {/* Up / Down Reorder Buttons */}
            <button
              type="button"
              disabled={index === 0}
              onClick={() => moveSection(secKey, -1)}
              title="Move section up"
              aria-label="Move section up"
              className="flex h-6 w-5 items-center justify-center rounded text-[#B5AFA6] hover:bg-[#F5F2EC] hover:text-[#1A1A1A] disabled:opacity-20 transition-colors"
            >
              <ChevronUp size={13} />
            </button>
            <button
              type="button"
              disabled={index === total - 1}
              onClick={() => moveSection(secKey, 1)}
              title="Move section down"
              aria-label="Move section down"
              className="flex h-6 w-5 items-center justify-center rounded text-[#B5AFA6] hover:bg-[#F5F2EC] hover:text-[#1A1A1A] disabled:opacity-20 transition-colors"
            >
              <ChevronDown size={13} />
            </button>

            {/* Visibility Toggle */}
            {hasVisibility && (
              <VisibilityToggle
                visible={visibility[secKey] !== false}
                onToggle={() => toggle(secKey)}
                label={secKey}
              />
            )}
          </div>
        }
      >
        <Component />
      </SectionCard>
    </Reorder.Item>
  )
}

export function ResumeEditor() {
  const store = useResumeStore()
  const visibility = store.visibility || {}
  const toggle = store.toggleSection
  const sectionOrder = store.sectionOrder || defaultSectionOrder()
  const reorderSections = store.reorderSections
  const moveSection = store.moveSection

  // Ensure all configured keys exist in the list
  const validKeys = Object.keys(SECTION_CONFIGS)
  let activeOrder = [
    ...sectionOrder.filter((k) => validKeys.includes(k)),
    ...validKeys.filter((k) => !sectionOrder.includes(k)),
  ]

  // If projects is buried below hobbies in legacy saved state, elevate it right after education
  const hobIdx = activeOrder.indexOf('hobbies')
  const projIdx = activeOrder.indexOf('projects')
  const eduIdx = activeOrder.indexOf('education')
  if (projIdx > hobIdx && hobIdx !== -1) {
    activeOrder = activeOrder.filter((k) => k !== 'projects')
    const insertAfter = eduIdx !== -1 ? activeOrder.indexOf('education') : -1
    if (insertAfter !== -1) {
      activeOrder.splice(insertAfter + 1, 0, 'projects')
    } else {
      activeOrder.unshift('projects')
    }
  }

  return (
    <div className="flex flex-col gap-2.5 pb-8">
      {/* Fixed: Personal Information */}
      <SectionCard
        icon={User}
        title="Personal Information"
        subtitle="Name, photo, title & contact coordinates"
        badge={store.basic?.fullName ? 'Complete' : null}
        defaultOpen={true}
      >
        <BasicForm />
      </SectionCard>

      {/* Dynamic Reorderable Sections */}
      <Reorder.Group
        axis="y"
        values={activeOrder}
        onReorder={reorderSections}
        className="flex flex-col gap-2.5"
      >
        {activeOrder.map((key, index) => {
          const config = SECTION_CONFIGS[key]
          if (!config) return null
          const badge = config.getBadge ? config.getBadge(store) : null
          return (
            <ReorderableSectionItem
              key={key}
              secKey={key}
              index={index}
              total={activeOrder.length}
              config={config}
              visibility={visibility}
              badge={badge}
              toggle={toggle}
              moveSection={moveSection}
            />
          )
        })}
      </Reorder.Group>
    </div>
  )
}
