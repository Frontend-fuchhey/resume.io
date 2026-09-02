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

export function ProjectsManager() {
  const { items, add, update, remove, move, reorder } = useListApi('projects')
  return (
    <Collection
      items={items}
      reorder={reorder}
      onAdd={add}
      empty="No projects yet — add open-source work, side products or case studies."
      addLabel="Add project"
      renderItem={(item, index, total) => (
        <ProjectRow
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
        <Field label="Project name">
          <TextInput value={item.name} onChange={(e) => onPatch({ name: e.target.value })} placeholder="Open-source dashboard" compact />
        </Field>
        <Field label="Link / URL">
          <TextInput value={item.link} onChange={(e) => onPatch({ link: e.target.value })} placeholder="github.com/you/repo" compact />
        </Field>
      </div>
      <div className="mt-2">
        <Field label="What did you build or learn?">
          <TextArea value={item.description} onChange={(e) => onPatch({ description: e.target.value })} rows={2} placeholder="One or two crisp sentences with a metric if possible…" compact />
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
          <TextInput value={item.name} onChange={(e) => onPatch({ name: e.target.value })} placeholder="AWS Certified Developer" compact />
        </Field>
        <Field label="Issuer">
          <TextInput value={item.issuer} onChange={(e) => onPatch({ issuer: e.target.value })} placeholder="Amazon Web Services" compact />
        </Field>
        <Field label="Year">
          <TextInput value={item.year} onChange={(e) => onPatch({ year: e.target.value })} placeholder="2024" compact />
        </Field>
      </div>
    </RowShell>
  )
}

/* ---------- shared row shell ---------- */

function RowShell({ item, index, total, controls, onMove, onRemove, children }) {
  const isProject = Boolean(item && item.name !== undefined)
  const icon = isProject ? (
    <FolderGit2 size={14} className="text-cyan-500/80 dark:text-cyan-400/70" />
  ) : (
    <Award size={14} className="text-amber-500/90 dark:text-amber-400/80" />
  )
  const fallback = isProject ? 'Project' : 'Certification'
  return (
    <Reorder.Item
      value={item}
      layout
      dragListener={false}
      dragControls={controls}
      className="rounded-xl border border-slate-200/80 bg-white/70 p-3 dark:border-white/[0.07] dark:bg-white/[0.025]"
    >
      <div className="mb-2 flex items-center gap-1.5">
        <DragGrip controls={controls} />
        {icon}
        <p className="min-w-0 flex-1 truncate text-[13px] font-bold text-slate-700 dark:text-slate-200">
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
        <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-slate-300/80 p-6 text-center dark:border-white/15">
          <p className="text-sm text-slate-500 dark:text-slate-400">{empty}</p>
          <button onClick={onAdd} className="btn-ghost border-dashed !text-xs text-slate-500 dark:text-slate-400">
            <Plus size={14} /> {addLabel}
          </button>
        </div>
      ) : (
        <>
          <Reorder.Group axis="y" values={items} onReorder={reorder} className="space-y-2.5">
            {items.map((item, i) => renderItem(item, i, items.length))}
          </Reorder.Group>
          <button onClick={onAdd} className="btn-ghost w-full border-dashed !py-2 text-slate-500 dark:text-slate-400">
            <Plus size={14} /> {addLabel}
          </button>
        </>
      )}
    </div>
  )
}

export function DragGrip({ controls }) {
  return (
    <button
      onPointerDown={(e) => controls.start(e)}
      className="cursor-grab touch-none rounded p-0.5 text-slate-300 hover:text-cyan-400 active:cursor-grabbing dark:text-slate-600 dark:hover:text-cyan-300"
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
