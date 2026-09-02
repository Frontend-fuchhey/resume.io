import { useRef } from 'react'
import { useResumeStore } from '../../store/useResumeStore'
import { Field, TextArea } from '../ui/fields'
import { RichTextToolbar } from './RichTextToolbar'

export function SummaryForm() {
  const summary = useResumeStore((s) => s.basic.summary || '')
  const setBasic = useResumeStore((s) => s.setBasic)
  const textareaRef = useRef(null)

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[#666055]">
          Highlight your core domain, years of expertise, and highest-impact achievements.
        </span>
      </div>

      <RichTextToolbar
        textareaRef={textareaRef}
        onApply={(text) => setBasic({ summary: text })}
      />

      <Field>
        <TextArea
          ref={textareaRef}
          rows={4}
          value={summary}
          onChange={(e) => setBasic({ summary: e.target.value })}
          placeholder="e.g. Lead Engineer with 7+ years of experience scaling distributed systems and web platforms…"
          className="font-sans text-sm leading-relaxed"
        />
      </Field>
    </div>
  )
}
