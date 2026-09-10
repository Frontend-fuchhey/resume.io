import { BookmarkPlus, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { useResumeStore } from '../../store/useResumeStore'
import { ConfirmDelete } from '../ui/ConfirmDelete'
import { Field, TextArea, TextInput } from '../ui/fields'

const PRESET_SECTIONS = [
  'Publications',
  'Volunteering',
  'Patents',
  'Speaking Engagements',
  'Military Service',
  'Leadership',
]

export function CustomSectionsManager() {
  const customSections = useResumeStore((s) => s.customSections || [])
  const addSection = useResumeStore((s) => s.addCustomSection)
  const removeSection = useResumeStore((s) => s.removeCustomSection)
  const updateSection = useResumeStore((s) => s.updateCustomSection)
  const addItem = useResumeStore((s) => s.addCustomItem)
  const updateItem = useResumeStore((s) => s.updateCustomItem)
  const removeItem = useResumeStore((s) => s.removeCustomItem)

  return (
    <div className="space-y-4">
      {/* Preset Quick-Add Pills */}
      <div>
        <p className="mb-2 text-[11px] font-medium text-[#666055]">Quick-Add Section Presets:</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_SECTIONS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => addSection(preset)}
              className="inline-flex items-center gap-1 rounded-full border border-[#E8E4DC] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1A1A1A] hover:border-[#FF5E1A] hover:bg-[#FFF3EB] hover:text-[#FF5E1A] transition-colors cursor-pointer"
            >
              <Plus size={11} className="text-[#FF5E1A]" />
              {preset}
            </button>
          ))}
        </div>
      </div>

      {customSections.length === 0 ? (
        <button
          type="button"
          onClick={() => addSection('Custom Section')}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#E8E4DC] bg-white/60 py-6 text-sm font-medium text-[#666055] hover:border-[#FF5E1A]/60 hover:bg-[#FFF3EB]/50 hover:text-[#FF5E1A] transition-all cursor-pointer"
        >
          <BookmarkPlus size={16} className="text-[#FF5E1A]" />
          Create Custom Section
        </button>
      ) : (
        <div className="space-y-4">
          {customSections.map((sec, secIdx) => (
            <div
              key={sec.id}
              className="rounded-xl border border-[#E8E4DC] bg-white p-3.5 shadow-card transition-all space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#E8E4DC]/60 pb-2.5">
                <div className="flex-1 mr-3">
                  <Field label="Section Heading">
                    <TextInput
                      value={sec.title || ''}
                      onChange={(e) => updateSection(sec.id, { title: e.target.value })}
                      compact
                      className="font-bold text-xs"
                    />
                  </Field>
                </div>
                <ConfirmDelete
                  onConfirm={() => removeSection(sec.id)}
                  label="Delete entire section"
                />
              </div>

              {/* Items within this section */}
              <div className="space-y-2.5 pl-1">
                {(sec.items || []).map((item, itemIdx) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-[#E8E4DC]/80 bg-[#FBF9F5]/70 p-2.5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#8C857B] uppercase tracking-wider">
                        Entry #{itemIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(sec.id, item.id)}
                        className="rounded p-1 text-[#B5AFA6] hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Remove entry"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Field label="Title / Headline" className="sm:col-span-2">
                        <TextInput
                          value={item.title || ''}
                          onChange={(e) => updateItem(sec.id, item.id, { title: e.target.value })}
                          compact
                        />
                      </Field>

                      <Field label="Subtitle / Organization">
                        <TextInput
                          value={item.subtitle || ''}
                          onChange={(e) => updateItem(sec.id, item.id, { subtitle: e.target.value })}
                          compact
                        />
                      </Field>

                      <Field label="Date / Year">
                        <TextInput
                          value={item.date || ''}
                          onChange={(e) => updateItem(sec.id, item.id, { date: e.target.value })}
                          compact
                        />
                      </Field>

                      <Field label="Description / Details" className="sm:col-span-2">
                        <TextArea
                          value={item.description || ''}
                          onChange={(e) => updateItem(sec.id, item.id, { description: e.target.value })}
                          rows={2}
                          compact
                        />
                      </Field>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addItem(sec.id)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#FF5E1A] hover:underline transition-colors cursor-pointer pt-1"
                >
                  <Plus size={12} /> Add entry to {sec.title || 'this section'}
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addSection('Custom Section')}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#E8E4DC] bg-white py-2.5 text-xs font-semibold text-[#666055] hover:border-[#FF5E1A]/70 hover:bg-[#FFF3EB]/40 hover:text-[#FF5E1A] transition-colors cursor-pointer"
          >
            <Plus size={14} /> + Add Another Custom Section
          </button>
        </div>
      )}
    </div>
  )
}
