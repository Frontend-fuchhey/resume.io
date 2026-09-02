import { Reorder, useDragControls } from 'framer-motion'
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  FileText,
  Globe,
  GraduationCap,
  GripVertical,
  Heart,
  Tag,
  User,
} from 'lucide-react'
import { BasicForm } from '../forms/BasicForm'
import { SummaryForm } from '../forms/SummaryForm'
import { ExperienceManager } from '../forms/ExperienceManager'
import { EducationManager } from '../forms/EducationManager'
import { WebsitesManager } from '../forms/WebsitesManager'
import { SkillsManager } from '../forms/SkillsManager'
import { HobbiesManager } from '../forms/HobbiesManager'
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
  },
  experience: {
    icon: Briefcase,
    title: 'Employment History',
    subtitle: 'Chronological career milestones & quantified wins',
    defaultOpen: true,
    Component: ExperienceManager,
    hasVisibility: true,
  },
  education: {
    icon: GraduationCap,
    title: 'Education',
    subtitle: 'Academic credentials, schools & achievements',
    defaultOpen: false,
    Component: EducationManager,
    hasVisibility: true,
  },
  websites: {
    icon: Globe,
    title: 'Websites & Social Links',
    subtitle: 'Portfolio, GitHub, LinkedIn & professional profiles',
    defaultOpen: false,
    Component: WebsitesManager,
    hasVisibility: true,
  },
  skills: {
    icon: Tag,
    title: 'Skills',
    subtitle: 'Categorized keywords and domain competencies',
    defaultOpen: false,
    Component: SkillsManager,
    hasVisibility: true,
  },
  hobbies: {
    icon: Heart,
    title: 'Hobbies',
    subtitle: 'Personal pursuits, extracurriculars & community',
    defaultOpen: false,
    Component: HobbiesManager,
    hasVisibility: true,
  },
}

function ReorderableSectionItem({
  secKey,
  index,
  total,
  config,
  visibility,
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
        defaultOpen={defaultOpen}
        actions={
          <div className="flex items-center gap-1">
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
  const visibility = useResumeStore((s) => s.visibility || {})
  const toggle = useResumeStore((s) => s.toggleSection)
  const sectionOrder = useResumeStore((s) => s.sectionOrder || defaultSectionOrder())
  const reorderSections = useResumeStore((s) => s.reorderSections)
  const moveSection = useResumeStore((s) => s.moveSection)

  // Ensure all configured keys exist in the list
  const validKeys = Object.keys(SECTION_CONFIGS)
  const activeOrder = [
    ...sectionOrder.filter((k) => validKeys.includes(k)),
    ...validKeys.filter((k) => !sectionOrder.includes(k)),
  ]

  return (
    <div className="flex flex-col gap-2.5 pb-8">
      {/* Fixed: Personal Information */}
      <SectionCard
        icon={User}
        title="Personal Information"
        subtitle="Name, photo, title & contact coordinates"
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
          return (
            <ReorderableSectionItem
              key={key}
              secKey={key}
              index={index}
              total={activeOrder.length}
              config={config}
              visibility={visibility}
              toggle={toggle}
              moveSection={moveSection}
            />
          )
        })}
      </Reorder.Group>
    </div>
  )
}
