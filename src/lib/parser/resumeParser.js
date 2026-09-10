import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import {
  freshBasic,
  freshCustomSection,
  freshCustomItem,
  blankResume,
} from '../factory.js'
import { uid } from '../utils.js'

// Initialize pdf.js worker URL
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  try {
    const workerUrl = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl
  } catch (err) {
    console.warn('Failed to set pdfjs worker from bundle, falling back to cdn', err)
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`
  }
}

/**
 * Extract raw text from a PDF File or ArrayBuffer, preserving line structure.
 */
export async function extractTextFromPdf(fileOrBuffer) {
  let arrayBuffer
  if (fileOrBuffer instanceof ArrayBuffer) {
    arrayBuffer = fileOrBuffer
  } else if (fileOrBuffer?.arrayBuffer) {
    arrayBuffer = await fileOrBuffer.arrayBuffer()
  } else {
    throw new Error('Unsupported PDF input')
  }

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  })
  const pdfDoc = await loadingTask.promise
  let fullText = ''

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum)
    const textContent = await page.getTextContent()

    let lastY = null
    const pageLines = []
    let currentLine = []

    for (const item of textContent.items) {
      if (!item.str) continue
      const y = item.transform ? Math.round(item.transform[5]) : null
      if (lastY !== null && y !== null && Math.abs(y - lastY) > 5) {
        if (currentLine.length > 0) {
          pageLines.push(currentLine.join(' ').trim())
          currentLine = []
        }
      }
      currentLine.push(item.str)
      lastY = y
    }
    if (currentLine.length > 0) {
      pageLines.push(currentLine.join(' ').trim())
    }

    fullText += pageLines.join('\n') + '\n\n'
  }

  return fullText
}

/**
 * Extract raw text from a DOCX File or ArrayBuffer.
 */
export async function extractTextFromDocx(fileOrBuffer) {
  let arrayBuffer
  if (fileOrBuffer instanceof ArrayBuffer) {
    arrayBuffer = fileOrBuffer
  } else if (fileOrBuffer?.arrayBuffer) {
    arrayBuffer = await fileOrBuffer.arrayBuffer()
  } else {
    throw new Error('Unsupported DOCX input')
  }

  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value || ''
}

/**
 * All known section heading patterns — used to detect section boundaries.
 * Content under these headings will become Custom Sections (as-is), 
 * except for the very first block (header) which provides contact info.
 */
const HEADING_PATTERNS = [
  /^(?:professional\s+summary|summary|profile|about\s+me|career\s+objective|objective|executive\s+summary|personal\s+statement|professional\s+profile)[:\s]*$/i,
  /^(?:work\s+experience|professional\s+experience|employment\s+history|experience|work\s+history|career\s+history|professional\s+background|work\s+background|employment)[:\s]*$/i,
  /^(?:education|academic\s+background|academic\s+credentials|qualifications|academic\s+history|educational\s+background|education\s+&\s+training)[:\s]*$/i,
  /^(?:skills|technical\s+skills|core\s+competencies|technologies|tools\s+&\s+technologies|skills\s+&\s+tools|expertise|key\s+skills|competencies|skill\s+set|core\s+skills)[:\s]*$/i,
  /^(?:projects|personal\s+projects|key\s+projects|portfolio|portfolio\s+projects|academic\s+projects|notable\s+projects|selected\s+projects)[:\s]*$/i,
  /^(?:certifications|certificates|licenses|credentials|professional\s+certifications|training|courses)[:\s]*$/i,
  /^(?:hobbies|interests|extracurricular\s+activities|activities|personal\s+interests|hobbies\s+&\s+interests)[:\s]*$/i,
  /^(?:languages|language\s+skills|spoken\s+languages|linguistic\s+skills)[:\s]*$/i,
  /^(?:awards|honors|awards\s+&\s+honors|achievements|recognition|accolades|scholarships|accomplishments)[:\s]*$/i,
  /^(?:publications|published\s+works|research|papers|articles|journals|conference)[:\s]*$/i,
  /^(?:volunteer|volunteering|volunteer\s+experience|community\s+service|community\s+involvement)[:\s]*$/i,
  /^(?:references|professional\s+references|referees)[:\s]*$/i,
  /^(?:links|websites|online\s+presence|web\s+presence|social\s+links|contact\s+details?)[:\s]*$/i,
  /^(?:memberships?|affiliations?|professional\s+memberships?)[:\s]*$/i,
  /^(?:patents?|inventions?)[:\s]*$/i,
  /^(?:speaking|speaking\s+engagements?|presentations?|conferences?)[:\s]*$/i,
  /^(?:military|military\s+service|armed\s+forces?)[:\s]*$/i,
  /^(?:additional\s+information|other\s+information|miscellaneous)[:\s]*$/i,
]

/**
 * Detect whether a line looks like a section heading.
 * Matches known patterns OR short ALL-CAPS / Title-Case phrases.
 */
function isHeading(line) {
  if (line.length > 60) return false
  for (const pattern of HEADING_PATTERNS) {
    if (pattern.test(line)) return true
  }
  // ALL CAPS heading (e.g. "WORK EXPERIENCE", "EDUCATION")
  if (line === line.toUpperCase() && /[A-Z]{2,}/.test(line) && line.length >= 3 && line.length <= 50) {
    return true
  }
  return false
}

/**
 * "As-Is" Resume Import Parser
 *
 * Strategy:
 *  1. Detect contact info (name, email, phone, location, LinkedIn, GitHub) from the top header.
 *  2. Split the rest of the document by detected section headings.
 *  3. Every section (including its heading) becomes a Custom Section in the editor —
 *     content is preserved exactly as extracted, fully editable.
 *  4. NOTHING is discarded, NOTHING is forced into template fields.
 */
export function parseResumeText(rawText) {
  const resume = blankResume()
  if (!rawText || typeof rawText !== 'string') return resume

  const allLines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())

  if (allLines.length === 0) return resume

  // ── 1. Contact extraction (global regex, safe to run over full text) ──────
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/
  const phoneRegex = /(?:\+?[\d\s\-().]{7,15})/
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([A-Za-z0-9_-]+)/i
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9_-]+)/i
  const urlRegex = /(?:https?:\/\/)(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?/gi

  const emailMatch = rawText.match(emailRegex)
  if (emailMatch) resume.basic.email = emailMatch[0]

  // Phone: look for patterns like +977-XXX, (XXX) XXX-XXXX, +XX XXXXXXXXXX
  const phoneStrictRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+\d{1,4}[\s\-]?\d{6,12}/
  const phoneMatch = rawText.match(phoneStrictRegex)
  if (phoneMatch) resume.basic.phone = phoneMatch[0].trim()

  const linkedinMatch = rawText.match(linkedinRegex)
  if (linkedinMatch) resume.basic.linkedin = linkedinMatch[0]

  const githubMatch = rawText.match(githubRegex)
  if (githubMatch) {
    const url = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`
    resume.websites = [...(resume.websites || []), { id: uid(), label: 'GitHub', url }]
  }

  // Other URLs → portfolio
  const allUrls = rawText.match(urlRegex) || []
  for (const u of allUrls) {
    if (!u.includes('linkedin.com') && !u.includes('github.com')) {
      if (!resume.basic.portfolio) resume.basic.portfolio = u
      break
    }
  }

  // ── 2. Detect name & title from first few non-contact lines ───────────────
  const contactLineRegex = /[@+]|linkedin\.com|github\.com|https?:\/\//i
  let nameFound = false
  let titleFound = false

  for (let i = 0; i < Math.min(allLines.length, 10); i++) {
    const line = allLines[i].trim()
    if (!line) continue
    if (contactLineRegex.test(line)) continue
    if (/resume|curriculum vitae|\bcv\b/i.test(line)) continue
    if (emailRegex.test(line) || phoneStrictRegex.test(line)) continue
    if (isHeading(line)) break  // Reached first real section heading — stop

    if (!nameFound && line.length < 55 && !/^\d/.test(line)) {
      resume.basic.fullName = line.replace(/^[|•\-\s]+|[|•\-\s]+$/g, '').trim()
      nameFound = true
      continue
    }

    if (nameFound && !titleFound && line.length < 70) {
      if (/engineer|developer|designer|manager|consultant|analyst|specialist|lead|architect|scientist|officer|director|intern|coordinator|administrator|executive|president|ceo|cto|cfo|researcher|student/i.test(line)) {
        resume.basic.jobTitle = line.trim()
        titleFound = true
        continue
      }
    }

    // Location pattern: "City, Country" or "City, State"
    if (nameFound && !resume.basic.location && /^[A-Za-z\s.\-]+,\s*[A-Za-z\s.\-]+$/.test(line) && line.length < 50) {
      resume.basic.location = line.trim()
    }
  }

  // ── 3. Segment the document into sections by heading ─────────────────────
  // Each segment: { heading: string, lines: string[] }
  const segments = []
  let currentSegment = null
  let headerDone = false

  for (const rawLine of allLines) {
    const line = rawLine.trim()

    // Skip completely blank lines at segment start
    if (!line && !currentSegment) continue

    if (isHeading(line)) {
      headerDone = true
      if (currentSegment && currentSegment.lines.some((l) => l.trim())) {
        segments.push(currentSegment)
      }
      currentSegment = { heading: line, lines: [] }
    } else {
      if (!headerDone) {
        // Still in header block — skip (we already extracted contact info above)
        continue
      }
      if (!currentSegment) {
        // Content before first section heading but after header — create unnamed section
        currentSegment = { heading: '', lines: [] }
      }
      currentSegment.lines.push(rawLine) // keep original spacing for readability
    }
  }
  // Push last segment
  if (currentSegment && currentSegment.lines.some((l) => l.trim())) {
    segments.push(currentSegment)
  }

  // ── 4. Convert each segment → Custom Section ─────────────────────────────
  const customSections = []

  for (const seg of segments) {
    // Clean up trailing blank lines within a segment
    const cleanedLines = seg.lines
    while (cleanedLines.length > 0 && !cleanedLines[cleanedLines.length - 1].trim()) {
      cleanedLines.pop()
    }
    if (cleanedLines.length === 0) continue

    const section = freshCustomSection(seg.heading || 'Additional Information')
    section.items = []

    // We store the entire segment content as a SINGLE custom item's description.
    // This preserves the original text exactly as-is.
    // Each bullet / sub-line will be visible in the description textarea and is fully editable.
    const item = freshCustomItem()
    item.title = ''  // No forced title
    item.subtitle = ''
    item.date = ''
    item.description = cleanedLines.join('\n')
    section.items = [item]

    customSections.push(section)
  }

  if (customSections.length > 0) {
    resume.customSections = customSections
    resume.visibility = { ...resume.visibility, customSections: true }
  }

  return resume
}

/**
 * Universal file parser: detects file type (.pdf or .docx), extracts text,
 * and parses into ResumeState using the as-is preservation strategy.
 */
export async function parseResumeFile(file) {
  if (!file) throw new Error('No file provided')

  const fileName = file.name || ''
  const isPdf = /\.pdf$/i.test(fileName) || file.type === 'application/pdf'
  const isDocx = /\.docx$/i.test(fileName) || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

  if (!isPdf && !isDocx) {
    throw new Error('Unsupported file format. Please upload a .pdf or .docx resume file.')
  }

  let rawText = ''
  if (isPdf) {
    rawText = await extractTextFromPdf(file)
  } else {
    rawText = await extractTextFromDocx(file)
  }

  if (!rawText || rawText.trim().length === 0) {
    throw new Error('Could not extract text from the document. Ensure the file contains selectable text (not scanned images).')
  }

  const structuredResume = parseResumeText(rawText)
  const defaultTitle = fileName.replace(/\.(pdf|docx)$/i, '') || 'Imported CV'

  return {
    rawText,
    resumeData: structuredResume,
    suggestedTitle: defaultTitle,
  }
}
