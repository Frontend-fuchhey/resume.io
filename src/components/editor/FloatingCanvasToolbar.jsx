import { Copy, Plus, Redo2, Trash2, Undo2 } from 'lucide-react'
import { useResumeStore } from '../../store/useResumeStore'
import { toast } from '../../store/useUIStore'

export function FloatingCanvasToolbar({ zoom, onZoomChange, zoomOptions = ['32%', '50%', '75%', '100%', 'Fit'] }) {
  const history = useResumeStore((s) => s.history || [])
  const future = useResumeStore((s) => s.future || [])
  const undo = useResumeStore((s) => s.undo)
  const redo = useResumeStore((s) => s.redo)
  const addItem = useResumeStore((s) => s.addItem)
  const duplicateItem = useResumeStore((s) => s.duplicateItem)
  const removeItem = useResumeStore((s) => s.removeItem)
  const activeItem = useResumeStore((s) => s.activeItem)
  const experience = useResumeStore((s) => s.experience || [])

  const canUndo = history.length > 0
  const canRedo = future.length > 0

  const handleAdd = () => {
    addItem('experience')
    toast('Added new position to timeline')
  }

  const handleDuplicate = () => {
    if (activeItem?.list && activeItem?.id) {
      duplicateItem(activeItem.list, activeItem.id)
      toast(`Duplicated ${activeItem.list} item`)
    } else if (experience.length > 0) {
      duplicateItem('experience', experience[experience.length - 1].id)
      toast('Duplicated latest role')
    } else {
      addItem('experience')
      toast('Added new position')
    }
  }

  const handleDelete = () => {
    if (activeItem?.list && activeItem?.id) {
      removeItem(activeItem.list, activeItem.id)
      toast(`Deleted ${activeItem.list} item`)
    } else if (experience.length > 0) {
      removeItem('experience', experience[experience.length - 1].id)
      toast('Removed position')
    }
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-[#E8E4DC] bg-white/95 px-2.5 py-1.5 shadow-toolbar backdrop-blur-md">
      {/* Undo / Redo */}
      <button
        type="button"
        onClick={undo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className="flex h-7 w-7 items-center justify-center rounded-full text-[#1A1A1A] hover:bg-[#F5F2EC] disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <Undo2 size={14} strokeWidth={2.2} />
      </button>

      <button
        type="button"
        onClick={redo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
        className="flex h-7 w-7 items-center justify-center rounded-full text-[#1A1A1A] hover:bg-[#F5F2EC] disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <Redo2 size={14} strokeWidth={2.2} />
      </button>

      <div className="mx-1 h-3.5 w-px bg-[#E8E4DC]" />

      {/* Zoom Dropdown with 32% default or selector */}
      <div className="relative flex items-center">
        <select
          value={zoom}
          onChange={(e) => onZoomChange(e.target.value)}
          aria-label="Canvas Zoom"
          className="cursor-pointer appearance-none rounded-md bg-transparent px-2 py-0.5 text-xs font-semibold text-[#1A1A1A] hover:bg-[#F5F2EC] focus:outline-none transition-colors pr-5"
        >
          {zoomOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-1 text-[9px] text-[#666055]">▼</div>
      </div>

      <div className="mx-1 h-3.5 w-px bg-[#E8E4DC]" />

      {/* Floating Action Box (Add +, Duplicate, Delete) */}
      <div className="flex items-center gap-1 rounded-full bg-[#F5F2EC] px-1 py-0.5">
        <button
          type="button"
          onClick={handleAdd}
          title="Add New Block (+)"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#FF5E1A] shadow-sm hover:bg-[#FFF3EB] transition-colors"
        >
          <Plus size={13} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={handleDuplicate}
          title="Duplicate Selected"
          className="flex h-6 w-6 items-center justify-center rounded-full text-[#666055] hover:bg-white hover:text-[#1A1A1A] transition-colors"
        >
          <Copy size={12} strokeWidth={2.2} />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          title="Delete Selected"
          className="flex h-6 w-6 items-center justify-center rounded-full text-[#666055] hover:bg-white hover:text-rose-600 transition-colors"
        >
          <Trash2 size={12} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}
