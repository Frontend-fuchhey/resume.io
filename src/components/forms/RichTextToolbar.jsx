import { Bold, Italic, Link as LinkIcon, List, Underline } from 'lucide-react'

/**
 * Inline rich text toolbar: Bold, Italic, Underline, Bullet Lists, Link.
 * Applies markdown/HTML annotations around current selection in the bound textarea/input.
 */
export function RichTextToolbar({ textareaRef, onApply, className = '' }) {
  const formatSelection = (type) => {
    const el = textareaRef?.current
    if (!el) return

    const start = el.selectionStart ?? 0
    const end = el.selectionEnd ?? 0
    const text = el.value || ''
    const selected = text.substring(start, end)

    let replacement = ''
    let cursorOffset = 0

    switch (type) {
      case 'bold':
        replacement = `**${selected || 'bold text'}**`
        cursorOffset = selected ? replacement.length : 2
        break
      case 'italic':
        replacement = `*${selected || 'italic text'}*`
        cursorOffset = selected ? replacement.length : 1
        break
      case 'underline':
        replacement = `<u>${selected || 'underlined text'}</u>`
        cursorOffset = selected ? replacement.length : 3
        break
      case 'bullet':
        if (!selected) {
          replacement = '\n• '
          cursorOffset = replacement.length
        } else {
          replacement = selected
            .split('\n')
            .map((line) => (line.startsWith('• ') ? line : `• ${line}`))
            .join('\n')
          cursorOffset = replacement.length
        }
        break
      case 'link':
        const url = prompt('Enter URL:', 'https://')
        if (!url) return
        replacement = `[${selected || 'link text'}](${url})`
        cursorOffset = replacement.length
        break
      default:
        return
    }

    const nextValue = text.substring(0, start) + replacement + text.substring(end)
    if (onApply) {
      onApply(nextValue)
    } else {
      el.value = nextValue
      el.dispatchEvent(new Event('input', { bubbles: true }))
    }

    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + cursorOffset, start + cursorOffset)
    }, 10)
  }

  return (
    <div className={`flex items-center gap-1 rounded-md border border-[#E8E4DC] bg-[#FBF9F5] p-1 text-[#666055] ${className}`}>
      <button
        type="button"
        onClick={() => formatSelection('bold')}
        title="Bold"
        className="flex h-6 w-6 items-center justify-center rounded hover:bg-white hover:text-[#1A1A1A] transition-colors"
      >
        <Bold size={13} strokeWidth={2.5} />
      </button>
      <button
        type="button"
        onClick={() => formatSelection('italic')}
        title="Italic"
        className="flex h-6 w-6 items-center justify-center rounded hover:bg-white hover:text-[#1A1A1A] transition-colors"
      >
        <Italic size={13} strokeWidth={2.2} />
      </button>
      <button
        type="button"
        onClick={() => formatSelection('underline')}
        title="Underline"
        className="flex h-6 w-6 items-center justify-center rounded hover:bg-white hover:text-[#1A1A1A] transition-colors"
      >
        <Underline size={13} strokeWidth={2.2} />
      </button>
      <div className="mx-0.5 h-3.5 w-px bg-[#E8E4DC]" />
      <button
        type="button"
        onClick={() => formatSelection('bullet')}
        title="Bullet List"
        className="flex h-6 w-6 items-center justify-center rounded hover:bg-white hover:text-[#1A1A1A] transition-colors"
      >
        <List size={13} strokeWidth={2.2} />
      </button>
      <button
        type="button"
        onClick={() => formatSelection('link')}
        title="Link"
        className="flex h-6 w-6 items-center justify-center rounded hover:bg-white hover:text-[#1A1A1A] transition-colors"
      >
        <LinkIcon size={13} strokeWidth={2.2} />
      </button>
    </div>
  )
}
