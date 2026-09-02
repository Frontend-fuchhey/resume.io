import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export function Field({ label, error, hint, children, className }) {
  return (
    <label className={cn('block text-left', className)}>
      {label && (
        <span className="mb-1 block text-[11px] font-semibold text-[#666055]">
          {label}
        </span>
      )}
      {children}
      {error ? (
        <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[10.5px] text-[#8C857B]">{hint}</span>
      ) : null}
    </label>
  )
}

export const TextInput = forwardRef(function TextInput({ className, invalid, compact, ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        'field',
        compact && '!px-2.5 !py-1.5 !text-xs',
        invalid && 'border-rose-400 focus:border-rose-500 focus:ring-rose-200',
        className
      )}
    />
  )
})

export const TextArea = forwardRef(function TextArea({ className, rows = 3, compact, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      {...props}
      className={cn('field resize-y leading-relaxed', compact && '!px-2.5 !py-1.5 !text-xs', className)}
    />
  )
})

export const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="group inline-flex select-none items-center gap-2 text-xs font-medium text-[#666055] cursor-pointer"
  >
    <span
      className={cn(
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
        checked ? 'bg-[#FF5E1A]' : 'bg-[#E8E4DC]'
      )}
    >
      <span
        className={cn(
          'inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform',
          checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
        )}
      />
    </span>
    {label}
  </button>
)
