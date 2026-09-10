import { Award, FolderGit2, Plus } from 'lucide-react'
import { Reorder, useDragControls } from 'framer-motion'
import { useResumeStore } from '../../store/useResumeStore'
import { Field, TextArea, TextInput } from '../ui/fields'
import { ArrowButton } from '../ui/primitives'
import { ConfirmDelete } from '../ui/ConfirmDelete'

function useListApi(list) {
  return {
    items: useResumeStore((s) => s[list]),
    add: useResumeStore((s) => () => s.addItem(list)),
    update: useResumeStore((s) => (id, patch) => s.updateItem(list, id, patch)),
    remove: useResumeStore((s) => (id) => s.removeItem(list, id)),
    move: useResumeStore((s) => (id, dir) => s.moveItem(list, id, dir)),
    reorder: useResumeStore((s) => (next) => s.reorderList(list, next)),
  }
}

export { ProjectsManager } from './ProjectsManager'

export function CertsManager() {
  const { items, add, update, remove, move, reorder } = useListApi('certifications')
  return (
    <Collection
      items={items}
      reorder={reorder}
      onAdd={add}
      empty="No certifications yet — AWS, Scrum, language certificates and more."
      addLabel="Add certification"
      renderItem={(item, index, total) => (
        <CertRow
          key={item.id}
          item={item}
          index={index}
          total={total}
          onPatch={(patch) => update(item.id, patch)}
          onRemove={() => remove(item.id)}
          onMove={(dir) => move(item.id, dir)}
        />
      )}
    />
  )
}

/* ---------- Projects ---------- */

function ProjectRow({ item, index, total, onPatch, onRemove, onMove }) {
  const controls = useDragControls()
  return (
    <RowShell controls={controls} index={index} total={total} onMove={onMove} onRemove={onRemove} item={item}>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <Field label="Project Title">
          <TextInput value={item.name} onChange={(e) => onPatch({ name: e.target.value })} compact />
        </Field>
        <Field label="Project / Portfolio Link">
          <TextInput value={item.link} onChange={(e) => onPatch({ link: e.target.value })} compact />
        </Field>
      </div>
      <div className="mt-2">
        <Field label="Description">
          <TextArea value={item.description} onChange={(e) => onPatch({ description: e.target.value })} rows={2} compact />
        </Field>
      </div>
    </RowShell>
  )
}

/* ---------- Certifications ---------- */

function CertRow({ item, index, total, onPatch, onRemove, onMove }) {
  const controls = useDragControls()
  return (
    <RowShell controls={controls} index={index} total={total} onMove={onMove} onRemove={onRemove} item={item}>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_1fr_90px]">
        <Field label="Certification">
          <TextInput value={item.name} onChange={(e) => onPatch({ name: e.target.value })} compact />
        </Field>
        <Field label="Issuer">
          <TextInput value={item.issuer} onChange={(e) => onPatch({ issuer: e.target.value })} compact />
        </Field>
        <Field label="Year">
          <TextInput value={item.year} onChange={(e) => onPatch({ year: e.target.value })} compact />
        </Field>
      </div>
    </RowShell>
  )
}

/* ---------- shared row shell ---------- */

function RowShell({ item, index, total, controls, onMove, onRemove, children }) {
  const isProject = Boolean(item && item.name !== undefined)
  const icon = isProject ? (
    <FolderGit2 size={14} className="text-[#FF5E1A]" />
  ) : (
    <Award size={14} className="text-[#FF5E1A]" />
  )
  const fallback = isProject ? 'Project' : 'Certification'
  return (
    <Reorder.Item
      value={item}
      layout
      dragListener={false}
      dragControls={controls}
      className="rounded-xl border border-[#E8E4DC] bg-white p-3.5 shadow-card"
    >
      <div className="mb-2 flex items-center gap-2">
        <DragGrip controls={controls} />
        {icon}
        <p className="min-w-0 flex-1 truncate text-xs font-semibold text-[#1A1A1A]">
          {item.name || `${fallback} ${index + 1}`}
        </p>
        <ArrowButton title="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
          <ChevSvg d="M6 15l6-6 6 6" />
        </ArrowButton>
        <ArrowButton title="Move down" disabled={index === total - 1} onClick={() => onMove(1)}>
          <ChevSvg d="M6 9l6 6 6-6" />
        </ArrowButton>
        <ConfirmDelete onConfirm={onRemove} label="Remove" />
      </div>
      {children}
    </Reorder.Item>
  )
}

function Collection({ items, reorder, onAdd, empty, addLabel, renderItem }) {
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#E8E4DC] bg-white/60 py-6 text-sm font-medium text-[#666055] hover:border-[#FF5E1A]/60 hover:bg-[#FFF3EB]/50 hover:text-[#FF5E1A] transition-all"
        >
          <Plus size={16} className="text-[#FF5E1A]" />
          {addLabel}
        </button>
      ) : (
        <>
          <Reorder.Group axis="y" values={items} onReorder={reorder} className="space-y-2.5">
            {items.map((item, i) => renderItem(item, i, items.length))}
          </Reorder.Group>
          <button
            type="button"
            onClick={onAdd}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#E8E4DC] bg-white py-2.5 text-xs font-semibold text-[#666055] hover:border-[#FF5E1A]/70 hover:bg-[#FFF3EB]/40 hover:text-[#FF5E1A] transition-colors"
          >
            <Plus size={14} /> + {addLabel}
          </button>
        </>
      )}
    </div>
  )
}

export function DragGrip({ controls }) {
  return (
    <button
      type="button"
      onPointerDown={(e) => controls.start(e)}
      className="cursor-grab touch-none rounded p-0.5 text-[#B5AFA6] hover:text-[#1A1A1A] active:cursor-grabbing"
      aria-label="Drag to reorder"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="6" r="1" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="9" cy="18" r="1" />
        <circle cx="15" cy="6" r="1" />
        <circle cx="15" cy="12" r="1" />
        <circle cx="15" cy="18" r="1" />
      </svg>
    </button>
  )
}

const ChevSvg = ({ d }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
