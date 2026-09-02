/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}', './skills/**/*.{ts,js}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Courgette', 'cursive', 'Georgia', 'serif'],
        courgette: ['Courgette', 'cursive', 'Georgia', 'serif'],
      },
      colors: {
        sand: {
          DEFAULT: '#FBF9F5',
          subtle: '#F5F2EC',
          border: '#E8E4DC',
          deep: '#E2DDD3',
        },
        charcoal: {
          DEFAULT: '#1A1A1A',
          slate: '#2D2D2D',
          soft: '#403D39',
        },
        earth: {
          DEFAULT: '#666055',
          muted: '#8C857B',
          faint: '#B0A99F',
        },
        studioOrange: {
          DEFAULT: '#FF5E1A',
          hover: '#E04D0E',
          subtle: '#FFF3EB',
        },
        studioBlue: {
          DEFAULT: '#244CEC',
          hover: '#1B3BBF',
          subtle: '#EEF2FF',
        },
        paper: '#ffffff',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.03), 0 6px 16px -8px rgba(0,0,0,0.05)',
        sheet: '0 1px 3px rgba(0,0,0,0.04), 0 16px 36px -12px rgba(26,26,26,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        toolbar: '0 6px 24px -4px rgba(26,26,26,0.12), 0 0 0 1px rgba(232,228,220,0.85)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.25s ease-out both',
      },
    },
  },
  plugins: [],
}
