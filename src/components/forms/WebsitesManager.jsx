import { Globe, Plus, Trash2 } from 'lucide-react'
import { useResumeStore } from '../../store/useResumeStore'
import { Field, TextInput } from '../ui/fields'

export function WebsitesManager() {
  const websites = useResumeStore((s) => s.websites || [])
  const add = useResumeStore((s) => () => s.addItem('websites'))
  const update = useResumeStore((s) => (id, patch) => s.updateItem('websites', id, patch))
  const remove = useResumeStore((s) => (id) => s.removeItem('websites', id))

  return (
    <div className="space-y-3">
      {websites.length === 0 ? (
        <button
          type="button"
          onClick={add}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#E8E4DC] bg-white/60 py-6 text-sm font-medium text-[#666055] hover:border-[#FF5E1A]/60 hover:bg-[#FFF3EB]/50 hover:text-[#FF5E1A] transition-all"
        >
          <Plus size={16} className="text-[#FF5E1A]" />
          Add Website or Social Link
        </button>
      ) : (
        <>
          <div className="space-y-2.5">
            {websites.map((w, i) => (
              <div
                key={w.id}
                className="flex items-center gap-2 rounded-lg border border-[#E8E4DC] bg-white p-2.5 shadow-card"
              >
                <Globe size={14} className="shrink-0 text-[#FF5E1A]" />
                <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                  <Field label={i === 0 ? 'Platform / Label' : ''}>
                    <TextInput
                      value={w.label || ''}
                      onChange={(e) => update(w.id, { label: e.target.value })}
                      placeholder="e.g. LinkedIn / Portfolio / GitHub"
                      compact
                    />
                  </Field>
                  <Field label={i === 0 ? 'URL' : ''}>
                    <TextInput
                      value={w.url || ''}
                      onChange={(e) => update(w.id, { url: e.target.value })}
                      placeholder="e.g. linkedin.com/in/username"
                      compact
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={() => remove(w.id)}
                  title="Remove link"
                  className="rounded p-1 text-[#B5AFA6] hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={add}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#E8E4DC] bg-white py-2.5 text-xs font-semibold text-[#666055] hover:border-[#FF5E1A]/70 hover:bg-[#FFF3EB]/40 hover:text-[#FF5E1A] transition-colors"
          >
            <Plus size={14} /> + Add One More
          </button>
        </>
      )}
    </div>
  )
}
