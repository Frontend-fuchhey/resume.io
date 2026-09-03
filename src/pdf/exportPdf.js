import html2pdf from 'html2pdf.js'
import { useResumeStore } from '../store/useResumeStore'

/**
 * Wait for DOM / Canvas Repaint Before Capture.
 * Introduces a micro-delay (requestAnimationFrame or setTimeout of ~100-200ms)
 * to guarantee all dynamic color bindings and state changes are fully rendered
 * in the DOM before html2canvas takes the snapshot.
 */
export const waitForRepaint = (ms = 150) =>
  new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      window.requestAnimationFrame(() => setTimeout(resolve, ms))
    } else {
      setTimeout(resolve, ms)
    }
  })

/**
 * Generate the PDF matching the live preview canvas exactly for any selected accent color.
 * Passes explicit CSS capture flags to html2canvas and preserves inline styles.
 *
 * @param {Object} [resumeData] - Resume state object
 * @returns {Promise<string>} downloaded filename
 */
export async function exportToPdf(resumeData) {
  const data = resumeData || (typeof window !== 'undefined' ? useResumeStore.getState() : {})
  
  // Blur any currently focused editable text to dismiss cursor & focus outline
  if (typeof document !== 'undefined' && document.activeElement?.blur) {
    document.activeElement.blur()
  }

  // Micro-delay (~100-200ms) ensuring DOM repaint and state transitions finish
  await waitForRepaint(150)

  const canvasEl = typeof document !== 'undefined' ? document.querySelector('#resume-canvas') : null
  if (!canvasEl) {
    throw new Error('Resume canvas element (#resume-canvas) not found in DOM')
  }

  const theme = {
    accentColor:
      data.formatting?.accentColor ||
      data.theme?.accentColor ||
      '#244CEC',
  }

  const rawName =
    data.personalInfo?.fullName ||
    data.basic?.fullName ||
    'resume'

  const filename = `${rawName}.pdf`

  const opt = {
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
      // Force canvas to capture exact computed styles
      onclone: (clonedDoc) => {
        // Ensures inline styles are preserved in the cloned document
        const clonedCanvas = clonedDoc.querySelector('#resume-canvas')
        if (clonedCanvas) {
          clonedCanvas.style.color = theme.accentColor
          clonedCanvas.style.boxShadow = 'none'
          clonedCanvas.style.transform = 'none'
        }
        // Remove interactive editor artifacts (page-break guides, add bullet buttons)
        clonedDoc.querySelectorAll('[data-html2canvas-ignore="true"]').forEach((el) => {
          el.remove()
        })
      },
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  }

  await html2pdf().set(opt).from(canvasEl).save()
  return filename
}

export const exportResumePdf = exportToPdf
