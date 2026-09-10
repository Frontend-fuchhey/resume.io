import { Trash2, Plus } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useResumeStore } from '../../store/useResumeStore'
import { EditableText } from './EditableText'

/**
 * Bullet component that allows direct click-to-edit inline text across all templates.
 * Directly integrates with useResumeStore for seamless real-time syncing.
 */
export function Bullet({
  expId,
  index,
  text = '',
  marker = '•',
  markerClass = '',
  className = '',
  placeholder = 'Add achievement with quantified metrics…',
  style = {},
  markerStyle = {},
}) {
  const updateBullet = useResumeStore((s) => s.updateBullet)
  const removeBullet = useResumeStore((s) => s.removeBullet)

  return (
    <div
      className={cn(
        'group/bullet relative flex items-start gap-2 leading-relaxed transition-colors rounded-sm -ml-1 pl-1 pr-6 hover:bg-black/[0.02]',
        className
      )}
      style={style}
    >
      <span
        className={cn('shrink-0 select-none pt-[1px]', markerClass)}
        style={markerStyle}
      >
        {marker}
      </span>

      <div className="min-w-0 flex-1">
        <EditableText
          multiline
          value={text}
          onChange={(val) => updateBullet(expId, index, val)}
          placeholder={placeholder}
          className="w-full text-left"
        />
      </div>

      {/* Delete bullet button - visible on hover, ignored during pdf export */}
      <button
        type="button"
        data-html2canvas-ignore="true"
        onClick={(e) => {
          e.stopPropagation()
          removeBullet(expId, index)
        }}
        title="Delete bullet"
        className="absolute right-0 top-1 hidden items-center justify-center h-4 w-4 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors group-hover/bullet:flex"
      >
        <Trash2 size={11} />
      </button>
    </div>
  )
}

/** In-canvas Add Bullet button rendered beneath bullet lists */
export function AddBulletButton({ expId, label = 'Add achievement bullet', className = '' }) {
  const addBullet = useResumeStore((s) => s.addBullet)

  return (
    <button
      type="button"
      data-html2canvas-ignore="true"
      onClick={(e) => {
        e.stopPropagation()
        addBullet(expId)
      }}
      className={cn(
        'mt-1.5 inline-flex items-center gap-1 rounded border border-dashed border-slate-300/80 bg-white/50 px-2 py-0.5 text-[9.5px] font-medium text-slate-500 hover:border-[#FF5E1A] hover:bg-[#FFF3EB]/60 hover:text-[#FF5E1A] transition-all cursor-pointer select-none',
        className
      )}
    >
      <Plus size={11} />
      <span>{label}</span>
    </button>
  )
}

