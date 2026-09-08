import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileUp,
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Briefcase,
  GraduationCap,
  Tag,
  FolderGit2,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { parseResumeFile } from '../../lib/parser/resumeParser'
import { useResumeStore } from '../../store/useResumeStore'
import { toast } from '../../store/useUIStore'

export function ImportResumeModal({ open, onClose, onImportSuccess }) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [parsing, setParsing] = useState(false)
  const [parseResult, setParseResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [customTitle, setCustomTitle] = useState('')
  const fileInputRef = useRef(null)

  const resetState = () => {
    setFile(null)
    setParsing(false)
    setParseResult(null)
    setErrorMsg('')
    setCustomTitle('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const processFile = async (uploadedFile) => {
    if (!uploadedFile) return
    setErrorMsg('')
    setParsing(true)
    setFile(uploadedFile)

    try {
      const result = await parseResumeFile(uploadedFile)
      setParseResult(result)
      const initialTitle =
        result.resumeData.basic.fullName && result.resumeData.basic.jobTitle
          ? `${result.resumeData.basic.fullName} - ${result.resumeData.basic.jobTitle}`
          : result.resumeData.basic.fullName
          ? `${result.resumeData.basic.fullName}'s Resume`
          : result.suggestedTitle
      setCustomTitle(initialTitle)
    } catch (err) {
      console.error('Resume parsing failed:', err)
      setErrorMsg(err.message || 'Failed to parse resume file. Please ensure it is a valid text PDF or DOCX.')
      setParseResult(null)
    } finally {
      setParsing(false)
    }
  }

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (f) processFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const f = e.dataTransfer.files?.[0]
    if (f) processFile(f)
  }

  const handleConfirmImport = () => {
    if (!parseResult) return
    try {
      const title = customTitle.trim() || parseResult.suggestedTitle || 'Imported CV'
      const record = useResumeStore.getState().importResume(parseResult.resumeData, title)
      toast(`Successfully imported "${record.title}" into Resume Studio ✨`)
      handleClose()
      if (onImportSuccess) onImportSuccess(record)
    } catch (err) {
      console.error(err)
      toast('Failed to load parsed resume into editor', 'error')
    }
  }

  if (!open) return null

  const data = parseResult?.resumeData

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.18 }}
          className="relative flex flex-col w-full max-w-xl max-h-[90vh] overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white shadow-2xl"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-[#E8E4DC] px-6 py-4 bg-[#FBF9F5]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF3EB] text-[#FF5E1A]">
                <FileUp size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1A1A1A]">Import & Edit Existing CV</h3>
                <p className="text-xs text-[#666055]">Upload PDF or DOCX to auto-populate into live studio</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666055] hover:bg-[#F5F2EC] hover:text-[#1A1A1A] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!parseResult ? (
              <>
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragActive(true)
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-[#FF5E1A] bg-[#FFF3EB]/60 scale-[0.99]'
                      : 'border-[#D6D0C5] bg-[#FBF9F5]/80 hover:border-[#FF5E1A]/70 hover:bg-[#FFF3EB]/30'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {parsing ? (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <Loader2 size={36} className="animate-spin text-[#FF5E1A]" />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-[#1A1A1A]">Parsing Document Layers…</p>
                        <p className="text-xs text-[#666055]">
                          Extracting work history, education, skills, and contact info
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm border border-[#E8E4DC] text-[#FF5E1A] group-hover:scale-105 transition-transform">
                        <Upload size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1A1A1A]">
                          Drop your resume file here, or{' '}
                          <span className="text-[#FF5E1A] underline decoration-2">browse files</span>
                        </p>
                        <p className="mt-1 text-xs text-[#666055]">
                          Supports text-based <span className="font-semibold">.PDF</span> and{' '}
                          <span className="font-semibold">.DOCX</span> documents
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                        <Sparkles size={12} /> 100% Client-side & Private (No cloud upload)
                      </span>
                    </div>
                  )}
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
                    <AlertCircle size={16} className="shrink-0 text-rose-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">Unable to parse file</p>
                      <p className="mt-0.5 text-rose-700 leading-relaxed">{errorMsg}</p>
                    </div>
                  </div>
                )}

                {/* Quick Tips */}
                <div className="rounded-xl border border-[#E8E4DC] bg-[#FBF9F5] p-3.5 text-xs text-[#666055] space-y-1.5">
                  <p className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#FF5E1A]" /> Best Parsing Results
                  </p>
                  <p>• Uses clean text layers from Word or vector PDFs exported from LinkedIn, Canva, or ATS systems.</p>
                  <p>• If your PDF is a flat scanned picture/photo, convert to Word or text-PDF first for full extraction.</p>
                </div>
              </>
            ) : (
              /* Success / Extraction Preview */
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold">Extracted Successfully: </span>
                      <span>{file?.name}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={resetState}
                    className="text-emerald-800 hover:text-emerald-950 underline font-medium text-[11px]"
                  >
                    Upload different file
                  </button>
                </div>

                {/* Editable Resume Title */}
                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A]">Resume Title in Studio</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Software Engineer Resume"
                    className="mt-1 w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] focus:border-[#FF5E1A] focus:outline-none focus:ring-1 focus:ring-[#FF5E1A]/20"
                  />
                </div>

                {/* Preview Cards Grid */}
                <div className="rounded-xl border border-[#E8E4DC] bg-[#FBF9F5] p-4 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#666055]">
                    Detected Profile Coordinates
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="rounded-lg border border-[#E8E4DC] bg-white p-2.5">
                      <span className="text-[10.5px] text-[#666055]">Candidate Name</span>
                      <p className="font-bold text-[#1A1A1A] truncate">{data?.basic?.fullName || '—'}</p>
                    </div>
                    <div className="rounded-lg border border-[#E8E4DC] bg-white p-2.5">
                      <span className="text-[10.5px] text-[#666055]">Target Title</span>
                      <p className="font-bold text-[#1A1A1A] truncate">{data?.basic?.jobTitle || '—'}</p>
                    </div>
                    <div className="rounded-lg border border-[#E8E4DC] bg-white p-2.5">
                      <span className="text-[10.5px] text-[#666055]">Email</span>
                      <p className="font-medium text-[#1A1A1A] truncate">{data?.basic?.email || '—'}</p>
                    </div>
                    <div className="rounded-lg border border-[#E8E4DC] bg-white p-2.5">
                      <span className="text-[10.5px] text-[#666055]">Phone</span>
                      <p className="font-medium text-[#1A1A1A] truncate">{data?.basic?.phone || '—'}</p>
                    </div>
                  </div>

                  {/* Section Badges */}
                  <div className="pt-2 border-t border-[#E8E4DC]/80 flex flex-wrap gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white border border-[#E8E4DC] px-2.5 py-1 font-medium text-[#1A1A1A]">
                      <Briefcase size={12} className="text-[#FF5E1A]" />
                      {data?.experience?.length || 0} Employment Positions
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white border border-[#E8E4DC] px-2.5 py-1 font-medium text-[#1A1A1A]">
                      <GraduationCap size={12} className="text-[#FF5E1A]" />
                      {data?.education?.length || 0} Degrees
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white border border-[#E8E4DC] px-2.5 py-1 font-medium text-[#1A1A1A]">
                      <Tag size={12} className="text-[#FF5E1A]" />
                      {data?.skillGroups?.reduce((acc, g) => acc + (g.items?.length || 0), 0) || 0} Skills
                    </span>
                    {data?.projects?.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white border border-[#E8E4DC] px-2.5 py-1 font-medium text-[#1A1A1A]">
                        <FolderGit2 size={12} className="text-[#FF5E1A]" />
                        {data.projects.length} Projects
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between border-t border-[#E8E4DC] px-6 py-4 bg-[#FBF9F5]">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-[#E8E4DC] bg-white px-4 py-2 text-xs font-semibold text-[#666055] hover:bg-[#F5F2EC] hover:text-[#1A1A1A] transition-colors"
            >
              Cancel
            </button>

            {parseResult && (
              <button
                type="button"
                onClick={handleConfirmImport}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF5E1A] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#E04D0E] active:scale-[0.98] transition-all"
              >
                <span>Load into Live Studio</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ImportResumeModal
