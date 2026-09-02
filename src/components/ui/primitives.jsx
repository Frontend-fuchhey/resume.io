import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  className,
  type = 'button',
  ...rest
}) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-5 py-2.5 text-sm rounded-lg',
    icon: 'p-2 rounded-lg',
  }

  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5E1A]/40 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
        sizes[size],
        variant === 'primary' && 'btn-primary',
        variant === 'ghost' && 'btn-ghost',
        variant === 'danger' &&
          'inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300',
        variant === 'subtle' &&
          'inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E8E4DC] bg-white px-2.5 py-1.5 text-xs font-medium text-[#666055] hover:border-[#D6D0C5] hover:text-[#1A1A1A]',
        className
      )}
      {...rest}
    >
      {loading && <Loader2 size={14} className="animate-spin text-current" />}
      {children}
    </motion.button>
  )
}

export function IconButton({ icon: Icon, label, active, className, ...rest }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-[#666055] hover:border-[#E8E4DC] hover:bg-[#F5F2EC] hover:text-[#1A1A1A] transition-colors',
        active && 'border-[#FF5E1A] bg-[#FFF3EB] text-[#FF5E1A]',
        className
      )}
      {...rest}
    >
      <Icon size={16} strokeWidth={2} />
    </motion.button>
  )
}

export function Chip({ children, className, onRemove, accent }) {
  return (
    <span
      className={cn('chip', className)}
      style={accent ? { borderColor: `${accent}40`, color: accent } : undefined}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="-mr-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full text-[#B5AFA6] hover:text-rose-500"
          aria-label="Remove tag"
        >
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  )
}

export function Segmented({ options, value, onChange, className }) {
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-lg border border-[#E8E4DC] bg-[#F5F2EC] p-1', className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all',
            value === opt.value
              ? 'bg-white text-[#1A1A1A] shadow-xs'
              : 'text-[#666055] hover:text-[#1A1A1A]'
          )}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function ArrowButton({ children, onClick, disabled, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="rounded p-1 text-[#B5AFA6] hover:bg-[#F5F2EC] hover:text-[#1A1A1A] disabled:opacity-20 transition-colors"
    >
      {children}
    </button>
  )
}

export function Spinner({ size = 16, className }) {
  return <Loader2 size={size} className={cn('animate-spin text-[#FF5E1A]', className)} />
}
