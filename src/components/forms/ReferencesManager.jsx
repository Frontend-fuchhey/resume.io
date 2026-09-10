import { ChevronDown, ChevronUp, Plus, UserCheck, Users } from 'lucide-react'
import { useResumeStore } from '../../store/useResumeStore'
import { ConfirmDelete } from '../ui/ConfirmDelete'
import { Field, TextInput } from '../ui/fields'

export function ReferencesManager() {
  const references = useResumeStore(
    (s) => s.references || { mode: 'upon_request', text: 'References available upon request', items: [] }
  )
  const updateConfig = useResumeStore((s) => s.updateReferencesConfig)
  const addReference = useResumeStore((s) => s.addReference)
  const updateReference = useResumeStore((s) => s.updateReference)
  const removeReference = useResumeStore((s) => s.removeReference)

  const mode = references.mode || 'upon_request'
  const items = references.items || []

  return (
    <div className="space-y-4">
      {/* Mode Selection Tabs */}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#F5F2EC] p-1">
        <button
          type="button"
          onClick={() => updateConfig({ mode: 'upon_request' })}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            mode === 'upon_request'
              ? 'bg-white text-[#1A1A1A] shadow-xs'
              : 'text-[#666055] hover:text-[#1A1A1A]'
          }`}
        >
          <UserCheck size={13} className={mode === 'upon_request' ? 'text-[#FF5E1A]' : ''} />
          Upon Request
        </button>

        <button
          type="button"
          onClick={() => {
            updateConfig({ mode: 'structured' })
            if (items.length === 0) addReference()
          }}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            mode === 'structured'
              ? 'bg-white text-[#1A1A1A] shadow-xs'
              : 'text-[#666055] hover:text-[#1A1A1A]'
          }`}
        >
          <Users size={13} className={mode === 'structured' ? 'text-[#FF5E1A]' : ''} />
          Detailed Referees
        </button>
      </div>

      {mode === 'upon_request' ? (
        <div className="rounded-xl border border-[#E8E4DC] bg-white p-3 space-y-2">
          <Field label="Disclaimer Note" hint="Displayed neatly at the bottom of your resume">
            <TextInput
              value={references.text ?? 'References available upon request'}
              onChange={(e) => updateConfig({ text: e.target.value })}
              compact
            />
          </Field>
          <p className="text-[11px] text-[#666055] italic">
            ATS Recommendation: Stating &ldquo;References available upon request&rdquo; preserves valuable resume space while reassuring employers that verified contacts are ready.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((referee, index) => (
            <div
              key={referee.id}
              className="rounded-xl border border-[#E8E4DC] bg-white p-3 shadow-card transition-all"
            >
              <div className="mb-2.5 flex items-center justify-between border-b border-[#E8E4DC]/60 pb-2">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-[#FF5E1A]" />
                  <span className="text-xs font-semibold text-[#1A1A1A]">
                    {referee.name || `Referee #${index + 1}`}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <ConfirmDelete onConfirm={() => removeReference(referee.id)} label="Remove referee" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <Field label="Full Name">
                  <TextInput
                    value={referee.name || ''}
                    onChange={(e) => updateReference(referee.id, { name: e.target.value })}
                    compact
                  />
                </Field>

                <Field label="Job Title / Position">
                  <TextInput
                    value={referee.role || ''}
                    onChange={(e) => updateReference(referee.id, { role: e.target.value })}
                    compact
                  />
                </Field>

                <Field label="Company / Institution">
                  <TextInput
                    value={referee.company || ''}
                    onChange={(e) => updateReference(referee.id, { company: e.target.value })}
                    compact
                  />
                </Field>

                <Field label="Email Address">
                  <TextInput
                    type="email"
                    value={referee.email || ''}
                    onChange={(e) => updateReference(referee.id, { email: e.target.value })}
                    compact
                  />
                </Field>

                <Field label="Phone Number" className="sm:col-span-2">
                  <TextInput
                    type="tel"
                    value={referee.phone || ''}
                    onChange={(e) => updateReference(referee.id, { phone: e.target.value })}
                    compact
                  />
                </Field>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addReference}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#E8E4DC] bg-white py-2.5 text-xs font-semibold text-[#666055] hover:border-[#FF5E1A]/70 hover:bg-[#FFF3EB]/40 hover:text-[#FF5E1A] transition-colors cursor-pointer"
          >
            <Plus size={14} /> + Add Referee
          </button>
        </div>
      )}
    </div>
  )
}
