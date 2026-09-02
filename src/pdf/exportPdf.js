import { pdf } from '@react-pdf/renderer'
import { createElement } from 'react'
import { ResumeDocument } from './ResumeDocument'
import { resumeFilename } from '../lib/names'

/**
 * Generate the PDF (vector text — fully selectable, ATS-parseable) and
 * trigger the download under the strict naming convention `[User Name]-resume.pdf`.
 * @returns {Promise<string>} the filename that was used
 */
export async function exportResumePdf(resume) {
  const doc = createElement(ResumeDocument, { resume })
  const instance = pdf(doc)
  const blob = await instance.toBlob()
  const filename = resumeFilename(resume.basic.fullName)

  if (typeof window !== 'undefined' && window.navigator?.msSaveBlob) {
    window.navigator.msSaveBlob(blob, filename) // legacy Edge
    return filename
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
  return filename
}
