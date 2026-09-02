import { GraduationCap, Plus } from 'lucide-react'
import { Reorder, useDragControls } from 'framer-motion'
import { useResumeStore } from '../../store/useResumeStore'
import { Field, TextInput } from '../ui/fields'
import { ArrowButton } from '../ui/primitives'
import { ConfirmDelete } from '../ui/ConfirmDelete'

export function EducationManager() {
  const items = useResumeStore((s) => s.education || [])
  const add = useResumeStore((s) => () => s.addItem('education'))
  const update = useResumeStore((s) => (id, patch) => s.updateItem('education', id, patch))
  const remove = useResumeStore((s) => (id) => s.removeItem('education', id))
  const move = useResumeStore((s) => (id, dir) => s.moveItem('education', id, dir))
  const reorder = useResumeStore((s) => (next) => s.reorderList('education', next))

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <button
          type="button"
          onClick={add}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#E8E4DC] bg-white/60 py-6 text-sm font-medium text-[#666055] hover:border-[#FF5E1A]/60 hover:bg-[#FFF3EB]/50 hover:text-[#FF5E1A] transition-all"
        >
          <Plus size={16} className="text-[#FF5E1A]" />
          Add Education Degree
        </button>
      ) : (
        <>
          <Reorder.Group axis="y" values={items} onReorder={reorder} className="space-y-2.5">
            {items.map((item, i) => (
              <EduRow
                key={item.id}
                item={item}
                index={i}
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
            <Plus size={14} /> + Add One More
          </button>
        </>
      )}
    </div>
  )
}

function EduRow(props) {
  const controls = useDragControls()
  const { item, index, total, onPatch, onRemove, onMove } = props

  return (
    <Reorder.Item
      value={item}
      layout
      dragListener={false}
      dragControls={controls}
      className="rounded-xl border border-[#E8E4DC] bg-white p-3 shadow-card"
    >
      <div className="mb-2.5 flex items-center gap-2">
        <button
          type="button"
          onPointerDown={(e) => controls.start(e)}
          className="cursor-grab touch-none rounded p-0.5 text-[#B5AFA6] hover:text-[#1A1A1A] active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="18" r="1" />
            <circle cx="15" cy="6" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="18" r="1" />
          </svg>
        </button>
        <GraduationCap size={14} className="text-[#FF5E1A]" />
        <p className="flex-1 truncate text-xs font-semibold text-[#1A1A1A]">
          {item.degree || item.school || `Degree ${index + 1}`}
        </p>
        <ArrowButton title="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </ArrowButton>
        <ArrowButton title="Move down" disabled={index === total - 1} onClick={() => onMove(1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </ArrowButton>
        <ConfirmDelete onConfirm={onRemove} label="Remove education" />
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <Field label="Degree / Program">
          <TextInput
            value={item.degree || ''}
            onChange={(e) => onPatch({ degree: e.target.value })}
            placeholder="e.g. B.S. in Computer Science"
            compact
          />
        </Field>
        <Field label="University / School">
          <TextInput
            value={item.school || ''}
            onChange={(e) => onPatch({ school: e.target.value })}
            placeholder="e.g. Stanford University"
            compact
          />
        </Field>
        <Field label="Graduation Year">
          <TextInput
            value={item.gradYear || ''}
            onChange={(e) => onPatch({ gradYear: e.target.value })}
            placeholder="e.g. 2022"
            compact
          />
        </Field>
        <Field label="GPA / Honors (Optional)">
          <TextInput
            value={item.focus || ''}
            onChange={(e) => onPatch({ focus: e.target.value })}
            placeholder="e.g. Magna Cum Laude · 3.9 GPA"
            compact
          />
        </Field>
      </div>
    </Reorder.Item>
  )
}
