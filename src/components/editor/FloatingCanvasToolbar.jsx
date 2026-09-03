import { Download, Redo2, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { useResumeStore } from '../../store/useResumeStore'
import { toast } from '../../store/useUIStore'
import { exportResumePdf } from '../../pdf/exportPdf'

export function FloatingCanvasToolbar({
  zoom,
  onZoomChange,
  zoomOptions = ['32%', '50%', '75%', '100%', 'Fit'],
  onDownload,
  isDownloading: externalIsDownloading,
}) {
  const history = useResumeStore((s) => s.history || [])
  const future = useResumeStore((s) => s.future || [])
  const undo = useResumeStore((s) => s.undo)
  const redo = useResumeStore((s) => s.redo)

  const [internalDownloading, setInternalDownloading] = useState(false)
  const isDownloading = externalIsDownloading ?? internalDownloading

  const canUndo = history.length > 0
  const canRedo = future.length > 0

  const handleDownloadPdf = async () => {
    if (isDownloading) return
    if (onDownload) {
      await onDownload()
      return
    }
    setInternalDownloading(true)
    try {
      // Micro-delay (~100-200ms) ensuring DOM repaint and state transitions finish
      await new Promise((resolve) => setTimeout(resolve, 150))
      const resume = useResumeStore.getState()
      const filename = await exportResumePdf(resume)
      toast(`Downloaded ATS resume: ${filename}`)
    } catch (err) {
      console.error(err)
      toast('PDF export failed — please try again', 'error')
    } finally {
      setInternalDownloading(false)
    }
  }

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-[#E8E4DC] bg-white/95 px-2.5 py-1.5 shadow-toolbar backdrop-blur-md">
      {/* Undo / Redo */}
      <div className="flex items-center gap-0.5">
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
      </div>

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

      {/* Primary Download PDF Action */}
      <button
        type="button"
        onClick={handleDownloadPdf}
        disabled={isDownloading}
        className="flex items-center gap-1.5 bg-[#FF5E1A] hover:bg-[#e04e10] active:scale-[0.98] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm transition-all disabled:opacity-60 disabled:pointer-events-none"
      >
        <Download size={14} />
        <span>{isDownloading ? 'Building…' : 'Download'}</span>
      </button>
    </div>
  )
}

