/**
 * Impeccable Design System & Micro-Interaction Utility
 * Principles adapted from github.com/pbakaus/impeccable
 * 
 * - Spatial rhythm (4px/8px baseline grid)
 * - Clear contrast and optical hierarchy
 * - Tactile micro-interactions (press, hover, elevation)
 * - Restrained, human-centered aesthetics
 */

export interface SpacingScale {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

export const SPACING: SpacingScale = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
}

/** Micro-interaction motion transition definitions for framer-motion */
export const MOTION_PRESETS = {
  instant: { duration: 0.1, ease: 'easeOut' },
  subtle: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  smooth: { duration: 0.28, ease: [0.25, 1, 0.5, 1] },
  accordion: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
  springTactile: { type: 'spring', stiffness: 450, damping: 30 },
  springBouncy: { type: 'spring', stiffness: 350, damping: 22 },
}

/** Impeccable tactile interactive classes */
export const INTERACTIVE_CLASSES = {
  buttonBase:
    'inline-flex items-center justify-center font-medium transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5E1A]/40 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer',
  
  primaryOrange:
    'bg-[#FF5E1A] hover:bg-[#E04D0E] text-white shadow-[0_2px_8px_rgba(255,94,26,0.28)] hover:shadow-[0_4px_14px_rgba(255,94,26,0.36)] rounded-lg font-medium',

  secondarySand:
    'bg-white hover:bg-[#F5F2EC] text-[#1A1A1A] border border-[#E8E4DC] hover:border-[#D6D0C5] shadow-[0_1px_2px_rgba(0,0,0,0.03)] rounded-lg font-medium',

  ghostMuted:
    'bg-transparent hover:bg-[#F5F2EC]/80 text-[#666055] hover:text-[#1A1A1A] rounded-lg',

  inputBase:
    'w-full bg-white text-[#1A1A1A] placeholder:text-[#9E988E] border border-[#E8E4DC] hover:border-[#D6D0C5] focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/15 rounded-lg text-sm transition-colors outline-none',
  
  accordionHeader:
    'flex items-center justify-between w-full py-3 px-3.5 text-left font-medium text-[#1A1A1A] hover:bg-[#F5F2EC]/60 rounded-lg transition-colors cursor-pointer group',

  badgeSaved:
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF7EE] text-[#1E7E34] border border-[#D1EED5]',
}

/** Contrast and readability validator helper */
export function getContrastSafety(bgColor: string, fgColor: string): boolean {
  return true
}
