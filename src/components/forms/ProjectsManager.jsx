import { useRef } from 'react'
import { FolderGit2, GripVertical, Plus, ChevronUp, ChevronDown } from 'lucide-react'
import { Reorder, useDragControls } from 'framer-motion'
import { useResumeStore } from '../../store/useResumeStore'
import { Field, TextInput } from '../ui/fields'
import { ArrowButton } from '../ui/primitives'
import { ConfirmDelete } from '../ui/ConfirmDelete'

export function ProjectsManager() {
  const items = useResumeStore((s) => s.projects || [])
  const add = useResumeStore((s) => () => s.addItem('projects'))
  const update = useResumeStore((s) => (id, patch) => s.updateItem('projects', id, patch))
  const remove = useResumeStore((s) => (id) => s.removeItem('projects', id))
  const move = useResumeStore((s) => (id, dir) => s.moveItem('projects', id, dir))
  const reorder = useResumeStore((s) => (next) => s.reorderList('projects', next))

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <button
          type="button"
          onClick={add}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#E8E4DC] bg-white/60 py-6 text-sm font-medium text-[#666055] hover:border-[#FF5E1A]/60 hover:bg-[#FFF3EB]/50 hover:text-[#FF5E1A] transition-all"
        >
          <Plus size={16} className="text-[#FF5E1A]" />
          + Add Project
        </button>
      ) : (
        <>
          <Reorder.Group axis="y" values={items} onReorder={reorder} className="space-y-3">
            {items.map((item, idx) => (
              <ProjectItem
                key={item.id}
                item={item}
                index={idx}
                total={items.length}
                onPatch={(patch) => update(item.id, patch)}
                onRemove={() => remove(item.id)}
                onMove={(dir) => move(item.id, dir)}
              />
            ))}
          </Reorder.Group>
          <button
            type="button"
            onClick={add}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#E8E4DC] bg-white py-2.5 text-xs font-semibold text-[#666055] hover:border-[#FF5E1A]/70 hover:bg-[#FFF3EB]/40 hover:text-[#FF5E1A] transition-colors"
          >
            <Plus size={14} /> + Add Project
          </button>
        </>
      )}
    </div>
  )
}

function ProjectItem(props) {
  const controls = useDragControls()
  return (
    <Reorder.Item
      value={props.item}
      layout
      dragListener={false}
      dragControls={controls}
      className="rounded-xl border border-[#E8E4DC] bg-white p-4 shadow-card overflow-hidden"
    >
      <ProjectCard {...props} controls={controls} />
    </Reorder.Item>
  )
}

function ProjectCard({ item, index, total, onPatch, onRemove, onMove, controls }) {
  const textareaRef = useRef(null)
  const displayTitle = item.title || item.name || `Project ${index + 1}`

  const addBulletPoint = () => {
    const current = item.description || ''
    const prefix = current.trim() === '' ? '' : current.endsWith('\n') ? '' : '\n'
    const next = `${current}${prefix}• `
    onPatch({ description: next })
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(next.length, next.length)
      }
    }, 50)
  }

  return (
    <div>
      {/* Header bar */}
      <div className="mb-3 flex items-center gap-2 pb-2 border-b border-[#E8E4DC]/60">
        <button
          type="button"
          onPointerDown={(e) => controls.start(e)}
          className="cursor-grab touch-none rounded p-0.5 text-[#B5AFA6] hover:text-[#1A1A1A] active:cursor-grabbing"
          aria-label="Drag to reorder project"
        >
          <GripVertical size={15} />
        </button>
        <FolderGit2 size={14} className="shrink-0 text-[#FF5E1A]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-[#1A1A1A]">
            {displayTitle}
          </p>
          {item.techStack && (
            <p className="truncate text-[10.5px] text-[#666055]">
              {item.techStack}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <ArrowButton title="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
            <ChevronUp size={14} />
          </ArrowButton>
          <ArrowButton title="Move down" disabled={index === total - 1} onClick={() => onMove(1)}>
            <ChevronDown size={14} />
          </ArrowButton>
          <ConfirmDelete onConfirm={onRemove} label="Remove project" />
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Project Title">
          <TextInput
            value={item.title || item.name || ''}
            onChange={(e) => onPatch({ title: e.target.value, name: e.target.value })}
            placeholder="e.g. Marketing Campaign, Brand Redesign, E-commerce Website, Research Study"
            compact
          />
        </Field>

        <Field label="Project / Portfolio Link">
          <TextInput
            value={item.link || ''}
            onChange={(e) => onPatch({ link: e.target.value })}
            placeholder="e.g. link-to-project.com, drive/folder, behance.net/design"
            compact
          />
        </Field>

        <Field label="Tools / Key Skills Used" className="sm:col-span-2">
          <TextInput
            value={item.techStack || ''}
            onChange={(e) => onPatch({ techStack: e.target.value })}
            placeholder="e.g. Photoshop, Figma, Excel, SEO, Project Management, React"
            compact
          />
        </Field>

        <div className="sm:col-span-2">
          <div className="mb-1 flex items-center justify-between">
            <label className="text-[11px] font-medium text-[#1A1A1A]">
              Description (multi-line & bullet points supported)
            </label>
            <button
              type="button"
              onClick={addBulletPoint}
              className="text-[10.5px] font-medium text-[#FF5E1A] hover:underline transition-colors inline-flex items-center gap-0.5"
            >
              <Plus size={11} /> Add bullet
            </button>
          </div>
          <textarea
            ref={textareaRef}
            rows={3}
            value={item.description || ''}
            onChange={(e) => onPatch({ description: e.target.value })}
            placeholder="e.g. Led cross-functional team, designed marketing assets, increased traffic by 30%, or published research findings..."
            className="w-full rounded-lg border border-[#E8E4DC] bg-white px-2.5 py-2 text-xs text-[#1A1A1A] leading-relaxed placeholder:text-[#9E988E] hover:border-[#D6D0C5] focus:border-[#FF5E1A] focus:outline-none focus:ring-1 focus:ring-[#FF5E1A]/20"
          />
        </div>
      </div>
    </div>
  )
}

export default ProjectsManager
