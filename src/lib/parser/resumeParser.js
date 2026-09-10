import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import {
  freshBasic,
  freshExperience,
  freshEducation,
  freshProject,
  freshSkillGroup,
  freshWebsite,
  freshHobby,
  freshCertification,
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
 * Extract raw text from a PDF File or ArrayBuffer
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
 * Extract raw text from a DOCX File or ArrayBuffer
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
 * Helper to normalize date strings to YYYY-MM or YYYY for form fields
 */
function normalizeDate(rawDate) {
  if (!rawDate) return ''
  const str = rawDate.trim()
  if (/present|current|now/i.test(str)) return ''

  const months = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
    january: '01', february: '02', march: '03', april: '04', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
  }

  // Check Month YYYY (e.g. May 2021)
  const monthYearMatch = str.match(/([A-Za-z]+)\s*[\.,\s]?\s*(\d{4})/)
  if (monthYearMatch) {
    const m = months[monthYearMatch[1].toLowerCase()]
    const y = monthYearMatch[2]
    if (m && y) return `${y}-${m}-01`
  }

  // Check MM/YYYY
  const slashMatch = str.match(/(\d{1,2})[\/\-](\d{4})/)
  if (slashMatch) {
    const m = slashMatch[1].padStart(2, '0')
    const y = slashMatch[2]
    return `${y}-${m}-01`
  }

  // Check YYYY
  const yearMatch = str.match(/\b(19\d{2}|20\d{2})\b/)
  if (yearMatch) {
    return `${yearMatch[1]}-01-01`
  }

  return ''
}

/**
 * Known section heading patterns → section key
 * Each entry: { key, regex }
 * Order matters – first match wins.
 */
const SECTION_PATTERNS = [
  { key: 'summary',        regex: /^(?:professional\s+summary|summary|profile|about\s+me|career\s+objective|objective|executive\s+summary|professional\s+profile|personal\s+statement)[:\s]*$/i },
  { key: 'experience',     regex: /^(?:work\s+experience|professional\s+experience|employment\s+history|experience|work\s+history|career\s+history|professional\s+background|work\s+background|employment)[:\s]*$/i },
  { key: 'education',      regex: /^(?:education|academic\s+background|academic\s+credentials|qualifications|academic\s+history|educational\s+background)[:\s]*$/i },
  { key: 'skills',         regex: /^(?:skills|technical\s+skills|core\s+competencies|technologies|tools\s+&\s+technologies|skills\s+&\s+tools|expertise|key\s+skills|competencies|skill\s+set)[:\s]*$/i },
  { key: 'projects',       regex: /^(?:projects|personal\s+projects|key\s+projects|portfolio\s+projects|academic\s+projects|notable\s+projects|selected\s+projects)[:\s]*$/i },
  { key: 'websites',       regex: /^(?:websites|links|social\s+links|online\s+presence|portfolio|web\s+presence)[:\s]*$/i },
  { key: 'certifications', regex: /^(?:certifications|certificates|licenses|credentials|professional\s+certifications|training)[:\s]*$/i },
  { key: 'hobbies',        regex: /^(?:hobbies|interests|extracurricular\s+activities|activities|personal\s+interests|hobbies\s+&\s+interests)[:\s]*$/i },
  { key: 'languages',      regex: /^(?:languages|language\s+skills|spoken\s+languages|linguistic\s+skills)[:\s]*$/i },
  { key: 'awards',         regex: /^(?:awards|honors|awards\s+&\s+honors|achievements|recognition|accolades|scholarships|accomplishments)[:\s]*$/i },
  { key: 'publications',   regex: /^(?:publications|published\s+works|research|papers|articles|journals)[:\s]*$/i },
  { key: 'volunteer',      regex: /^(?:volunteer|volunteering|volunteer\s+experience|community\s+service|community\s+involvement)[:\s]*$/i },
  { key: 'references',     regex: /^(?:references|professional\s+references|referees)[:\s]*$/i },
]

// Keys that map to structured fields in the resume model
const KNOWN_STRUCTURED_KEYS = new Set([
  'summary', 'experience', 'education', 'skills', 'projects',
  'websites', 'certifications', 'hobbies', 'languages', 'awards', 'references',
])

/**
 * Intelligent ATS Resume Parser
 * Parses raw text extracted from PDF or DOCX into structured resume state.
 * Zero data loss: all unrecognized sections become Custom Sections.
 */
export function parseResumeText(rawText) {
  const resume = blankResume()
  if (!rawText || typeof rawText !== 'string') return resume

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  if (lines.length === 0) return resume

  // ─── 1. Extract contact coordinates via global regexes ───────────────────
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{1,4}[-.\s]?\d{6,12}/g
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([A-Za-z0-9_-]+)/i
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9_-]+)/i
  const urlRegex = /(?:https?:\/\/)(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?/gi

  const allEmails = rawText.match(emailRegex) || []
  if (allEmails.length > 0) resume.basic.email = allEmails[0]

  const allPhones = rawText.match(phoneRegex) || []
  if (allPhones.length > 0) resume.basic.phone = allPhones[0].trim()

  const allUrls = rawText.match(urlRegex) || []
  const websites = []

  const linkedinMatch = rawText.match(linkedinRegex)
  if (linkedinMatch) {
    resume.basic.linkedin = linkedinMatch[0]
    websites.push({ id: uid(), label: 'LinkedIn', url: linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}` })
  }

  const githubMatch = rawText.match(githubRegex)
  if (githubMatch) {
    websites.push({ id: uid(), label: 'GitHub', url: githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}` })
  }

  for (const u of allUrls) {
    if (!u.includes('linkedin.com') && !u.includes('github.com')) {
      if (!resume.basic.portfolio) resume.basic.portfolio = u
      if (!websites.some((w) => w.url === u)) {
        websites.push({ id: uid(), label: 'Portfolio', url: u })
      }
    }
  }
  if (websites.length > 0) resume.websites = websites

  // ─── 2. Segment raw text into sections ──────────────────────────────────
  // We track: { key, label, lines[] }
  // "key" = matched key from SECTION_PATTERNS, or a generated 'custom_N' key for unknown headings
  // "label" = the original heading text from the CV (for display in custom section title)

  const segments = [] // Array of { key, label, lines: [] }
  let current = { key: 'header', label: 'header', lines: [] }
  segments.push(current)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let matchedKey = null
    let matchedLabel = line

    for (const p of SECTION_PATTERNS) {
      if (p.regex.test(line)) {
        matchedKey = p.key
        break
      }
    }

    // Heuristic: short lines (≤40 chars) with no typical "content" markers
    // that appear after the header section may be unknown section headings.
    // Conditions: not a bullet, not a date range, not an email/phone/URL,
    // and either ALL CAPS or title-cased short phrase.
    if (!matchedKey && current.key !== 'header') {
      const isShort = line.length <= 45
      const isBullet = /^[•*▪\-\–\—>]/.test(line)
      const hasDate = /\b(19|20)\d{2}\b/.test(line)
      const hasEmail = emailRegex.test(line)
      const hasPhone = phoneRegex.test(line)
      const hasUrl = /https?:\/\//.test(line)
      const isAllCaps = line === line.toUpperCase() && /[A-Z]{2,}/.test(line)
      const isTitleCase = /^[A-Z][a-z]/.test(line) && !/[a-z]{2,}[A-Z]/.test(line)
      // Reset regex lastIndex
      emailRegex.lastIndex = 0
      phoneRegex.lastIndex = 0

      if (isShort && !isBullet && !hasDate && !hasEmail && !hasPhone && !hasUrl && (isAllCaps || isTitleCase)) {
        // Treat as an unknown custom section heading
        matchedKey = `custom_${uid()}`
        matchedLabel = line
      }
    }

    if (matchedKey) {
      current = { key: matchedKey, label: matchedLabel, lines: [] }
      segments.push(current)
    } else {
      current.lines.push(line)
    }
  }

  // Separate known and unknown segments
  const sectionMap = {}
  const unknownSegments = []

  for (const seg of segments) {
    if (seg.key === 'header') {
      sectionMap['header'] = seg.lines
    } else if (KNOWN_STRUCTURED_KEYS.has(seg.key)) {
      if (!sectionMap[seg.key]) sectionMap[seg.key] = []
      sectionMap[seg.key].push(...seg.lines)
    } else {
      // Unknown or semi-known section (publications, volunteer, etc.) → custom section
      if (seg.lines.length > 0) {
        unknownSegments.push({ title: seg.label, lines: seg.lines })
      }
    }
  }

  // ─── 3. Header: Name, Title, Location ────────────────────────────────────
  const headerLines = sectionMap['header'] || []
  let candidateName = ''
  let candidateTitle = ''
  let candidateLocation = ''

  for (let i = 0; i < Math.min(headerLines.length, 10); i++) {
    const line = headerLines[i]
    // Skip contact-info lines
    if (emailRegex.test(line) || phoneRegex.test(line) || /linkedin\.com|github\.com|https?:\/\//i.test(line)) {
      emailRegex.lastIndex = 0
      phoneRegex.lastIndex = 0
      continue
    }
    emailRegex.lastIndex = 0
    phoneRegex.lastIndex = 0
    if (/resume|curriculum vitae|\bcv\b/i.test(line)) continue

    if (!candidateName && line.length < 55 && !/^\d/.test(line)) {
      candidateName = line.replace(/^[|•\-\s]+|[|•\-\s]+$/g, '').trim()
      continue
    }

    if (candidateName && !candidateTitle && line.length < 70) {
      if (/engineer|developer|designer|manager|consultant|analyst|specialist|lead|architect|scientist|officer|director|intern|coordinator|administrator|executive|president|ceo|cto|cfo|vp\b/i.test(line)) {
        candidateTitle = line.trim()
        continue
      }
    }

    if (!candidateLocation && /^[A-Za-z\s.\-]+,\s*[A-Za-z\s.\-]+$/.test(line) && line.length < 45) {
      candidateLocation = line.trim()
    }
  }

  // Only set name if actually found (no placeholder!)
  if (candidateName) resume.basic.fullName = candidateName
  if (candidateTitle) resume.basic.jobTitle = candidateTitle
  if (candidateLocation) resume.basic.location = candidateLocation

  // ─── 4. Professional Summary ─────────────────────────────────────────────
  const summaryLines = sectionMap['summary'] || []
  if (summaryLines.length > 0) {
    resume.basic.summary = summaryLines.join(' ')
  }

  // ─── 5. Work Experience ──────────────────────────────────────────────────
  const expLines = sectionMap['experience'] || []
  if (expLines.length > 0) {
    const expEntries = []
    let currentExp = null

    const dateRangeRegex = /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\d{1,2}[\/\-])?\s*(19|20)\d{2}\s*(?:-|–|—|to)\s*(present|current|now|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\d{1,2}[\/\-])?\s*(19|20)\d{2})/i

    let hasAnyDateLine = expLines.some((l) => dateRangeRegex.test(l))

    if (hasAnyDateLine) {
      // Structured parsing when date ranges exist
      for (let i = 0; i < expLines.length; i++) {
        const line = expLines[i]
        const dateMatch = line.match(dateRangeRegex)
        const isBullet = /^[•*▪\-\–\—>]\s*/.test(line)

        if (dateMatch && !isBullet) {
          if (currentExp) expEntries.push(currentExp)

          const dateFullStr = dateMatch[0]
          const parts = dateFullStr.split(/(?:-|–|—|\bto\b)/i).map((s) => s.trim())
          const startStr = parts[0] || ''
          const endStr = parts[1] || ''
          const isCurrent = /present|current|now/i.test(endStr)

          currentExp = freshExperience()
          currentExp.startDate = normalizeDate(startStr)
          currentExp.endDate = isCurrent ? '' : normalizeDate(endStr)
          currentExp.current = isCurrent
          currentExp.bullets = []

          const lineWithoutDate = line.replace(dateMatch[0], '').trim().replace(/^[|,•\-\s]+|[|,•\-\s]+$/g, '')
          const prevLine = i > 0 ? expLines[i - 1].trim() : ''
          const isPrevLineHeader = prevLine && !/^[•*▪\-\–\—>]/.test(prevLine) && !dateRangeRegex.test(prevLine)

          if (isPrevLineHeader) {
            if (prevLine.includes(' at ')) {
              const [r, c] = prevLine.split(' at ').map((s) => s.trim())
              currentExp.role = r
              currentExp.company = c
            } else if (prevLine.includes('|')) {
              const [r, c] = prevLine.split('|').map((s) => s.trim())
              currentExp.role = r
              currentExp.company = c
            } else if (prevLine.includes(' - ')) {
              const [r, c] = prevLine.split(' - ').map((s) => s.trim())
              currentExp.role = r
              currentExp.company = c
            } else {
              currentExp.role = prevLine
            }
            if (lineWithoutDate) currentExp.location = lineWithoutDate
          } else if (lineWithoutDate) {
            if (lineWithoutDate.includes(' at ')) {
              const [r, c] = lineWithoutDate.split(' at ').map((s) => s.trim())
              currentExp.role = r
              currentExp.company = c
            } else if (lineWithoutDate.includes('|')) {
              const [r, c] = lineWithoutDate.split('|').map((s) => s.trim())
              currentExp.role = r
              currentExp.company = c
            } else {
              currentExp.role = lineWithoutDate
            }
          }
        } else if (isBullet) {
          if (!currentExp) {
            currentExp = freshExperience()
            currentExp.bullets = []
          }
          const bulletText = line.replace(/^[•*▪\-\–\—>]\s*/, '').trim()
          if (bulletText) currentExp.bullets.push(bulletText)
        } else if (currentExp) {
          if (!currentExp.company && line.length < 60 && !line.includes(',')) {
            currentExp.company = line
          } else if (!currentExp.location && /^[A-Za-z\s.\-]+,\s*[A-Za-z\s.\-]+$/.test(line) && line.length < 45) {
            currentExp.location = line
          } else if (line.length > 30) {
            currentExp.bullets.push(line)
          }
        }
      }
      if (currentExp) expEntries.push(currentExp)
    } else {
      // FALLBACK: No date ranges found — preserve ALL lines as a single experience entry
      // with all non-header text as bullets, so nothing is lost
      const fallbackExp = freshExperience()
      fallbackExp.bullets = []
      for (const line of expLines) {
        const isBullet = /^[•*▪\-\–\—>]\s*/.test(line)
        const cleaned = line.replace(/^[•*▪\-\–\—>]\s*/, '').trim()
        if (!fallbackExp.role && !isBullet && line.length < 70) {
          fallbackExp.role = line
        } else if (cleaned) {
          fallbackExp.bullets.push(cleaned)
        }
      }
      if (fallbackExp.role || fallbackExp.bullets.length > 0) {
        expEntries.push(fallbackExp)
      }
    }

    if (expEntries.length > 0) {
      resume.experience = expEntries.map((e) => ({
        ...e,
        bullets: e.bullets.length > 0 ? e.bullets : [''],
      }))
    }
  }

  // ─── 6. Education ─────────────────────────────────────────────────────────
  const eduLines = sectionMap['education'] || []
  if (eduLines.length > 0) {
    const eduEntries = []
    let currentEdu = null

    const degreeKeywords = /\b(b\.?s\.?|b\.?a\.?|bachelor|m\.?s\.?|m\.?a\.?|master|ph\.?d\.?|doctor|associate|b\.?tech|m\.?tech|mba|diploma|b\.?sc|b\.?e|hnd|hnc|gnvq|gcse|a-levels?)\b/i

    for (const line of eduLines) {
      const allYears = line.match(/\b(19\d{2}|20\d{2})\b/g)
      const gradYear = allYears ? allYears[allYears.length - 1] : null
      const hasDegree = degreeKeywords.test(line)

      if (hasDegree) {
        if (currentEdu) eduEntries.push(currentEdu)
        currentEdu = freshEducation()
        if (gradYear) currentEdu.gradYear = gradYear

        if (line.includes('|')) {
          const parts = line.split('|').map((s) => s.trim())
          currentEdu.degree = parts[0] || ''
          currentEdu.school = parts[1] || ''
        } else if (line.includes(',')) {
          const parts = line.split(',').map((s) => s.trim())
          currentEdu.degree = parts[0] || ''
          currentEdu.school = parts.slice(1).join(', ') || ''
        } else {
          currentEdu.degree = line
        }
      } else if (currentEdu) {
        if (gradYear && !currentEdu.gradYear) {
          currentEdu.gradYear = gradYear
        } else if (!currentEdu.school && line.length < 80 && !/gpa|honors|cum laude/i.test(line)) {
          currentEdu.school = line
        } else if (/gpa|cum laude|honors|focus|major/i.test(line)) {
          currentEdu.focus = line
        }
      } else if (gradYear) {
        currentEdu = freshEducation()
        currentEdu.gradYear = gradYear
        currentEdu.degree = line.replace(/\b(19\d{2}|20\d{2})\b/g, '').trim()
      } else if (line.length < 80) {
        // Line in education section but no degree keyword, no year, no current entry
        // Start a new education entry to preserve the data
        if (currentEdu) eduEntries.push(currentEdu)
        currentEdu = freshEducation()
        currentEdu.degree = line
      }
    }

    if (currentEdu) eduEntries.push(currentEdu)
    if (eduEntries.length > 0) resume.education = eduEntries
  }

  // ─── 7. Skills ────────────────────────────────────────────────────────────
  const skillLines = sectionMap['skills'] || []
  if (skillLines.length > 0) {
    const skillGroups = []

    for (const line of skillLines) {
      if (line.includes(':')) {
        const colonIdx = line.indexOf(':')
        const label = line.slice(0, colonIdx).trim()
        const rest = line.slice(colonIdx + 1).trim()
        const items = rest.split(/[,|•▪;]/).map((s) => s.trim()).filter(Boolean)
        if (items.length > 0) {
          skillGroups.push({ id: uid(), label, items })
        } else if (rest) {
          skillGroups.push({ id: uid(), label, items: [rest] })
        }
      } else {
        const items = line.split(/[,|•▪;]/).map((s) => s.trim()).filter(Boolean)
        if (items.length > 0) {
          skillGroups.push({ id: uid(), label: 'Core Skills', items })
        }
      }
    }

    if (skillGroups.length > 0) resume.skillGroups = skillGroups
  }

  // ─── 8. Projects ──────────────────────────────────────────────────────────
  const projectLines = sectionMap['projects'] || []
  if (projectLines.length > 0) {
    const projects = []
    let currentProj = null

    for (const line of projectLines) {
      const isBullet = /^[•*▪\-\–\—>]\s*/.test(line)
      const isTechStack = /^(built with|tech stack|tools:|technologies:)/i.test(line)

      if (isTechStack && currentProj) {
        currentProj.techStack = line.replace(/^(built with|tech stack|tools:|technologies:)\s*/i, '').trim()
      } else if (!isBullet && line.length < 70 && !line.includes('http')) {
        if (currentProj) projects.push(currentProj)
        currentProj = freshProject()
        currentProj.title = line.trim()
        currentProj.name = line.trim()
      } else if (currentProj) {
        if (/https?:\/\//i.test(line) && !currentProj.link) {
          const match = line.match(/(https?:\/\/[^\s]+)/)
          if (match) currentProj.link = match[0]
        } else {
          const text = line.replace(/^[•*▪\-\–\—>]\s*/, '').trim()
          currentProj.description = currentProj.description ? `${currentProj.description}\n• ${text}` : `• ${text}`
        }
      }
    }
    if (currentProj) projects.push(currentProj)
    if (projects.length > 0) resume.projects = projects
  }

  // ─── 9. Certifications ───────────────────────────────────────────────────
  const certLines = sectionMap['certifications'] || []
  if (certLines.length > 0) {
    const certs = []
    for (const line of certLines) {
      const clean = line.replace(/^[•*▪\-\–\—>]\s*/, '').trim()
      if (clean) {
        const yearMatch = clean.match(/\b(19\d{2}|20\d{2})\b/)
        // Try to detect issuer if line has " - " or " | " or " by "
        let name = clean.replace(/\b(19\d{2}|20\d{2})\b/, '').trim()
        let issuer = ''
        if (name.includes(' - ')) {
          const parts = name.split(' - ')
          name = parts[0].trim()
          issuer = parts.slice(1).join(' - ').trim()
        } else if (name.includes(' | ')) {
          const parts = name.split(' | ')
          name = parts[0].trim()
          issuer = parts.slice(1).join(' | ').trim()
        } else if (/ by /i.test(name)) {
          const parts = name.split(/ by /i)
          name = parts[0].trim()
          issuer = parts.slice(1).join(' by ').trim()
        }
        certs.push({ id: uid(), name: name || clean, issuer, year: yearMatch ? yearMatch[1] : '' })
      }
    }
    if (certs.length > 0) resume.certifications = certs
  }

  // ─── 10. Hobbies ─────────────────────────────────────────────────────────
  const hobbyLines = sectionMap['hobbies'] || []
  if (hobbyLines.length > 0) {
    const hobbies = []
    for (const line of hobbyLines) {
      const items = line.replace(/^[•*▪\-\–\—>]\s*/, '').split(/[,|•▪;]/).map((s) => s.trim()).filter(Boolean)
      for (const it of items) hobbies.push({ id: uid(), name: it })
    }
    if (hobbies.length > 0) resume.hobbies = hobbies
  }

  // ─── 11. Languages ───────────────────────────────────────────────────────
  const langLines = sectionMap['languages'] || []
  if (langLines.length > 0) {
    const langs = []
    for (const line of langLines) {
      const clean = line.replace(/^[•*▪\-\–\—>]\s*/, '').trim()
      if (!clean) continue
      // Pattern: "English - Native" or "English (Native)" or "English: C1"
      const levelMatch = clean.match(/[-:(]\s*(native|bilingual|c2|c1|b2|b1|a2|a1|fluent|proficient|advanced|intermediate|beginner|conversational|working\s+knowledge)[)]*\s*$/i)
      if (levelMatch) {
        const langName = clean.slice(0, clean.indexOf(levelMatch[0])).replace(/[-:()\s]+$/, '').trim()
        const level = levelMatch[1].trim()
        const ratingMap = { native: 5, bilingual: 5, c2: 5, fluent: 4, proficient: 4, c1: 4, advanced: 4, b2: 3, intermediate: 3, b1: 3, conversational: 3, 'working knowledge': 2, a2: 2, beginner: 1, a1: 1 }
        const rating = ratingMap[level.toLowerCase()] || 3
        langs.push({ id: uid(), name: langName || clean, level: level.charAt(0).toUpperCase() + level.slice(1), rating })
      } else {
        // Just a language name, no level specified
        const items = clean.split(/[,|;]/).map((s) => s.trim()).filter(Boolean)
        for (const it of items) {
          langs.push({ id: uid(), name: it, level: '', rating: 3 })
        }
      }
    }
    if (langs.length > 0) resume.languages = langs
  }

  // ─── 12. Awards & Honors ─────────────────────────────────────────────────
  const awardLines = sectionMap['awards'] || []
  if (awardLines.length > 0) {
    const awards = []
    let currentAward = null
    for (const line of awardLines) {
      const clean = line.replace(/^[•*▪\-\–\—>]\s*/, '').trim()
      if (!clean) continue
      const yearMatch = clean.match(/\b(19\d{2}|20\d{2})\b/)
      const isBullet = /^[•*▪\-\–\—>]/.test(line)

      if (!isBullet && clean.length < 80) {
        if (currentAward) awards.push(currentAward)
        currentAward = { id: uid(), title: clean.replace(/\b(19\d{2}|20\d{2})\b/, '').trim(), issuer: '', date: yearMatch ? yearMatch[1] : '', description: '' }
      } else if (currentAward) {
        if (!currentAward.issuer && clean.length < 60) {
          currentAward.issuer = clean
        } else {
          currentAward.description = currentAward.description ? `${currentAward.description} ${clean}` : clean
        }
      } else {
        currentAward = { id: uid(), title: clean, issuer: '', date: yearMatch ? yearMatch[1] : '', description: '' }
      }
    }
    if (currentAward) awards.push(currentAward)
    if (awards.length > 0) resume.awards = awards
  }

  // ─── 13. References ──────────────────────────────────────────────────────
  const refLines = sectionMap['references'] || []
  if (refLines.length > 0) {
    const firstLine = refLines[0] || ''
    if (/available\s+upon\s+request|on\s+request|furnished\s+upon/i.test(firstLine)) {
      resume.references = { mode: 'upon_request', text: firstLine, items: [] }
    } else {
      // Try to parse structured referee entries
      resume.references = { mode: 'upon_request', text: 'References available upon request', items: [] }
    }
  }

  // ─── 14. Unknown / Custom Sections → preserved as Custom Sections ────────
  const customSections = []

  for (const seg of unknownSegments) {
    const section = freshCustomSection(seg.title)
    section.items = []
    let currentItem = null

    for (const line of seg.lines) {
      const isBullet = /^[•*▪\-\–\—>]\s*/.test(line)
      const clean = line.replace(/^[•*▪\-\–\—>]\s*/, '').trim()
      const yearMatch = line.match(/\b(19\d{2}|20\d{2})\b/)

      if (!isBullet && clean.length < 80 && !currentItem) {
        currentItem = freshCustomItem()
        currentItem.title = clean.replace(/\b(19\d{2}|20\d{2})\b/, '').trim()
        if (yearMatch) currentItem.date = yearMatch[1]
        section.items.push(currentItem)
      } else if (!isBullet && clean.length < 80 && currentItem && !currentItem.subtitle) {
        currentItem.subtitle = clean.replace(/\b(19\d{2}|20\d{2})\b/, '').trim()
        if (!currentItem.date && yearMatch) currentItem.date = yearMatch[1]
      } else if (currentItem) {
        currentItem.description = currentItem.description
          ? `${currentItem.description}\n${clean}`
          : clean
      } else {
        // No current item — start one with the line as description
        currentItem = freshCustomItem()
        currentItem.description = clean
        section.items.push(currentItem)
      }
    }

    // Only include section if it has meaningful content
    if (section.items.some((item) => item.title || item.description)) {
      customSections.push(section)
    }
  }

  if (customSections.length > 0) {
    resume.customSections = customSections
  }

  return resume
}

/**
 * Universal file parser: detects file type (.pdf or .docx), extracts text, and parses into ResumeState
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
