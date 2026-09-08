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
 * Identify section headers in text
 */
const SECTION_PATTERNS = [
  { key: 'summary', regex: /^(?:professional\s+summary|summary|profile|about\s+me|career\s+objective|objective|executive\s+summary)[\s:]*$/i },
  { key: 'experience', regex: /^(?:work\s+experience|professional\s+experience|employment\s+history|experience|work\s+history|career\s+history)[\s:]*$/i },
  { key: 'education', regex: /^(?:education|academic\s+background|academic\s+credentials|qualifications|academic\s+history)[\s:]*$/i },
  { key: 'skills', regex: /^(?:skills|technical\s+skills|core\s+competencies|technologies|tools\s+&\s+technologies|skills\s+&\s+tools|expertise)[\s:]*$/i },
  { key: 'projects', regex: /^(?:projects|personal\s+projects|key\s+projects|portfolio\s+projects|academic\s+projects)[\s:]*$/i },
  { key: 'websites', regex: /^(?:websites|links|social\s+links|online\s+presence)[\s:]*$/i },
  { key: 'certifications', regex: /^(?:certifications|certificates|licenses|credentials)[\s:]*$/i },
  { key: 'hobbies', regex: /^(?:hobbies|interests|extracurricular\s+activities|activities)[\s:]*$/i },
]

/**
 * Intelligent ATS Resume Parser
 * Parses raw text extracted from PDF or DOCX into structured resume state
 */
export function parseResumeText(rawText) {
  const resume = blankResume()
  if (!rawText || typeof rawText !== 'string') return resume

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  if (lines.length === 0) return resume

  // 1. Extract contact coordinates via global regexes
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{1,4}[-.\s]?\d{6,12}/g
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([A-Za-z0-9_-]+)/i
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9_-]+)/i
  const urlRegex = /(?:https?:\/\/)(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?/gi

  const allEmails = rawText.match(emailRegex) || []
  if (allEmails.length > 0) {
    resume.basic.email = allEmails[0]
  }

  const allPhones = rawText.match(phoneRegex) || []
  if (allPhones.length > 0) {
    resume.basic.phone = allPhones[0].trim()
  }

  const allUrls = rawText.match(urlRegex) || []
  const websites = []

  // Check for LinkedIn
  const linkedinMatch = rawText.match(linkedinRegex)
  if (linkedinMatch) {
    resume.basic.linkedin = linkedinMatch[0]
    websites.push({
      id: uid(),
      label: 'LinkedIn',
      url: linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`,
    })
  }

  // Check for GitHub
  const githubMatch = rawText.match(githubRegex)
  if (githubMatch) {
    websites.push({
      id: uid(),
      label: 'GitHub',
      url: githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`,
    })
  }

  // Other URLs as portfolio / websites
  for (const u of allUrls) {
    if (!u.includes('linkedin.com') && !u.includes('github.com')) {
      if (!resume.basic.portfolio) {
        resume.basic.portfolio = u
      }
      if (!websites.some((w) => w.url === u)) {
        websites.push({
          id: uid(),
          label: 'Portfolio',
          url: u,
        })
      }
    }
  }
  if (websites.length > 0) {
    resume.websites = websites
  }

  // 2. Segment raw text into sections
  const sections = {}
  let currentSection = 'header'
  sections['header'] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Check if this line is a section header
    let matchedKey = null
    for (const p of SECTION_PATTERNS) {
      if (p.regex.test(line)) {
        matchedKey = p.key
        break
      }
    }

    if (matchedKey) {
      currentSection = matchedKey
      if (!sections[currentSection]) sections[currentSection] = []
    } else {
      if (!sections[currentSection]) sections[currentSection] = []
      sections[currentSection].push(line)
    }
  }

  // 3. Process Header section (Name, Title, Location)
  const headerLines = sections['header'] || []
  let candidateName = ''
  let candidateTitle = ''
  let candidateLocation = ''

  for (let i = 0; i < Math.min(headerLines.length, 6); i++) {
    const line = headerLines[i]
    // Skip lines containing email, phone, or URLs
    if (emailRegex.test(line) || phoneRegex.test(line) || /linkedin\.com|github\.com|https?:\/\//i.test(line)) {
      continue
    }
    // Skip generic words
    if (/resume|curriculum vitae|cv/i.test(line)) continue

    if (!candidateName && line.length < 50 && !/^\d/.test(line)) {
      candidateName = line.replace(/^[|•\-\s]+|[|•\-\s]+$/g, '')
      continue
    }

    if (candidateName && !candidateTitle && line.length < 60) {
      // Often contains title keywords or location
      if (/engineer|developer|designer|manager|consultant|analyst|specialist|lead|architect|scientist|officer|director|intern/i.test(line)) {
        candidateTitle = line
        continue
      }
    }

    // Look for location pattern e.g., "City, State" or "City, Country"
    if (!candidateLocation && /^[A-Za-z\s.-]+,\s*[A-Za-z\s.-]+$/.test(line) && line.length < 40) {
      candidateLocation = line
    }
  }

  resume.basic.fullName = candidateName || 'Candidate Name'
  if (candidateTitle) resume.basic.jobTitle = candidateTitle
  if (candidateLocation) resume.basic.location = candidateLocation

  // 4. Process Professional Summary
  const summaryLines = sections['summary'] || []
  if (summaryLines.length > 0) {
    resume.basic.summary = summaryLines.join(' ')
  }

  // 5. Process Work Experience
  const expLines = sections['experience'] || []
  if (expLines.length > 0) {
    const expEntries = []
    let currentExp = null

    // Date range pattern
    const dateRangeRegex = /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\d{1,2}[\/\-])?\s*(\d{4})\s*(?:-|–|—|to)\s*(present|current|now|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\d{1,2}[\/\-])?\s*(\d{4}))/i

    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i]
      const dateMatch = line.match(dateRangeRegex)
      const isBullet = /^[•*▪\-\–\—\>]\s*/.test(line)

      if (dateMatch && !isBullet) {
        if (currentExp) {
          expEntries.push(currentExp)
        }

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

        // Check if preceding line contains Role / Company
        const prevLine = i > 0 ? expLines[i - 1].trim() : ''
        const isPrevLineHeader = prevLine && !/^[•*▪\-\–\—\>]/.test(prevLine) && !dateRangeRegex.test(prevLine)

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

          if (lineWithoutDate) {
            currentExp.location = lineWithoutDate
          }
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
          currentExp.role = 'Role / Position'
          currentExp.company = 'Company'
          currentExp.bullets = []
        }
        const bulletText = line.replace(/^[•*▪\-\–\—\>]\s*/, '').trim()
        if (bulletText) currentExp.bullets.push(bulletText)
      } else if (currentExp) {
        // Look for location or continuation
        if (!currentExp.company && line.length < 50 && !line.includes(',')) {
          currentExp.company = line
        } else if (!currentExp.location && /^[A-Za-z\s.-]+,\s*[A-Za-z\s.-]+$/.test(line)) {
          currentExp.location = line
        } else if (line.length > 50) {
          currentExp.bullets.push(line)
        }
      }
    }

    if (currentExp) {
      expEntries.push(currentExp)
    }

    if (expEntries.length > 0) {
      resume.experience = expEntries.map((e) => ({
        ...e,
        bullets: e.bullets.length > 0 ? e.bullets : [''],
      }))
    }
  }

  // 6. Process Education
  const eduLines = sections['education'] || []
  if (eduLines.length > 0) {
    const eduEntries = []
    let currentEdu = null

    const degreeKeywords = /\b(b\.?s\.?|b\.?a\.?|bachelor|m\.?s\.?|m\.?a\.?|master|ph\.?d\.?|doctor|associate|b\.?tech|m\.?tech|mba|diploma|b\.?sc|b\.?e)\b/i
    const yearRegex = /\b(19\d{2}|20\d{2})\b/

    for (const line of eduLines) {
      const allYears = line.match(/\b(19\d{2}|20\d{2})\b/g)
      const gradYear = allYears ? allYears[allYears.length - 1] : null
      const hasDegree = degreeKeywords.test(line)

      if (hasDegree) {
        if (currentEdu) eduEntries.push(currentEdu)
        currentEdu = freshEducation()

        if (gradYear) {
          currentEdu.gradYear = gradYear
        }

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
        } else if (!currentEdu.school && line.length < 60 && !/gpa|honors|cum laude/i.test(line)) {
          currentEdu.school = line
        } else if (/gpa|cum laude|honors|focus|major/i.test(line)) {
          currentEdu.focus = line
        }
      } else if (gradYear) {
        currentEdu = freshEducation()
        currentEdu.gradYear = gradYear
        currentEdu.degree = line.replace(/\b(19\d{2}|20\d{2})\b/g, '').trim()
      }
    }

    if (currentEdu) eduEntries.push(currentEdu)

    if (eduEntries.length > 0) {
      resume.education = eduEntries
    }
  }

  // 7. Process Skills
  const skillLines = sections['skills'] || []
  if (skillLines.length > 0) {
    const skillGroups = []

    for (const line of skillLines) {
      if (line.includes(':')) {
        const [label, itemsStr] = line.split(':')
        const items = itemsStr
          .split(/[,|•▪;]/)
          .map((s) => s.trim())
          .filter(Boolean)

        if (items.length > 0) {
          skillGroups.push({
            id: uid(),
            label: label.trim(),
            items,
          })
        }
      } else {
        const items = line
          .split(/[,|•▪;]/)
          .map((s) => s.trim())
          .filter(Boolean)

        if (items.length > 0) {
          skillGroups.push({
            id: uid(),
            label: 'Core Skills',
            items,
          })
        }
      }
    }

    if (skillGroups.length > 0) {
      resume.skillGroups = skillGroups
    }
  }

  // 8. Process Projects
  const projectLines = sections['projects'] || []
  if (projectLines.length > 0) {
    const projects = []
    let currentProj = null

    for (const line of projectLines) {
      const isBullet = /^[•*▪\-\–\—\>]\s*/.test(line)
      const isTechStack = /^(built with|tech stack|tools:|technologies:)/i.test(line)

      if (isTechStack && currentProj) {
        currentProj.techStack = line.replace(/^(built with|tech stack|tools:|technologies:)\s*/i, '').trim()
      } else if (!isBullet && line.length < 60 && !line.includes('http')) {
        if (currentProj) projects.push(currentProj)
        currentProj = freshProject()
        currentProj.title = line.trim()
        currentProj.name = line.trim()
      } else if (currentProj) {
        if (/https?:\/\//i.test(line) && !currentProj.link) {
          const match = line.match(/(https?:\/\/[^\s]+)/)
          if (match) currentProj.link = match[0]
        } else {
          const text = line.replace(/^[•*▪\-\–\—\>]\s*/, '').trim()
          currentProj.description = currentProj.description ? `${currentProj.description}\n• ${text}` : `• ${text}`
        }
      }
    }
    if (currentProj) projects.push(currentProj)

    if (projects.length > 0) {
      resume.projects = projects
    }
  }

  // 9. Process Certifications
  const certLines = sections['certifications'] || []
  if (certLines.length > 0) {
    const certs = []
    for (const line of certLines) {
      const clean = line.replace(/^[•*▪\-\–\—\>]\s*/, '').trim()
      if (clean) {
        const yearMatch = clean.match(/\b(19\d{2}|20\d{2})\b/)
        certs.push({
          id: uid(),
          name: clean.replace(/\b(19\d{2}|20\d{2})\b/, '').trim(),
          issuer: '',
          year: yearMatch ? yearMatch[1] : '',
        })
      }
    }
    if (certs.length > 0) {
      resume.certifications = certs
    }
  }

  // 10. Process Hobbies
  const hobbyLines = sections['hobbies'] || []
  if (hobbyLines.length > 0) {
    const hobbies = []
    for (const line of hobbyLines) {
      const items = line.split(/[,|•▪;]/).map((s) => s.trim()).filter(Boolean)
      for (const it of items) {
        hobbies.push({ id: uid(), name: it })
      }
    }
    if (hobbies.length > 0) {
      resume.hobbies = hobbies
    }
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
