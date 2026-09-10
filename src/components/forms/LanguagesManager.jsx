import { ChevronDown, ChevronUp, Languages, Plus } from 'lucide-react'
import { useResumeStore } from '../../store/useResumeStore'
import { ConfirmDelete } from '../ui/ConfirmDelete'
import { Field, TextInput } from '../ui/fields'

const PROFICIENCY_LEVELS = [
  { label: 'Native / Bilingual', rating: 5 },
  { label: 'Fluent / Full Professional (C2)', rating: 4 },
  { label: 'Advanced / Professional Working (C1)', rating: 3 },
  { label: 'Intermediate (B1/B2)', rating: 2 },
  { label: 'Beginner / Elementary (A1/A2)', rating: 1 },
]

export function LanguagesManager() {
  const languages = useResumeStore((s) => s.languages || [])
  const addItem = useResumeStore((s) => s.addItem)
  const updateItem = useResumeStore((s) => s.updateItem)
  const removeItem = useResumeStore((s) => s.removeItem)
  const moveItem = useResumeStore((s) => s.moveItem)

  const add = () => addItem('languages')

  return (
    <div className="space-y-3">
      {languages.length === 0 ? (
        <button
          type="button"
          onClick={add}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#E8E4DC] bg-white/60 py-6 text-sm font-medium text-[#666055] hover:border-[#FF5E1A]/60 hover:bg-[#FFF3EB]/50 hover:text-[#FF5E1A] transition-all cursor-pointer"
        >
          <Plus size={16} className="text-[#FF5E1A]" />
          Add Language
        </button>
      ) : (
        <>
          <div className="space-y-2.5">
            {languages.map((lang, index) => (
              <div
                key={lang.id}
                className="rounded-xl border border-[#E8E4DC] bg-white p-3 shadow-card transition-all"
              >
                <div className="mb-2.5 flex items-center justify-between border-b border-[#E8E4DC]/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Languages size={14} className="text-[#FF5E1A]" />
                    <span className="text-xs font-semibold text-[#1A1A1A]">
                      {lang.name || `Language #${index + 1}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveItem('languages', lang.id, -1)}
                      title="Move up"
                      className="flex h-6 w-6 items-center justify-center rounded text-[#B5AFA6] hover:bg-[#F5F2EC] hover:text-[#1A1A1A] disabled:opacity-20 transition-colors"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={index === languages.length - 1}
                      onClick={() => moveItem('languages', lang.id, 1)}
                      title="Move down"
                      className="flex h-6 w-6 items-center justify-center rounded text-[#B5AFA6] hover:bg-[#F5F2EC] hover:text-[#1A1A1A] disabled:opacity-20 transition-colors"
                    >
                      <ChevronDown size={13} />
                    </button>
                    <ConfirmDelete onConfirm={() => removeItem('languages', lang.id)} label="Remove language" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 items-start">
                  <Field label="Language">
                    <TextInput
                      value={lang.name || ''}
                      onChange={(e) => updateItem('languages', lang.id, { name: e.target.value })}
                      compact
                    />
                  </Field>

                  <Field label="Proficiency Level">
                    <select
                      value={lang.level || 'Fluent'}
                      onChange={(e) => {
                        const level = e.target.value
                        const matched = PROFICIENCY_LEVELS.find((p) => p.label === level)
                        updateItem('languages', lang.id, {
                          level,
                          rating: matched ? matched.rating : lang.rating || 4,
                        })
                      }}
                      className="w-full rounded-lg border border-[#E8E4DC] bg-white px-2.5 py-1.5 text-xs text-[#1A1A1A] focus:border-[#FF5E1A] focus:outline-none focus:ring-1 focus:ring-[#FF5E1A]/20"
                    >
                      {PROFICIENCY_LEVELS.map((p) => (
                        <option key={p.label} value={p.label}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Interactive 5-dot proficiency rating */}
                <div className="mt-3 flex items-center justify-between rounded-lg bg-[#FBF9F5] px-3 py-2 border border-[#E8E4DC]/70">
                  <span className="text-[11px] font-medium text-[#666055]">Proficiency Score (1–5)</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((dot) => {
                      const active = (lang.rating || 4) >= dot
                      return (
                        <button
                          key={dot}
                          type="button"
                          onClick={() => updateItem('languages', lang.id, { rating: dot })}
                          title={`Set proficiency rating: ${dot}/5`}
                          className={`h-4 w-4 rounded-full transition-all cursor-pointer flex items-center justify-center text-[9px] font-bold ${
                            active
                              ? 'bg-[#FF5E1A] text-white shadow-xs scale-105'
                              : 'bg-[#E8E4DC] text-[#8C857B] hover:bg-[#D6D0C5]'
                          }`}
                        >
                          {dot}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={add}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#E8E4DC] bg-white py-2.5 text-xs font-semibold text-[#666055] hover:border-[#FF5E1A]/70 hover:bg-[#FFF3EB]/40 hover:text-[#FF5E1A] transition-colors cursor-pointer"
          >
            <Plus size={14} /> + Add One More Language
          </button>
        </>
      )}
    </div>
  )
}
