import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Check,
  Edit3,
  FileText,
  FileUp,
  FolderOpen,
  Layers,
  Loader2,
  PenTool,
  Plus,
  UserCircle2,
} from 'lucide-react'
import logoImg from '../../assets/resume-logo.png'
import { ResumeEditor } from './ResumeEditor'
import { TemplateGallery } from './TemplateGallery'
import { PreviewPane } from '../preview/PreviewPane'
import { RightToolbarPane } from './RightToolbarPane'
import { useResumeStore } from '../../store/useResumeStore'
import { toast } from '../../store/useUIStore'
import { exportResumePdf } from '../../pdf/exportPdf'
import { resumeFilename } from '../../lib/names'
import { AboutCreatorModal } from '../AboutCreatorModal'
import { ImportResumeModal } from '../modals/ImportResumeModal'
import { SavedResumesModal } from '../modals/SavedResumesModal'

export function EditorScreen({ onHome }) {
  const navigate = (path = '/') => {
    if (onHome) onHome()
    else window.location.href = path
  }
  const resume = useResumeStore()
  const resumeTitle = useResumeStore((s) => s.resumeTitle)
  const setResumeTitle = useResumeStore((s) => s.setResumeTitle)
  const isSaving = useResumeStore((s) => s.isSaving)

  const [leftTab, setLeftTab] = useState('create') // 'create' | 'templates'
  const [busy, setBusy] = useState(false)
  const [mobilePane, setMobilePane] = useState('canvas') // 'left' | 'canvas' | 'right'
  const [aboutOpen, setAboutOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState('')

  const rawName = resume.basic.fullName?.trim() || ''
  const displayName = rawName || 'Untitled Resume'
  const exportFile = resumeFilename(rawName)

  useEffect(() => {
    setTitleInput(resumeTitle || displayName)
  }, [resumeTitle, displayName])

  const handleDownload = async () => {
    if (busy) return
    setBusy(true)
    try {
      if (mobilePane !== 'canvas') {
        setMobilePane('canvas')
      }
      // Micro-delay (~100-200ms) ensuring DOM repaint and state transitions finish
      await new Promise((resolve) => setTimeout(resolve, 150))
      const filename = await exportResumePdf(resume)
      toast(`Downloaded ATS resume: ${filename}`)
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
        className={`flex h-full w-full flex-col border-r border-[#E8E4DC] bg-white transition-all lg:w-[420px] lg:shrink-0 ${
          mobilePane === 'left' ? 'flex' : 'hidden lg:flex'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="flex shrink-0 flex-col border-b border-[#E8E4DC] bg-[#FBF9F5]/70">
          <div className="flex items-center justify-between px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onHome}
                title="Return to Home"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E4DC] bg-white text-[#666055] hover:border-[#FF5E1A] hover:text-[#FF5E1A] transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <img
                src={logoImg}
                alt="resume.io"
                className="h-7 w-auto object-contain cursor-pointer"
                onClick={() => navigate('/')}
              />
            </div>

            {/* Quick Action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setHistoryOpen(true)}
                title="My Resumes & History"
                className="inline-flex items-center gap-1 rounded-lg border border-[#E5E2DC] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1A1A1A] hover:border-[#FF5E1A] hover:text-[#FF5E1A] hover:bg-[#FFF3EB] transition-all shadow-xs"
              >
                <FolderOpen size={13} className="text-[#FF5E1A]" />
                <span className="hidden sm:inline">My Resumes</span>
              </button>

              <button
                type="button"
                onClick={() => setImportOpen(true)}
                title="Import / Edit Existing CV (.pdf, .docx)"
                className="inline-flex items-center gap-1 rounded-lg border border-[#E5E2DC] bg-white px-2 py-1 text-[11px] font-semibold text-[#1A1A1A] hover:border-[#FF5E1A] hover:text-[#FF5E1A] hover:bg-[#FFF3EB] transition-all shadow-xs"
              >
                <FileUp size={13} className="text-[#FF5E1A]" />
                <span className="hidden sm:inline">Import</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  useResumeStore.getState().newResume('ats-studio')
                  toast('Created new blank resume canvas')
                }}
                title="Create New Resume"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E5E2DC] bg-white text-[#666055] hover:border-[#FF5E1A] hover:text-[#FF5E1A] hover:bg-[#FFF3EB] transition-all shadow-xs"
              >
                <Plus size={14} />
              </button>

              <button
                type="button"
                onClick={() => setAboutOpen(true)}
                title="About Creator"
                aria-label="About Creator"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E5E2DC] bg-white text-[#666055] hover:border-[#FF5E1A] hover:text-[#FF5E1A] transition-all shadow-xs"
              >
                <UserCircle2 size={14} />
              </button>
            </div>
          </div>

          {/* Active Status Bar: Editing [Title] + Auto-save indicator */}
          <div className="flex items-center justify-between border-t border-[#E8E4DC]/80 bg-white px-3.5 py-1.5">
            <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-2">
              <span className="text-[10.5px] font-semibold text-[#8C857B] shrink-0">Editing:</span>
              {editingTitle ? (
                <input
                  autoFocus
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={() => {
                    if (titleInput.trim()) setResumeTitle(titleInput.trim())
                    setEditingTitle(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (titleInput.trim()) setResumeTitle(titleInput.trim())
                      setEditingTitle(false)
                    }
                    if (e.key === 'Escape') setEditingTitle(false)
                  }}
                  className="rounded border border-[#FF5E1A] px-1.5 py-0.5 text-xs font-bold text-[#1A1A1A] outline-none w-full"
                />
              ) : (
                <div
                  onClick={() => {
                    setTitleInput(resumeTitle || displayName)
                    setEditingTitle(true)
                  }}
                  title="Click to rename resume"
                  className="group/title flex items-center gap-1 cursor-pointer truncate max-w-[210px]"
                >
                  <span className="truncate text-xs font-bold text-[#1A1A1A] group-hover/title:text-[#FF5E1A] transition-colors">
                    {resumeTitle || displayName}
                  </span>
                  <Edit3
                    size={11}
                    className="shrink-0 text-[#8C857B] opacity-0 group-hover/title:opacity-100 transition-opacity"
                  />
                </div>
              )}
            </div>

            {/* Save Status */}
            <div className="flex items-center gap-1 text-[10.5px] shrink-0">
              {isSaving ? (
                <span className="flex items-center gap-1 text-[#8C857B]">
                  <Loader2 size={11} className="animate-spin text-[#FF5E1A]" />
                  Saving…
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Check size={11} strokeWidth={2.5} />
                  Saved
                </span>
              )}
            </div>
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
        <PreviewPane
          onDownload={handleDownload}
          isDownloading={busy}
          onOpenImport={() => setImportOpen(true)}
          onOpenHistory={() => setHistoryOpen(true)}
        />
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

      {/* Modals */}
      <AboutCreatorModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <ImportResumeModal open={importOpen} onClose={() => setImportOpen(false)} />
      <SavedResumesModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onOpenImport={() => setImportOpen(true)}
      />
    </div>
  )
}
