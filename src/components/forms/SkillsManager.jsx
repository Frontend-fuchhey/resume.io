import { useState } from 'react'
import { Plus, Tag, Trash2 } from 'lucide-react'
import { useResumeStore } from '../../store/useResumeStore'
import { TextInput } from '../ui/fields'
import { ConfirmDelete } from '../ui/ConfirmDelete'

export function SkillsManager() {
  const groups = useResumeStore((s) => s.skillGroups || [])
  const addGroup = useResumeStore((s) => s.addSkillGroup)
  const removeGroup = useResumeStore((s) => s.removeSkillGroup)
  const rename = useResumeStore((s) => s.renameSkillGroup)
  const updateSkill = useResumeStore((s) => s.updateSkill)
  const removeSkill = useResumeStore((s) => s.removeSkill)

  return (
    <div className="space-y-3">
      {groups.length === 0 ? (
        <button
          type="button"
          onClick={addGroup}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#E8E4DC] bg-white/60 py-6 text-sm font-medium text-[#666055] hover:border-[#FF5E1A]/60 hover:bg-[#FFF3EB]/50 hover:text-[#FF5E1A] transition-all"
        >
          <Plus size={16} className="text-[#FF5E1A]" />
          Add Skill Category
        </button>
      ) : (
        <>
          <div className="space-y-3">
            {groups.map((g) => (
              <div
                key={g.id}
                className="rounded-xl border border-[#E8E4DC] bg-white p-3 shadow-card"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Tag size={14} className="shrink-0 text-[#FF5E1A]" />
                  <TextInput
                    value={g.label || ''}
                    onChange={(e) => rename(g.id, e.target.value)}
                    placeholder="Category (e.g. Technical Skills, Leadership)"
                    compact
                    className="flex-1 font-medium text-xs"
                  />
                  <span className="shrink-0 rounded-full bg-[#F5F2EC] px-2 py-0.5 text-[10px] font-semibold text-[#666055]">
                    {g.items.filter((t) => t.trim()).length}
                  </span>
                  <ConfirmDelete onConfirm={() => removeGroup(g.id)} label="Remove category" />
                </div>

                <SkillTagEditor
                  tags={g.items}
                  gid={g.id}
                  updateSkill={updateSkill}
                  removeSkill={removeSkill}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addGroup}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#E8E4DC] bg-white py-2.5 text-xs font-semibold text-[#666055] hover:border-[#FF5E1A]/70 hover:bg-[#FFF3EB]/40 hover:text-[#FF5E1A] transition-colors"
          >
            <Plus size={14} /> + Add One More
          </button>
        </>
      )}
    </div>
  )
}

function SkillTagEditor({ tags, gid, updateSkill, removeSkill }) {
  const addSkill = useResumeStore((s) => s.addSkill)

  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      {tags.map((tag, i) => (
        <SkillPill
          key={i}
          value={tag}
          onChange={(v) => updateSkill(gid, i, v)}
          onRemove={() => removeSkill(gid, i)}
        />
      ))}
      <button
        type="button"
        onClick={() => addSkill(gid)}
        className="inline-flex h-6.5 px-2 items-center gap-1 rounded-full border border-dashed border-[#E8E4DC] bg-[#FBF9F5] text-[11px] font-medium text-[#666055] hover:border-[#FF5E1A]/60 hover:text-[#FF5E1A] transition-colors"
        title="Add tag"
      >
        <Plus size={11} />
        <span>Add keyword</span>
      </button>
    </div>
  )
}

function SkillPill({ value, onChange, onRemove }) {
  const [width, setWidth] = useState(Math.max(8, String(value || '').length + 3))

  return (
    <span className="group inline-flex items-center overflow-hidden rounded-full border border-[#E8E4DC] bg-[#FBF9F5] py-0.5 pl-2 pr-1 transition-colors focus-within:border-[#FF5E1A] focus-within:ring-1 focus-within:ring-[#FF5E1A]/20">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setWidth(Math.max(8, e.target.value.length + 3))
        }}
        placeholder="e.g. React"
        spellCheck={false}
        className="bg-transparent py-0.5 text-xs text-[#1A1A1A] outline-none placeholder:text-[#9E988E]"
        style={{ width: `${width}ch` }}
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove tag"
        className="ml-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[#B5AFA6] hover:bg-rose-100 hover:text-rose-600 transition-colors"
      >
        <Trash2 size={10} />
      </button>
    </span>
  )
}
