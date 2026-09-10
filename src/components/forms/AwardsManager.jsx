import { ChevronDown, ChevronUp, Plus, Trophy } from 'lucide-react'
import { useResumeStore } from '../../store/useResumeStore'
import { ConfirmDelete } from '../ui/ConfirmDelete'
import { Field, TextArea, TextInput } from '../ui/fields'

export function AwardsManager() {
  const awards = useResumeStore((s) => s.awards || [])
  const addItem = useResumeStore((s) => s.addItem)
  const updateItem = useResumeStore((s) => s.updateItem)
  const removeItem = useResumeStore((s) => s.removeItem)
  const moveItem = useResumeStore((s) => s.moveItem)

  const add = () => addItem('awards')

  return (
    <div className="space-y-3">
      {awards.length === 0 ? (
        <button
          type="button"
          onClick={add}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#E8E4DC] bg-white/60 py-6 text-sm font-medium text-[#666055] hover:border-[#FF5E1A]/60 hover:bg-[#FFF3EB]/50 hover:text-[#FF5E1A] transition-all cursor-pointer"
        >
          <Plus size={16} className="text-[#FF5E1A]" />
          Add Award or Honor
        </button>
      ) : (
        <>
          <div className="space-y-3">
            {awards.map((award, index) => (
              <div
                key={award.id}
                className="rounded-xl border border-[#E8E4DC] bg-white p-3 shadow-card transition-all"
              >
                <div className="mb-2.5 flex items-center justify-between border-b border-[#E8E4DC]/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Trophy size={14} className="text-[#FF5E1A]" />
                    <span className="text-xs font-semibold text-[#1A1A1A]">
                      {award.title || `Award #${index + 1}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveItem('awards', award.id, -1)}
                      title="Move up"
                      className="flex h-6 w-6 items-center justify-center rounded text-[#B5AFA6] hover:bg-[#F5F2EC] hover:text-[#1A1A1A] disabled:opacity-20 transition-colors"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={index === awards.length - 1}
                      onClick={() => moveItem('awards', award.id, 1)}
                      title="Move down"
                      className="flex h-6 w-6 items-center justify-center rounded text-[#B5AFA6] hover:bg-[#F5F2EC] hover:text-[#1A1A1A] disabled:opacity-20 transition-colors"
                    >
                      <ChevronDown size={13} />
                    </button>
                    <ConfirmDelete onConfirm={() => removeItem('awards', award.id)} label="Remove award" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <Field label="Award / Honor Title" className="sm:col-span-2">
                    <TextInput
                      value={award.title || ''}
                      onChange={(e) => updateItem('awards', award.id, { title: e.target.value })}
                      compact
                    />
                  </Field>

                  <Field label="Issuer / Organization">
                    <TextInput
                      value={award.issuer || ''}
                      onChange={(e) => updateItem('awards', award.id, { issuer: e.target.value })}
                      compact
                    />
                  </Field>

                  <Field label="Date / Year">
                    <TextInput
                      value={award.date || ''}
                      onChange={(e) => updateItem('awards', award.id, { date: e.target.value })}
                      compact
                    />
                  </Field>

                  <Field label="Summary / Scope" className="sm:col-span-2">
                    <TextArea
                      value={award.description || ''}
                      onChange={(e) => updateItem('awards', award.id, { description: e.target.value })}
                      rows={2}
                      compact
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={add}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#E8E4DC] bg-white py-2.5 text-xs font-semibold text-[#666055] hover:border-[#FF5E1A]/70 hover:bg-[#FFF3EB]/40 hover:text-[#FF5E1A] transition-colors cursor-pointer"
          >
            <Plus size={14} /> + Add One More Award
          </button>
        </>
      )}
    </div>
  )
}
