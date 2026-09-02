/**
 * UI/UX Pro Max - Studio Tokens & Presets
 * High-End Human-Centered Studio Configuration
 */

export const STUDIO_PALETTE = {
  // Page Backdrop: Warm Anthropic Light Sand
  backdrop: '#FBF9F5',
  backdropAlt: '#F5F2EC',

  // Cards & Canvas Sheet: Pure Crisp White
  card: '#FFFFFF',
  sheet: '#FFFFFF',

  // Text & Headers
  textPrimary: '#1A1A1A', // Charcoal / Dark Slate
  textSecondary: '#2D2D2D',
  textMuted: '#666055', // Muted Earth for secondary hints
  textFaint: '#9E988E',

  // Primary Accent: Energetic Orange
  accentOrange: '#FF5E1A',
  accentOrangeHover: '#E04D0E',
  accentOrangeSubtle: '#FFF1EB',

  // Accent Swatches for Text Formatting Panel
  accentBlueDefault: '#244CEC',
  swatches: ['#244CEC', '#FF5E1A', '#1A1A1A', '#0F766E', '#7C3AED', '#B91C1C'],

  // Borders & Dividers
  borderSand: '#E8E4DC',
  borderSandSubtle: '#F0ECE4',
  borderActive: '#FF5E1A',
}

export const STUDIO_FONTS = {
  display: 'Courgette, cursive',
  body: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

export const STUDIO_ELEVATIONS = {
  sheet: '0 1px 3px rgba(0, 0, 0, 0.04), 0 16px 36px -12px rgba(26, 26, 26, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
  panel: '0 1px 3px rgba(0, 0, 0, 0.03), 0 6px 16px -8px rgba(0, 0, 0, 0.05)',
  floatingToolbar: '0 4px 20px -4px rgba(26, 26, 26, 0.12), 0 0 0 1px rgba(232, 228, 220, 0.9)',
  cardHover: '0 4px 12px -2px rgba(26, 26, 26, 0.06)',
}

export const FORMATTING_PRESETS = {
  fontFamilies: [
    { label: 'Poppins (Clean & Modern)', value: 'Poppins' },
    { label: 'Courgette (Signature Display)', value: 'Courgette' },
  ],
  fontWeights: [
    { label: 'Regular', value: '400' },
    { label: 'Medium', value: '500' },
    { label: 'SemiBold', value: '600' },
    { label: 'Bold', value: '700' },
  ],
  lineHeights: [120, 130, 140, 150, 160],
  letterSpacings: [-2, -1, 0, 1, 2, 3],
  canvasDimensions: [
    { label: 'A4 Standard (210 × 297mm)', value: 'A4', width: 794, minHeight: 1123 },
    { label: 'US Letter (8.5 × 11in)', value: 'Letter', width: 816, minHeight: 1056 },
  ],
  canvasShapes: [
    { label: 'Sharp (0px)', value: 'sharp', radius: 'rounded-none' },
    { label: 'Rounded (8px)', value: 'rounded', radius: 'rounded-lg' },
    { label: 'Smooth (16px)', value: 'smooth', radius: 'rounded-2xl' },
  ],
  canvasShadows: [
    { label: 'None', value: 'none', shadowClass: 'shadow-none ring-1 ring-[#E8E4DC]' },
    { label: 'Subtle Studio', value: 'subtle', shadowClass: 'shadow-sm ring-1 ring-[#E8E4DC]' },
    { label: 'Warm Soft', value: 'medium', shadowClass: 'shadow-lg ring-1 ring-black/5' },
    { label: 'Deep Sheet', value: 'deep', shadowClass: 'shadow-2xl ring-1 ring-black/5' },
  ],
  canvasOutlines: [
    { label: 'None', value: 'none', outlineClass: 'border-0' },
    { label: 'Subtle Hairline', value: 'hairline', outlineClass: 'border border-[#E8E4DC]' },
    { label: 'Accent Border', value: 'accent', outlineClass: 'border-2 border-[#FF5E1A]/40' },
  ],
}
