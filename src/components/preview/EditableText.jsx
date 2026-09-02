import { useEffect, useRef, useState } from 'react'

/**
 * In-Canvas Direct Text Editing Component
 * Supports two-way data binding with central store without cursor jumps or focus loss.
 */
export function EditableText({
  value = '',
  onChange,
  placeholder = 'Click to edit...',
  className = '',
  style = {},
  multiline = false,
  as: Component = 'span',
}) {
  const ref = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const isInternalChange = useRef(false)

  // Sync external value changes into DOM only if not actively focused
  useEffect(() => {
    if (ref.current && !isFocused) {
      if (ref.current.innerText !== (value || '')) {
        ref.current.innerText = value || ''
      }
    }
  }, [value, isFocused])

  const handleBlur = (e) => {
    setIsFocused(false)
    const text = e.currentTarget.innerText.trim()
    if (text !== value && onChange) {
      isInternalChange.current = true
      onChange(text)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
    }
  }

  const isEmpty = !value && !isFocused

  return (
    <Component
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      className={`relative inline-block cursor-text rounded px-1 -mx-1 transition-colors select-text
        hover:bg-[#FF5E1A]/10 hover:outline hover:outline-1 hover:outline-[#FF5E1A]/30
        focus:outline-none focus:ring-2 focus:ring-[#FF5E1A]/40 focus:bg-[#FF5E1A]/5
        ${isEmpty ? 'text-[#9E988E] italic' : ''}
        ${className}`}
      style={style}
    >
      {isEmpty ? placeholder : value}
    </Component>
  )
}
