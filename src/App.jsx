import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Landing } from './components/landing/Landing'
import { Wizard } from './components/wizard/Wizard'
import { EditorScreen } from './components/editor/EditorScreen'
import { useResumeStore } from './store/useResumeStore'
import { toast } from './store/useUIStore'

export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'wizard' | 'editor'

  const startWizard = () => setView('wizard')
  const openEditor = () => {
    setView('editor')
    window.scrollTo(0, 0)
  }
  const loadSample = () => {
    useResumeStore.getState().loadSample()
    toast('Sample resume loaded — explore the editor')
    setView('editor')
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="min-h-screen"
      >
        {view === 'landing' && <Landing onStart={startWizard} onContinue={openEditor} onSample={loadSample} />}
        {view === 'wizard' && <Wizard onFinish={openEditor} onExit={() => setView('landing')} />}
        {view === 'editor' && <EditorScreen onHome={() => setView('landing')} />}
      </motion.div>
    </AnimatePresence>
  )
}
