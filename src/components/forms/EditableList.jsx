import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { TextInput } from '../ui/fields'
import { cn } from '../../lib/utils'

/**
 * Generic editor for an array of short strings (achievement bullets,
 * skill tags). Reusable everywhere: wizard, side panel, inline.
 */
export function EditableList({ items, onChange, placeholder, addLabel, marker = '•', className, inputClass }) {
  const [focusIdx, setFocusIdx] = useState(null)
  const refs = useRef({})

  useEffect(() => {
    if (focusIdx !== null && refs.current[focusIdx]) {
      refs.current[focusIdx].focus()
      refs.current[focusIdx].select?.()
      setFocusIdx(null)
    }
  }, [focusIdx, items.length])

  const commit = (i, value) => {
    const next = [...items]
    next[i] = value
    onChange(next)
  }
  const addBelow = (i) => {
    const next = [...items]
    next.splice(i + 1, 0, '')
    onChange(next)
    setFocusIdx(i + 1)
  }
  const removeAt = (i) => {
    if (items.length === 1) {
      onChange([''])
      return
    }
    const next = items.filter((_, k) => k !== i)
    onChange(next)
    setFocusIdx(Math.max(0, Math.min(i, next.length - 1)))
  }
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    const [v] = next.splice(i, 1)
    next.splice(j, 0, v)
    onChange(next)
  }
  const onKey = (e, i) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addBelow(i)
    } else if (e.key === 'Backspace' && !e.target.value && items.length > 1 && i > 0) {
      e.preventDefault()
      removeAt(i)
    }
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      {items.map((value, i) => (
        <div key={`${i}-${value}`} className="group flex items-center gap-1.5">
          <span className="w-3 shrink-0 select-none text-center text-xs text-cyan-500/70 dark:text-cyan-400/60">
            {marker}
          </span>
          <TextInput
            ref={(el) => (refs.current[i] = el)}
            value={value}
            onChange={(e) => commit(i, e.target.value)}
            onKeyDown={(e) => onKey(e, i)}
            placeholder={placeholder}
            aria-label={`Line ${i + 1}`}
            className={cn('flex-1 px-2.5 py-1.5 text-[13px] leading-snug', inputClass)}
          />
          <span className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <ArrowUp size={13} className="cursor-pointer rounded p-0.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200" onClick={() => move(i, -1)} />
            <ArrowDown size={13} className="cursor-pointer rounded p-0.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200" onClick={() => move(i, 1)} />
            <Trash2 size={13} className="cursor-pointer rounded p-0.5 text-slate-400 hover:bg-rose-100 hover:text-rose-500 dark:hover:bg-rose-500/20 dark:hover:text-rose-400" onClick={() => removeAt(i)} />
          </span>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addBelow(items.length - 1)}
        className="flex w-full items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/[0.06] hover:text-cyan-500 dark:border-white/15 dark:hover:border-cyan-400/40"
      >
        <Plus size={13} />
        {addLabel || 'Add line'}
      </button>
    </div>
  )
}
