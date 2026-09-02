import { Briefcase, FileText, Globe, GraduationCap, Heart, Tag, User } from 'lucide-react'
import { BasicForm } from '../forms/BasicForm'
import { SummaryForm } from '../forms/SummaryForm'
import { ExperienceManager } from '../forms/ExperienceManager'
import { EducationManager } from '../forms/EducationManager'
import { WebsitesManager } from '../forms/WebsitesManager'
import { SkillsManager } from '../forms/SkillsManager'
import { HobbiesManager } from '../forms/HobbiesManager'
import { SectionCard, VisibilityToggle } from '../ui/sectioncard'
import { useResumeStore } from '../../store/useResumeStore'

export function ResumeEditor() {
  const visibility = useResumeStore((s) => s.visibility || {})
  const toggle = useResumeStore((s) => s.toggleSection)

  return (
    <div className="flex flex-col gap-2.5 pb-8">
      {/* 1. Personal Information */}
      <SectionCard
        icon={User}
        title="Personal Information"
        subtitle="Name, photo, title & contact coordinates"
        defaultOpen={true}
      >
        <BasicForm />
      </SectionCard>

      {/* 2. Professional Summary */}
      <SectionCard
        icon={FileText}
        title="Professional Summary"
        subtitle="Executive bio and primary value proposition"
        defaultOpen={true}
      >
        <SummaryForm />
      </SectionCard>

      {/* 3. Employment History */}
      <SectionCard
        icon={Briefcase}
        title="Employment History"
        subtitle="Chronological career milestones & quantified wins"
        defaultOpen={true}
        actions={
          <VisibilityToggle
            visible={visibility.experience !== false}
            onToggle={() => toggle('experience')}
            label="experience"
          />
        }
      >
        <ExperienceManager />
      </SectionCard>

      {/* 4. Education */}
      <SectionCard
        icon={GraduationCap}
        title="Education"
        subtitle="Academic credentials, schools & achievements"
        defaultOpen={false}
        actions={
          <VisibilityToggle
            visible={visibility.education !== false}
            onToggle={() => toggle('education')}
            label="education"
          />
        }
      >
        <EducationManager />
      </SectionCard>

      {/* 5. Websites & Social Links */}
      <SectionCard
        icon={Globe}
        title="Websites & Social Links"
        subtitle="Portfolio, GitHub, LinkedIn & professional profiles"
        defaultOpen={false}
        actions={
          <VisibilityToggle
            visible={visibility.websites !== false}
            onToggle={() => toggle('websites')}
            label="websites"
          />
        }
      >
        <WebsitesManager />
      </SectionCard>

      {/* 6. Skills */}
      <SectionCard
        icon={Tag}
        title="Skills"
        subtitle="Categorized keywords and domain competencies"
        defaultOpen={false}
        actions={
          <VisibilityToggle
            visible={visibility.skills !== false}
            onToggle={() => toggle('skills')}
            label="skills"
          />
        }
      >
        <SkillsManager />
      </SectionCard>

      {/* 7. Hobbies */}
      <SectionCard
        icon={Heart}
        title="Hobbies"
        subtitle="Personal pursuits, extracurriculars & community"
        defaultOpen={false}
        actions={
          <VisibilityToggle
            visible={visibility.hobbies !== false}
            onToggle={() => toggle('hobbies')}
            label="hobbies"
          />
        }
      >
        <HobbiesManager />
      </SectionCard>
    </div>
  )
}
