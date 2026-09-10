import { uid } from './utils.js'

/** Fresh-entity factories used by the store and by UI "add" actions. */

export function freshBasic() {
  return {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    avatar: '',
    hidePhotoForAts: false,
    linkedin: '',
    portfolio: '',
    summary: '',
  }
}

export function freshExperience() {
  return { id: uid(), role: '', company: '', location: '', startDate: '', endDate: '', dateStr: '', current: false, bullets: [''] }
}

export function freshEducation() {
  return { id: uid(), degree: '', school: '', gradYear: '', focus: '' }
}

export function freshWebsite() {
  return { id: uid(), label: '', url: '' }
}

export function freshSkillGroup() {
  return { id: uid(), label: '', items: [] }
}

export function freshHobby() {
  return { id: uid(), name: '' }
}

export function freshProject() {
  return { id: uid(), title: '', name: '', techStack: '', description: '', link: '' }
}

export function freshCertification() {
  return { id: uid(), name: '', issuer: '', year: '' }
}

export function freshFormatting() {
  return {
    fontFamily: 'Poppins', // 'Poppins' | 'Inter' | 'Roboto' | 'Lato' | 'Garamond' | 'Courgette'
    fontWeight: '400',
    fontSize: 10.5,
    accentColor: '#244CEC', // Default accent swatch as requested
    textColor: '#1A1A1A',
    textAlign: 'left', // 'left' | 'center' | 'right' | 'justify'
    lineHeight: 140, // %
    letterSpacing: 0, // %
    canvasDimensions: 'A4', // 'A4' | 'Letter'
    canvasShape: 'sharp', // 'sharp' | 'rounded' | 'smooth'
    canvasShadow: 'subtle', // 'none' | 'subtle' | 'medium' | 'deep'
    canvasOutline: 'none', // 'none' | 'hairline' | 'accent'
    marginDensity: 'standard', // 'compact' | 'standard' | 'spacious'
  }
}

export function defaultSectionOrder() {
  return ['summary', 'experience', 'education', 'projects', 'certifications', 'websites', 'skills', 'hobbies']
}

export function defaultSectionTitles() {
  return {
    summary: 'Profile Summary',
    experience: 'Employment History',
    education: 'Education',
    projects: 'Projects',
    websites: 'Contact Details',
    skills: 'Skills & Competencies',
    hobbies: 'Hobbies & Interests',
    certifications: 'Certifications',
  }
}

export function blankVisibility() {
  return {
    experience: true,
    education: true,
    skills: true,
    websites: true,
    hobbies: true,
    projects: true,
    certifications: true,
  }
}

/** Shape of a brand-new resume. Starts completely blank! */
export function blankResume() {
  return {
    basic: freshBasic(),
    experience: [],
    education: [],
    websites: [],
    skillGroups: [],
    hobbies: [],
    projects: [],
    certifications: [],
    visibility: blankVisibility(),
    sectionOrder: defaultSectionOrder(),
    sectionTitles: defaultSectionTitles(),
    templateId: 'ats-studio',
    formatting: freshFormatting(),
  }
}
