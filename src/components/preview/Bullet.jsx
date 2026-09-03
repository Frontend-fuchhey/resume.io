import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * Read/write session for the live canvas. Templates stay fully presentational —
 * they consume this context so users can edit bullets directly on the page.
 */
const PreviewCtx = createContext({
  enabled: false,
  getState: () => ({}),
  commitBullet: () => {},
  deleteBullet: () => {},
  addBullet: () => {},
})

export const usePreview = () => useContext(PreviewCtx)

export function PreviewProvider({ enabled, state, commitBullet, deleteBullet, addBullet, children }) {
  const value = {
    enabled,
    state,
    commitBullet: enabled ? commitBullet : () => {},
    deleteBullet: enabled ? deleteBullet : () => {},
    addBullet: enabled ? addBullet : () => {},
  }
  return <PreviewCtx.Provider value={value}>{children}</PreviewCtx.Provider>
}

/**
 * Bullet that behaves like static text until clicked; then it becomes a
 * borderless textarea while the user edits. Used by every template so
 * click-to-edit works identically on all designs.
 */
export function Bullet({
  expId,
  index,
  text,
  marker = '•',
  markerClass,
  className,
  readOnly,
  placeholder,
  style,
  markerStyle,
}) {
  const ctx = usePreview()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const areaRef = useRef(null)
  const interactive = ctx.enabled && !readOnly

  const startEdit = () => {
    setDraft(text)
    setEditing(true)
  }
  const commit = () => {
    ctx.commitBullet(expId, index, draft)
    setEditing(false)
  }
  const cancel = () => {
    setDraft(text)
    setEditing(false)
  }

  useEffect(() => {
    if (editing) {
      areaRef.current?.focus()
      const el = areaRef.current
      if (el) {
        el.style.height = 'auto'
        el.style.height = `${el.scrollHeight + 2}px`
      }
    }
  }, [editing, draft])

  if (!interactive) {
    if (!text.trim()) return null
    return (
      <div className={cn('flex gap-2', className)} style={style}>
        <span className={cn('w-[1ch] shrink-0 select-none', markerClass)} style={markerStyle}>{marker}</span>
        <span className="min-w-0 flex-1">{text}</span>
      </div>
    )
  }

  if (editing) {
    return (
      <div className="group relative -mx-1 rounded-lg bg-amber-50/90 p-1 ring-2 ring-amber-300/70 dark:bg-amber-400/10" style={style}>
        <div className="flex gap-1.5">
          <span className={cn('w-[1ch] shrink-0 select-none pt-1', markerClass)} style={markerStyle}>{marker}</span>
          <textarea
            ref={areaRef}
            rows={1}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = `${e.target.scrollHeight + 2}px`
            }}
            onBlur={commit}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                commit()
              } else if (e.key === 'Escape') cancel()
            }}
            placeholder={placeholder || 'Type an achievement…'}
            className="w-full resize-none border-none bg-transparent text-[inherit] leading-snug outline-none placeholder:text-black/30 dark:placeholder:text-white/25"
          />
        </div>
        <div className="mt-1 flex items-center justify-end gap-1 border-t border-black/10 pt-1 dark:border-white/15">
          <button onMouseDown={(e) => e.preventDefault()} onClick={commit} className="inline-flex items-center gap-1 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-emerald-600">
            <Check size={11} /> Done
          </button>
          <button onMouseDown={(e) => e.preventDefault()} onClick={cancel} className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold text-black/50 hover:bg-black/10 dark:text-white/60 dark:hover:bg-white/10">
            <X size={11} /> Cancel
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              ctx.deleteBullet(expId, index)
              setEditing(false)
            }}
            title="Delete bullet"
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group/bullet relative flex gap-2" onDoubleClick={startEdit} style={style}>
      <span className={cn('w-[1ch] shrink-0 select-none', markerClass)} style={markerStyle}>{marker}</span>
      <span className="min-w-0 flex-1">{text}</span>
      <button
        data-html2canvas-ignore="true"
        onMouseDown={(e) => e.preventDefault()}
        onClick={startEdit}
        title="Edit bullet"
        className="absolute -right-0.5 top-1/2 hidden -translate-y-1/2 items-center rounded-md bg-white/95 p-1 text-slate-400 shadow-sm ring-1 ring-black/10 hover:text-amber-500 group-hover/bullet:inline-flex dark:bg-[#101828] dark:text-slate-400 dark:ring-white/15"
      >
        <Pencil size={10} />
      </button>
    </div>
  )
}

/** Tiny dashed row rendered under each role’s bullet list — adds a bullet on the canvas itself. */
export function AddBulletButton({ expId, label = 'Add bullet', className }) {
  const ctx = usePreview()
  if (!ctx.enabled) return null
  return (
    <button
      data-html2canvas-ignore="true"
      onClick={() => ctx.addBullet(expId)}
      className={cn(
        'mt-1 flex items-center gap-1.5 rounded border border-dashed border-black/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black/35 transition-colors hover:border-cyan-600/70 hover:bg-cyan-500/10 hover:text-cyan-700 dark:border-white/25 dark:text-white/40 dark:hover:text-cyan-200',
        className
      )}
    >
      + {label}
    </button>
  )
}
