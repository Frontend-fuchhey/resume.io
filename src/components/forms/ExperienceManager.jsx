import { useRef } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import { Briefcase, CalendarRange, ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from 'lucide-react'
import { useResumeStore } from '../../store/useResumeStore'
import { RichTextToolbar } from './RichTextToolbar'
import { ArrowButton } from '../ui/primitives'
import { Field, TextInput, Toggle } from '../ui/fields'
import { ConfirmDelete } from '../ui/ConfirmDelete'
import { dateRange } from '../../lib/format'

export function ExperienceManager() {
  const items = useResumeStore((s) => s.experience || [])
  const add = useResumeStore((s) => () => s.addItem('experience'))
  const update = useResumeStore((s) => (id, patch) => s.updateItem('experience', id, patch))
  const remove = useResumeStore((s) => (id) => s.removeItem('experience', id))
  const move = useResumeStore((s) => (id, dir) => s.moveItem('experience', id, dir))
  const reorder = useResumeStore((s) => (next) => s.reorderList('experience', next))
  const setBullets = useResumeStore((s) => (id, next) => s.setBullets(id, next))

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <button
          type="button"
          onClick={add}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#E8E4DC] bg-white/60 py-6 text-sm font-medium text-[#666055] hover:border-[#FF5E1A]/60 hover:bg-[#FFF3EB]/50 hover:text-[#FF5E1A] transition-all"
        >
          <Plus size={16} className="text-[#FF5E1A]" />
          Add Employment Position
        </button>
      ) : (
        <>
          <Reorder.Group axis="y" values={items} onReorder={reorder} className="space-y-3">
            {items.map((item, idx) => (
              <ExperienceItem
                key={item.id}
                item={item}
                index={idx}
                total={items.length}
                onPatch={(patch) => update(item.id, patch)}
                onRemove={() => remove(item.id)}
                onMove={(dir) => move(item.id, dir)}
                onBullets={(next) => setBullets(item.id, next)}
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

function ExperienceItem(props) {
  const controls = useDragControls()
  return (
    <Reorder.Item
      value={props.item}
      layout
      dragListener={false}
      dragControls={controls}
      className="rounded-xl border border-[#E8E4DC] bg-white p-3.5 shadow-card"
    >
      <ExperienceCard {...props} controls={controls} />
    </Reorder.Item>
  )
}

function ExperienceCard({ item, index, total, onPatch, onRemove, onMove, onBullets, controls }) {
  const activeBulletRef = useRef(null)
  const bullets = item.bullets && item.bullets.length > 0 ? item.bullets : ['']

  const updateBullet = (i, text) => {
    const next = [...bullets]
    next[i] = text
    onBullets(next)
  }

  const addBullet = () => {
    onBullets([...bullets, ''])
  }

  const removeBullet = (i) => {
    if (bullets.length === 1) {
      onBullets([''])
      return
    }
    onBullets(bullets.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <div className="flex items-center gap-2 pb-2.5">
        <button
          type="button"
          onPointerDown={(e) => controls.start(e)}
          className="cursor-grab touch-none rounded p-0.5 text-[#B5AFA6] hover:text-[#1A1A1A] active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical size={15} />
        </button>
        <Briefcase size={14} className="shrink-0 text-[#FF5E1A]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-[#1A1A1A]">
            {item.role || item.company || `Position ${index + 1}`}
          </p>
          <p className="truncate text-[11px] text-[#666055]">
            {item.company ? `${item.company}${item.location ? ' · ' + item.location : ''}` : 'Position details'}
            {dateRange(item) && ` · ${dateRange(item)}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <ArrowButton title="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
            <ChevronUp size={14} />
          </ArrowButton>
          <ArrowButton title="Move down" disabled={index === total - 1} onClick={() => onMove(1)}>
            <ChevronDown size={14} />
          </ArrowButton>
          <ConfirmDelete onConfirm={onRemove} label="Remove position" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <Field label="Job Title">
          <TextInput
            value={item.role || ''}
            onChange={(e) => onPatch({ role: e.target.value })}
            placeholder="e.g. Senior Software Engineer"
            compact
          />
        </Field>
        <Field label="Employer / Company">
          <TextInput
            value={item.company || ''}
            onChange={(e) => onPatch({ company: e.target.value })}
            placeholder="e.g. Acme Corporation"
            compact
          />
        </Field>
        <Field label="Location">
          <TextInput
            value={item.location || ''}
            onChange={(e) => onPatch({ location: e.target.value })}
            placeholder="e.g. New York, NY (Hybrid)"
            compact
          />
        </Field>
        <div className="flex items-end gap-2">
          <Field label="Start Date" className="flex-1">
            <TextInput
              type="month"
              value={item.startDate || ''}
              onChange={(e) => onPatch({ startDate: e.target.value })}
              compact
            />
          </Field>
          {item.current ? (
            <div className="mb-px flex h-[34px] flex-1 items-center justify-center gap-1 rounded-lg border border-[#D1EED5] bg-[#EBF7EE] text-xs font-medium text-[#1E7E34]">
              <CalendarRange size={12} /> Present
            </div>
          ) : (
            <Field label="End Date" className="flex-1">
              <TextInput
                type="month"
                value={item.endDate || ''}
                onChange={(e) => onPatch({ endDate: e.target.value })}
                compact
              />
            </Field>
          )}
          <div className="pb-1">
            <Toggle checked={Boolean(item.current)} onChange={(v) => onPatch({ current: v })} label="Current" />
          </div>
        </div>
      </div>

      {/* Inline Rich Text Toolbar & Bullets */}
      <div className="mt-3 rounded-lg border border-[#E8E4DC] bg-[#FBF9F5]/80 p-2.5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#666055]">
            Key Responsibilities & Achievements
          </span>
          <RichTextToolbar
            textareaRef={activeBulletRef}
            className="scale-90 origin-right"
          />
        </div>

        <div className="space-y-2">
          {bullets.map((b, i) => (
            <div key={i} className="group flex items-start gap-1.5">
              <span className="mt-2 text-xs text-[#FF5E1A]">▪</span>
              <textarea
                ref={i === 0 ? activeBulletRef : undefined}
                value={b}
                rows={2}
                onChange={(e) => updateBullet(i, e.target.value)}
                placeholder="e.g. Spearheaded frontend refactoring reducing latency by 35%…"
                className="w-full rounded-lg border border-[#E8E4DC] bg-white px-2.5 py-1.5 text-xs text-[#1A1A1A] leading-relaxed placeholder:text-[#9E988E] hover:border-[#D6D0C5] focus:border-[#FF5E1A] focus:outline-none focus:ring-1 focus:ring-[#FF5E1A]/20"
              />
              <button
                type="button"
                onClick={() => removeBullet(i)}
                title="Remove bullet"
                className="mt-1.5 p-1 text-[#B5AFA6] hover:text-rose-600 transition-colors opacity-60 hover:opacity-100"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addBullet}
          className="mt-2 flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-[#FF5E1A] hover:bg-[#FFF3EB] transition-colors"
        >
          <Plus size={12} /> Add achievement bullet
        </button>
      </div>
    </div>
  )
}
