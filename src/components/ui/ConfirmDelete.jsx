import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { cn } from '../../lib/utils'

/** Two-step delete: first click arms, second click confirms. */
export function ConfirmDelete({ onConfirm, label = 'Remove', className }) {
  const [armed, setArmed] = useState(false)
  const [timer, setTimer] = useState(null)

  const click = (e) => {
    e.stopPropagation()
    if (!armed) {
      setArmed(true)
      setTimer(
        setTimeout(() => {
          setArmed(false)
          setTimer(null)
        }, 2600)
      )
      return
    }
    clearTimeout(timer)
    onConfirm()
    setArmed(false)
  }

  return (
    <button
      type="button"
      onClick={click}
      title={armed ? 'Click again to confirm' : label}
      className={cn(
        'inline-flex items-center gap-1 rounded-lg px-1.5 py-1 text-[11px] font-semibold transition-colors',
        armed
          ? 'bg-rose-500 text-white shadow-xs'
          : 'text-[#B5AFA6] hover:bg-rose-50 hover:text-rose-600',
        className
      )}
    >
      <Trash2 size={13} />
      {armed && 'Confirm?'}
    </button>
  )
}
