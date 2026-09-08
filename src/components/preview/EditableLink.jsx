import { useEffect, useRef, useState } from 'react'
import { ExternalLink, Check, Trash2, Globe, Link2, X } from 'lucide-react'
import { cleanUrl, toHref } from '../../lib/format'

/**
 * Interactive In-Canvas Hyperlink Component
 *
 * Features:
 * - Styled with primary accent color and visible underline
 * - Normal click: Opens inline URL editing popover with live store sync
 * - Alt / Cmd + Click: Instantly opens external link in a new tab
 * - Hover action badge with quick "Test Link ↗" button
 */
export function EditableLink({
  url = '',
  label = '',
  onChange,
  onDelete,
  placeholder = 'Add link URL...',
  accentColor = '#244CEC',
  className = '',
  style = {},
  showLabelInput = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [draftUrl, setDraftUrl] = useState(url || '')
  const [draftLabel, setDraftLabel] = useState(label || '')
  const popoverRef = useRef(null)
  const inputRef = useRef(null)

  // Sync external changes
  useEffect(() => {
    setDraftUrl(url || '')
  }, [url])

  useEffect(() => {
    setDraftLabel(label || '')
  }, [label])

  // Focus URL input when popover opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 50)
    }
  }, [isOpen])

  // Handle click outside to close popover
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleLinkClick = (e) => {
    // Alt + Click or Cmd/Ctrl + Click -> Open external link directly
    if (e.altKey || e.metaKey || e.ctrlKey) {
      e.preventDefault()
      e.stopPropagation()
      if (url) {
        window.open(toHref(url), '_blank', 'noopener,noreferrer')
      }
      return
    }

    // Normal Click -> Open inline editing popover
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(true)
  }

  const handleTestLink = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const target = draftUrl || url
    if (target) {
      window.open(toHref(target), '_blank', 'noopener,noreferrer')
    }
  }

  const handleUrlChange = (newUrl) => {
    setDraftUrl(newUrl)
    if (onChange) {
      if (showLabelInput) {
        onChange({ url: newUrl, label: draftLabel })
      } else {
        onChange(newUrl)
      }
    }
  }

  const handleLabelChange = (newLabel) => {
    setDraftLabel(newLabel)
    if (onChange) {
      onChange({ url: draftUrl, label: newLabel })
    }
  }

  const handleDone = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
  }

  const displayText = cleanUrl(url) || placeholder
  const isEmpty = !url

  return (
    <span
      className="relative inline-block align-baseline"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Hyperlink */}
      <a
        href={url ? toHref(url) : '#'}
        onClick={handleLinkClick}
        className={`inline-flex items-center gap-1 font-mono transition-all select-text cursor-pointer rounded px-1 -mx-1
          ${isEmpty ? 'text-[#9E988E] italic border-b border-dashed border-[#9E988E]/50' : 'underline decoration-1 underline-offset-2 hover:decoration-2'}
          hover:bg-[#244CEC]/10 hover:outline hover:outline-1 hover:outline-[#244CEC]/30
          focus:outline-none focus:ring-2 focus:ring-[#244CEC]/50
          ${className}`}
        style={{ color: isEmpty ? '#9E988E' : accentColor, ...style }}
        title={url ? `Alt+Click to open: ${url}` : 'Click to add URL'}
      >
        <span>{displayText}</span>
      </a>

      {/* Hover Action Badge */}
      {isHovered && !isOpen && url && (
        <span
          data-html2canvas-ignore="true"
          className="pointer-events-auto absolute left-0 -top-8 z-30 flex items-center gap-1.5 rounded-md border border-[#E8E4DC] bg-white/95 px-2 py-0.5 text-[10px] font-sans font-medium text-[#1A1A1A] shadow-md backdrop-blur-xs select-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
        >
          <span className="text-[9px] text-[#8C857B]">Alt+Click to open</span>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleTestLink}
            className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9.5px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <ExternalLink size={10} /> Test
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(true)
            }}
            className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9.5px] font-semibold text-[#FF5E1A] hover:bg-[#FFF3EB] transition-colors"
          >
            Edit
          </button>
        </span>
      )}

      {/* Inline URL Editing Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          data-html2canvas-ignore="true"
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-full mt-1.5 z-50 w-72 rounded-xl border border-[#E8E4DC] bg-white p-3 font-sans shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E4DC]/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
              <Link2 size={13} className="text-[#244CEC]" />
              <span>Edit Hyperlink</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded p-0.5 text-[#8C857B] hover:text-[#1A1A1A] hover:bg-[#F5F2EC] transition-colors"
            >
              <X size={13} />
            </button>
          </div>

          <div className="space-y-2.5 pt-2.5 text-left">
            {showLabelInput && (
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#666055] mb-1">
                  Label / Platform
                </label>
                <input
                  type="text"
                  value={draftLabel}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  placeholder="e.g. GitHub, LinkedIn, Portfolio"
                  className="w-full rounded-md border border-[#E8E4DC] bg-[#FBF9F5] px-2.5 py-1.5 text-xs text-[#1A1A1A] placeholder:text-[#9E988E] focus:border-[#244CEC] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#244CEC]"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#666055] mb-1">
                Destination URL
              </label>
              <div className="relative flex items-center">
                <Globe size={13} className="absolute left-2.5 text-[#8C857B] pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={draftUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleDone(e)
                  }}
                  placeholder="e.g. https://github.com/username"
                  className="w-full rounded-md border border-[#E8E4DC] bg-[#FBF9F5] pl-8 pr-2.5 py-1.5 text-xs font-mono text-[#1A1A1A] placeholder:text-[#9E988E] focus:border-[#244CEC] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#244CEC]"
                />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E8E4DC]/80">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleTestLink}
                  disabled={!draftUrl}
                  className="inline-flex items-center gap-1 rounded bg-[#F5F2EC] px-2 py-1 text-[10.5px] font-semibold text-[#1A1A1A] hover:bg-[#E8E4DC] disabled:opacity-40 transition-colors"
                >
                  <ExternalLink size={11} /> Test Link
                </button>
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      onDelete()
                      setIsOpen(false)
                    }}
                    className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-[10.5px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove Link"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleDone}
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
