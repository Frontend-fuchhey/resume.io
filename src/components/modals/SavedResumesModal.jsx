import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  Copy,
  FileText,
  Plus,
  Trash2,
  X,
  Check,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  FolderOpen,
  Sparkles,
  Edit2,
  AlertTriangle,
} from 'lucide-react'
import {
  getResumeHistory,
  duplicateResumeRecord,
  deleteResumeRecord,
  saveResumeRecord,
} from '../../lib/resumeHistory'
import { useResumeStore } from '../../store/useResumeStore'
import { toast } from '../../store/useUIStore'

/** Format ISO timestamp to relative time or date */
function formatTimeAgo(isoString) {
  if (!isoString) return 'Recently'
  try {
    const d = new Date(isoString)
    const now = new Date()
    const diffSec = Math.floor((now - d) / 1000)

    if (diffSec < 60) return 'Just now'
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`

    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  } catch {
    return 'Recently'
  }
}

export function SavedResumesModal({ open, onClose, onSelectResume, onCreateNew, onOpenImport }) {
  const [resumes, setResumes] = useState([])
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [editingTitleId, setEditingTitleId] = useState(null)
  const [tempTitle, setTempTitle] = useState('')

  const activeId = useResumeStore((s) => s.activeResumeId)

  // Refresh history on open
  useEffect(() => {
    if (open) {
      setResumes(getResumeHistory())
      setDeleteConfirmId(null)
      setEditingTitleId(null)
    }
  }, [open])

  const refreshList = () => {
    setResumes(getResumeHistory())
  }

  const handleLoadResume = (record) => {
    useResumeStore.getState().loadResumeData(record)
    toast(`Loaded "${record.title || 'Resume'}" into Live Studio`)
    onClose()
    if (onSelectResume) onSelectResume(record)
  }

  const handleDuplicate = (record, e) => {
    e?.stopPropagation()
    const clone = duplicateResumeRecord(record.id)
    if (clone) {
      refreshList()
      toast(`Duplicated "${record.title}" as copy`)
    }
  }

  const handleDelete = (id, title, e) => {
    e?.stopPropagation()
    const { nextActiveId } = deleteResumeRecord(id)
    refreshList()
    setDeleteConfirmId(null)
    toast(`Deleted "${title || 'Resume'}"`)

    if (activeId === id) {
      if (nextActiveId) {
        const nextRecord = getResumeHistory().find((r) => r.id === nextActiveId)
        if (nextRecord) useResumeStore.getState().loadResumeData(nextRecord)
      } else {
        useResumeStore.getState().newResume('ats-studio')
      }
    }
  }

  const handleCreateNew = () => {
    const record = useResumeStore.getState().newResume('ats-studio')
    toast('Created new blank resume canvas')
    onClose()
    if (onCreateNew) onCreateNew(record)
  }

  const startRename = (record, e) => {
    e?.stopPropagation()
    setEditingTitleId(record.id)
    setTempTitle(record.title || '')
  }

  const saveRename = (record, e) => {
    e?.stopPropagation()
    if (tempTitle.trim() && tempTitle.trim() !== record.title) {
      const updated = saveResumeRecord({
        ...record,
        title: tempTitle.trim(),
      })
      if (record.id === activeId) {
        useResumeStore.getState().setResumeTitle(tempTitle.trim())
      }
      refreshList()
      toast('Resume title updated')
    }
    setEditingTitleId(null)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18 }}
          className="relative flex flex-col w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E8E4DC] px-6 py-4 bg-[#FBF9F5]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF3EB] text-[#FF5E1A]">
                <FolderOpen size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1A1A1A]">My Resumes & History</h3>
                <p className="text-xs text-[#666055]">Manage, switch, or duplicate your saved CV versions</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCreateNew}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF5E1A] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#E04D0E] transition-colors"
              >
                <Plus size={14} />
                <span>+ Create New</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666055] hover:bg-[#F5F2EC] hover:text-[#1A1A1A] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {resumes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF3EB] text-[#FF5E1A] mb-3">
                  <FileText size={28} />
                </div>
                <h4 className="text-base font-bold text-[#1A1A1A]">No saved resumes found</h4>
                <p className="mt-1 max-w-sm text-xs text-[#666055]">
                  All edits are auto-saved locally in your browser. Create a new CV or import an existing document to get started.
                </p>
                <div className="mt-5 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF5E1A] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#E04D0E] transition-all"
                  >
                    <Plus size={14} />
                    <span>Create New Resume</span>
                  </button>
                  {onOpenImport && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        onOpenImport()
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8E4DC] bg-white px-4 py-2 text-xs font-semibold text-[#1A1A1A] hover:bg-[#F5F2EC] transition-all"
                    >
                      <span>Import PDF / DOCX</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {resumes.map((rec) => {
                  const isActive = rec.id === activeId
                  const isDeleting = deleteConfirmId === rec.id
                  const isEditingThisTitle = editingTitleId === rec.id

                  const data = rec.data || {}
                  const expCount = data.experience?.length || 0
                  const eduCount = data.education?.length || 0
                  const skillCount =
                    data.skillGroups?.reduce((acc, g) => acc + (g.items?.length || 0), 0) || 0
                  const candidateName = data.basic?.fullName?.trim()
                  const template = data.templateId || 'ats-studio'

                  return (
                    <div
                      key={rec.id}
                      className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all ${
                        isActive
                          ? 'border-[#FF5E1A] bg-[#FFF8F5] shadow-md ring-1 ring-[#FF5E1A]/30'
                          : 'border-[#E8E4DC] bg-white hover:border-[#D6D0C5] hover:shadow-card'
                      }`}
                    >
                      <div>
                        {/* Top Bar: Active badge & template */}
                        <div className="flex items-center justify-between gap-2 pb-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              isActive
                                ? 'bg-[#FF5E1A] text-white'
                                : 'bg-[#F5F2EC] text-[#666055]'
                            }`}
                          >
                            {isActive ? (
                              <>
                                <Check size={10} strokeWidth={3} /> Active in Editor
                              </>
                            ) : (
                              'Saved CV'
                            )}
                          </span>

                          <span className="text-[10px] font-mono text-[#8C857B] capitalize">
                            {template.replace('-', ' ')}
                          </span>
                        </div>

                        {/* Title & Rename */}
                        <div className="mt-1">
                          {isEditingThisTitle ? (
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <input
                                autoFocus
                                type="text"
                                value={tempTitle}
                                onChange={(e) => setTempTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveRename(rec, e)
                                  if (e.key === 'Escape') setEditingTitleId(null)
                                }}
                                className="w-full rounded border border-[#FF5E1A] px-2 py-1 text-xs font-semibold text-[#1A1A1A] outline-none"
                              />
                              <button
                                type="button"
                                onClick={(e) => saveRename(rec, e)}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              >
                                <Check size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-1 group/title">
                              <h4
                                onClick={() => handleLoadResume(rec)}
                                title="Click to load into editor"
                                className="cursor-pointer text-sm font-bold text-[#1A1A1A] line-clamp-1 hover:text-[#FF5E1A] transition-colors"
                              >
                                {rec.title || 'Untitled Resume'}
                              </h4>
                              <button
                                type="button"
                                onClick={(e) => startRename(rec, e)}
                                title="Rename resume"
                                className="opacity-0 group-hover/title:opacity-100 p-0.5 text-[#8C857B] hover:text-[#1A1A1A] transition-opacity"
                              >
                                <Edit2 size={12} />
                              </button>
                            </div>
                          )}

                          {candidateName && (
                            <p className="text-[11px] text-[#666055] truncate mt-0.5">
                              {candidateName}
                            </p>
                          )}
                        </div>

                        {/* Summary Badges */}
                        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10.5px] text-[#666055]">
                          <span className="rounded bg-[#F5F2EC] px-1.5 py-0.5">
                            {expCount} role{expCount !== 1 ? 's' : ''}
                          </span>
                          <span className="rounded bg-[#F5F2EC] px-1.5 py-0.5">
                            {eduCount} degree{eduCount !== 1 ? 's' : ''}
                          </span>
                          <span className="rounded bg-[#F5F2EC] px-1.5 py-0.5">
                            {skillCount} skill{skillCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-[#E8E4DC]/80 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10.5px] text-[#8C857B]">
                          <Clock size={11} />
                          <span>{formatTimeAgo(rec.updatedAt)}</span>
                        </div>

                        {/* Action Buttons */}
                        {isDeleting ? (
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[10px] text-rose-600 font-medium">Delete?</span>
                            <button
                              type="button"
                              onClick={(e) => handleDelete(rec.id, rec.title, e)}
                              className="rounded bg-rose-600 px-2 py-0.5 text-[10.5px] font-bold text-white hover:bg-rose-700"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeleteConfirmId(null)
                              }}
                              className="rounded border border-[#E8E4DC] px-1.5 py-0.5 text-[10.5px] text-[#666055] hover:bg-[#F5F2EC]"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            {/* Duplicate */}
                            <button
                              type="button"
                              onClick={(e) => handleDuplicate(rec, e)}
                              title="Duplicate resume"
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666055] hover:bg-[#F5F2EC] hover:text-[#1A1A1A] transition-colors"
                            >
                              <Copy size={13} />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeleteConfirmId(rec.id)
                              }}
                              title="Delete resume"
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666055] hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>

                            {/* Edit / Load */}
                            <button
                              type="button"
                              onClick={() => handleLoadResume(rec)}
                              className={`ml-1 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                isActive
                                  ? 'bg-[#FF5E1A]/10 text-[#FF5E1A]'
                                  : 'bg-[#1A1A1A] text-white hover:bg-[#33302B]'
                              }`}
                            >
                              <span>{isActive ? 'Editing' : 'Edit / Load'}</span>
                              {!isActive && <ArrowRight size={12} />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#E8E4DC] px-6 py-3 bg-[#FBF9F5] text-xs text-[#666055]">
            <span>{resumes.length} saved resume{resumes.length !== 1 ? 's' : ''} in localStorage</span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E8E4DC] bg-white px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] hover:bg-[#F5F2EC]"
            >
              Close
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default SavedResumesModal
