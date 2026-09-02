import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'

export function ThemeToggle({ className }) {
  const theme = useUIStore((s) => s.theme)
  const toggle = useUIStore((s) => s.toggleTheme)
  const dark = theme === 'dark'
  return (
    <motion.button
      whileTap={{ scale: 0.88, rotate: 30 }}
      onClick={toggle}
      aria-label="Toggle dark / light mode"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-slate-600 transition-colors hover:border-cyan-300/60 hover:text-cyan-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-amber-300 dark:hover:border-cyan-400/40 dark:hover:text-cyan-300 ${className || ''}`}
    >
      <AnimatedIcon dark={dark} />
    </motion.button>
  )
}

function AnimatedIcon({ dark }) {
  return (
    <motion.div
      key={dark ? 'moon' : 'sun'}
      initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.4, rotate: 90 }}
      transition={{ duration: 0.25 }}
    >
      {dark ? <Moon size={17} strokeWidth={1.9} /> : <Sun size={17} strokeWidth={1.9} />}
    </motion.div>
  )
}
