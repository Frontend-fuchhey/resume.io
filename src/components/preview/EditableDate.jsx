import { useEffect, useRef, useState } from 'react'
import { Calendar, Check, X } from 'lucide-react'
import { dateRange } from '../../lib/format'
import { EditableText } from './EditableText'

/**
 * Interactive In-Canvas Date Editor
 *
 * Supports:
 * 1. Instant click-to-edit inline typing directly on the canvas
 * 2. Quick calendar picker popover with Start Date, End Date, and "Current" checkbox
 * 3. Bidirectional real-time sync with central store & sidebar form inputs
 */
export function EditableDate({
  item = {},
  onPatch,
  placeholder = 'e.g. 2021 — Present',
  className = '',
  style = {},
}) {
  const [showPicker, setShowPicker] = useState(false)
  const popoverRef = useRef(null)

  const isCurrent = Boolean(item.current)
  const formattedText = item.dateStr || dateRange(item) || ''

  // Close popover when clicking outside
  useEffect(() => {
    if (!showPicker) return
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowPicker(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowPicker(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showPicker])

  const handleInlineChange = (val) => {
    if (!onPatch) return
    const patch = { dateStr: val }
    if (/\b(?:present|current|now)\b/i.test(val)) {
      patch.current = true
    }
    onPatch(patch)
  }

  const handleStartDateChange = (val) => {
    if (!onPatch) return
    onPatch({ startDate: val, dateStr: '' })
  }

  const handleEndDateChange = (val) => {
    if (!onPatch) return
    onPatch({ endDate: val, dateStr: '' })
  }

  const handleCurrentToggle = (checked) => {
    if (!onPatch) return
    onPatch({ current: checked, dateStr: '' })
  }

  return (
    <span className={`group/date relative inline-flex items-center gap-1 ${className}`} style={style}>
      {/* Direct inline typing */}
      <EditableText
        value={formattedText}
        onChange={handleInlineChange}
        placeholder={placeholder}
        className="font-medium"
      />

      {/* Quick structured calendar button */}
      <button
        type="button"
        data-html2canvas-ignore="true"
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.stopPropagation()
          setShowPicker(!showPicker)
        }}
        title="Open date picker popover"
        className="opacity-0 group-hover/date:opacity-100 focus:opacity-100 rounded p-0.5 text-[#8C857B] hover:text-[#1A1A1A] hover:bg-[#F5F2EC] transition-all cursor-pointer select-none"
      >
        <Calendar size={11} />
      </button>

      {/* Date Picker Popover */}
      {showPicker && (
        <div
          ref={popoverRef}
          data-html2canvas-ignore="true"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-1.5 z-50 w-64 rounded-xl border border-[#E8E4DC] bg-white p-3 font-sans shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150 text-left"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E4DC]/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
              <Calendar size={13} className="text-[#244CEC]" />
              <span>Set Dates</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="rounded p-0.5 text-[#8C857B] hover:text-[#1A1A1A] hover:bg-[#F5F2EC] transition-colors"
            >
              <X size={13} />
            </button>
          </div>

          <div className="space-y-2.5 pt-2.5">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#666055] mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={item.startDate ? (item.startDate.length === 7 ? `${item.startDate}-01` : item.startDate) : ''}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full rounded-md border border-[#E8E4DC] bg-[#FBF9F5] px-2 py-1 text-xs text-[#1A1A1A] focus:border-[#244CEC] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#244CEC]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#666055]">
                  End Date
                </label>
                <label className="flex items-center gap-1 text-[10.5px] text-[#666055] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCurrent}
                    onChange={(e) => handleCurrentToggle(e.target.checked)}
                    className="h-3 w-3 rounded text-[#244CEC] accent-[#244CEC]"
                  />
                  <span>Present</span>
                </label>
              </div>
              <input
                type="date"
                disabled={isCurrent}
                value={item.endDate ? (item.endDate.length === 7 ? `${item.endDate}-01` : item.endDate) : ''}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full rounded-md border border-[#E8E4DC] bg-[#FBF9F5] px-2 py-1 text-xs text-[#1A1A1A] disabled:opacity-40 disabled:cursor-not-allowed focus:border-[#244CEC] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#244CEC]"
              />
            </div>

            <div className="flex justify-end pt-1.5 border-t border-[#E8E4DC]/80">
              <button
                type="button"
                onClick={() => setShowPicker(false)}
                className="inline-flex items-center gap-1 rounded bg-[#244CEC] px-2.5 py-1 text-[10.5px] font-semibold text-white shadow-xs hover:bg-[#1B3BBF] transition-colors"
              >
                <Check size={11} strokeWidth={2.5} /> Done
              </button>
            </div>
          </div>
        </div>
      )}
    </span>
  )
}
