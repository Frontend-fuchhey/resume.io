/**
 * Strictly enforce export naming convention: `[User_Name]-resume.pdf`
 * Example:
 *   "David St. Peter" -> "David_St_Peter-resume.pdf"
 *   "Alex Morgan"     -> "Alex_Morgan-resume.pdf"
 *   ""                -> "Resume-resume.pdf"
 */
export function resumeFilename(fullName = '') {
  let base = String(fullName || '')
    .trim()
    .replace(/[^\w\s-]/g, '') // remove dots, commas, invalid filename symbols
    .replace(/\s+/g, '_')     // replace spaces with underscores
    .replace(/_+/g, '_')      // collapse multiple underscores
    .replace(/^[_\s]+|[_\s]+$/g, '')
  if (!base) base = 'Resume'
  return `${base}-resume.pdf`
}
