import { useState } from 'react'
import { ArrowLeft, FileText, Layers, PenTool, UserCircle2 } from 'lucide-react'
import { Brand } from '../brand'
import { ResumeEditor } from './ResumeEditor'
import { TemplateGallery } from './TemplateGallery'
import { PreviewPane } from '../preview/PreviewPane'
import { RightToolbarPane } from './RightToolbarPane'
import { useResumeStore } from '../../store/useResumeStore'
import { toast } from '../../store/useUIStore'
import { exportResumePdf } from '../../pdf/exportPdf'
import { resumeFilename } from '../../lib/names'
import { AboutCreatorModal } from '../AboutCreatorModal'
import { AtsScoreBadge } from './ats'

export function EditorScreen({ onHome }) {
  const resume = useResumeStore()
  const [leftTab, setLeftTab] = useState('create') // 'create' | 'templates'
  const [busy, setBusy] = useState(false)
  const [mobilePane, setMobilePane] = useState('canvas') // 'left' | 'canvas' | 'right'
  const [aboutOpen, setAboutOpen] = useState(false)

  const rawName = resume.basic.fullName?.trim() || ''
  const displayName = rawName || 'Untitled Resume'
  const exportFile = resumeFilename(rawName)

  const handleDownload = async () => {
    if (busy) return
    setBusy(true)
    try {
      const filename = await exportResumePdf(resume)
      toast(`Downloaded vector ATS resume: ${filename}`)
    } catch (err) {
      console.error(err)
      toast('PDF export failed — please try again', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FBF9F5] text-[#1A1A1A] antialiased">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR PANE: Forms & Navigation (Tab Switcher: Create | Templates) */}
      {/* ========================================================================= */}
      <aside
        className={`flex h-full w-full flex-col border-r border-[#E8E4DC] bg-white transition-all lg:w-[410px] lg:shrink-0 ${
          mobilePane === 'left' ? 'flex' : 'hidden lg:flex'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E8E4DC] px-4 py-2.5 bg-[#FBF9F5]/60">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onHome}
              title="Return to Home"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E4DC] bg-white text-[#666055] hover:border-[#FF5E1A] hover:text-[#FF5E1A] transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <Brand size={26} withText={false} />
            <div className="min-w-0 max-w-[180px]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
                <FileText size={12} className="shrink-0 text-[#FF5E1A]" />
                <span className="truncate">{displayName}</span>
              </div>
              <div className="truncate font-mono text-[9px] text-[#666055]">
                {exportFile}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live ATS Score Badge */}
            <AtsScoreBadge />

            {/* ── About Creator button ── */}
            <button
              type="button"
              onClick={() => setAboutOpen(true)}
              title="About Creator"
              aria-label="About Creator"
              className="group flex items-center gap-1.5 rounded-lg border border-[#E5E2DC] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#666055] transition-all hover:border-[#FF5E1A] hover:text-[#FF5E1A] hover:bg-[#FFF3EB]"
            >
              <UserCircle2 size={14} className="shrink-0 transition-colors group-hover:text-[#FF5E1A]" />
              <span className="hidden sm:inline">About</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher at the Top: Create | Templates */}
        <div className="shrink-0 border-b border-[#E8E4DC] p-3 bg-white">
          <div className="grid grid-cols-2 rounded-lg border border-[#E8E4DC] bg-[#F5F2EC] p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLeftTab('create')}
              className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 transition-all ${
                leftTab === 'create'
                  ? 'bg-white text-[#1A1A1A] shadow-sm font-bold'
                  : 'text-[#666055] hover:text-[#1A1A1A]'
              }`}
            >
              <PenTool size={13} className={leftTab === 'create' ? 'text-[#FF5E1A]' : ''} />
              <span>Create</span>
            </button>
            <button
              type="button"
              onClick={() => setLeftTab('templates')}
              className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 transition-all ${
                leftTab === 'templates'
                  ? 'bg-white text-[#1A1A1A] shadow-sm font-bold'
                  : 'text-[#666055] hover:text-[#1A1A1A]'
              }`}
            >
              <Layers size={13} className={leftTab === 'templates' ? 'text-[#FF5E1A]' : ''} />
              <span>Templates</span>
            </button>
          </div>
        </div>

        {/* Tab Body: Accordion Sections (Create) OR Template Gallery (Templates) */}
        <div className="flex-1 overflow-y-auto p-3.5">
          {leftTab === 'create' ? <ResumeEditor /> : <TemplateGallery />}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. CENTER CANVAS PANE: Live Resume Sheet on Anthropic Sand Backdrop       */}
      {/* ========================================================================= */}
      <main
        className={`relative flex h-full flex-1 flex-col overflow-hidden bg-[#FBF9F5] ${
          mobilePane === 'canvas' ? 'flex' : 'hidden lg:flex'
        }`}
      >
        <PreviewPane />
      </main>

      {/* ========================================================================= */}
      {/* 3. RIGHT TOOLBAR PANE: Design & Formatting Controls                       */}
      {/* ========================================================================= */}
      <aside
        className={`h-full w-full flex-col lg:w-[310px] lg:shrink-0 ${
          mobilePane === 'right' ? 'flex' : 'hidden xl:flex'
        }`}
      >
        <RightToolbarPane onDownload={handleDownload} isDownloading={busy} />
      </aside>

      {/* Mobile Bottom Bar for switching panes on small viewports */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-[#E8E4DC] bg-white py-2 lg:hidden">
        <button
          type="button"
          onClick={() => setMobilePane('left')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            mobilePane === 'left' ? 'text-[#FF5E1A]' : 'text-[#666055]'
          }`}
        >
          <PenTool size={16} />
          <span>Editor</span>
        </button>
        <button
          type="button"
          onClick={() => setMobilePane('canvas')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            mobilePane === 'canvas' ? 'text-[#FF5E1A]' : 'text-[#666055]'
          }`}
        >
          <FileText size={16} />
          <span>Canvas</span>
        </button>
        <button
          type="button"
          onClick={() => setMobilePane('right')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            mobilePane === 'right' ? 'text-[#FF5E1A]' : 'text-[#666055]'
          }`}
        >
          <Layers size={16} />
          <span>Design</span>
        </button>
      </div>

      {/* About Creator Modal */}
      <AboutCreatorModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  )
}
