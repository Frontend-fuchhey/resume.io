import { Heart, Plus, Trash2 } from 'lucide-react'
import { useResumeStore } from '../../store/useResumeStore'
import { TextInput } from '../ui/fields'

export function HobbiesManager() {
  const hobbies = useResumeStore((s) => s.hobbies || [])
  const add = useResumeStore((s) => () => s.addItem('hobbies'))
  const update = useResumeStore((s) => (id, patch) => s.updateItem('hobbies', id, patch))
  const remove = useResumeStore((s) => (id) => s.removeItem('hobbies', id))

  return (
    <div className="space-y-3">
      {hobbies.length === 0 ? (
        <button
          type="button"
          onClick={add}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#E8E4DC] bg-white/60 py-6 text-sm font-medium text-[#666055] hover:border-[#FF5E1A]/60 hover:bg-[#FFF3EB]/50 hover:text-[#FF5E1A] transition-all"
        >
          <Plus size={16} className="text-[#FF5E1A]" />
          Add Hobby or Personal Interest
        </button>
      ) : (
        <>
          <div className="space-y-2">
            {hobbies.map((h) => (
              <div
                key={h.id}
                className="flex items-center gap-2 rounded-lg border border-[#E8E4DC] bg-white p-2 shadow-card"
              >
                <Heart size={14} className="shrink-0 text-[#FF5E1A]" />
                <TextInput
                  value={h.name || ''}
                  onChange={(e) => update(h.id, { name: e.target.value })}
                  placeholder="e.g. Open-source maintainer, Chess, Mountain hiking"
                  compact
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => remove(h.id)}
                  title="Remove hobby"
                  className="rounded p-1 text-[#B5AFA6] hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={13} />
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
