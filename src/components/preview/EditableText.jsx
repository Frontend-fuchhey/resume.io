import { useLayoutEffect, useRef, useState } from 'react'

/**
 * In-Canvas Direct Text Editing Component
 * Supports two-way real-time data binding with central store without cursor jumps or focus loss.
 */
export function EditableText({
  value = '',
  onChange,
  onBlur,
  placeholder = 'Click to edit...',
  className = '',
  style = {},
  multiline = false,
  as: Component = 'span',
}) {
  const ref = useRef(null)
  const [isFocused, setIsFocused] = useState(false)

  // Initialize and sync external value changes into DOM only if not actively focused
  useLayoutEffect(() => {
    if (ref.current && !isFocused) {
      const currentText = ref.current.innerText || ''
      const targetText = value || ''
      if (currentText !== targetText) {
        ref.current.innerText = targetText
      }
    }
  }, [value, isFocused])

  const handleInput = (e) => {
    if (onChange) {
      const text = e.currentTarget.innerText
      onChange(text)
    }
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    const text = e.currentTarget.innerText.trim()
    if (!text && ref.current) {
      ref.current.innerText = ''
    }
    if (text !== (value || '').trim() && onChange) {
      onChange(text)
    }
    if (onBlur) onBlur(text)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
    } else if (e.key === 'Escape') {
      e.currentTarget.blur()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    const clean = multiline ? text : text.replace(/[\r\n]+/g, ' ')
    document.execCommand('insertText', false, clean)
    if (onChange && ref.current) {
      onChange(ref.current.innerText)
    }
  }

  const isEmpty = !value && !isFocused

  return (
    <Component
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      data-placeholder={placeholder}
      className={`relative inline-block cursor-text rounded px-1 -mx-1 transition-all select-text min-h-[1.2em] min-w-[2ch]
        hover:outline hover:outline-1 hover:outline-[#FF5E1A]/40 hover:bg-[#FF5E1A]/[0.03]
        focus:outline-none focus:ring-2 focus:ring-[#FF5E1A]/50 focus:bg-[#FF5E1A]/[0.04]
        ${isEmpty ? 'text-[#9E988E] italic' : ''}
        ${className}`}
      style={style}
    />
  )
}
